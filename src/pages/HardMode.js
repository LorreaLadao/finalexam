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
    const [timeFreezeUsed, setTimeFreezeUsed] = useState(false);
    const [doublePointsUsed, setDoublePointsUsed] = useState(false);
    const [flashing, setFlashing] = useState(false);
    const [paused, setPaused] = useState(false); // Paused state for the timer

    useEffect(() => {
        if (!playerName) {
            navigate("/");
            return;
        }
        generateRandomNumbers();
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
    }, [timer, paused]); // Listen to paused state

    function generateRandomNumbers() {
        const num1 = Math.floor(Math.random() * 100) + 1;
        const num2 = Math.floor(Math.random() * 100) + 1;
        setRandomNum1(num1);
        setRandomNum2(num2);

        // Handle flashing numbers for stages 5-10
        if (stage >= 5) {
            setFlashing(true);
            setTimeout(() => setFlashing(false), 5000); // Flash for 5 seconds
        }

        setTimer(10); // Reset timer for each stage
    }

    function handleTimeout() {
        setScore(score - 5);
        Swal.fire({
            title: "Timeout!",
            text: "You ran out of time!",
            icon: "error",
        });
        goToNextStage();
    }

    function checkAnswer() {
        // Stop the timer when the submit button is clicked
        setPaused(true);

        const correctAnswer = randomNum1 + randomNum2;
        let points = 0;

        if (Number(answer) === correctAnswer) {
            const timeBonus =
                timer >= 7 ? 15 : timer >= 4 ? 10 : timer >= 1 ? 5 : 0;

            points = timeBonus;
            if (doublePointsUsed) {
                points *= 2;
                setDoublePointsUsed(false);
            }

            Swal.fire({
                title: "Correct!",
                text: `You earned ${points} points!`,
                icon: "success",
            }).then(() => {
                // After pop-up is closed, resume the timer
                setPaused(false);
                setScore(score + points);
                goToNextStage();
            });
        } else {
            Swal.fire({
                title: "Incorrect!",
                text: "You lost 10 points!",
                icon: "error",
            }).then(() => {
                // After pop-up is closed, resume the timer
                setPaused(false);
                setScore(score - 10);
                goToNextStage();
            });
        }
    }

    function goToNextStage() {
        if (stage === 10) {
            Swal.fire({
                title: "Congratulations!",
                text: `You completed Hard Mode with a score of ${score}!`,
                icon: "success",
            }).then(() => navigate("/select-level"));
        } else {
            setStage(stage + 1);
            setAnswer("");
            generateRandomNumbers();
        }
    }

    function useTimeFreeze() {
        if (timeFreezeUsed) {
            // If timeFreeze has already been used, show an alert or do nothing
            Swal.fire({
                title: "Time Freeze Already Used!",
                text: "You can only use the Time Freeze once per session.",
                icon: "warning",
            });
        } else {
            // If timeFreeze hasn't been used, proceed with the activation
            setTimeFreezeUsed(true);
            setPaused(true); // Pause the timer
            setTimer(timer + 5); // Add 5 seconds to the timer
            Swal.fire({
                title: "Time Freeze Activated!",
                text: "Timer paused for 5 seconds.",
                icon: "info",
            }).then(() => {
                setPaused(false); // Resume the timer after pop-up is closed
            });
        }
    }
    

    function useDoublePoints() {
        if (doublePointsUsed) {
            // If double points have already been used, show an alert or do nothing
            Swal.fire({
                title: "Double Points Already Used!",
                text: "You can only activate Double Points once per session.",
                icon: "warning",
            });
        } else {
            // If double points haven't been used, proceed with the activation
            setDoublePointsUsed(true);
            Swal.fire({
                title: "Double Points Activated!",
                text: "Next correct answer will earn double points.",
                icon: "info",
            }).then(() => {
                // Continue with the game after the pop-up is closed
            });
        }
    }
    
    return (
        <Container fluid className="d-flex flex-column m-0 p-0 bg-danger p-5 text-white">
            <Container fluid className="d-flex">
                <h1 className="me-auto">Welcome, {playerName}!</h1>
                <h1>Score: {score}</h1>
                <h1>Time: {timer}</h1>
            </Container>

            <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
                <Container className="col-6 d-flex align-items-center justify-content-center flex-column border border-dark p-5 rounded-3 shadow bg-light text-dark">
                    <h1 className="display-6 fw-bold mb-4">Stage {stage}</h1>

                    <Container className="col-5 d-flex align-items-center justify-content-center gap-1">
                        {(!flashing || stage < 5) && (
                            <>
                                <Container className="col-12 bg-warning d-flex align-items-center justify-content-center p-5 rounded-3">
                                    <h1 className="display-3 fw-bold">{randomNum1}</h1>
                                </Container>
                                <Container className="col-12 bg-warning d-flex align-items-center justify-content-center p-5 rounded-3">
                                    <h1 className="display-3 fw-bold">{randomNum2}</h1>
                                </Container>
                            </>
                        )}
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

                    <Container className="d-flex gap-3">
                        <Button
                            variant="primary"
                            onClick={useTimeFreeze}
                            disabled={timeFreezeUsed}
                        >
                            Time Freeze
                        </Button>
                        <Button
                            variant="success"
                            onClick={useDoublePoints}
                            disabled={doublePointsUsed}
                        >
                            Double Points
                        </Button>
                    </Container>
                </Container>
            </Container>
        </Container>
    );
}
