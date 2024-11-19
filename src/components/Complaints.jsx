import { Box, IconButton, TextField } from "@mui/material";
import React from "react";
import { Button } from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

function Complaints() {
  return (
    <>
      <h3 className="mt-5">All Complaints</h3>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        className="mt-2 p-2"
      >
        <TextField
          label="Search by category, danger level, description or date"
          variant="outlined"
          fullWidth
        />
        <Button variant="outlined" sx={{ height: "3.5rem", '&:hover':{ backgroundColor: "red", color: "white" } }}>
          <FilterAltOffIcon />
        </Button>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        p={2}
      >
        <Button
          variant="outlined"
          sx={{
            "&:hover": {
              backgroundColor: "red",
              color: "white",
            },
          }}
        >
          Immediate Attention
        </Button>
        <Button
          variant="outlined"
          sx={{
            "&:hover": {
              backgroundColor: "orange",
              color: "white",
            },
          }}
        >
          New Issues
        </Button>
        <Button
          variant="outlined"
          sx={{
            "&:hover": {
              backgroundColor: "yellowgreen",
              color: "white",
            },
          }}
        >
          Pending Issues
        </Button>
        <Button
          variant="outlined"
          sx={{
            "&:hover": {
              backgroundColor: "green",
              color: "white",
            },
          }}
        >
          Resolved Issues
        </Button>
      </Box>
    </>
  );
}

export default Complaints;
