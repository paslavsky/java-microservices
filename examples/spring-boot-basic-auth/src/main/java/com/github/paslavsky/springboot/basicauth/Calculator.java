package com.github.paslavsky.springboot.basicauth;

import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Calculator {
    @RequestMapping(value = "/fibonacci", method = RequestMethod.GET)
    public long fibonacci(@RequestParam("n") long n) {
        try {
            return fibonacci0(n);
        } finally {
            LoggerFactory.getLogger(getClass()).info(
                    "Memory usage: {}", Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory());
        }
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
