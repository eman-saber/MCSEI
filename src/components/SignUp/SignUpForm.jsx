import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Formik, Field, Form as FormikForm } from "formik";
import Swal from "sweetalert2";

function SignUpForm() {
    const navigate = useNavigate();
    const handleSignUp = async (values) => {
        try {
            const response = await fetch("https://medical-website-three-delta.vercel.app/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    
                    userName: values.userName,
                    email: values.email,
                    password: values.password,
                    confirmationPassword: values.confirmationPassword,
                }),
            });
            const responseData = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Account created successfully!',
                    text: 'Please check your email to confirm your account.',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    navigate("/confirm-email", {
                        state: { email: values.email }
                    });
                });
            } else {
                if (responseData.details && responseData.details.length > 0) {
                    responseData.details.forEach((errorDetail) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: errorDetail.message,
                            confirmButtonColor: '#d33'
                        });
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: responseData.message || "Failed to create account. Please try again.",
                        confirmButtonColor: '#d33'
                    });
                }
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: 'Please try again later.',
                confirmButtonColor: '#d33'
            });
        }
    };

    return (
        <Formik
            initialValues={{
                
                userName: "",
                email: "",
                password: "",
                confirmationPassword: "",
            }}
            validate={(values) => {
                const errors = {};
                console.log(values);
                if (!values.userName) errors.userName = "Full Name is required";
                if (!values.email) errors.email = "Email is required";
                if (!values.password) errors.password = "Password is required";
                if (!values.confirmationPassword) errors.confirmationPassword = "Confirmation Password is required";
                if (values.password !== values.confirmationPassword) {
                    errors.confirmationPassword = "Passwords must match";
                }
                return errors;
            }}
            onSubmit={handleSignUp}
        >
            {({ values, handleChange, handleBlur, errors, touched }) => (
                <FormikForm>
                  

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                            Full Name
                        </Form.Label>
                        <Field
                            type="text"
                            name="userName"
                            placeholder="Enter your full name"
                            className={`form-control ${errors.userName && touched.userName ? "is-invalid" : ""}`}
                        />
                        {errors.userName && touched.userName && (
                            <div className="invalid-feedback">{errors.userName}</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary" />
                            Email
                        </Form.Label>
                        <Field
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className={`form-control ${errors.email && touched.email ? "is-invalid" : ""}`}
                        />
                        {errors.email && touched.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <FontAwesomeIcon icon={faLock} className="me-2 text-primary" />
                            Password
                        </Form.Label>
                        <Field
                            type="password"
                            name="password"
                            placeholder="Enter a password"
                            className={`form-control ${errors.password && touched.password ? "is-invalid" : ""}`}
                        />
                        {errors.password && touched.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <FontAwesomeIcon icon={faLock} className="me-2 text-primary" />
                            Confirm Password
                        </Form.Label>
                        <Field
                            type="password"
                            name="confirmationPassword"
                            placeholder="Re-enter your password"
                            className={`form-control ${errors.confirmationPassword && touched.confirmationPassword ? "is-invalid" : ""}`}
                        />
                        {errors.confirmationPassword && touched.confirmationPassword && (
                            <div className="invalid-feedback">{errors.confirmationPassword}</div>
                        )}
                    </Form.Group>

                    <Button type="submit" className="w-100">Sign Up</Button>
                </FormikForm>
            )}
        </Formik>
    );
}
export default SignUpForm;
