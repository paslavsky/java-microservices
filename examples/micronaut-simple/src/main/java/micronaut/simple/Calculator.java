package micronaut.simple;

import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Produces;

import java.util.Optional;

@Controller("/fibonacci")
public class Calculator {
    @Get("/{?n}")
    @Produces(MediaType.TEXT_PLAIN)
    public Long fibonacci(Optional<Long> n) {
        return fibonacci0(n.orElse(0L));
    }

    @SuppressWarnings("Duplicates")
    private long fibonacci0(long n) {
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
}
