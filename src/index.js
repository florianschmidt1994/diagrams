import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {HashRouter, Route, Routes} from "react-router-dom";
import {useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";
import {app} from "./firebase";
import {getAuth} from "firebase/auth"
import List from "./List";


const auth = getAuth(app);

function Login() {

    const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return <div className="w-screen h-screen bg-slate-900 flex items-center justify-center">
        <div className="p-8 bg-slate-700 rounded flex flex-col items-center shadow-white">
            <span className="mb-4 text-slate-200">{username} - {password}</span>
            <span
                className="mb-4 text-slate-200">{JSON.stringify(user)} - {JSON.stringify(loading)} - {JSON.stringify(error)}</span>
            <span className="mb-4 text-slate-200 font-bold">Login</span>
            <input onChange={e => setUsername(e.target.value)} className="bg-slate-500 block mb-2 p-2 rounded"
                   type="text" placeholder="username"/>
            <input onChange={e => setPassword(e.target.value)} className="bg-slate-500 block p-2 rounded" type="text"
                   placeholder="password"/>
            <button className="p-2 bg-white mt-2 rounded" type="button"
                    onClick={() => signInWithEmailAndPassword(username, password)}>
                Login
            </button>
        </div>
    </div>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/list" element={<List/>}/>
                <Route path="/diagrams/:diagramName" element={<App/>}/>
            </Routes>
        </HashRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
