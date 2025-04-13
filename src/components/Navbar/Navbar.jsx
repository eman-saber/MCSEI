import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faFileAlt } from "@fortawesome/free-solid-svg-icons"; 
import homePic from "../../images/homePic.svg";
import'./Navbar.css';
function Navbar() {
  const location = useLocation();
  const isStyledPage = ["/addnewcitizen", "/createmedical","/createradiology"].includes(location.pathname);

  return (
    <nav className={`navbar navbar-expand-lg ${isStyledPage ? "colored-navbar" : "bg-transparent"}`}>
      <div className="container-fluid d-flex justify-content-center"> 
        <Link className="navbar-brand fw-bold" to="/">
          <img src={homePic} alt="Logo" className="logo me-2" style={{ width: "50px", height: "auto", maxHeight: "40px" }}/>
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
              <Link className="nav-link active d-flex align-items-center" to="/dashboard">
                <FontAwesomeIcon icon={faChartBar} className="me-2" style={{ color: "blue" }} />
                Dashboard
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link className="nav-link active d-flex align-items-center" to="/dashboard">
                <FontAwesomeIcon icon={faFileAlt} className="me-2" style={{ color: "blue" }} />
                Records
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
