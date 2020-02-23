package micronaut.jpa;

import io.micronaut.configuration.hibernate.jpa.scope.CurrentSession;
import io.micronaut.spring.tx.annotation.Transactional;

import javax.inject.Singleton;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

@Singleton
public class PersonService {
    @PersistenceContext
    private final EntityManager entityManager;

    public PersonService(@CurrentSession EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public Optional<Person> findById(@NotNull Long id) {
        return Optional.ofNullable(entityManager.find(Person.class, id));
    }

    @Transactional
    public void deleteById(long id) {
        delete(findById(id).orElseThrow(() -> new IllegalArgumentException(
                String.format("No Person entity with id %s exists!", id))));
    }

    @Transactional
    public void delete(Person entity) {
        entityManager.remove(entityManager.contains(entity) ? entity : entityManager.merge(entity));
    }

    @Transactional
    public Person save(Person entity) {
        if (entity.getId() == 0L) {
            entityManager.persist(entity);
            return entity;
        } else {
            return entityManager.merge(entity);
        }
    }

    @Transactional
    public List<Person> findAll() {
        return entityManager.createQuery("select p from Person p", Person.class).getResultList();
    }
}
