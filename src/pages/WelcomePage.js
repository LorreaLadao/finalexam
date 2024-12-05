import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate(); // Get the navigate function

  function storePlayerName() {
    localStorage.setItem("playerName", playerName);
  }

  // Handle Enter key press to trigger the same action as the "ENTER" button
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      storePlayerName(); // Store player name
      navigate("/select-level"); // Navigate to the next page
    }
  };

  return (
    <Container fluid className="p-5 bg-warning vh-100">
      <Container className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="display-3 fw-bold">Guess the Value!</h1>

        <Form className="mt-5">
          <Form.Group
            className="mb-3 d-flex flex-column justify-content-center align-items-center"
            controlId="exampleForm.ControlInput1"
          >
            <h3 className="display-6 fw-bold">Please enter your name</h3>

            <Form.Control
              type="text"
              placeholder="Type Here..."
              onChange={(e) => setPlayerName(e.target.value)}
              value={playerName}
              className="rounded-pill"
              size="lg"
              onKeyDown={handleKeyPress} // Add the event handler for Enter key
            />

            <Button
              className="px-5 rounded-pill mt-5"
              onClick={() => {
                storePlayerName();
              }}
              as={Link}
               to="/select-level"
            >
              ENTER
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </Container>
  );
}