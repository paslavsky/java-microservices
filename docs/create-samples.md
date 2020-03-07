# Create Sample

Sample - it's an independent Gradle project with its dependencies and configurations.
There are only a few requirements for the Sample:

* Sample should implement one of the two API: Fibonacci or People API
* Gradle `build` command should produce Shadow/Uber jar (you could use 
[com.github.johnrengelman.shadow](https://plugins.gradle.org/plugin/com.github.johnrengelman.shadow) plugin)
* Provide additional properties for the measuring script at `gradle.properties` file (see table below)
* Sample name should explain which framework used and its configuration. For example, 
`spring-boot-basic-auth` – **Spring Boot** application with _Basic Authentication_.

### Additional properties

The following properties should be added to the `gradle.properties`:

|      Property name     | Required |   Default   |                                                  Description                                                    |
|:-----------------------|:--------:|:-----------:|:----------------------------------------------------------------------------------------------------------------|
| sample.tags            | Yes      |             | List of Tags separated by comma (see available tags below)                                                      |
| sample.api             | Yes      |             | Implemented API: **fibonacci** or **people** (see requirements below)                                           |
| sample.auth            | Yes      | **no-auth** | Application authentication: **no-auth** or **basic(&lt;_user_&gt;:&lt;_password_&gt;)**                         |
| sample.started.pattern | Yes      |             | The Regex pattern used to detect the application starts. This pattern matches the application logs line by line |

### Tags
You can use any Tags that you want, but we have some recommendations:

|     Tag    | Description |
|:----------:|:------------|
| Simple     | A quite simple application (like a "Hello World") that use some Framework without any libraries or specific settings |
| Auth       | Application configured with _some_ Authentication (maybe in the future we will support more than Basic Auth) |
| Basic Auth | Application configured with Basic Auth |
| No Auth    | Application not using any authentication |
| JDBC       | Application using JDBC or another library over JDBC to store data at the Database |
| JPA        | Application using JPA or another library over JPA to store data at the Database |
| Netty      | The application works on the Netty web server |
| Tomcat     | The application works on the Tomcat web server |

We recommend listing the names of the Framework and libraries as a Tag.

### Fibonacci API
Application should implement one endpoint: 

* **GET** `http://<host>:<port>/fibonacci?n=<N>`

This endpoint should calculate Fibonacci number `N` and return result at the response body.

Example of the Fibonacci function:

```java
    long fibonacci(long n) {
        if (n <= 1) {
            return n;
        }
        int fib = 1;
        int prevFib = 1;

        for (int i = 2; i < n; i++) {
            int temp = fib;
            fib += prevFib;
            prevFib = temp;
        }
        return fib;
    }

```

### People API
This API designed to works with Database. To create table you could use the following SQL:

```sql
CREATE TABLE persons(id SERIAL, first_name VARCHAR(255), last_name VARCHAR(255));
```

Application should implement two endpoints:

* **GET** `http://<host>:<port>/people` – read and return all rows from the table
* **POST** `http://<host>:<port>/people` – create new row at the Database from the request body:

```json
{
  "firstName": "...",
  "lastName": "..."
}
```
