import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faSignOutAlt, faUserShield, faHome } from "@fortawesome/free-solid-svg-icons"; 
import homePic from "../../images/homePic.svg";
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isStyledPage = ["/addnewcitizen", "/createmedical", "/createradiology", "/admindashboard"].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isStyledPage ? "colored-navbar" : "bg-transparent"}`}>
      <div className="container-fluid d-flex justify-content-between"> 
        <Link className="navbar-brand fw-bold" to="/">
          <img src={homePic} alt="Logo" className="logo me-2" style={{ width: "50px", height: "auto", maxHeight: "40px" }} />
          MCSEI
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-center w-100">  
          {/* Home Link */}
          <li className="nav-item mx-3">
              <Link className="nav-link d-flex align-items-center" to="/">
                <FontAwesomeIcon icon={faHome} className="me-2" style={{ color: "blue" }} />
                Home
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link className="nav-link active d-flex align-items-center" to="/dashboard">
                <FontAwesomeIcon icon={faFileAlt} className="me-2" style={{ color: "blue" }} />
                Records
              </Link>
            </li>
            
          </ul>

          {/* Admin Dashboard and Log Out Buttons */}
          <div className="ms-auto d-flex flex-column align-items-end gap-2">
            {/* Admin Dashboard Button */}
            <Link to={"/admindashboard"}
              className="btn btn-sm btn-outline-secondary d-flex align-items-center px-2 py-1"
              onClick={() => navigate("/dashboard")}
              style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}
            >
              <FontAwesomeIcon
                icon={faUserShield}
                className="me-1"
                style={{ fontSize: "1rem", color: "black" }}
              />
              Admin Dashboard
            </Link>

            {/* Log Out Button */}
            <button
              className="btn btn-sm btn-outline-primary d-flex align-items-center px-2 py-1"
              onClick={handleLogout}
              style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="me-1"
                style={{ fontSize: "1rem", color: "blue" }}
              />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
