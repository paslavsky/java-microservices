package com.github.paslavsky

import com.fasterxml.jackson.databind.SerializationFeature
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.ContentNegotiation
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.routing
import net.paslavsky.ktor.exposed.ExposedFeature
import net.paslavsky.ktor.sql.SqlFeature
import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.LongIdTable
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import java.lang.management.ManagementFactory

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
    val uptime = ManagementFactory.getRuntimeMXBean().uptime / 1000.0
    LoggerFactory.getLogger(Application::class.java).info("Uptime $uptime seconds")
}

@Suppress("unused") // Referenced in application.conf
fun Application.module() {
    install(SqlFeature)
    install(ExposedFeature) {
        init {
            transaction {
                SchemaUtils.create(Persons)
            }
        }
    }

    install(ContentNegotiation) {
        jackson {
            configure(SerializationFeature.INDENT_OUTPUT, true)
        }
    }

    routing {
        get("/people") {
            val list = transaction {
                Person.all().map { person ->
                    PersonDTO(
                    person.id.value,
                    person.firstName,
                    person.lastName
                ) }
            }
            call.respond(list)
        }

        post("/people") {
            val person = call.receive(PersonDTO::class)
            transaction {
                Person.new {
                    firstName = person.firstName
                    lastName = person.lastName
                }
            }
            call.respond(HttpStatusCode.Created)
        }
    }
}

object Persons : LongIdTable("persons") {
    val firstName = varchar("first_name", 255)
    val lastName = varchar("last_name", 255)
}

class Person(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<Person>(Persons)

    var firstName by Persons.firstName
    var lastName by Persons.lastName
}

data class PersonDTO(
    val id: Long? = null,
    val firstName: String,
    val lastName: String
)