import { useEffect, useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function HardMode() {
    const playerName = localStorage.getItem("playerName");
    const navigate = useNavigate();
    const [randomNum1, setRandomNum1] = useState(0);
    const [randomNum2, setRandomNum2] = useState(0);
    const [answer, setAnswer] = useState("");
    const [stage, setStage] = useState(1);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(10);
    const [operation, setOperation] = useState('+');
    const [timeFreezeUsed, setTimeFreezeUsed] = useState(false);
    const [timeFreezeActive, setTimeFreezeActive] = useState(false);
    const [doublePointsUsed, setDoublePointsUsed] = useState(false);
    const [doublePointsActive, setDoublePointsActive] = useState(false);
    const [flashing, setFlashing] = useState(false);
    const [paused, setPaused] = useState(false);
    const [flashMessage, setFlashMessage] = useState("");
    const [flashFreeze, setFlashFreeze] = useState("");

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
            const timerInterval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(timerInterval);
        } else {
            if (timer === 0) {
                handleTimeout();
            }
        }
    }, [timer, paused]);

    function pauseBeforeStart() {
        console.log("Current stage:", stage);
    
        if (stage === 1) {
            setPaused(true);
    
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
                            clearInterval(countdownInterval);
                            setPaused(false);
                        }
                    }, 1000);
                }
            });
        } else {
            setPaused(false);
        }
    
        if (timeFreezeActive) {
            setPaused(true);
        }
    }
    

    function generateRandomNumbers() {
        let num1, num2, operation;
    
        if (stage <= 5) {
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * 100) + 1;
            operation = "+";
        }
        else {
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * 100) + 1;
    
            if (Math.random() < 0.5) {
                operation = "+";
            } else {
                operation = "-";
                if (num2 > num1) {
                    [num1, num2] = [num2, num1];
                }
            }
        }
    
        setRandomNum1(num1);
        setRandomNum2(num2);
        setOperation(operation);
        setTimer(10)
    }
    
    function handleTimeout() {
        if (doublePointsActive) {
            setScore((prevScore) => prevScore - 2);
            goToNextStage();
            setAnswer("");
            generateRandomNumbers();
        } else {
            setScore((prevScore) => prevScore - 5);
    
            Swal.fire({
                title: "Timeout!",
                text: "You ran out of time!",
                icon: "error",
                willClose: () => {
                    goToNextStage();
                }
            });
        }
    }
    
    const startCountdown = () => {
        let countdown = 6;
        
        let countdownInterval = setInterval(() => {
            if (!paused) {
                countdown -= 1;
                
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    setTimeFreezeActive(false);
                    setPaused(false);
                }
            }
        }, 1000);
    
        if (timeFreezeActive) {
            setPaused(true);

            setTimeout(() => {
                setPaused(false);
                clearInterval(countdownInterval);
            }, 6000);
        }
    
    };
    
    
    function checkAnswer() {
        if (!doublePointsActive && !paused) {
            setPaused(true);
        }
    
        let correctAnswer;

        if (operation === "+") {
            correctAnswer = randomNum1 + randomNum2;
        } else if (operation === "-") {
            correctAnswer = randomNum1 - randomNum2;
        }
    
        let points = 0;

    if (Number(answer) === correctAnswer) {


        points = 5

        if (timer > 7) {
            const chance = Math.random();
            if (chance < 0.33 && timeFreezeUsed) {
                setFlashFreeze(
                    <div className={`flash-message double rounded mb-4 ${flashing ? "flashing" : ""}`} style={{ width: '1700%', left: '-20%' }}>
                        Time Freeze Available!
                    </div>
                );
                setTimeFreezeUsed(false);
            } else if (chance < 0.66 && doublePointsUsed) {
                setFlashFreeze(
                    <div className={`flash-message double rounded mb-4 ${flashing ? "flashing" : ""}`} style={{ width: '1700%', left: '-20%' }}>
                        Double Points Available!
                    </div>
                );
                setDoublePointsUsed(false);
            } 

        }
        


            if (doublePointsActive) {
                points *= 2;

                setScore(score + points);

                generateRandomNumbers();

                goToNextStage();
            } else {

                Swal.fire({
                    title: "Correct!",
                    text: `You earned ${points} points!`,
                    icon: "success",
                }).then(() => {
                    setScore(score + points);
                    goToNextStage();
                });
            }
        } else {

            if (doublePointsActive) {

                setScore(score - 2);
                setAnswer("");

            } else {

                setPaused(true);
                Swal.fire({
                    title: "Incorrect!",
                    text: "You lost 2 points! Try again.",
                    icon: "error",
                }).then(() => {
                    setScore(score - 2);
                    setAnswer("");

                    setPaused(false);
                });
            }

        }

        if (timeFreezeActive) {
            setPaused(true);
        } else {
        
        }
    }
    
    
    function goToNextStage() {
        setStage((prevStage) => prevStage + 1);
        setAnswer("");
        generateRandomNumbers();

        if (timeFreezeActive) {
            setPaused(false);
            setTimeFreezeActive(false);
        } else {
            setPaused(false);
            if (timer === 0) {
                setTimer(10);
            }
        }

        if (stage === 10) {
            Swal.fire({
                title: "Congratulations!",
                text: `You completed Hard Mode with a score of ${score - 10}!`,
                icon: "success",
            }).then(() => {
                navigate("/select-level");
            });
        }
    }
    
    
    function useTimeFreeze() {
        if (timeFreezeUsed) {
        } else {
            setTimeFreezeUsed(true);
            setTimeFreezeActive(true);
    
            setPaused(true);

            let countdownInterval;
    

            startCountdown();

            if (paused) {
                clearInterval(countdownInterval); 
            } else {
                startCountdown();
            }
        }
    }
    
    
    function useDoublePoints() {
        if (doublePointsUsed) {
            return;
        } else {
            setDoublePointsUsed(true);
            setDoublePointsActive(true);
            setFlashing(true);
    
            let countdown = 5;

            setFlashMessage(
                <div className="flash-message double rounded mb-4" style={{ width: '1700%' }}>
                    Double Points activated for {countdown} seconds!
                </div>
            );

            const countdownInterval = setInterval(() => {
                setFlashMessage(
                    <div className={`flash-message double rounded mb-4 ${flashing ? "flashing" : ""}`} style={{ width: '1700%' }}>
                        Double Points activated for {countdown} seconds!
                    </div>
                );
    
                countdown--;
    
                if (countdown <= -1) {
                    clearInterval(countdownInterval);
                    setFlashing(false);
                    setDoublePointsActive(false);
                    setFlashMessage(
                        <div className="flash-message double rounded mb-4" style={{ width: '1700%' }}>
                        Double Points Deactivated
                    </div>
                    );
                }
            }, 1000);
        }
    }
    
    
    return (

        <Container fluid className="d-flex flex-column m-0 p-0 p-5 text-white">
        {}
        {flashMessage && (
          <div className={`flash-message text-dark p-3 rounded mb-2`}>
            <h5>{flashMessage}</h5>
          </div>
        )}

<Container fluid className="d-flex flex-column m-0 p-0 p-5 text-white">
          {}
          {flashFreeze && (
            <div className={`flash-message text-dark p-3 rounded mb-2`}>
              <h5>{flashFreeze}</h5>
            </div>
          )}
          
    
          <Container fluid className="d-flex">
            <h1 className="me-auto text-white">Score: {score}</h1>
            <h1 className={timeFreezeActive ? 'time-freeze-active' : 'time-normal'}>
    Time: {timer}
</h1>

          </Container>
    
          <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
            <Container className="game-card col-6 d-flex align-items-center justify-content-center flex-column p-5 rounded-3 shadow text-dark">
              <h1 className="display-6 fw-bold mb-4 text-white"> Problem {stage}</h1>
    
              <Container className="col-5 d-flex align-items-center justify-content-center gap-1">
              {!flashing || stage >= 1 ? (
                <>
                    {timer > 5 && (
                    <Container className="col-12 bg-light d-flex align-items-center justify-content-center p-5 w-75 rounded-3 ms-4">
                        <h1 className="display-3 fw-bold">{randomNum1}</h1>
                    </Container>
                    )}
                    <Container className="col-12 bg-transparent d-flex align-items-center justify-content-center w-50 rounded-3 text-white">
                    <h3 className="display-3 fw-bold">{operation}</h3>
                    </Container>
                    {timer > 5 && (
                    <Container className="col-12 bg-light d-flex align-items-center justify-content-center p-5 w-75 rounded-3 me-4">
                            <h1 className="display-3 fw-bold">{randomNum2}</h1>
                    </Container>
                    )}
                </>
                ) : null}


              </Container>
    
              <Form className="mt-5">
                <Form.Group className="mb-3 d-flex flex-column justify-content-center align-items-center">
                <Form.Control
                type="number"
                placeholder="Type your answer"
                className="rounded-3 p-2"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        checkAnswer();
                    }
                }}
            />
                  <Button className="rounded-3 mt-2 w-100 p-2 bg-warning text-white custom-border" onClick={checkAnswer}>
                    Check
                  </Button>
                </Form.Group>
              </Form>
    
              <Container className="d-flex gap-2 text justify-content-center">
                <Button
                  variant="primary"
                  onClick={useTimeFreeze}
                  disabled={timeFreezeUsed}
                  className="w-25 custom-border">
                  Time Freeze
                </Button>
                <Button
                  variant="success"
                  onClick={useDoublePoints}
                  disabled={doublePointsUsed}
                  className="w-25 custom-border">
                  Double Points
                </Button>
              </Container>
              </Container>
          </Container>
        </Container>
        </Container>
      );
    }