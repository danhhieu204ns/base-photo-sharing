import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  ListItemAvatar,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";
import api from "../../lib/useApi";


function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/list");
        // console.log("Fetched users:", response);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.response?.data?.message || "Failed to fetch users");
        setLoading(false);
      }
    };

    useEffect(() => {
      setLoading(true);
      fetchUsers();

    }, []);
    
    if (loading) {
      return (
        <div className="user-list-container">
          <Typography variant="h5" component="h1" className="user-list-title">
            Users
          </Typography>
          <div className="loading-container">
            <CircularProgress />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="user-list-container">
          <Typography variant="h5" component="h1" className="user-list-title">
            Users
          </Typography>
          <Typography color="error">{error}</Typography>
        </div>
      );
    }
    
    return (
      <div className="user-list-container">
        <Typography variant="h5" component="h1" className="user-list-title">
          Users
        </Typography>
        <List component="nav" className="user-list">
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem 
                button 
                component={Link} 
                to={`/users/${user._id}`}
                className="user-list-item"
              >
                <ListItemAvatar>
                  <Avatar/>
                </ListItemAvatar>
                <ListItemText 
                  primary={`${user.first_name || user.first || ''} ${user.last_name || ''}`}
                  className="user-list-item-text"
                />
              </ListItem>
              <Divider variant="inset" component="li" className="user-list-divider" />
            </React.Fragment>
          ))}
        </List>
      </div>
    );
}

export default UserList;
