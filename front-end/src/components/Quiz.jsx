import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Select,
  MenuItem,
} from "@mui/material";
import Flashcard from "./Flashcard";
import DragAndDrop from "./DragAndDrop";
import "../styles/Quiz.css";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizMode, setQuizMode] = useState("multiple-choice"); // Modes: multiple-choice, true-false, flashcard, match-term

  const questions = {
    "multiple-choice": [
      {
        question: "What is the melon used for?",
        options: ["Echolocation", "Swimming", "Breathing", "Digestion"],
        answer: "Echolocation",
        category: "Anatomy",
      },
      {
        question: "What is the biggest threat to Cook Inlet belugas?",
        options: ["Climate change", "Noise pollution", "Overfishing", "All of the above"],
        answer: "All of the above",
        category: "Conservation",
      },
    ],
    "true-false": [
      {
        question: "Belugas can swim backward.",
        options: ["True", "False"],
        answer: "True",
        category: "Behavior",
      },
    ],
    "flashcard": [
      {
        question: "Do belugas have facial expressions?",
        answer: "Yes, they can move their lips and head to create expressions.",
        category: "Fun Facts",
      },
    ],
    "match-term": [
      {
        term: "Melon",
        match: "Echolocation",
      },
      {
        term: "Cook Inlet",
        match: "Endangered Population",
      },
    ],
  };

  const handleOptionClick = (option) => {
    setSelectedOptions({ ...selectedOptions, [currentQuestion]: option });
  };

  const handleNextQuestion = () => {
    if (selectedOptions[currentQuestion] === questions[quizMode][currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions[quizMode].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedOptions({});
  };

  const renderQuestion = () => {
    if (quizMode === "multiple-choice" || quizMode === "true-false") {
      return (
        <Box>
          <Typography variant="h5" gutterBottom>
            {questions[quizMode][currentQuestion].question}
          </Typography>
          <Box>
            {questions[quizMode][currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant={selectedOptions[currentQuestion] === option ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleOptionClick(option)}
                sx={{
                  margin: "5px",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {option}
              </Button>
            ))}
          </Box>
        </Box>
      );
    } else if (quizMode === "flashcard") {
      return <Flashcard question={questions.flashcard[currentQuestion]} />;
    } else if (quizMode === "match-term") {
      return <DragAndDrop />;
    }
  };

  return (
    <Box
      className="quiz-container"
      sx={{
        maxWidth: 700,
        margin: "50px auto",
        padding: "30px",
        backgroundColor: "#ffffff",
        borderRadius: "15px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Beluga Whale Quiz
      </Typography>
      <div className="quiz-mode-dropdown">
        <Select
          value={quizMode}
          onChange={(e) => setQuizMode(e.target.value)}
        >
          <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
          <MenuItem value="true-false">True/False</MenuItem>
          <MenuItem value="flashcard">Flashcard</MenuItem>
          <MenuItem value="match-term">Match the Term</MenuItem>
        </Select>
      </div>
      <LinearProgress
        variant="determinate"
        value={(currentQuestion / questions[quizMode].length) * 100}
        sx={{ marginBottom: "20px", height: "10px", borderRadius: "5px" }}
      />
      {showResults ? (
        <Box>
          <Typography variant="h4" gutterBottom>
            Quiz Results
          </Typography>
          <Typography variant="h6">
            You scored <strong>{score}</strong> out of <strong>{questions[quizMode].length}</strong>!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRestartQuiz}
            sx={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "10px",
            }}
          >
            Restart Quiz
          </Button>
        </Box>
      ) : (
        <>
          {renderQuestion()}
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button
              onClick={handlePreviousQuestion}
              variant="outlined"
              color="secondary"
              disabled={currentQuestion === 0}
              sx={{
                padding: "10px 20px",
                fontSize: "1rem",
                borderRadius: "10px",
              }}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextQuestion}
              variant="contained"
              color="primary"
              disabled={!selectedOptions[currentQuestion]}
              sx={{
                padding: "10px 20px",
                fontSize: "1rem",
                borderRadius: "10px",
              }}
            >
              {currentQuestion === questions[quizMode].length - 1 ? "Finish Quiz" : "Next"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Quiz;