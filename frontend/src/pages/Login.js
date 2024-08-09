import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="login-box">
          <form className="login" onSubmit={handleSubmit}>
          <img src="/bflogo.jpg" alt="BioSales Logo" style={{ height: '100px' }} />
            <h3>Log In</h3>
            <label>Email address:</label>
            <input 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              placeholder="Email address" 
            />
            <label>Password:</label>
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
              placeholder="Password" 
            />
            <button disabled={isLoading}>Log in</button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
      <div className="right-section"></div>
    </div>
  );
};

export default Login;
