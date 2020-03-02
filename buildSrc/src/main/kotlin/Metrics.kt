import com.google.gson.GsonBuilder

class Metrics {
    var uptime: Long? = null
    var memoryOnStart: Long? = null
    val memory = mutableListOf<Long?>()
    val requestTime = mutableListOf<Long?>()
    val errors = mutableListOf<String?>()

    override fun toString(): String = GsonBuilder().setPrettyPrinting().create().toJson(this)
}

class SampleMetrics(description: SampleDescription) {
    val name = description.name
    val description = description.description
    val version = description.version
    val tags = description.tags

    val metrics = mutableListOf<Metrics>()
}