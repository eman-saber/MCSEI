import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; 

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.patch(
        "https://medical-website-production-1dc4.up.railway.app/auth/update-password",
        {
          oldPassword,
          password,
          confirmationPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "Password updated successfully!",
        text: "You will now be redirected to login.",
      }).then(() => {
        
        window.location.href = "/login"; 
      });
    } catch (error) {
      console.error(error);
      alert("Error updating password. Check console.");
    }
  };

  return (
    <div className="out-form">
      <div className="container my-5 d-flex justify-content-center ">
        <div
          className="card shadow p-4"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <h2 className="mb-4 text-center">Update Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Old Password</label>
              <input
                type="password"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmationPassword}
                onChange={(e) => setConfirmationPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;
