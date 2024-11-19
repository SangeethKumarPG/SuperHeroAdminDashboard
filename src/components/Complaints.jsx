import {
  Accordion,
  Box,
  IconButton,
  TextField,
  AccordionSummary,
  AccordionDetails,
  Pagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { getAllComplaints, getTokenHeader } from "../services/allAPI";
import { toast } from "react-toastify";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import MapComponent from "./MapComponent";

function Complaints() {
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [allComplaints, setAllComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 5; // Adjust this to set complaints per page
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [markers, setMarkers] = useState([]);

  const fetchComplaints = async () => {
    const response = await getAllComplaints(getTokenHeader());
    if (response.status === 200) {
      console.log("Complaints data : ", response.data);
      setAllComplaints(response.data);
    } else {
      toast.error("Error fetching complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  // Calculate pagination details
  const totalPages = Math.ceil(allComplaints.length / complaintsPerPage);
  const startIndex = (currentPage - 1) * complaintsPerPage;
  const currentComplaints = allComplaints.slice(
    startIndex,
    startIndex + complaintsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
        <Button
          variant="outlined"
          sx={{
            height: "3.5rem",
            "&:hover": { backgroundColor: "red", color: "white" },
          }}
        >
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
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        sx={{ width: "100%" }}
      >
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h6">Id</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h6">Type</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h6">Danger Level</Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="h6">Date</Typography>
        </Box>
      </Box>
      {currentComplaints?.length > 0 ? (
        currentComplaints.map((complaint, index) => (
          <Box key={complaint._id}>
            <Accordion
              expanded={expandedComplaint === complaint._id}
              onChange={() =>
                setExpandedComplaint(
                  expandedComplaint === complaint._id ? null : complaint._id
                )
              }
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{ padding: "0 10px" }}
              >
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Typography sx={{ flex: 1, textAlign: "center" }}>
                    {startIndex + index + 1}
                  </Typography>
                  <Typography sx={{ flex: 1, textAlign: "center" }}>
                    {complaint?.complaintType}
                  </Typography>
                  <Typography sx={{ flex: 1, textAlign: "center" }}>
                    {complaint?.dangerLevel}
                  </Typography>
                  <Typography sx={{ flex: 1, textAlign: "center" }}>
                    {complaint?.createdDate}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"column"}
                >
                  <Typography variant="h6">
                    {complaint?.description}
                  </Typography>
                  <MapComponent latitude={location.latitude} longitude={location.longitude} markers={[{location:complaint?.location}]}/>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        ))
      ) : (
        <Typography variant="h6">No complaints found</Typography>
      )}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </>
  );
}

export default Complaints;
