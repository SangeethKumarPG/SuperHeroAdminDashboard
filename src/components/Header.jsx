import { Box, Button } from "@mui/material";
import React, { useEffect } from "react";
import LoggInIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const checkUserCredentials = () => {
    if (sessionStorage.getItem("token")) {
      const token = JSON.parse(sessionStorage.getItem("token"));
      setIsLoggedIn(!!token);
    }
  };
  const handleLogout = () => {
    if (sessionStorage.getItem("token")) {
      sessionStorage.removeItem("token");
      setIsLoggedIn(false);
      toast.success("Logged out successfully");
      navigate("/");
    } else {
      navigate("/");
    }
  };
  useEffect(() => {
    checkUserCredentials();
  }, [isLoggedIn]);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "50px",
          padding: "10px",
          backgroundColor: "whitesmoke",
          color: "black",
          fontSize: "24px",
          fontWeight: "bold",
          width:'100%'
        }}
      >
        <h4>Admin Portal</h4>
        <Button
          variant="contained"
          color={isLoggedIn ? "error" : "success"}
          startIcon={isLoggedIn ? <LogoutIcon /> : <LoggInIcon />}
          onClick={handleLogout}
        >{isLoggedIn ? "Logout" : "Login"}</Button>
      </Box>
    </>
  );
}

export default Header;
