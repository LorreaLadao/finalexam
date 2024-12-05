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
    const [doublePointsActive, setDoublePointsActive] = useState(false);  // New state to track if double points are active
    const [flashing, setFlashing] = useState(false);
    const [paused, setPaused] = useState(false); // Paused state for the timer
    const [flashMessage, setFlashMessage] = useState("");

    useEffect(() => {
        if (!playerName) {
            navigate("/"); // Redirect to home if no player name
            return;
        }
        generateRandomNumbers();
        pauseBeforeStart(); // Pause before starting
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

    function pauseBeforeStart() {
        console.log("Current stage:", stage); // Log the current stage
    
        if (stage === 1) { // Only pause at stage 1
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
    

    function generateRandomNumbers() {
        let num1, num2, operation;
    
        // For stages 1-5, only addition with numbers from 1 to 100
        if (stage <= 5) {
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * 100) + 1;
            operation = "+";
        }
        // For stages 6-10, 50-50 chance of addition or subtraction (with no negative results)
        else {
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * 100) + 1;
    
            // Randomly choose between addition or subtraction
            if (Math.random() < 0.5) {
                operation = "+";
            } else {
                operation = "-";
                // Ensure num2 is not greater than num1 for subtraction
                if (num2 > num1) {
                    [num1, num2] = [num2, num1];
                }
            }
        }
    
        setRandomNum1(num1);
        setRandomNum2(num2);
        setOperation(operation);
        setTimer(10); // Reset timer for next stage
    }
    
    function handleTimeout() {
        if (doublePointsActive) {
            // If double points are active, deduct 10 points and skip the popup
            setScore((prevScore) => prevScore - 5); // Decrease the score by 10
            goToNextStage(); // Move to the next stage immediately
            setAnswer(""); // Clear the answer input
            generateRandomNumbers();
        } else {
            // Standard timeout behavior
            setScore((prevScore) => prevScore - 5); // Decrease the score by 5 on timeout
    
            // Display timeout message to the user
            Swal.fire({
                title: "Timeout!",
                text: "You ran out of time!",
                icon: "error",
                willClose: () => {
                    goToNextStage(); // Proceed to the next stage after the popup
                }
            });
        }
    }
    
    const startCountdown = () => {
        let countdown = 6; // Countdown duration (6 seconds)
        
        // Start the countdown interval
        let countdownInterval = setInterval(() => {
            if (!paused) { // Only proceed if the game is not paused
                countdown -= 1;
                
                // Check if the countdown reaches 0
                if (countdown <= 0) {
                    clearInterval(countdownInterval); // Stop the countdown
                    setTimeFreezeActive(false); // Set timeFreezeActive to false after freeze ends
                    setPaused(false); // Resume the game after countdown finishes
                }
            }
        }, 1000);
    
        // Freeze the countdown for exactly 6 seconds if timeFreeze is active
        if (timeFreezeActive) {
            setPaused(true); // Pause the game immediately when time freeze is active
    
            // After 6 seconds, resume the countdown and the game
            setTimeout(() => {
                setPaused(false); // Unpause the game after 6 seconds
                clearInterval(countdownInterval); // Ensure countdown finishes
            }, 6000); // Freeze duration is 6 seconds
        }
    
    };
    
    
    function checkAnswer() {
        // Only pause if double points are not active and the game is not paused
        if (!doublePointsActive && !paused) {
            setPaused(true); // Stop timer when answer is submitted
        }
    
        let correctAnswer;
    
        // Calculate the correct answer based on the operation
        if (operation === "+") {
            correctAnswer = randomNum1 + randomNum2;
        } else if (operation === "-") {
            correctAnswer = randomNum1 - randomNum2;
        }
    
        let points = 0;
    
       // Check if the answer is correct
    if (Number(answer) === correctAnswer) {
        const timeBonus = timer >= 7 ? 15 : timer >= 4 ? 10 : timer >= 1 ? 5 : 0;

        points = timeBonus;

        if (timer > 7) {
            const chance = Math.random();
            if (chance < 0.33 && timeFreezeUsed) {
                setFlashMessage(
                    <div className={`flash-message freeze-notif rounded mb-4 ${flashing ? "flashing" : ""}`} style={{ width: '1700%' }}>
                        Time Freeze Available!
                    </div>
                );
                setTimeFreezeUsed(false); // Enable Time Freeze power-up
            } else if (chance < 0.66 && doublePointsUsed) {
                setFlashMessage(
                    <div className={`flash-message double rounded mb-4 ${flashing ? "flashing" : ""}`} style={{ width: '1700%' }}>
                        Double Points Available!
                    </div>
                );
                setDoublePointsUsed(false); // Enable Double Points power-up
            } 
            // The remaining 33% chance awards no power-up
        }
        

    
            // If double points are active, apply the bonus
            if (doublePointsActive) {
                points *= 2;
    
                // Update the score immediately without popups
                setScore(score + points);
    
                // Immediately generate a new set of random numbers for the next question
                generateRandomNumbers();
    
                // Move to the next stage without waiting for a popup
                goToNextStage();
            } else {
                // Standard pop-up message for regular points (if double points is not active)
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
            // Handle incorrect answer
            if (doublePointsActive) {
                // If double points are active, deduct points but stay on the same stage
                setScore(score - 5); // Deduct 10 points for incorrect answer
                setAnswer(""); // Clear the answer input

            } else {
                // Standard pop-up for incorrect answer (without double points)
                setPaused(true); // Pause the game when Swal is active
                Swal.fire({
                    title: "Incorrect!",
                    text: "You lost 5 points! Try again.",
                    icon: "error",
                }).then(() => {
                    setScore(score - 5); // Deduct points for incorrect answer
                    setAnswer(""); // Clear the answer input

                    // Resume the game after Swal is closed
                    setPaused(false);
                });
            }

        }
        
        // Handle the time freeze effect here
        if (timeFreezeActive) {
            setPaused(true); // Pause the game and the countdown if time freeze is active
        } else {
        
        }
    }
    
    
    function goToNextStage() {
        // Increment the stage and prepare for the next round
        setStage((prevStage) => prevStage + 1); // Increment the stage
        setAnswer(""); // Clear the answer input
        generateRandomNumbers(); // Generate new random numbers for the next stage
    
        // Handle timer behavior based on active modifiers
        if (timeFreezeActive) {
            setPaused(false); // Resume the game timer as time freeze ends
            setTimeFreezeActive(false); // Deactivate the time freeze explicitly
        } else {
            setPaused(false); // Resume the timer if no time freeze
            if (timer === 0) {
                setTimer(10); // Reset the timer only if it reached 0, otherwise keep the current value
            }
        }
    
        // Check if the stage is 10 (the last stage)
        if (stage === 10) { // Ensure this check happens before the stage is incremented
            Swal.fire({
                title: "Congratulations!",
                text: `You completed Hard Mode with a score of ${score - 10}!`,
                icon: "success",
            }).then(() => {
                // Navigate to the select-level page after completing the last stage
                navigate("/select-level");
            });
        }
    }
    
    
    function useTimeFreeze() {
        if (timeFreezeUsed) {
            // Time freeze already used, do nothing or handle the notification
        } else {
            // Activate time freeze for 5 seconds
            setTimeFreezeUsed(true);
            setTimeFreezeActive(true);
    
            setPaused(true); // Pause the timer while time freeze is active
    
            // Save the countdown state
            let countdownInterval;
    
    
            // Start the countdown when time freeze is activated
            startCountdown();
    
            // Listen for the game pause and resume
            if (paused) {
                // When the game is paused, stop the countdown (don't restart it)
                clearInterval(countdownInterval); 
            } else {
                // When the game is resumed, continue the countdown from where it was
                startCountdown(); // Continue the countdown from the current state
            }
        }
    }
    
    
    function useDoublePoints() {
        if (doublePointsUsed) {
            // If double points are already used, return early
            return;
        } else {
            setDoublePointsUsed(true); // Mark double points as used
            setDoublePointsActive(true); // Set double points as active
            setFlashing(true); // Start flashing effect
    
            let countdown = 5;  // Set the initial countdown value (in seconds)
    
            // Set the initial flash message with countdown
            setFlashMessage(
                <div className="flash-message double rounded mb-4" style={{ width: '1700%' }}>
                    Double Points activated for {countdown} seconds!
                </div>
            );
    
            // Start countdown and synchronize with the timer
            const countdownInterval = setInterval(() => {
                setFlashMessage(
                    <div className={`flash-message double rounded mb-4 ${flashing ? "flashing" : ""}`} style={{ width: '1700%' }}>
                        Double Points activated for {countdown} seconds!
                    </div>
                );
    
                countdown--; // Decrease the countdown
    
                if (countdown <= -1) {
                    clearInterval(countdownInterval);  // Stop countdown when it reaches 0
                    setFlashing(false);  // Stop flashing effect
                    setDoublePointsActive(false);  // Set double points as inactive
                    setFlashMessage(  // Final flash message when countdown ends
                        <div className="flash-message double rounded mb-4" style={{ width: '1700%' }}>
                        Double Points Deactivated
                    </div>
                    );
                }
            }, 1000);  // Update every second
        }
    }
    
    
    return (

         <Container fluid className="d-flex flex-column m-0 p-0 bg-danger p-5 text-white">
          {/* Flash Messages */}
          {flashMessage && (
            <div className={`flash-message text-dark p-3 rounded mb-2`}>
              <h5>{flashMessage}</h5>
            </div>
          )}
          
    
          <Container fluid className="d-flex">
            <h1 className="me-auto">Welcome, {playerName}!</h1>
            <h1>Score: {score}</h1>
            <h1 className={timeFreezeActive ? 'time-freeze-active' : 'time-normal'}>
    Time: {timer}
</h1>

          </Container>
    
          <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
            <Container className="col-6 d-flex align-items-center justify-content-center flex-column border border-dark p-5 rounded-3 shadow bg-light text-dark">
              <h1 className="display-6 fw-bold mb-4">PROBLEM {stage}</h1>
    
              <Container className="col-5 d-flex align-items-center justify-content-center gap-1">
              {!flashing || stage >= 1 ? (
                <>
                    {timer > 5 && (
                    <Container className="col-10 bg-warning d-flex align-items-center justify-content-center p-5 rounded-3">
                        <h1 className="display-3 fw-bold">{randomNum1}</h1>
                    </Container>
                    )}
                    <Container className="col-10 bg-warning d-flex align-items-center justify-content-center p-5 rounded-3">
                    <h3 className="display-3 fw-bold">{operation}</h3>
                    </Container>
                    {timer > 5 && (
                    <Container className="col-10 bg-warning d-flex align-items-center justify-content-center p-5 rounded-3">
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
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Prevent default behavior (e.g., form submission)
                        checkAnswer(); // Call the checkAnswer function
                    }
                }}
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
                  onClick={useTimeFreeze} // Updated handler
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