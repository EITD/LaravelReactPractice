import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Alert } from "@mui/material";

export default function DefaultLayout() {
    const [anchorEl, setAnchorEl] = useState(null)
    const [loading, setLoading] = useState(false)
    const { user, token, notification, setUser, setToken } = useStateContext()
    const open = Boolean(anchorEl);

    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data)
            })
    }, [])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onLogout = (ev) => {
        ev.preventDefault()
        setLoading(true)
        axiosClient.post('/logout')
            .then(() => {
                setUser({})
                setToken(null)
            })
    }

    if (!token) {
        return <Navigate to="/login" />
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ backgroundColor: "black" }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleClose}><Link to="/dashboard">Dashboard</Link></MenuItem>
                            <MenuItem onClick={handleClose}><Link to="/users">Users</Link></MenuItem>
                        </Menu>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {user.name}
                        </Typography>
                        <Button color="inherit" onClick={onLogout}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            {notification &&
                    <Alert severity="success">{notification}</Alert>}
            {loading && (<div className="text-center">Loading...</div>)}
            {!loading && <Outlet />}
        </div>
    )
}