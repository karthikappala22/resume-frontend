import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      // ✅ Store JWT
      localStorage.setItem("token", res.data.token);

      // ✅ Go to home
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        {error && <p className="login-error">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>

        {/* ✅ REGISTER LINK ADDED */}
        <p style={{ marginTop: 12 }}>
          New user?{" "}
          <Link to="/register" style={{ color: "#0066cc" }}>
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
