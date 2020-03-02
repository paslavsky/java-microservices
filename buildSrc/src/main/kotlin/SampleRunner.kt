import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.gson.jsonBody
import com.github.kittinunf.result.Result

fun MeasurePlugin.executeAndTest(description: SampleDescription): Metrics {
    val metrics = Metrics()

    fun executeSample(block: SampleProcess.() -> Unit) {
        val start = System.currentTimeMillis()
        SampleProcess(configs.output, description).use {
            metrics.uptime = System.currentTimeMillis() - start
            metrics.memoryOnStart = it.realMemory
            it.block()
        }
    }

    fun request(index: Int) = when (description.api) {
        SampleDescription.Api.Fibonacci -> Fuel.get("http://localhost:${description.port}/fibonacci?n=10")
        SampleDescription.Api.People -> if (index % 2 == 0) {
            Fuel.get("http://localhost:${description.port}/people")
        } else {
            Fuel.post("http://localhost:${description.port}/people").jsonBody(
                    mapOf("firstName" to "User$index", "lastName" to "Foo$index")
            )
        }
    }.let {
        when (description.auth) {
            is SampleDescription.Auth.NoAuth -> it
            is SampleDescription.Auth.BasicAuth ->
                it.authentication().basic(description.auth.user, description.auth.password)
        }
    }.also {
        logger.info(it.toString())
    }

    fun SampleProcess.warmingUp() {
        val start = System.currentTimeMillis()
        val request = request(0)
        var error: String?
        do {
            val (_, _, result) = request.responseString()
            error = if (result is Result.Failure) result.error.message else null
            if (error != null && "Connection refused" in error) {
                Thread.sleep(10)
            }
        } while (error != null && "Connection refused" in error)

        metrics.requestTime.add(System.currentTimeMillis() - start)
        metrics.memory.add(realMemory)
        metrics.errors.add(error)
    }

    fun SampleProcess.test(index: Int) {
        val start = System.currentTimeMillis()
        val (_, _, result) = request(index).responseString()
        metrics.requestTime.add(System.currentTimeMillis() - start)
        metrics.memory.add(realMemory)
        when (result) {
            is Result.Success -> {
                logger.info("Response: ${result.get()}")
                metrics.errors.add(null)
            }
            is Result.Failure -> {
                logger.info("Request error: ${result.error.message}")
                metrics.errors.add(result.error.message)
                Thread.sleep(100)
            }
        }
    }

    executeSample {
        warmingUp()

        for (index in 1..configs.`number of test requests`) {
            test(index)
            Thread.sleep(100)
        }
    }

    return metrics
}
