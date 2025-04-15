import React from "react";
import Quiz from "../components/Quiz";
import "../styles/Education.css";

const Education = () => {
  return (
    <div className="education-page">
      <header className="education-header">
        <h1>Beluga Whale Education</h1>
        <p>Learn about beluga whales and test your knowledge with our interactive quiz!</p>
      </header>
      <section className="education-content">
        <Quiz />
      </section>
    </div>
  );
};

export default Education;