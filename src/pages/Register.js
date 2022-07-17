import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase } from "firebase/database";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";

const database = getDatabase(app);
const auth = getAuth(app);

export function Register() {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (user) {
    navigate("/");
  }

  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center">
      <h1 className="text-gray-100 text-xl font-bold">Welcome!</h1>
      <h2 className="text-gray-400 mb-10 mt-2 text-sm">
        Please fill in your details to continue
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
        placeholder="New Password"
      />
      {error && error.code === "auth/email-already-in-use" && (
        <span className="text-red-600 text-xs w-64 pl-1 mt-2">
          This email address is already in use
        </span>
      )}

      {error && error.code !== "auth/email-already-in-use" && (
        <span className="text-red-600 text-xs w-64 pl-1 mt-2">
          Failed to log in: {error.code}
        </span>
      )}
      <button
        className="p-2 bg-rose-500 mt-10 text-gray-100 font-bold text-sm rounded w-64"
        type="button"
        onClick={() => createUserWithEmailAndPassword(username, password)}
      >
        Register
      </button>
      <span className="text-gray-100 mt-8 text-sm">
        Already have an account?{" "}
        <Link className="text-rose-500" to="/register">
          Sign In
        </Link>
      </span>
    </div>
  );
}
