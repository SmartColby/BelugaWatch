import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      console.log("✅ Login Response:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username); // Store username
      onLogin(response.data.username);
      setMessage("Login successful!");
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "Failed to log in");
    }
  };

  return (
    <div className="auth-page">
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;