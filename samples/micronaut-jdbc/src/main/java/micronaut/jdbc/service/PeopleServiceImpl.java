package micronaut.jdbc.service;

import micronaut.jdbc.model.Person;

import javax.inject.Singleton;
import javax.sql.DataSource;
import java.sql.*;
import java.util.LinkedList;
import java.util.List;

@Singleton
public class PeopleServiceImpl implements PeopleService {
    private final DataSource dataSource;

    public PeopleServiceImpl(DataSource dataSource) {
        this.dataSource = dataSource;
        try (final Connection connection = dataSource.getConnection()) {
            try (final Statement statement = connection.createStatement()) {
                statement.execute("DROP TABLE persons IF EXISTS");
                statement.execute("CREATE TABLE persons(id SERIAL, first_name VARCHAR(255), last_name VARCHAR(255))");
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        }
    }

    @Override
    public List<Person> getAll() {
        String selectAll = "select id, first_name, last_name from persons";
        final List<Person> all = new LinkedList<>();
        try (final Connection connection = dataSource.getConnection()) {
            try (final PreparedStatement statement = connection.prepareStatement(selectAll)) {
                try (final ResultSet resultSet = statement.executeQuery()) {
                    while (resultSet.next()) {
                        all.add(new Person(
                                resultSet.getLong("id"),
                                resultSet.getString("first_name"),
                                resultSet.getString("last_name")
                        ));
                    }
                }
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        }
        return all;
    }

    @Override
    public Person getOneById(long id) {
        String selectById = "select id, first_name, last_name from persons where id=?";
        try (final Connection connection = dataSource.getConnection()) {
            try (final PreparedStatement statement = connection.prepareStatement(selectById)) {
                statement.setLong(1, id);
                try (final ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        return new Person(
                                resultSet.getLong("id"),
                                resultSet.getString("first_name"),
                                resultSet.getString("last_name")
                        );
                    }
                }
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        }
        throw new IllegalStateException("Person with ID " + id + " not found");
    }

    @Override
    public boolean save(Person person) {
        final String insert = "insert into persons (first_name, last_name) VALUES (?,?)";
        try (final Connection connection = dataSource.getConnection()) {
            try (final PreparedStatement statement = connection.prepareStatement(insert)) {
                statement.setString(1, person.getFirstName());
                statement.setString(2, person.getLastName());
                return statement.executeUpdate() == 1;
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        }
    }

    @Override
    public boolean delete(long id) {
        final String insert = "delete FROM persons WHERE id=?";
        try (final Connection connection = dataSource.getConnection()) {
            try (final PreparedStatement statement = connection.prepareStatement(insert)) {
                statement.setLong(1, id);
                return statement.executeUpdate() == 1;
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        }
    }
}
