import { Link } from "react-router-dom";
import LogInPic from '../../images/logInpic.svg'
import { Container, Row, Col } from 'react-bootstrap';
import './LogIn.css';
import LogInForm from "./LogInForm";

function LogIn(){
    return(
        <>
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Row className="w-100 card-style" style={{ maxWidth: "900px", height:"600px", borderRadius: "15px", overflow: "hidden" }}>
                    <Col md={6} className="p-4 d-flex flex-column justify-content-center order-md-1">
                        <div className="text-center">
                            <img src={LogInPic} alt="Login" height="100" />
                            <h3 className="mt-3">Login</h3>
                        </div>
                        <LogInForm />
                        <div className="mt-3 text-center">
                            <p>
                                Don't have an account?{" "}
                                <Link to='/signUp' className="text-decoration-none">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </Col>

                    <Col md={6} className="bg-primary-lgn text-white p-1 order-md-2">
                        <h2 className='mt-5 text-center'>WELCOME BACK !</h2>
                        <p className="text-center mt-1">
                            Let's check in on your medical information.
                        </p>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default LogIn;


