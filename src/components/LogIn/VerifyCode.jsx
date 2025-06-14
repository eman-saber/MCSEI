import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import"./ForgetPassword.css";
function VerifyCode() {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch('https://medical-website-mocha.vercel.app/auth/valid-forget-password', {
                email,
                code,
            });
            console.log(response.data);
            setMessage("Code verified successfully!");
            navigate("/reset-password", { state: { email, code } });
        } catch (error) {
            console.error(error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Verification failed. Try again.");
        }
    };
    return (
        <div className="d-flex justify-content-center align-items-center forget-colr" style={{ minHeight: "100vh" }}>
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow text-bg-light" style={{ width: "400px" }}>
                <h4 className="mb-3 text-center">Verify Code</h4>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter verification code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Verify</button>
                {message && <p className="mt-3 text-center">{message}</p>}
            </form>
        </div>
    );
}
export default VerifyCode;
