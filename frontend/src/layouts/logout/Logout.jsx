import React from "react";
import { Link } from "react-router-dom";
import "./logout.css"; // Import the CSS file

const Logout = () => {
    return (
        <div className="logout-container">
            <div className="logout-box">
                <span className="logout-icon">🔓</span>
                <h1>You have successfully logged out!</h1>
                <p>Thank you for using our Employee Management System. We hope to see you again soon.</p>
                <Link to="/" className="logout-button">Go to LoginPage</Link>
            </div>

            <footer className="logout-footer">
                <p>&copy; 2025 Employee Management System | All Rights Reserved</p>
                <nav>
                    <Link to="/" className="footer-link">Home</Link> |
                    <Link to="/" className="footer-link">Contact Us</Link> |
                    <Link to="/" className="footer-link">About</Link>
                </nav>
            </footer>
        </div>
    );
};

export default Logout;
