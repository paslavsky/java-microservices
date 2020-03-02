plugins {
    `kotlin-dsl`
    kotlin("jvm") version "1.3.61"
}

gradlePlugin {
    plugins {
        register("measure-plugin") {
            id = "measure"
            implementationClass = "MeasurePlugin"
        }
    }
}

repositories {
    mavenCentral()
    jcenter()
}

dependencies {
    implementation(group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-core", version = "1.3.3")
    implementation(group = "com.github.kittinunf.fuel", name = "fuel", version = "2.2.1")
    implementation(group = "com.github.kittinunf.fuel", name = "fuel-gson", version = "2.2.1")
    implementation(group = "com.google.code.gson", name = "gson", version = "2.8.6")

}