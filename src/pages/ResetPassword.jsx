import { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`,
        { email }
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setMessage("A password reset link has been sent to your email.");
      }
    } catch {
      setError("Failed to send reset password link.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleResetPassword}>
        <div className="mb-3">
          <label className="form-label">Enter your email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-warning w-100">
          Reset Password
        </button>
      </form>
      <div className="mt-3 text-center">
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
};

export default ResetPassword;
