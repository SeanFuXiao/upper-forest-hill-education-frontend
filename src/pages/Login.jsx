import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //Login
  //Login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        { email, password }
      );
      if (response.data.token) {
        localStorage.setItem("access", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else {
        setError("Invalid login credentials.");
      }
    } catch {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center mt-5"
      style={{ flex: 1 }}
    >
      <h2 className="mb-4">Login</h2>
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <form
        onSubmit={handleLogin}
        className="w-100"
        style={{ maxWidth: "400px" }}
      >
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-3">
          Login
        </button>
      </form>

      <div className="text-center mb-3">
        <Link to="/reset-password">Forgot Password?</Link>
      </div>
      <div className="text-center">
        <span>Don&apos;t have an account? </span>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
