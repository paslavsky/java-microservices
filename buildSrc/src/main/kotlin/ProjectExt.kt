import org.gradle.api.Project
import org.gradle.kotlin.dsl.extra

val Project.sampleDescription: SampleDescription
    get() = SampleDescription(
            name = name,
            description = description,
            version = version.toString(),
            artifact = when {
                "-api" in configurations.names -> configurations.getByName("-api")
                "apiElements" in configurations.names -> configurations.getByName("apiElements")
                else -> throw UnsupportedSampleConfigurationException(this)
            }.artifacts.files.files.let {
                when (it.size) {
                    0 -> throw ArtifactNotFoundException(this)
                    1 -> it.first()
                    else -> throw FoundMultipleArtifactsException(project, it)
                }
            },
            api = SampleDescription.Api.parse(getSampleAttribute("sample.api")),
            tags = getSampleAttribute("sample.tags").split(',').map {
                it.trim()
            }.filter {
                it.isNotEmpty()
            },
            startedPattern = getSampleAttribute("sample.started.pattern").toRegex(),
            auth = SampleDescription.Auth.parse(getSampleAttribute("sample.auth", "no-auth"), this)
    )

fun Project.getSampleAttribute(attribute: String, default: String? = null): String {
    val value = if (extra.has(attribute)) {
        extra[attribute]?.toString()
    } else {
        default
    }

    if (value.isNullOrBlank()) {
        throw SampleProjectConfigurationRequiredException(project, attribute)
    }

    return value
}