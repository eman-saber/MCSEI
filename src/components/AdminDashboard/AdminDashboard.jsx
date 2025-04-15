import { useState} from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");

  // Admin and SuperAdmin Check

  // useEffect(() => {
  //   const role = localStorage.getItem("userRole");
  //   if (role !== "Admin" && role !== "SuperAdmin") {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Permission Denied",
  //       text: "You don’t have permission to access this page.",
  //     });
  //     navigate("/dashboard"); 
  //   }
  // }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const TOKEN = localStorage.getItem("userToken");

      const response = await axios.patch(
        "https://medical-website-production-1dc4.up.railway.app/user/dashboard/role",
        { email, role },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "✅ Role Updated",
        text: response.data.message || "User role updated successfully.",
        showCancelButton: true,
        confirmButtonText: "Back",
        cancelButtonText: "Stay Here",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/dashboard");
        }
      });

      setEmail("");
      setRole("User");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "❌ Error",
        text: error.response?.data?.message || "Failed to update role.",
      });
    }
  };

  return (
    <div className="out-form">
      <div className="container mt-0 p-4 bg-light rounded shadow">
        <h2 className="text-center text-primary mb-4 fw-bold">Change User Role</h2>
        <form onSubmit={handleSubmit} className="row g-3">

          <div className="col-12">
            <label htmlFor="email" className="form-label fw-semibold">
              User Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="role" className="form-label fw-semibold">
              Select Role
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="User">User</option>
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
              
            </select>
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary px-4">
              Update Role
            </button>
          </div>
        </form>

        <div className="d-flex justify-content-end gap-3 mt-4">
          <button
            className="btn btn-secondary shadow-sm px-4"
            onClick={() => navigate("/dashboard")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
