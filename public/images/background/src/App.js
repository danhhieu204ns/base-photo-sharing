import './App.css';
import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from './components/Register';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // console.log("User data loaded from localStorage:", parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar user={user} setUser={setUser} />
          </Grid> 
          <div className="main-topbar-buffer" />
          
          {!user ? (
            <Grid item xs={12}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route path="/register" element={<Register setUser={setUser}/>} />
                  <Route path="/login" element={<Login setUser={setUser} />} />
                </Routes>
              </Paper>
            </Grid>
          ) : (
            <>
              <Grid item sm={3}>
                <Paper className="main-grid-item">
                  <UserList />
                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="main-grid-item">
                  <Routes>
                    <Route path="/users/:userId" element={<UserDetail />} />
                    <Route path="/photos/:userId" element={<UserPhotos />} />
                    <Route path="/users" element={<></>} />
                    <Route path="*" element={<Navigate to="/users" replace />} />
                  </Routes>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </div>
    </Router>
  );
}

export default App;