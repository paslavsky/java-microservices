#Testing and measuring

## API

The main goal is to measure frameworks and libraries (not a business logic). 
Based on these considerations, we have established requirements for Sample API:

* All Samples should implement one of the two API
* Calculation logic should be implemented similarly (if other not required by library/framework).
For example, to calculate the Fibonacci number, we should use the same function 
(see example at [Create Sample](./create-samples.md)).
From other side, the most popular JPA way in Spring Framework is to use Spring Data Repositories 
(that is not possible to repeat with Ktor, but for Spring Framework it is a mainstream).


## Metrics
We are collecting the following metrics that allow comparing the Samples between each other:

* **RAM** that application used (right after start and when processing Web requests)
* **Uptime**. Time that required for application to became available (available to respond to the Web requests)
* **Warming up**. Very often, the first Web request took much more time than all subsequent. 
The difference between the first and regular requests is the warming time.
* **Request time**


## Testing
Testing proceeds as follows:

1. Start Sample. Each Sample starts multiple times (by default ten times). 
Measuring the time that took to start Sample (We have a log pattern to detect when the 
application successfully started).
1. Measure the RAM
1. Make the first request to "warm the engine"; collect the time.
1. Call REST API `N` times (by default ten times) and collect time for each call
1. Stop the application process and repeat the test again