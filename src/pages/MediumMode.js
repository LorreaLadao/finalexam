import { useEffect, useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function MediumMode() {
  let playerName = localStorage.getItem("playerName");
  const navigate = useNavigate();

  const [randomNum1, setRandomNum1] = useState(0);
  const [randomNum2, setRandomNum2] = useState(0);
  const [answer, setAnswer] = useState(0);
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [paused, setPaused] = useState(false);
  const [operation, setOperation] = useState("+");
  useEffect(() => {
    if (!playerName) {
      navigate("/");
      return;
    }
    generateRandomNumbers();
    pauseBeforeStart();
  }, []);

  useEffect(() => {
    if (!paused && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleTimeout();
    }
  }, [timer, paused]);

  const handleTimeout = () => {
    setScore((prev) => prev - 2);
    Swal.fire({
      title: "Timeout!",
      text: "You ran out of time!",
      icon: "error",
    }).then(() => {
      goToNextStage();
    });
  };

  const goToNextStage = () => {
    if (stage === 10) {
      Swal.fire({
        title: "Congratulations!",
        text: `You completed the game with a score of ${score}!`,
        icon: "success",
      }).then(() => navigate("/select-level"));
    } else {
      setStage((prev) => prev + 1);
      setAnswer("");
      generateRandomNumbers();
      setTimer(20);
    }
  };

  const pauseBeforeStart = () => {
    if (stage === 1) {
      setPaused(true);
      Swal.fire({
        title: "Game Paused",
        text: "Click 'OK' to start!",
        icon: "info",
      }).then(() => setPaused(false));
    }
  };

  const generateRandomNumbers = () => {
    let num1, num2, op;
    if (stage <= 5) {
      num1 = Math.floor(Math.random() * 500) + 1;
      num2 = Math.floor(Math.random() * 500) + 1;
      op = "+";
    } else {
      num1 = Math.floor(Math.random() * 500) + 1;
      num2 = Math.floor(Math.random() * 500) + 1;
      op = Math.random() < 0.5 ? "+" : "-";
      if (op === "-" && num2 > num1) [num1, num2] = [num2, num1];
    }
    setRandomNum1(num1);
    setRandomNum2(num2);
    setOperation(op);
  };

  const checkAnswer = () => {
    const correctAnswer =
      operation === "+" ? randomNum1 + randomNum2 : randomNum1 - randomNum2;
    if (Number(answer) === correctAnswer) {
      const timeBonus = timer >= 15 ? 10 : timer >= 10 ? 7 : timer > 0 ? 5 : 0;
      setScore((prev) => prev + timeBonus);
      Swal.fire("Correct!", "Good job!", "success").then(() => {
        goToNextStage();
      });
    } else {
      setScore((prev) => prev - 5);
      Swal.fire("Incorrect!", "Try again!", "error");
    }
  };

  return (
    <Container fluid className="d-flex flex-column m-0 p-0 bg-warning p-5">
      <Container fluid className="d-flex">
        <h1 className="me-auto">Welcome, {playerName}!</h1>
        <h1>SCORE: {score}</h1>
        <h1>Time: {timer}</h1>
      </Container>
      <Container
        fluid
        className=" vh-100 d-flex align-items-center justify-content-center"
      >
        <Container
          fluid
          className="row d-flex align-items-center justify-content-center "
        >
          <Container
            className="col-6 d-flex align-items-center justify-content-center flex-column border border-dark p-5 rounded-3 shadow"
            data-aos="flip-left"
          >
            <h1 className="display-6 fw bold mb-4">STAGE {stage}</h1>
            <Container className="col-5 d-flex align-items-center justify-content-center gap-1">
              <Container className="col-12 bg-light d-flex align-items-center justify-content-center p-5 rounded-3">
                <h1 className="display-3 fw-bold">{randomNum1}</h1>
              </Container>
              <Container className="col-10 bg-warning d-flex align-items-center justify-content-center p-5 rounded-3">
                <h3 className="display-3 fw-bold">{operation}</h3>
              </Container>
              <Container className="col-12 bg-light d-flex align-items-center justify-content-center p-5 rounded-3">
                <h1 className="display-3 fw-bold">{randomNum2}</h1>
              </Container>
            </Container>

            <Form className="mt-5">
              <Form.Group className="mb-3 d-flex flex-column justify-content-center align-items-center">
                <Form.Control
                  type="number"
                  placeholder="Type your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="rounded-pill"
                  size="lg"
                />
                <Button
                  className="rounded-pill mt-5 w-100"
                  onClick={checkAnswer}
                  disabled={timer === 0}
                >
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
