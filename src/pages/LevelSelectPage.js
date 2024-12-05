import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

export default function LevelSelectPage() {
  const [showFlashMessage, setShowFlashMessage] = useState(false);
  let playerName = localStorage.getItem("playerName");
  const navigate = useNavigate();

  useEffect(() => {
    if (playerName == null || playerName === "") {
      navigate("/"); 
    } else {
      setShowFlashMessage(true);
      setTimeout(() => {
        setShowFlashMessage(false); 
      }, 3000);
    }
  }, [playerName, navigate]);

  if (playerName == null || playerName === "") {
    return null; 
  }

  return (
    <Container fluid className="d-flex flex-column m-0 p-0 p-5">
      {showFlashMessage && (
        <div className="flash-message">
          <h1>Welcome, {playerName}!</h1>
        </div>
      )}
      <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
        <Container fluid className="row d-flex align-items-center justify-content-center">
          <Container
            className="col-6 d-flex align-items-center justify-content-center flex-column select-container"
            data-aos="flip-left"
          >
            <h1 className="display-6 fw-bold game-title">Select Level</h1>
            <Container className="col-5 d-flex align-items-center justify-content-center flex-column">
              <Button
                size="lg"
                className="btn-success custom-border rounded-4 w-100"
                as={NavLink}
                to="/easy"
              >
                EASY
              </Button>
              <Button
                size="lg"
                className="btn-warning text-white custom-border rounded-4 my-3 w-100"
                as={NavLink}
                to="/medium"
              >
                MEDIUM
              </Button>
              <Button
                size="lg"
                className="custom-border rounded-4 w-100 btn-danger"
                as={NavLink}
                to="/hard"
              >
                HARD
              </Button>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
