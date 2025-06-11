import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./ForgetPassword.css";
function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;
    const code = location.state?.code;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.patch('https://medical-website-mocha.vercel.app/auth/reset-password', {
                email,
                code,
                password,
                confirmationPassword: confirmPassword, 
            });

            console.log(response.data);
            setMessage("Password reset successfully!");

            setTimeout(() => {
                navigate("/login"); 
            }, 2000);

        } catch (error) {
            console.error(error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Failed to reset password. Try again.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center forget-colr" style={{ minHeight: "100vh" }}>
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow text-bg-light" style={{ width: "500px" }}>
                <h4 className="mb-3 text-center">Reset Password</h4>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                {message && <p className="mt-3 text-center">{message}</p>}
            </form>
        </div>
    );
}

export default ResetPassword;
