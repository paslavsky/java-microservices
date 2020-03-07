# Microservices in Java World

This project is designed to collect metrics about frameworks for Microservices.

The common idea is to create "Samples" - simple applications with similar business logic and different configurations. 
The set of these samples creates a configuration matrix.

To compare how to turning some functionality affects the application, we are collecting the following metrics:

* **Uptime** - time that required for application to became available (available to respond to the Web requests)
* **Warming up** - very often, the first Web request took much more time than all subsequent. 
The difference between the first and regular requests is the warming time.
* **Regular request time**
* Application **RAM** right after start and RAM used when processing Web requests

For more details about Metrics and Measuring please see [testing](./testing.md) document.

If you want to help please see [Contribution](contributing.md) section.