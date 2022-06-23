import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import {auth} from './firebase';
import { signOut } from "firebase/auth";
import 'bulma/css/bulma.min.css';
import 'react-calendar/dist/Calendar.css';
import "./style/App.css";
import Button from "./components/Button";

export default function App() {
  const navigate = useNavigate();
  let location = useLocation();
  var loginState = parseInt(localStorage.getItem('loginState'));
  useEffect(() => {
    auth.onAuthStateChanged(user => {
        if(!user || !loginState) {
            navigate('/login');
        } else {
          if (location.pathname === "/tasks-management" || location.pathname === "/") {
            navigate('/dashboard');
          }
        }
    })
  })
  const logOut = () => {
    signOut(auth).then(() => {
      navigate('/login')
    })
  }
  return (
    <div className="app">
      <nav className="nav">
        <Link className={ location.pathname === "/dashboard" ? "nav-item is-active" : "nav-item"} to="/dashboard">
          <span>Home</span>
          <span className="material-symbols-outlined">home</span>
        </Link>
        <Link className={location.pathname === "/tasks" ? "nav-item is-active" : "nav-item"} to="/tasks">
          <span>Tasks</span>
          <span className="material-symbols-outlined">task</span>
        </Link>
        <Link className={location.pathname === "/profile" ? "nav-item is-active" : "nav-item"} to="/profile">
          <span>Profile</span>
          <span className="material-symbols-outlined">settings</span>
        </Link>
        <span className="indicator"></span>
      </nav>
      <Button value={""} icon={"logout"} className={"button is-primary logout"} onClick={() => {logOut()}}/>
      <Outlet />
    </div>
  );
}
