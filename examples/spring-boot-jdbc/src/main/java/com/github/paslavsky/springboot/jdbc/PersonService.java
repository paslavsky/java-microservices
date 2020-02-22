package com.github.paslavsky.springboot.jdbc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PersonService {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public PersonService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public void save(Person person) {
        if (person.getId() > 0) {
            jdbcTemplate.execute(String.format(
                    "update persons set first_name='%1$s', last_name='%2$s' where id=%3$d", person.getFirstName(), person.getLastName(), person.getId()));
        } else {
            jdbcTemplate.execute(String.format(
                    "insert into persons(first_name, last_name) values ('%1$s', '%2$s')", person.getFirstName(), person.getLastName()));
        }
    }

    @Transactional(readOnly = true)
    public List<Person> readAll() {
        return jdbcTemplate.query("select id, first_name, last_name from persons", (rs, rowNum) ->
                new Person(
                        rs.getLong("id"),
                        rs.getString("first_name"),
                        rs.getString("last_name")
                )
        );
    }
}
