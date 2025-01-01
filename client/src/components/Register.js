import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    password2: "",
  });

  const { email, password, name, password2 } = inputs;
  const navigate = useNavigate();

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const body = { email, password, name };
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        
        navigate("/dashboard");
      } else {
        alert(parseRes.message || "Registration failed");
        setAuth(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center my-5">Register</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-control my-3"
          value={name}
          onChange={(e) => onChange(e)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control my-3"
          value={email}
          onChange={(e) => onChange(e)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control my-3"
          value={password}
          onChange={(e) => onChange(e)}
          required
        />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          className="form-control my-3"
          value={password2}
          onChange={(e) => onChange(e)}
          required
        />
        <button className="btn btn-success btn-block" type="submit">
          Register
        </button>
      </form>
      <Link to="/login">Login</Link>
    </Fragment>
  );
};

export default Register;
