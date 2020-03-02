import com.google.gson.Gson
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.api.logging.Logger
import org.gradle.api.logging.Logging

import org.gradle.kotlin.dsl.*
import java.io.File
import java.io.OutputStreamWriter


class MeasurePlugin : Plugin<Project> {
    val logger: Logger = Logging.getLogger(MeasurePlugin::class.java)
    lateinit var configs: MeasureExtension
    private val sampleMetrics = mutableListOf<SampleMetrics>()

    override fun apply(project: Project) {
        configs = project.extensions.create("measure", MeasureExtension::class, project)

        project.tasks {
            val measureTasks = project.subprojects.filter {
                it.name != "samples"
            }.map { sampleProject ->
                register("measure-${sampleProject.name}") {
                    group = "measure"
                    description = "Run ${sampleProject.name} and measure RAM, Uptime and REST call Time"

                    doLast {
                        val description = sampleProject.sampleDescription
                        val metricsContainer = SampleMetrics(description)

                        for (i in 1..configs.`number of sample starts`) {
                            metricsContainer.metrics.add(executeAndTest(description))
                        }
                        sampleMetrics.add(metricsContainer)

                        configs.output.mkdirs()
                        OutputStreamWriter(File(configs.output, "${sampleProject.name}.json").outputStream()).use {
                            Gson().toJson(sampleMetrics, it)
                        }
                    }
                }
            }

            register("measure-all") {
                group = "measure"
                description = "Measure RAM, Uptime and REST call Time"

                dependsOn(measureTasks)
                doLast {
                    configs.output.mkdirs()
                    OutputStreamWriter(File(configs.output, "metrics.json").outputStream()).use {
                        Gson().toJson(sampleMetrics, it)
                    }
                }
            }
        }
    }
}