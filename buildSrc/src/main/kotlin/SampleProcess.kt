import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.gradle.internal.jvm.Jvm
import java.io.Closeable
import java.io.File

class SampleProcess(private val output: File, private val description: SampleDescription) : AutoCloseable, Closeable {
    private val pid: Long
    private val process: Process
    init {
        output.mkdirs()
    }
    private val logFile by lazy { File(output, "${description.name}.log") }

    init {
        Runtime.getRuntime().exec(arrayOf(Jvm.current().javaExecutable.path, "-jar", description.artifact.path)).also {
            process = it
            pid = it.pid()
        }.apply {
            val bufferedReader = inputStream.bufferedReader()
            do {
                val line = bufferedReader.readLine() ?: throw SampleNotStartedException(description)
                log(line)
                if (description.startedPattern.matches(line)) {
                    break
                }
            } while (true)

            GlobalScope.launch {
                withContext(Dispatchers.IO) {
                    do {
                        val line = try {
                            bufferedReader.readLine()
                        } catch (ignore: Exception) {
                            null
                        }

                        if (line != null) {
                            log(line)
                        }
                    } while (line != null)
                }
            }

            Runtime.getRuntime().addShutdownHook(Thread { close() })
        }
    }

    private fun log(line: String) {
        logFile.appendText("$line\n")
    }

    val realMemory: Long?
        get() = try {
            with(Runtime.getRuntime().exec(arrayOf("ps", "-p", "$pid", "-o", "rss"))) {
                waitFor()
                inputStream.bufferedReader().readLines()[1].toLong()
            }
        } catch (ignore: Exception) {
            null
        }

    private val isAliveNative: Boolean
        get() = try {
            with(Runtime.getRuntime().exec(arrayOf("ps", "-p", "$pid", "-o", "pid"))) {
                waitFor()
                inputStream.bufferedReader().readLines().let {
                    it.size > 1 && it[1].toLong() == pid
                }
            }
        } catch (e: Exception) {
            false
        }

    private fun kill() {
        do {
            try {
                Runtime.getRuntime().exec(arrayOf("kill", "$pid"))
            } catch (ignore: Exception) {
            }
        } while (isAliveNative)
    }

    override fun close() {
        if (process.isAlive) {
            process.destroy()
            process.waitFor()
        }

        kill()
    }
}