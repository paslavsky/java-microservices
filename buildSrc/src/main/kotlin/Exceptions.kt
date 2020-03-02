import org.gradle.api.GradleException
import org.gradle.api.Project
import java.io.File

open class SampleProjectException(message: String, project: Project? = null, description: SampleDescription? = null) :
        GradleException("${project?.displayName ?: "project " + description?.name}: $message")

class UnsupportedSampleConfigurationException(project: Project) :
        SampleProjectException("Unsupported sample project configuration", project)

class ArtifactNotFoundException(project: Project) :
        SampleProjectException("Could not detect the artifact", project)

class FoundMultipleArtifactsException(project: Project, artifacts: Iterable<File>) :
        SampleProjectException("Found multiple artifacts:\n\t- ${artifacts.joinToString(separator = "\n\t- ")}", project)

class SampleProjectConfigurationRequiredException(project: Project, attribute: String):
        SampleProjectException("Attribute $attribute required! Please use gradle.properties to provide value", project)

class UnsupportedSampleAuthException(project: Project, authStr: String):
        SampleProjectException("Unsupported authentication: $authStr", project)

class SampleNotStartedException(description: SampleDescription) :
        SampleProjectException("Sample not started. See logs for more details", description = description)