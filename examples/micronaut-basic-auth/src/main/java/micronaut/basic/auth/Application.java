package micronaut.basic.auth;

import io.micronaut.runtime.Micronaut;
import org.slf4j.LoggerFactory;

import java.lang.management.ManagementFactory;

public class Application {

    public static void main(String[] args) {
        Micronaut.run(Application.class);
        double uptime = ManagementFactory.getRuntimeMXBean().getUptime() / 1000.0;
        LoggerFactory.getLogger(Application.class).info("Uptime {} seconds", uptime);
    }
}