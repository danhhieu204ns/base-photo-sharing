import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import PhotoUploadModal from "../PhotoUpload";

function TopBar({ user, setUser }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [contextInfo, setContextInfo] = useState("");
    const [openUploadModal, setOpenUploadModal] = useState(false);
    
    useEffect(() => {
        const path = location.pathname;
        const parts = path.split('/');
        
        let newContextInfo = "";
        
        if (parts.length >= 3 && (parts[1] === 'users' || parts[1] === 'photos')) {
            if (user) {
                if (parts[1] === 'photos') {
                    newContextInfo = `Photos of ${user.first_name} ${user.last_name}`;
                } else {
                    newContextInfo = `${user.first_name} ${user.last_name}`;
                }
            }
        }
        
        setContextInfo(newContextInfo);
    }, [location.pathname, user]);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('user');
            setUser(null);
            // navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleOpenUploadModal = () => {
        setOpenUploadModal(true);
    };

    const handleCloseUploadModal = () => {
        setOpenUploadModal(false);
    };

    return (
        <AppBar className="topbar-appBar" position="absolute">
            <Toolbar>
                <Typography variant="h5" color="inherit" className="topbar-title">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Button color="inherit" sx={{ ml: 2 }}>
                            Mai Danh Hieu
                        </Button>
                    </Link>
                </Typography>

                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            Hi {user.first_name}
                        </Typography>
                        <Button 
                            color="inherit" 
                            onClick={handleOpenUploadModal}
                            sx={{ mr: 2 }}
                        >
                            Add Photo
                        </Button>
                        <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Link>
                    </Box>
                ) : (
                    <>
                        <Typography variant="body1">
                                Please Login
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Button color="inherit" sx={{ ml: 2 }}>
                                    Login
                                </Button>
                            </Link>
                            <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Button color="inherit" sx={{ ml: 2 }}>
                                    Register
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
                
                {/* {contextInfo && (
                    <Typography variant="h6" color="inherit" className="topbar-context">
                        {contextInfo}
                    </Typography>
                )} */}
            </Toolbar>
            <PhotoUploadModal 
                open={openUploadModal} 
                onClose={handleCloseUploadModal} 
                userId={user?._id} 
            />
        </AppBar>
    );
}

export default TopBar;
