import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { HashRouter, Route, Routes } from "react-router-dom";
import { app } from "./firebase";
import { getAuth } from "firebase/auth";
import AllDiagrams from "./pages/AllDiagrams";
import EmbeddableDiagram from "./EmbeddableDiagram";
import CreateDiagram from "./pages/CreateDiagram";
import EditDiagram from "./pages/EditDiagram";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

const auth = getAuth(app);

// make editor better
// setup CI / CD
// list all your diagrams
// refactor code
// show error inline
// https://github.com/satya164/react-simple-code-editor
// pdf export
// embeddable view
// real-time collaboration, ...
// OT https://en.wikipedia.org/wiki/Operational_transformation
// CRDT https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
// https://auth0.com/blog/developing-a-real-time-collaborative-editor-with-pusher/
// https://www.tiny.cloud/blog/real-time-collaboration-ot-vs-crdt/#:~:text=OT%20trades%20complexity%20for%20the,even%20valid%20for%20your%20schema.
// import from websequencediagrams
// sidebar with tree view
// connect with git?
// examples
// tutorials
// SSO
// registration
// making it pretty
// embed in Confluence button
// show errors in place
// combine with GPT-3 auto drawer / vqgan-clip

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<CreateDiagram />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/list" element={<AllDiagrams />} />
        <Route path="/diagrams/:diagramId" element={<EditDiagram />} />
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
