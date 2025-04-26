import "./WelcomePage.css";
import homePic from "../../images/homePic.svg";
import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <>
      <div className="homecolor">
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
          
          <img 
            src={homePic} 
            alt="Welcome" 
            width="200" 
            className="mb-4 welcome-image" 
          />

          <h1 className="light-gray-text welcome-title text-light">MCSEI</h1>
          <p className="light-gray-text welcome-description text-light">
            (Medical Card System for Emergency Information)
          </p>

          <ul className=" mt-3 text-start feature-list" style={{ listStyleType: "none" }}>
            <li><i className="fas fa-user me-2 text-info"></i>Manage and access citizen identity and contact information.</li>
            <li><i className="fas fa-heartbeat me-2 text-danger"></i>Review vital medical history and emergency conditions.</li>
            <li><i className="fas fa-x-ray me-2 text-light"></i>View radiology records and diagnostic imaging results.</li>
          </ul>

          <div className="d-flex gap-3 mt-4">

            <div>
              <p className="text-animation"> Already have an account?</p>
              <Link to="/login">
                <button className="btn btn-lg px-4 welcome-login-button">Log In</button>
              </Link>
            </div>

        
            <div className="divider"></div>

     
            <div>
              <p className="text-animation">Don't have an account?</p>
              <Link to="/signup">
                <button className="btn btn-lg px-4 welcome-signup-button">Sign Up</button>
              </Link>
            </div>
          </div>

          <footer className="welcome-footer">
            <small>© 2025 MCSEI - All rights reserved</small>
          </footer>
        </div>
      </div>
    </>
  );
}

export default WelcomePage;
