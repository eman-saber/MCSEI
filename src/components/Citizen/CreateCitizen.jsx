import { FaUser, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import './CreateCitizen.css';

function CreateCitizen() {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [blood, setBlood] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const formSubmit = (e) => {
        e.preventDefault();
        const TOKEN = localStorage.getItem("userToken");
        console.log("TOKEN USED:", TOKEN); 
        if (!TOKEN) {
            Swal.fire({
                title: "Unauthorized",
                text: "",
                icon: "warning",
                confirmButtonColor: "#d33",
            });
            return;
        }
        fetch("https://mcsei-production.up.railway.app/citizens/create-citizen", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}`,
            },
            body: JSON.stringify({
                national_ID: id,
                full_name: name,
                address: address,
                blood_type: blood,
                birth_date: new Date(birthdate).toISOString().split("T")[0],
                mobileNumber: mobileNumber,
            }),
        })
        .then((response) => response.json())
        .then((result) => {
            console.log("Response after creation:", result);
            if (result.error && result.error.toLowerCase().includes("already exists")) {
                Swal.fire({
                    title: "Error!",
                    text: "⚠️ Citizen with this National ID already exists.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                });
            } else if (result.message?.toLowerCase().includes("success")) {
                Swal.fire({
                    title: "Success!",
                    text: result.message,
                    icon: "success",
                    confirmButtonColor: "#28a745",
                });
                setId("");
                setName("");
                setAddress("");
                setBlood("");
                setBirthdate("");
                setMobileNumber("");
            } else {
                Swal.fire({
                    title: "Error!",
                    text: result.message || "⚠️ Failed to create citizen.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                });
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
                title: "Error!",
                text: `⚠️ An error occurred: ${error.message}`,
                icon: "error",
                confirmButtonColor: "#d33",
            });
        });
    };
    return (
        <div className="out-form">
            <div className="container p-4 bg-light rounded shadow-lg" style={{ border: "1px solid blue", borderRadius: "10px" }}>
                <h2 className="text-center fw-bold text-primary">Add New Citizen</h2>
                <form className="row g-3" onSubmit={formSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="nationalID" className="form-label fw-semibold">National ID</label>
                        <input type="text" className="form-control" id="nationalID" required value={id} onChange={(e) => setId(e.target.value)} />
                    </div>
                    <div className="">
                        <label htmlFor="fullName" className="form-label fw-semibold">Full Name</label>
                        <div className="input-group">
                            <input type="text" className="form-control" id="fullName" required value={name} onChange={(e) => setName(e.target.value)} />
                            <span className="input-group-text bg-white"> <FaUser className="text-primary" /></span>
                        </div>
                    </div>
                    <div className="">
                        <label htmlFor="dateOfBirth" className="form-label fw-semibold">Birthdate</label>
                        <div className="input-group">
                            <input type="date" className="form-control" id="dateOfBirth" required value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                            <span className="input-group-text bg-white"> <FaCalendarAlt className="text-primary" /> </span>
                        </div>
                    </div>
                    <div className="">
                        <label htmlFor="address" className="form-label fw-semibold">Address</label>
                        <input type="text" className="form-control" id="address" required value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div className="">
                        <label htmlFor="bloodType" className="form-label fw-semibold">Blood Type</label>
                        <input type="text" className="form-control" id="bloodType" required value={blood} onChange={(e) => setBlood(e.target.value)} />
                    </div>
                    <div className="">
                        <label htmlFor="mobileNumber" className="form-label fw-semibold">Mobile Number</label>
                        <input type="tel" className="form-control" id="mobileNumber" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <button type="submit" className="btn btn-primary shadow-sm px-4">Add</button>
                        <Link to={'/dashboard'} className="btn btn-secondary shadow-sm px-4">Back</Link>
                    </div>
                </form>
            </div>
        </div>
    );
} export default CreateCitizen;
