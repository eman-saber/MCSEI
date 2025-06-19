import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";

function LogInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("https://mcsei-production.up.railway.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (response.ok) {
        const TOKEN = responseData.data.token;
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userToken", TOKEN);
        navigate("/dashboard");
      } else {
        const message = responseData.message?.toLowerCase();
        if (message?.includes("invalid account")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(responseData.message || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <Form onSubmit={handleLogIn}>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form.Group controlId="formEmail" className="direction-L">
        <Form.Label>
          <FontAwesomeIcon icon={faEnvelope} className="me-2" style={{ color: "#74C0FC" }} />
          Email Address
        </Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formPassword" className="mt-3 direction-L">
        <Form.Label>
          <FontAwesomeIcon icon={faLock} className="me-2" style={{ color: "#74C0FC" }} />
          Password
        </Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <p className="mt-2">
        <Link to="/forget-password" className="text-decoration-none">
          Forget Password?
        </Link>
      </p>
      <div className="mt-3">
        <Button className="w-100" variant="primary" type="submit">
          Login
        </Button>
      </div>
    </Form>
  );
}

export default LogInForm;
