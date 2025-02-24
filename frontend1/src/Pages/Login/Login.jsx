import React, { useState } from "react";
import "./login.css";
import axios from "axios"; // To make API requests
import Swal from "sweetalert2"; // Import SweetAlert2

const Login = () => {
  const [isActive, setIsActive] = useState(false);

  // State for input fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Handlers for switching forms
  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: loginEmail,
      password: loginPassword,
    };

    try {
      const response = await axios.post(
        "https://api.cakecrazzy.com/api/user/login",
        loginData
      ); // Make API call to login route
      if (response.status === 200) {
        sessionStorage.setItem("login", true);
        sessionStorage.setItem("token", response.data.data.token);
        sessionStorage.setItem("userId", response.data.data._id);
        Swal.fire({
          title: "Login Successful!",
          text: "Welcome back!",
          icon: "success",
          confirmButtonText: "Okay",
        });
        window.location.href = "/";
      }
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );

      // Show error message using SweetAlert2
      Swal.fire({
        title: "Login Failed!",
        text: error.response?.data || "An error occurred during login.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  // Handle registration form submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const registerData = {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
    };

    try {
      const response = await axios.post(
        "https://api.cakecrazzy.com/api/user",
        registerData
      );
      //console.log(response);
      // Show success message using SweetAlert2
      Swal.fire({
        title: "Registration Successful!",
        text: "You can now log in.",
        icon: "success",
        confirmButtonText: "Okay",
      });
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );

      // Show error message using SweetAlert2
      Swal.fire({
        title: "Registration Failed!",
        text:
          error.response?.data?.message ||
          "An error occurred during registration.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className={`Login_container ${isActive ? "active" : ""}`}>
        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <i className="bx bxs-user" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <i className="bx bxs-lock-alt" />
            </div>
            {/* <div className="forgot-link">
              <a href="#">Forgot Password?</a>
            </div> */}
            <button type="submit" className="btnLogin">
              Login
            </button>
            <p>or login with social platforms</p>
            {/* <div className="social-icon">
              <a href="#">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#">
                <i className="bi bi-github"></i>
              </a>
              <a href="#">
                <i className="bi bi-whatsapp"></i>
              </a>
              <a href="#">
                <i className="bi bi-linkedin"></i>
              </a>
            </div> */}
          </form>
        </div>

        {/* Registration Form */}
        <div className="form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Registration</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
              <i className="bx bxs-user" />
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <i className="bx bxs-envelope" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <i className="bx bxs-lock-alt" />
            </div>
            <button type="submit" className="btnLogin">
              Register
            </button>
            {/* <p>or register with social platforms</p>
            <div className="social-icon">
              <a href="#">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#">
                <i className="bi bi-github"></i>
              </a>
              <a href="#">
                <i className="bi bi-whatsapp"></i>
              </a>
              <a href="#">
                <i className="bi bi-linkedin"></i>
              </a>
            </div> */}
          </form>
        </div>

        {/* Toggle Panels */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className="btn register-btn" onClick={handleRegisterClick}>
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="btn login-btn" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
