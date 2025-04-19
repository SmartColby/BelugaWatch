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
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState("Easy");
  const [invincible, setInvincible] = useState(false);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const gridSize = 60;
  const belugaRef = useRef({ x: 0, y: 0, width: gridSize, height: gridSize });
  const fishRef = useRef([]);
  const trashRef = useRef([]);
  const threatsRef = useRef([]);
  const powerUpsRef = useRef([]);
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

  const handleDifficultyChange = (level) => setDifficulty(level);

  const adjustDifficulty = () => {
    const settings = {
      Easy: [10, 3, 2],
      Medium: [15, 5, 3],
      Hard: [20, 7, 5]
    };
    generateItems(...settings[difficulty]);
  };

  const resetGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    setLives(3);
    setMarineFact(null);
    setLevel(1);
    setInvincible(false);
    belugaRef.current = { x: 0, y: 0, width: gridSize, height: gridSize };
    adjustDifficulty();
    generatePowerUps();
  };

  const generateItems = (fishCount, trashCount, threatCount) => {
    const randCoord = () => Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;

    fishRef.current = Array.from({ length: fishCount }, () => ({ x: randCoord(), y: randCoord(), type: "fish" }));
    trashRef.current = Array.from({ length: trashCount }, () => ({ x: randCoord(), y: randCoord(), type: "trash" }));

    threatsRef.current = Array.from({ length: threatCount }, () => ({
      x: randCoord(),
      y: randCoord(),
      direction: Math.random() > 0.5 ? "horizontal" : "vertical",
      speed: Math.random() > 0.5 ? gridSize / 6 : -gridSize / 6,
      width: gridSize,
      height: gridSize
    }));
  };

  const generatePowerUps = () => {
    powerUpsRef.current = Array.from({ length: 2 }, () => ({
      x: Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize,
      type: Math.random() > 0.5 ? "invincibility" : "speed",
    }));
  };

  const handleKeyDown = (e) => {
    if (gameOver || gameWon) return;
    const beluga = belugaRef.current;

    const movement = {
      w: () => (beluga.y = Math.max(beluga.y - gridSize, 0)),
      s: () => (beluga.y = Math.min(beluga.y + gridSize, canvasHeight - gridSize)),
      a: () => (beluga.x = Math.max(beluga.x - gridSize, 0)),
      d: () => (beluga.x = Math.min(beluga.x + gridSize, canvasWidth - gridSize)),
    };

    if (movement[e.key]) movement[e.key]();
    checkCollisions();
    checkPowerUpCollisions();
  };

  const handleHealthReduction = () => {
    if (!isInSafeZone(belugaRef.current) && !invincible) {
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) setGameOver(true);
        return newLives;
      });
    }
  };

  const isColliding = (a, b) =>
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;

  const checkCollisions = () => {
    const beluga = belugaRef.current;

    fishRef.current = fishRef.current.filter((fish) => {
      if (isColliding(beluga, { ...fish, width: gridSize, height: gridSize })) {
        setScore((prev) => prev + 10);
        return false;
      }
      return true;
    });

    trashRef.current = trashRef.current.filter((trash) => {
      if (isColliding(beluga, { ...trash, width: gridSize, height: gridSize })) {
        handleHealthReduction();
        return false;
      }
      return true;
    });

    threatsRef.current.forEach((threat) => {
      if (isColliding(beluga, threat)) {
        handleHealthReduction();
      }
    });

    if (fishRef.current.length === 0) {
      setGameWon(true);
    }
  };

  const checkPowerUpCollisions = () => {
    const beluga = belugaRef.current;

    powerUpsRef.current = powerUpsRef.current.filter((powerUp) => {
      if (isColliding(beluga, { ...powerUp, width: gridSize, height: gridSize })) {
        if (powerUp.type === "invincibility") {
          setInvincible(true);
          setTimeout(() => setInvincible(false), 5000);
        }
        return false;
      }
      return true;
    });
  };

  const isInSafeZone = (entity) =>
    safeZones.some((zone) =>
      isColliding(entity, zone)
    );

  const moveThreats = () => {
    threatsRef.current.forEach((threat) => {
      if (Math.random() < 0.01) {
        threat.direction = threat.direction === "horizontal" ? "vertical" : "horizontal";
      }

      if (threat.direction === "horizontal") {
        threat.x += threat.speed;
        if (threat.x <= 0 || threat.x >= canvasWidth - gridSize) threat.speed *= -1;
      } else {
        threat.y += threat.speed;
        if (threat.y <= 0 || threat.y >= canvasHeight - gridSize) threat.speed *= -1;
      }
    });
  };

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
    adjustDifficulty();
    generatePowerUps();
    setLives((prev) => prev + 1);
  };

  useEffect(() => {
    if (gameWon) {
      nextLevel();
      const fact = marineFacts[Math.floor(Math.random() * marineFacts.length)];
      setMarineFact(fact);
    }
  }, [gameWon]);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const bg = new Image(); bg.src = backgroundImage;
    const belugaImg = new Image(); belugaImg.src = belugaSprite;
    const fishImg = new Image(); fishImg.src = fishSprite;
    const trashImg = new Image(); trashImg.src = trashSprite;
    const boatImg = new Image(); boatImg.src = boatSprite;
    const heartImg = new Image(); heartImg.src = heartSprite;

    const render = () => {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(bg, 0, 0, canvasWidth, canvasHeight);

      ctx.drawImage(belugaImg, belugaRef.current.x, belugaRef.current.y, gridSize, gridSize);

      fishRef.current.forEach(f => ctx.drawImage(fishImg, f.x, f.y, gridSize, gridSize));
      trashRef.current.forEach(t => ctx.drawImage(trashImg, t.x, t.y, gridSize, gridSize));
      threatsRef.current.forEach(b => ctx.drawImage(boatImg, b.x, b.y, gridSize, gridSize));
      powerUpsRef.current.forEach(p => ctx.drawImage(heartImg, p.x, p.y, gridSize, gridSize));

      for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImg, canvasWidth - (i + 1) * 40, 10, 30, 30);
      }

      moveThreats();
      requestAnimationFrame(render);
    };

    render();

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver]);

  return (
    <div className="game-container">
      {!gameStarted ? (
        <button onClick={resetGame}>Start Game</button>
      ) : (
        <>
          <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
          <div className="hud">
            <p>Score: {score}</p>
            <p>Level: {level}</p>
            {marineFact && <p className="fact">{marineFact}</p>}
            {gameOver && <p className="game-over">Game Over</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default BelugaGame;