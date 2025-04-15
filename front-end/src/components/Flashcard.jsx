import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const Flashcard = ({ question }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ textAlign: "center" }}>
      <Card
        sx={{
          maxWidth: 500,
          margin: "20px auto",
          textAlign: "center",
          padding: "20px",
          cursor: "pointer",
          backgroundColor: flipped ? "#e0f7fa" : "#ffffff",
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.5s ease",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={() => setFlipped(!flipped)}
      >
        <CardContent>
          <Typography variant="h6">
            {flipped ? question.answer : question.question}
          </Typography>
        </CardContent>
      </Card>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setFlipped(false)}
        sx={{ marginTop: "20px" }}
      >
        Replay
      </Button>
    </div>
  );
};

export default Flashcard;