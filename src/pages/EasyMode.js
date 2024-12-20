import { useEffect, useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function EasyMode() {
  let playerName = localStorage.getItem("playerName");
  const navigate = useNavigate();

  const [randomNum1, setRandomNum1] = useState(0);
  const [randomNum2, setRandomNum2] = useState(0);
  const [answer, setAnswer] = useState();
  let [stage, setStage] = useState(1);
  let [score, setScore] = useState(0);

  useEffect(() => {
    if (playerName == null || playerName == "") {
      navigate("/");
    }
    generateRandomNum();
  },[] );

  if (playerName == null || playerName == "") {
    return null;
  }

  function generateRandomNum() {
    let randomNum1 = Math.floor(Math.random() * 100) + 1;
    let randomNum2 = Math.floor(Math.random() * 100) + 1;
    setRandomNum1(randomNum1);
    setRandomNum2(randomNum2);
  }

  function checkAnswer() {
    let correctAnswer = randomNum1 + randomNum2;
    if (Number(answer) === correctAnswer) {
      Swal.fire({
        title: "CORRECT!",
        message: "Keep it up!",
        icon: "success",
      });
      setAnswer("");
      setStage(stage + 1);
      setScore(score + 5);

      if (stage === 10) {
        Swal.fire({
          title: "YOU MADE IT!",
          message: "Redirecting to level select...",
          icon: "success",
        }).then(() => {
          navigate("/select-level");
        });
      } else {
        generateRandomNum();
      }
    } else {
      Swal.fire({
        title: "OOPS!",
        message: "Try again!",
        icon: "error",
      });
    }
  }

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
    }
  };

  return (
    <Container fluid className="d-flex flex-column m-0 p-0 p-5">
      {}
      <Container fluid className="d-flex">
        <h1 className="me-auto"></h1>
        <h1 className="text-white">SCORE {score}</h1>
      </Container>

      <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
        <Container fluid className="row d-flex align-items-center justify-content-center">
          <Container className="col-6 d-flex align-items-center justify-content-center flex-column p-5 rounded-3 game-card" data-aos="flip-left">
          <h1 className="display-6 fw-bold mb-4 game-title">Problem {stage}</h1>
            <Container className="col-5 d-flex align-items-center justify-content-center gap-1">
              <Container className="col-12 bg-light d-flex align-items-center justify-content-center p-5 w-75 rounded-3 ms-42 me-1">
                <h1 className="display-3 fw-bold">{randomNum1}</h1>
              </Container>

              <Container className="col-12 bg-transparent d-flex align-items-center justify-content-center w-50 rounded-3 text-white">
                <h3 className="display-3 fw-bold">+</h3>
              </Container>

              <Container className="col-12 bg-light d-flex align-items-center justify-content-center p-5 w-75 rounded-3 ms-2 me-1">
                <h1 className="display-3 fw-bold">{randomNum2}</h1>
              </Container>
            </Container>

            <Form className="mt-5">
              <Form.Group className="mb-3 d-flex flex-column justify-content-center align-items-center" controlId="exampleForm.ControlInput1">
                <Form.Control
                  type="number"
                  placeholder="Type your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="rounded-3 p-2"
                  onKeyDown={handleEnter}
                />

                <Button className="rounded-3 mt-2 w-100 p-2 bg-warning text-white  custom-border" onClick={checkAnswer}>
                  {stage === 10 ? "SUBMIT" : "Check"}
                </Button>
              </Form.Group>
            </Form>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
