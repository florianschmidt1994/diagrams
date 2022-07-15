import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { app } from "./firebase";
import { getAuth } from "firebase/auth";
import List from "./List";
import EmbeddableDiagram from "./EmbeddableDiagram";

const auth = getAuth(app);

function Login() {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center">
      <h1 className="text-gray-100 text-xl font-bold">Welcome Back!</h1>
      <h2 className="text-gray-400 mb-10 mt-2 text-sm">
        Please sign into your account
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

function Register() {
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
        Please fill in the form to continue
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/list" element={<List />} />
        <Route path="/diagrams/:diagramName" element={<App />} />
        <Route
          path="/diagrams/:diagramName/embed"
          element={<EmbeddableDiagram />}
        />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
