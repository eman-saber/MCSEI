import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faSignOutAlt, faUserShield, faHome, faKey, faCog } from "@fortawesome/free-solid-svg-icons";
import homePic from "../../images/homePic.svg";
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isStyledPage = ["/addnewcitizen", "/createmedical", "/createradiology", "/admindashboard", "/updatepassword"].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isStyledPage ? "colored-navbar" : "bg-transparent"}`}>
      <div className="container-fluid d-flex justify-content-between">
        <Link className="navbar-brand fw-bold" to="/MCSEI">
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
            <li className="nav-item mx-3">
              <Link className="nav-link d-flex align-items-center" to="/MCSEI">
                <FontAwesomeIcon icon={faHome} className="me-2" style={{ color: "blue" }} />
                Home
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link className="nav-link active d-flex align-items-center" to="/dashboard">
                <FontAwesomeIcon icon={faFileAlt} className="me-2" style={{ color: "blue" }} />
                Dashboard
              </Link>
            </li>
          </ul>
          {/* Settings Dropdown */}
          <div className="dropdown ms-auto">
            <button
              className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center"
              type="button"
              id="settingsDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ fontSize: "0.85rem" }}>
              <FontAwesomeIcon icon={faCog} className="me-2" />
              Settings
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="settingsDropdown">
              <li>
                <Link className="dropdown-item d-flex align-items-center" to="/admindashboard">
                  <FontAwesomeIcon icon={faUserShield} className="me-2" style={{ color: "black" }} />
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link className="dropdown-item d-flex align-items-center" to="/updatepassword">
                  <FontAwesomeIcon icon={faKey} className="me-2" style={{ color: "orange" }} />
                  Update Password
                </Link>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" style={{ color: "blue" }} />
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
