package micronaut.jpa;

import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;

import javax.inject.Inject;
import java.util.List;

@Controller("/people")
public class PersonController {
    private final PersonService service;

    @Inject
    public PersonController(PersonService service) {
        this.service = service;
    }

    @Get
    @Produces(MediaType.APPLICATION_JSON)
    public List<Person> people() {
        return service.findAll();
    }

    @Post
    @Consumes(MediaType.APPLICATION_JSON)
    public HttpStatus save(@Body Person person) {
        try {
            service.save(person);
            return HttpStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
            return HttpStatus.BAD_REQUEST;
        }
    }

    @Delete("/{id}")
    public HttpStatus delete(long id) {
        try {
            service.deleteById(id);
            return HttpStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
            return HttpStatus.BAD_REQUEST;
        }
    }
}
