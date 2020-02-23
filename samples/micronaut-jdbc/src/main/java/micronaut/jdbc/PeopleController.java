package micronaut.jdbc;

import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import io.micronaut.http.HttpStatus;
import micronaut.jdbc.model.Person;
import micronaut.jdbc.service.PeopleServiceImpl;

import javax.inject.Inject;
import java.util.List;

@Controller("/people")
public class PeopleController {

    private final PeopleServiceImpl peopleService;

    @Inject
    public PeopleController(PeopleServiceImpl peopleService) {
        this.peopleService = peopleService;
    }

    @Get("/")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Person> getAll() {
        return peopleService.getAll();
    }

    @Get("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Person getOneById(long id) {
        return peopleService.getOneById(id);
    }

    @Post("/")
    @Consumes(MediaType.APPLICATION_JSON)
    public HttpStatus save(@Body Person person) {
        return peopleService.save(person) ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
    }

    @Delete("/{id}")
    public HttpStatus delete(long id) {
        return peopleService.delete(id) ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
    }
}