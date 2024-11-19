import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import ViewListIcon from '@mui/icons-material/ViewList';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
function SideBar({ setSelectedView, setIsCollapsed, isCollapsed }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (e, index) => {
    setSelectedIndex(index);
    setSelectedView(index);
  };

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev); 
    setTimeout(()=>{
      // setIsCollapsed((prev) => !prev);
      setIsCollapsed(true);
    }, 3000);
  };

  return (
    <Box sx={{ width: isCollapsed ? "60px" : "240px", bgcolor: "background.paper", transition: 'width 0.3s', margin:'40px 0px' }}>
      <IconButton onClick={handleToggleSidebar} sx={{ margin: '0px',
        display:{xs:'none', sm:'block'}
       }}>
        {isCollapsed ? <ChevronRightRoundedIcon /> : <ChevronLeftRoundedIcon />}
      </IconButton>
      <Divider />
      <List component="nav" aria-label="user service options">
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(e) => handleListItemClick(e, 0)}
        >
          <ListItemIcon>
            <HomeIcon/>
          </ListItemIcon>
          {!isCollapsed && <ListItemText primary="Home" />}
        </ListItemButton>

        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(e) => handleListItemClick(e, 1)}
        >
          <ListItemIcon>
            <ViewListIcon/>
          </ListItemIcon>
          {!isCollapsed && <ListItemText primary="All Complaints" />}
        </ListItemButton>

       </List>
    </Box>
  );
}

export default SideBar;
