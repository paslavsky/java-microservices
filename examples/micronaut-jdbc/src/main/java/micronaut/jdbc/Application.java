package micronaut.jdbc;

import io.micronaut.context.ApplicationContext;
import io.micronaut.runtime.Micronaut;
import micronaut.jdbc.service.PeopleService;
import org.slf4j.LoggerFactory;

import java.lang.management.ManagementFactory;

public class Application {
    public static void main(String[] args) {
        final ApplicationContext context = Micronaut.run(Application.class);
        context.getBean(PeopleService.class);
        double uptime = ManagementFactory.getRuntimeMXBean().getUptime() / 1000.0;
        LoggerFactory.getLogger(Application.class).info("Uptime {} seconds", uptime);
    }
}