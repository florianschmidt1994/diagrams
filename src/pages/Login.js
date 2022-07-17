import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { getDatabase } from "firebase/database";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";

const database = getDatabase(app);
const auth = getAuth(app);

export function Login() {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (user) {
    navigate("/list");
  }

  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center">
      <h1 className="text-gray-100 text-xl font-bold">Welcome Back!</h1>
      <h2 className="text-gray-400 mb-10 mt-2 text-sm">
        Please sign into your account{" "}
        {location.state &&
          location.state.intent &&
          location.state.intent === "save" &&
          "to save your diagram"}
      </h2>
      <input
        onChange={(e) => setUsername(e.target.value)}
        className="bg-gray-700 block mb-2 p-4 rounded w-64 text-sm text-gray-100 placeholder-text-gray-400"
        type="text"
        placeholder="Email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        className="bg-gray-700 block p-4 rounded w-64 text-sm text-gray-100 placeholder-text-gray-400"
        type="password"
        placeholder="Password"
      />
      {error && error.code === "auth/wrong-password" && (
        <span className="text-red-600 text-xs w-64 pl-1 mt-2">
          Wrong password!
        </span>
      )}

      {error && error.code !== "auth/wrong-password" && (
        <span className="text-red-600 text-xs w-64 pl-1 mt-2">
          Failed to log in: {error.code}
        </span>
      )}
      <button
        className="p-2 bg-rose-500 mt-10 text-gray-100 font-bold text-sm rounded w-64"
        type="button"
        onClick={() => signInWithEmailAndPassword(username, password)}
      >
        Login
      </button>
      <span className="text-gray-100 mt-8 text-sm">
        Don't have an Account?{" "}
        <Link className="text-rose-500" to="/register">
          Sign Up
        </Link>
      </span>
    </div>
  );
}
