import org.gradle.api.Project
import java.io.File
import java.util.regex.Pattern

class SampleDescription(
        val name: String,
        val description: String?,
        val version: String,
        val artifact: File,
        val api: Api,
        val tags: List<String>,
        val startedPattern: Regex,
        val port: Int = 8080,
        val auth: Auth

) {
    enum class Api {
        Fibonacci,
        People;

        companion object {
            fun parse(strValue: String) = values().first {
                it.name.equals(strValue, ignoreCase = true)
            }
        }
    }

    sealed class Auth {
        object NoAuth : Auth() {
            override fun toString() = "NoAuth"
        }

        class BasicAuth(val user: String, val password: String) : Auth()

        companion object {
            fun parse(authStr: String, project: Project): Auth {
                val matcher = "\\s*(\\w+)\\s*\\(\\s*(.+)\\s*:\\s*(.+)\\s*\\)\\s*".toPattern().matcher(authStr)
                return when {
                    authStr eq "noauth"|| authStr eq "no-auth" -> NoAuth
                    !matcher.matches() -> throw UnsupportedSampleAuthException(project, authStr)
                    "basic" eq matcher.group(1) -> BasicAuth(matcher.group(2), matcher.group(3))
                    else -> throw UnsupportedSampleAuthException(project, authStr)

                }
            }

            private infix fun String.eq(other: String) = equals(other, ignoreCase = true)
        }
    }
}
