import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function WelcomePage() {
  const [playerName, setPlayerName] = useState("");
  const [showFlashMessage, setShowFlashMessage] = useState(false);

  function storePlayerName() {
    if (playerName.trim() === "") return; // Prevent empty name submission
    localStorage.setItem("playerName", playerName);
    setShowFlashMessage(true);
    setTimeout(() => {
      setShowFlashMessage(false); // Hide flash message after 3 seconds
    }, 3000);
  }

  return (
    <Container fluid className="p-5 vh-100">
      <Container className="game-container w-25 h-50 d-flex flex-column justify-content-center align-items-center">
        <h1 className="game-title">Guess the Value!</h1>

        <Form className="game-form mt-5">
          <Form.Group
            className="mb-3 d-flex flex-column justify-content-center align-items-center"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Control
              type="text"
              placeholder="Enter username..."
              onChange={(e) => setPlayerName(e.target.value)}
              value={playerName}
              className="rounded-3 p-2"
            />

            <Button
              className="rounded-3 mt-2 w-100 p-2 bg-primary text-black text-white custom-border"
              onClick={storePlayerName}
              as={Link}
              to="/select-level"
            >
              ENTER
            </Button>
          </Form.Group>
        </Form>

        {showFlashMessage && (
          <div className="flash-message">
            <h1>Welcome, {playerName}!</h1>
          </div>
        )}
      </Container>
    </Container>
  );
}
