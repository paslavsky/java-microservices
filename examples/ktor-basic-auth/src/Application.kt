package com.github.paslavsky

import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.auth.UserIdPrincipal
import io.ktor.auth.authenticate
import io.ktor.auth.basic
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing
import org.slf4j.LoggerFactory
import java.lang.management.ManagementFactory

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
    val uptime = ManagementFactory.getRuntimeMXBean().uptime / 1000.0
    LoggerFactory.getLogger(Application::class.java).info("Uptime $uptime seconds")
}

@Suppress("unused")
fun Application.module() {
    install(Authentication) {
        basic(name = "basicAuth") {
            realm = "Ktor Server"
            validate { credentials ->
                if (credentials.name == "user" && credentials.password == "password") {
                    UserIdPrincipal(credentials.name)
                } else {
                    null
                }
            }
        }
    }

    routing {
        authenticate("basicAuth") {
            get("/fibonacci") {
                val n = call.request.queryParameters["n"]?.toLong() ?: 10L
                call.respondText {
                    fibonacci0(n).toString()
                }
            }
        }
    }
}

private fun fibonacci0(n: Long): Long {
    if (n <= 1) {
        return n
    }
    var fib = 1L
    var prevFib = 1L

    for (i in 2 until n) {
        val temp = fib
        fib += prevFib
        prevFib = temp
    }
    return fib
}
