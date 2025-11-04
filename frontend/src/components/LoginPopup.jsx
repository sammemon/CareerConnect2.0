import React from "react";
import "./loginpopup.css";

const LoginPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2>Login Required</h2>
        <p>You need to log in to use the CareerConnect AI Assistant.</p>
        <a href="/login" className="login-btn">
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default LoginPopup;
