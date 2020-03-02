import org.gradle.api.Project
import java.io.File

@Suppress("PropertyName")
open class MeasureExtension(project: Project) {
    var output: File = File(project.buildDir, "metrics")
    var `number of sample starts` = 10
    var `number of test requests` = 10
}