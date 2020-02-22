package micronaut.jdbc.service;

import micronaut.jdbc.model.Person;

import java.util.List;

public interface PeopleService {
    List<Person> getAll();
    Person getOneById(long userId);
    boolean save(Person person);
    boolean delete(long userId);
}
