import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate()

  const [credentials, setCredentials] = useState({email:"", password:""})

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid response from server");
      }

      const json = await response.json();
      console.log(json);

      if (json.success) {
        // Save auth token and redirect
        localStorage.setItem("token", json.authToken);
        navigate("/");
        props.showAlert("Logged In Successfully", "success");
      } else {
        props.showAlert("Invalid Credentials", "danger");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      props.showAlert("Login failed. Please try again.", "danger");
    }
  };
  const onChange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value})
  }
  return (
    <div className="container mx-5 my-5">
      <form onSubmit={handleSubmit} >
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={onChange}
            value={credentials.email}
          
        
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
          name="password"
            type="password"
            onChange={onChange}
            value={credentials.password}
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
