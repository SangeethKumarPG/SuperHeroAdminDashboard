import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Complaints from "./Complaints";
import { Box } from "@mui/material";
import SideBar from "./SideBar";
import { toast } from "react-toastify";
import Header from "./Header";

function Home() {
  const [selectedView, setSelectedView] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      toast.error("Please login to access this page", {
        position: "top-center",
      });
      navigate("/");
    }
  }, []);

  const renderMainView = () => {
    switch (selectedView) {
      case 0:
        return <Dashboard />;
      case 1:
        return <Complaints />;
      default:
        return <div>Invalid View</div>;
    }
  };
  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      {isLoggedIn && (
        <Box display="flex" mt={2}>
          <Box
            sx={{
              width: isCollapsed ? "auto" : "25%",
              transition: "width 0.3s",
            }}
          >
            <SideBar
              setSelectedView={setSelectedView}
              setIsCollapsed={setIsCollapsed}
              isCollapsed={isCollapsed}
            />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            {renderMainView()}
          </Box>
        </Box>
      )}
    </>
  );
}

export default Home;
