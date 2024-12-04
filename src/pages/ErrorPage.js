import { Container, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function ErrorPage(){
    return(
        <Container fluid className="bg-warning vh-100 p-5">
            <Container className="d-flex flex-column justify-content-center align-items-center p-3">
                <h1 className="display-3 fw-bold my-3">PAGE NOT FOUND!</h1>
                <p>We cannot find the page you are trying to access.</p>
                <Button size="lg" className="rounded-pill px-5 mt-5" as={Link} to="/">Go Back</Button>
            </Container>

        </Container>
    )
}