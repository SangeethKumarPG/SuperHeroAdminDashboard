import React, { useEffect, useState } from "react";
import {
  Accordion,
  Box,
  IconButton,
  TextField,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  getAllComplaints,
  getTokenHeader,
  updateComplaintStatus,
} from "../services/allAPI";
import { toast } from "react-toastify";
import MapComponent from "./MapComponent";

function Complaints() {
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [allComplaints, setAllComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filter, setFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 5; // Complaints per page
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [complaintStatusUpdate, setComplaintStatusUpdate] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchComplaints = async () => {
    const response = await getAllComplaints(getTokenHeader());
    if (response.status === 200) {
      setAllComplaints(response.data);
      setFilteredComplaints(response.data); // Initialize filteredComplaints
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

  // Filter complaints based on search and filter
  useEffect(() => {
    let filtered = allComplaints;

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (complaint) =>
          complaint.complaintType?.toLowerCase().includes(lowercasedQuery) ||
          complaint.description?.toLowerCase().includes(lowercasedQuery) ||
          complaint.createdDate?.toLowerCase().includes(lowercasedQuery) ||
          complaint.dangerLevel?.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Apply additional filters
    if (filter) {
      filtered = filtered.filter((complaint) => {
        switch (filter) {
          case "immediate":
            return [
              "Danger To Life",
              "Danger To Property",
              "Danger To Safety",
              "Danger To Animals",
            ].includes(complaint.dangerLevel);
          case "new":
            return complaint.status === "open";
          case "pending":
            return complaint.status === "pending";
          case "resolved":
            return complaint.status === "resolved";
          default:
            return true;
        }
      });
    }

    setFilteredComplaints(filtered);
  }, [searchQuery, filter, allComplaints]);

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
  const startIndex = (currentPage - 1) * complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(
    startIndex,
    startIndex + complaintsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleStatusUpdate = async (complaintData) => {
    if (complaintStatusUpdate) {
      const response = await updateComplaintStatus(
        complaintData,
        getTokenHeader()
      );
      if (response.status === 200) {
        toast.success("Complaint status updated successfully");
        fetchComplaints();
      } else {
        toast.error("Error updating complaint status");
      }
      setComplaintStatusUpdate({});
    }
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="outlined"
          //reset filters
          onClick={() => {
            setSearchQuery("");
            setFilter("");
          }}
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
          onClick={() => setFilter("immediate")}
          sx={{ "&:hover": { backgroundColor: "red", color: "white" } }}
        >
          Immediate Attention
        </Button>
        <Button
          variant="outlined"
          onClick={() => setFilter("new")}
          sx={{ "&:hover": { backgroundColor: "orange", color: "white" } }}
        >
          New Issues
        </Button>
        <Button
          variant="outlined"
          onClick={() => setFilter("pending")}
          sx={{ "&:hover": { backgroundColor: "yellowgreen", color: "white" } }}
        >
          Pending Issues
        </Button>
        <Button
          variant="outlined"
          onClick={() => setFilter("resolved")}
          sx={{ "&:hover": { backgroundColor: "green", color: "white" } }}
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
      {currentComplaints.length > 0 ? (
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
                  <Typography variant="h6">{complaint?.description}</Typography>
                  <FormControl fullWidth variant="outlined" className="p-2">
                    <InputLabel id="status-select-label">
                      Complaint Status
                    </InputLabel>
                    <Select
                      labelId="status-select-label"
                      value={complaint?.status}
                      onChange={(e) => {
                        e.preventDefault();
                        const updatedStatus = e.target.value;
                        setComplaintStatusUpdate({
                          ...complaintStatusUpdate,
                          complaintId: complaint?._id,
                          status: updatedStatus,
                        });
                        handleStatusUpdate({
                          complaintId: complaint?._id,
                          status: updatedStatus,
                        });
                      }}
                      aria-label="status-select"
                    >
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                  <MapComponent
                    latitude={location.latitude}
                    longitude={location.longitude}
                    markers={[{ location: complaint?.location }]}
                  />
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
