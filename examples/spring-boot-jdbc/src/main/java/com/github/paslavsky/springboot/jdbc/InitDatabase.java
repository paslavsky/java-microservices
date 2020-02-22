package com.github.paslavsky.springboot.jdbc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class InitDatabase {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public InitDatabase(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void run() {
        jdbcTemplate.execute("DROP TABLE persons IF EXISTS");
        jdbcTemplate.execute("CREATE TABLE persons(" +
                "id SERIAL, first_name VARCHAR(255), last_name VARCHAR(255))");
    }
}
