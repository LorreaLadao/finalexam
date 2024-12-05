import { useEffect, useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function MediumMode() {
  let playerName = localStorage.getItem("playerName");
  const navigate = useNavigate();
  const [timeFreezeActive, setTimeFreezeActive] = useState(false);
  const [randomNum1, setRandomNum1] = useState(0);
  const [randomNum2, setRandomNum2] = useState(0);
  const [answer, setAnswer] = useState();
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [paused, setPaused] = useState(false);
  const [operation, setOperation] = useState("+");
  const [isSwalOpen, setIsSwalOpen] = useState(false); // Flag to track if Swal is open

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
    setScore((prev) => prev - 5);
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
      }).then(() => {
        setTimeout(() => {
          navigate("/select-level");
        }, 1000); // Add a small delay to ensure the alert is visible for a moment
      });
    } else {
      setStage((prev) => prev + 1);
      setAnswer("");
      generateRandomNumbers();
      setTimer(20);
    }
  };

  function pauseBeforeStart() {
    console.log("Current stage:", stage); // Log the current stage

    if (stage === 1) {
      // Only pause at stage 1
      setPaused(true); // Pause initially

      Swal.fire({
        title: "Game Paused",
        text: "Click 'OK' to start!",
        icon: "info",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          let countdown = 3;
          const countdownInterval = setInterval(() => {
            Swal.fire({
              title: `Resuming in ${countdown}...`,
              text: "Get ready!",
              icon: "info",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
            });

            countdown -= 1;

            if (countdown < 1) {
              clearInterval(countdownInterval); // Stop countdown
              setPaused(false); // Resume game
            }
          }, 1000);
        }
      });
    } else {
      setPaused(false); // No pause if not at stage 1
    }

    // Ensure the time freeze countdown is paused when the game is paused
    if (timeFreezeActive) {
      setPaused(true); // Pause both the game and time freeze
    }
  }

  const generateRandomNumbers = () => {
    let num1, num2, op;
    if (stage <= 4) {
      // Stage >= 4: Use addition only
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
      op = "+";
    } else if (stage >= 5) {
      // Stage <= 5: Randomly choose between "+" and "-"
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
      op = Math.random() < 0.5 ? "+" : "-";
    } 
    setRandomNum1(num1);
    setRandomNum2(num2);
    setOperation(op);

  };

  const checkAnswer = async () => {
    if (isSwalOpen) return; // Prevent further checks if Swal is open

    const correctAnswer =
      operation === "+" ? randomNum1 + randomNum2 : randomNum1 - randomNum2;

    if (Number(answer) === correctAnswer) {
      const timeBonus = timer >= 15 ? 10 : timer >= 10 ? 7 : timer > 0 ? 5 : 0;
      setScore((prev) => prev + timeBonus);

      // Wait for the Swal alert to be closed by the user before proceeding
      setIsSwalOpen(true); // Set the Swal flag to open
      await Swal.fire({
        title: "Correct!",
        text: "Good job!",
        icon: "success",
      });
      setIsSwalOpen(false); // Reset Swal flag after alert is closed

      // Now, proceed to the next stage after the alert is closed
      goToNextStage();
    } else {
      setScore((prev) => prev - 2);

      // Wait for the Swal alert to be closed by the user before proceeding
      setIsSwalOpen(true); // Set the Swal flag to open
      await Swal.fire({
        title: "Incorrect!",
        text: "Try again!",
        icon: "error",
      });
      setIsSwalOpen(false); // Reset Swal flag after alert is closed
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSwalOpen) {
      // Prevent submitting if Swal is open
      e.preventDefault(); // Prevent default form submission
      checkAnswer();
    }
  };

  return (
    <Container fluid className="d-flex flex-column m-0 p-0 bg-warning p-5">
      <Container fluid className="d-flex">
        <h1 className="me-auto">Welcome, {playerName}!</h1>
        <h1>SCORE: {score}</h1>
        <h1 className={timeFreezeActive ? "time-freeze-active" : "time-normal"}>
          Time: {timer}
        </h1>
      </Container>
      <Container
        fluid
        className="vh-100 d-flex align-items-center justify-content-center"
      >
        <Container
          fluid
          className="row d-flex align-items-center justify-content-center"
        >
          <Container
            className="col-6 d-flex align-items-center justify-content-center flex-column border border-dark p-5 rounded-3 shadow"
            data-aos="flip-left"
          >
            <h1 className="display-6 fw bold mb-4">PROBLEM {stage}</h1>
            <Container className="col-5 d-flex align-items-center justify-content-center gap-1">
              <Container className="col-12 bg-light d-flex align-items-center justify-content-center p-5 rounded-3">
                <h1 className="display-3 fw-bold">{randomNum1}</h1>
              </Container>
              <Container className="col-12 bg-light d-flex align-items-center justify-content-center p-5 rounded-3">
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
                  onKeyDown={handleKeyDown} // Handle Enter key
                  className="rounded-pill"
                  size="lg"
                />
                <Button
                  className="rounded-pill mt-5 w-100"
                  onClick={checkAnswer}
                  disabled={timer === 0 || isSwalOpen} // Disable button if Swal is open
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
