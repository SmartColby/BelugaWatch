import React, { useEffect, useRef, useState } from "react";
import "../styles/BelugaGame.css";
import belugaSprite from "../assets/sprites/beluga.png";
import fishSprite from "../assets/sprites/fish.png";
import trashSprite from "../assets/sprites/trash.png";
import boatSprite from "../assets/sprites/boat.png";
import heartSprite from "../assets/sprites/heart.png";
import backgroundImage from "../assets/backgrounds/arctic.jpg";

const BelugaGame = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [marineFact, setMarineFact] = useState(null);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const gridSize = 60; // Increased size for all sprites
  const belugaRef = useRef({ x: 0, y: 0, width: gridSize, height: gridSize });
  const fishRef = useRef([]);
  const trashRef = useRef([]);
  const threatsRef = useRef([]);
  const safeZones = [
    { x: 0, y: 0, width: gridSize * 2, height: gridSize * 2 },
    { x: canvasWidth - gridSize * 2, y: canvasHeight - gridSize * 2, width: gridSize * 2, height: gridSize * 2 },
  ];

  const marineFacts = [
    "Belugas can mimic human speech patterns!",
    "Plastic pollution can block belugas' blowholes.",
    "Melting sea ice disrupts beluga migration.",
    "Belugas are one of the most vocal whale species!",
    "Belugas rely on echolocation to navigate Arctic waters.",
    "Climate change threatens beluga habitats."
  ];

  const resetGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    setLives(3);
    setMarineFact(null);
    belugaRef.current = { x: 0, y: 0, width: gridSize, height: gridSize };
    generateItems();
  };

  const generateItems = () => {
    // Generate fish (energy pickups)
    fishRef.current = Array.from({ length: 10 }, () => ({
      x: Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize,
      type: "fish",
    }));

    // Generate trash (hazards)
    trashRef.current = Array.from({ length: 5 }, () => ({
      x: Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize,
      type: "trash",
    }));

    // Generate threats (boats)
    threatsRef.current = Array.from({ length: 3 }, () => ({
      x: Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize,
      direction: Math.random() > 0.5 ? "horizontal" : "vertical", // Randomize direction
      speed: Math.random() > 0.5 ? gridSize / 6 : -gridSize / 6, // Reduced speed
    }));
  };

  const handleKeyDown = (e) => {
    const beluga = belugaRef.current;
    if (gameOver || gameWon) return;

    if (e.key === "w") beluga.y = Math.max(beluga.y - gridSize, 0); // Move up
    if (e.key === "s") beluga.y = Math.min(beluga.y + gridSize, canvasHeight - gridSize); // Move down
    if (e.key === "a") beluga.x = Math.max(beluga.x - gridSize, 0); // Move left
    if (e.key === "d") beluga.x = Math.min(beluga.x + gridSize, canvasWidth - gridSize); // Move right

    checkCollisions();
  };

  const checkCollisions = () => {
    const beluga = belugaRef.current;

    // Check collision with fish
    fishRef.current = fishRef.current.filter((fish) => {
      if (beluga.x === fish.x && beluga.y === fish.y) {
        setScore((prev) => prev + 10);
        return false; // Remove the fish after collection
      }
      return true;
    });

    // Check collision with trash
    trashRef.current = trashRef.current.filter((trash) => {
      if (beluga.x === trash.x && beluga.y === trash.y) {
        if (!isInSafeZone(beluga)) {
          setLives((prev) => prev - 1); // Reduce lives
          if (lives - 1 === 0) {
            setGameOver(true); // End the game if lives reach 0
          }
        }
        return false; // Remove the trash after collision
      }
      return true;
    });

    // Check collision with threats (boats)
    threatsRef.current.forEach((threat) => {
      if (beluga.x === threat.x && beluga.y === threat.y && !isInSafeZone(beluga)) {
        setLives((prev) => prev - 1); // Reduce lives
        if (lives - 1 === 0) {
          setGameOver(true); // End the game if lives reach 0
        }
      }
    });

    // Check if all fish are collected
    if (fishRef.current.length === 0) {
      setGameWon(true); // Player wins if all fish are collected
    }
  };

  const isInSafeZone = (entity) => {
    return safeZones.some(
      (zone) =>
        entity.x >= zone.x &&
        entity.x < zone.x + zone.width &&
        entity.y >= zone.y &&
        entity.y < zone.y + zone.height
    );
  };

  const moveThreats = () => {
    threatsRef.current.forEach((threat) => {
      // Randomly switch direction
      if (Math.random() < 0.01) { // 1% chance per frame to switch direction
        threat.direction = threat.direction === "horizontal" ? "vertical" : "horizontal";
      }

      // Move horizontally
      if (threat.direction === "horizontal") {
        threat.x += threat.speed;
        if (threat.x <= 0 || threat.x >= canvasWidth - gridSize) {
          threat.speed *= -1; // Reverse direction when hitting canvas edges
        }
      }

      // Move vertically
      if (threat.direction === "vertical") {
        threat.y += threat.speed;
        if (threat.y <= 0 || threat.y >= canvasHeight - gridSize) {
          threat.speed *= -1; // Reverse direction when hitting canvas edges
        }
      }
    });
  };

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const background = new Image();
    background.src = backgroundImage;

    const belugaImage = new Image();
    belugaImage.src = belugaSprite;

    const fishImage = new Image();
    fishImage.src = fishSprite;

    const trashImage = new Image();
    trashImage.src = trashSprite;

    const boatImage = new Image();
    boatImage.src = boatSprite;

    const heartImage = new Image();
    heartImage.src = heartSprite;

    const gameLoop = () => {
      if (gameOver || gameWon) return;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw background
      ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

      // Draw safe zones
      ctx.fillStyle = "lightgreen";
      safeZones.forEach((zone) => {
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
      });

      // Draw beluga
      ctx.drawImage(belugaImage, belugaRef.current.x, belugaRef.current.y, gridSize, gridSize);

      // Draw fish
      fishRef.current.forEach((fish) => {
        ctx.drawImage(fishImage, fish.x, fish.y, gridSize, gridSize);
      });

      // Draw trash
      trashRef.current.forEach((trash) => {
        ctx.drawImage(trashImage, trash.x, trash.y, gridSize, gridSize);
      });

      // Draw threats (boats)
      threatsRef.current.forEach((threat) => {
        ctx.drawImage(boatImage, threat.x, threat.y, gridSize, gridSize);
      });

      // Draw score
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${score}`, 10, 20);

      // Draw lives as hearts
      for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImage, 10 + i * 30, 30, 20, 20);
      }

      moveThreats();
      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, [gameStarted, gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  return (
    <div>
      {!gameStarted && (
        <div className="instructions">
          <h2>How to Play</h2>
          <p>Use the W, A, S, D keys to move the beluga whale.</p>
          <p>Collect fish 🐟 for points, avoid trash 🚮, and escape boats 🚤!</p>
          <p>Use safe zones (green areas) to escape threats.</p>
          <button onClick={resetGame} className="btn btn-primary">
            Start Game
          </button>
        </div>
      )}
      {gameStarted && (
        <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>
      )}
      {gameOver && (
        <div className="game-over">
          <h1>Game Over</h1>
          <p>Your Score: {score}</p>
          <button onClick={resetGame} className="btn btn-primary">
            Play Again
          </button>
        </div>
      )}
      {gameWon && (
        <div className="game-won">
          <h1>Congratulations!</h1>
          <p>You collected all the fish and saved the beluga!</p>
          <button onClick={resetGame} className="btn btn-primary">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default BelugaGame;