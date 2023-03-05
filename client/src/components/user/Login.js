import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
const Login = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      name,
      email,
      password,
    };
    try {
      const res = await axios.post("/api/user/login", user);

      localStorage.setItem("userInfo", JSON.stringify(res.data));
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      history.push("/");
    }
  }, [history]);
  return (
    <div className="container">
      <form
        onSubmit={handleSubmit}
        className="form card"
        style={{ width: "500px", margin: "10rem auto", padding: "2rem" }}
      >
        <div class="form__group">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div class="form__group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          don`t have any account...?<Link to="/register">Sign Un</Link>
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
