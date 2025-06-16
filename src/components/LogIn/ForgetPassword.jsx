import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "https://medical-website-three-delta.vercel.app/auth/forget-password",
        { email }
      );
      console.log(response.data);
      setMessage("Check your email for the code.");
      navigate("/verify-code", { state: { email } });
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Try again.");
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center forget-colr" style={{ minHeight: "100vh" }}>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-lg text-bg-light" style={{ width: "500px" }}>
        <h4 className="mb-3 text-center">Forget Password</h4>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Send Code</button>
        {message && <p className="mt-3 text-center">{message}</p>}
      </form>
    </div>
  );
}
export default ForgetPassword;
