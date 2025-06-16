import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ConfirmPic from '../../images/confirmEmailPic.jpeg';
import '../LogIn/LogIn.css';

const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const navigate = useNavigate();
  const handleConfirm = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      code: confirmationCode,
    };

    try {
      const response = await fetch("https://medical-website-five-xi.vercel.app/auth/confirm-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Confirmation Failed",
          text: data.message || "Failed to confirm email. Please check the code and try again.",
          confirmButtonColor: "#d33"
        });
        return;
      }
      Swal.fire({
        icon: "success",
        title: "Email Confirmed",
        text: "✅ Your email has been confirmed successfully!",
        confirmButtonColor: "#3085d6"
      }).then(() => navigate("/login"));

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#d33"
      });
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100 card-style" style={{ maxWidth: "900px", height: "600px", borderRadius: "15px", overflow: "hidden" }}>
        
        
        <Col md={6} className="bg-primary-lgn text-white p-3 order-1 order-md-2 d-flex flex-column justify-content-start">
          <div className="text-center px-2 mt-4">
            <h2 className='mb-3'>Verify Your Email</h2>
            <p>
              Please check your email inbox <br />
              for the confirmation code<br />
              and enter it to activate your account.
            </p>
          </div>
        </Col>

       
        <Col md={6} className="p-4 d-flex flex-column justify-content-center order-2 order-md-1">
          <div className="text-center">
            <img src={ConfirmPic} alt="Confirm Email" height="80" />
            <h3 className="mt-3">Confirm Email</h3>
          </div>

          <Form onSubmit={handleConfirm}>
            <Form.Group controlId="formEmail" className="direction-L">
              <Form.Label>
                <FontAwesomeIcon icon={faEnvelope} className="me-2" style={{ color: "#74C0FC" }} />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCode" className="mt-3 direction-L">
              <Form.Label>
                <FontAwesomeIcon icon={faKey} className="me-2" style={{ color: "#74C0FC" }} />
                Confirmation Code
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
            </Form.Group>

            <div className="mt-3">
              <Button className="w-100" variant="primary" type="submit">
                Confirm Email
              </Button>
            </div>
          </Form>
        </Col>

      </Row>
    </Container>
  );
};

export default ConfirmEmail;
