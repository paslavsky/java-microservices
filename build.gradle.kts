import com.github.kittinunf.fuel.core.FuelError
import com.github.kittinunf.fuel.core.Request
import com.github.kittinunf.fuel.core.Response
import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.result.Result
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.gradle.internal.jvm.Jvm
import java.lang.management.ManagementFactory
import java.util.regex.Pattern
import kotlin.math.roundToLong

typealias Test = () -> RequestMetrics

buildscript {
    repositories {
        mavenCentral()
        jcenter()
    }
    dependencies {
        classpath(group = "org.apache.commons", name = "commons-csv", version = "1.6")
        classpath(group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-core", version = "1.0.1")
        classpath(group = "com.github.kittinunf.fuel", name = "fuel", version = "1.16.0")
        classpath(group = "com.github.kittinunf.fuel", name = "fuel-gson", version = "1.16.0")
    }
}

class ProjectDescription(
    val name: String,
    val version: String = "0.1",
    private val artifact: ProjectDescription.() -> String = { "./$name/build/libs/$name-$version.jar" },
    val startPattern: Pattern = ".+Started\\s([\\w\\d]+)\\sin\\s(\\d+\\.?\\d*)\\sseconds\\s\\(JVM\\srunning\\sfor\\s(\\d+\\.?\\d*)\\).*".toPattern(),
    val uptimeGroupNumber: Int = 3,
    val test: Test
) {
    val artifactSize: Long by lazy {
        artifactPath.length()
    }

    val artifactPath: File by lazy {
        File(artifact()).also {
            if (!it.exists()) throw IllegalStateException("Artifact not found: ${it.path}")
        }
    }

    fun exec(): Process =
        Runtime.getRuntime().exec(arrayOf(Jvm.current().javaExecutable.path, "-jar", artifactPath.path))
}

data class RequestMetrics(val firstCallTime: Long, val averageTime: Long, val errors: Int)

open class ExecApplication : DefaultTask() {
    lateinit var project: ProjectDescription
    lateinit var csv: () -> CSVPrinter
    private val csvPrinter: CSVPrinter by lazy { csv() }
    var times: Int = 10
    private var uptime: Long? = null
    private var memoryOnStart: Long? = null
    private var memoryAfterTest: Long? = null
    private var metrics: RequestMetrics? = null

    @TaskAction
    fun exec() {
        try {
            for (i in 1..times)
                exec0()
        } catch (e: Exception) {
            logger.warn("Something went wrong :(", e)
        } finally {
            csvPrinter.close(true)
        }
    }

    private fun exec0() {
        runBlocking {
            val process = try {
                project.exec().waitForStart()
            } catch (e: Exception) {
                csvPrinter.printRecord(
                    "Failed to start ${project.name}: ${e.message}",
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                )
                return@runBlocking
            }

            try {
                metrics = project.test()
                memoryAfterTest = process.realMemory
            } catch (e: Exception) {
                logger.warn("Failed to test ${project.name} REST API", e)
            } finally {
                process.destroy()
                csvPrinter.printRecord(
                    status(),
                    uptime,
                    memoryOnStart,
                    memoryAfterTest,
                    metrics?.firstCallTime,
                    metrics?.averageTime,
                    metrics?.errors
                )
                csvPrinter.flush()
            }
        }
    }

    private fun status() = when {
        uptime == null -> "Unable to start ${project.name}"
        memoryOnStart == null || memoryAfterTest == null -> "Unable to evaluate process memory (works only on *nix OS)"
        metrics == null -> "REST API unavailable"
        else -> "OK"
    }

    private suspend fun Process.waitForStart() = try {
        this.waitForStart0()
    } catch (e: Exception) {
        this.destroy()
        throw e
    }

    private suspend fun Process.waitForStart0() = withTimeout(TimeUnit.MINUTES.toMillis(1)) {
        with(inputStream.bufferedReader()) {
            val process = this@waitForStart0
            var line: String? = readLine()
            while (line != null) {
                logger.debug(line)
                val matcher = project.startPattern.matcher(line)
                if (matcher.matches()) {
                    uptime = matcher.group(project.uptimeGroupNumber).let {
                        logger.info("> ${project.name} started in $it seconds")
                        it.toDoubleOrNull()?.times(1000L)?.roundToLong()
                    }
                    memoryOnStart = process.realMemory
                    break
                }
                line = readLine()
            }
            process
        }
    }

    private val Process.pid: Int?
        get() = if (javaClass.name == "java.lang.UNIXProcess") {
            try {
                javaClass.getDeclaredField("pid").apply { isAccessible = true }.getInt(this)
            } catch (e: Throwable) {
                null
            }
        } else null

    private val Process.realMemory: Long?
        get() = pid.let {
            if (it != null) {
                try {
                    with(Runtime.getRuntime().exec(arrayOf("ps", "-p", "$it", "-o", "rss"))) {
                        waitFor()
                        inputStream.bufferedReader().readLines()[1].toLong()
                    }
                } catch (e: Exception) {
                    null
                }
            } else {
                null
            }
        }
}

val projects = listOf(
    ProjectDescription(
        name = "spring-boot-simple",
        test = testSimple()
    ),
    ProjectDescription(
        name = "spring-boot-basic-auth",
        test = testSimple("Authorization" to "Basic dXNlcjpwYXNzd29yZA==")
    ),
    ProjectDescription(
        name = "spring-boot-jpa",
        test = testDB()
    ),
    ProjectDescription(
        name = "spring-boot-jdbc",
        test = testDB()
    ),
    ProjectDescription(
        name = "micronaut-simple",
        artifact = { "./$name/build/libs/$name-$version-all.jar" },
        startPattern = ".+Uptime\\s(\\d+\\.?\\d*)\\sseconds.*".toPattern(),
        uptimeGroupNumber = 1,
        test = testSimple()
    ),
    ProjectDescription(
        name = "micronaut-basic-auth",
        artifact = { "./$name/build/libs/$name-$version-all.jar" },
        startPattern = ".+Uptime\\s(\\d+\\.?\\d*)\\sseconds.*".toPattern(),
        uptimeGroupNumber = 1,
        test = testSimple("Authorization" to "Basic dXNlcjpwYXNzd29yZA==")
    ),
    ProjectDescription(
        name = "micronaut-jpa",
        artifact = { "./$name/build/libs/$name-$version-all.jar" },
        startPattern = ".+Uptime\\s(\\d+\\.?\\d*)\\sseconds.*".toPattern(),
        uptimeGroupNumber = 1,
        test = testDB()
    ),
    ProjectDescription(
        name = "micronaut-jdbc",
        artifact = { "./$name/build/libs/$name-$version-all.jar" },
        startPattern = ".+Uptime\\s(\\d+\\.?\\d*)\\sseconds.*".toPattern(),
        uptimeGroupNumber = 1,
        test = testDB()
    ),
    ProjectDescription(
        name = "ktor-simple",
        artifact = { "./$name/build/libs/$name-$version-all.jar" },
        startPattern = ".+Uptime\\s(\\d+\\.?\\d*)\\sseconds.*".toPattern(),
        uptimeGroupNumber = 1,
        test = testSimple()
    ),
    ProjectDescription(
        name = "ktor-basic-auth",
        artifact = { "./$name/build/libs/$name-$version-all.jar" },
        startPattern = ".+Uptime\\s(\\d+\\.?\\d*)\\sseconds.*".toPattern(),
        uptimeGroupNumber = 1,
        test = testSimple("Authorization" to "Basic dXNlcjpwYXNzd29yZA==")
    ),
    ProjectDescription(
        name = "ktor-exposed",
        artifact = { "./$name/build/libs/$name-$version-all.jar" },
        startPattern = ".+Uptime\\s(\\d+\\.?\\d*)\\sseconds.*".toPattern(),
        uptimeGroupNumber = 1,
        test = testDB()
    )
)

val buildTasks = projects.map {
    task("${it.name}-rebuild", GradleBuild::class) {
        buildFile = file("./${it.name}/build.gradle")
        tasks = listOf("clean", "build")
        doFirst {
            logger.lifecycle("> Rebuilding ${it.name} project")
        }
    }
}.toTypedArray()

task("rebuild") {
    dependsOn(*buildTasks)
    doLast {
        val csv = csv(File("artifacts.csv"), arrayOf("Project", "Artifact Size"))
        projects.forEach {
            csv.printRecord(it.name, it.artifactSize)
        }
        csv.close(true)
        logger.info("> Rebuild completed")
    }
}

val runTasks = projects.map {
    task("${it.name}-run", ExecApplication::class) {
        project = it
//        times = 1
        csv = {
            csv(
                File("${it.name}.csv"), arrayOf(
                    "status",
                    "uptime",
                    "memory on start",
                    "memory after test",
                    "first call time",
                    "average time",
                    "failed calls"
                )
            )
        }
    }
}.toTypedArray()

task("run") {
    dependsOn(*runTasks)
}

fun csv(file: File, headers: Array<String>) =
    CSVFormat.DEFAULT.withHeader(*headers).print(file, charset("UTF-8"))!!

fun testSimple(vararg headers: Pair<String, Any>?): Test = {
    test {
        "http://localhost:8080/fibonacci?n=10".httpGet().header(*headers).responseString()
    }
}

fun testDB(): Test = {
    var i = 0
    test {
        if (i++ <= 9) {
            "http://localhost:8080/people".httpPost().jsonBody(
                """{"firstName": "User$i", "lastName": "Foo$i"} """
            ).responseString()
        } else {
            "http://localhost:8080/people".httpGet().responseString()
        }
    }
}

fun test(call: () -> Triple<Request, Response, Result<String, FuelError>>): RequestMetrics {
    var errors = 0

    fun processResponse(result: Result<String, FuelError>) {
        when (result) {
            is Result.Success<*, *> -> {
                logger.debug("Response: ${result.get()}")
            }
            is Result.Failure<*, *> -> {
                logger.warn("Request error: ${result.error}")
                errors++
            }
        }
    }

    val (firstResult, firstCall) = measureTime(call)
    processResponse(firstResult)

    val average = (1..10).map {
        val (result, time) = measureTime(call)
        processResponse(result)
        time
    }.average().roundToLong()

    return RequestMetrics(firstCall, average, errors)
}

inline fun measureTime(block: () -> Triple<Request, Response, Result<String, FuelError>>): Pair<Result<String, FuelError>, Long> {
    val start = System.currentTimeMillis()
    val result = block()
    return result.third to (System.currentTimeMillis() - start)
}