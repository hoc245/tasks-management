import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Dashboard from "./routes/Dashboard";
import Tasks from "./routes/Tasks";
import Profile from "./routes/Profile";
import Login from "./routes/Login";
import React from "react";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<App />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks-management" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />}>
            <Route path="*" element={<Tasks />}/>
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route
          path="*"
          element={
              <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
              </main>
          }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);