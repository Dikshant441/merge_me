import React from "react";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASEURL } from "../utils/constants";

const LogIn = () => {
  const [email, setEmail] = useState("trump@gmail.com");
  const [password, setPassword] = useState("Trump123@");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASEURL + "/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res.data));
      return navigate("/feed");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-base-200">
      <div className="w-full max-w-sm mx-4">
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-2xl border p-6 shadow-lg">
          <legend className="fieldset-legend text-xl font-semibold">
            Login
          </legend>

          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="label mt-2">
            <span className="label-text font-medium">Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-neutral w-full mt-5" onClick={handleLogin}>
            Login
          </button>

          <div className="mt-3 text-center text-sm text-base-content/70">
            Don’t have an account?{" "}
            <a href="#" className="link link-primary">
              Sign up
            </a>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default LogIn;
