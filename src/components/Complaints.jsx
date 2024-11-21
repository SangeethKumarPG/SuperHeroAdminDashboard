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
  Container,
} from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getAllComplaints, getTokenHeader, updateComplaintStatus } from "../services/allAPI";
import { toast } from "react-toastify";
import MapComponent from "./MapComponent";
import ReactLoading from "react-loading";

function Complaints({ complaintTypeFilter, setComplaintTypeFilter }) {
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const [allComplaints, setAllComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filter, setFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 5; // Complaints per page
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [complaintStatusUpdate, setComplaintStatusUpdate] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await getAllComplaints(getTokenHeader());
      if (response.status === 200) {
        setAllComplaints(response.data);
        setFilteredComplaints(response.data); // Initialize filteredComplaints
      } else {
        toast.error("Error fetching complaints");
      }
    } catch (error) {
      toast.error("Error fetching complaints");
    } finally {
      setLoading(false);
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
    switch (complaintTypeFilter) {
      case 0:
        setFilter("immediate");
        break;
      case 1:
        setFilter("new");
        break;
      case 2:
        setFilter("pending");
        break;
      case 3:
        setFilter("resolved");
        break;
      default:
        setComplaintTypeFilter(null);
        break;
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
      setLoading(true);
      try {
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
      } catch (error) {
        toast.error("Error updating complaint status");
      } finally {
        setLoading(false);
        setComplaintStatusUpdate({});
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" className="mt-5" textAlign="center">
        All Complaints
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <ReactLoading type="spin" color="#1976d2" height={80} width={80} />
        </Box>
      ) : (
        <>
          <Box display="flex" alignItems="center" className="mt-2 p-2">
            <TextField
              label="Search complaints"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ marginRight: 2 }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery("");
                setFilter("");
                setComplaintTypeFilter(null);
              }}
              sx={{
                height: "3.5rem",
                "&:hover": { backgroundColor: "red", color: "white" },
              }}
            >
              <FilterAltOffIcon />
            </Button>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
            {["immediate", "new", "pending", "resolved"].map((type) => (
              <Button
                key={type}
                variant="outlined"
                onClick={() => setFilter(type)}
                sx={{
                  "&:hover": {
                    backgroundColor: {
                      immediate: "red",
                      new: "orange",
                      pending: "yellowgreen",
                      resolved: "green",
                    }[type],
                    color: "white",
                  },
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} Issues
              </Button>
            ))}
          </Box>

          {currentComplaints.map((complaint, index) => (
            <Box key={complaint._id} p={2} borderBottom="1px solid lightgray">
              {/* Row before accordion */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#f9f9f9"
                p={1}
                borderRadius={1}
                mb={1}
              >
                <Typography variant="body2"><b>ID:</b> {index + 1}</Typography>
                <Typography variant="body2"><b>Type:</b> {complaint.complaintType}</Typography>
                <Typography variant="body2"><b>Danger Level:</b> {complaint.dangerLevel}</Typography>
                <Typography variant="body2"><b>Date:</b> {complaint.createdDate}</Typography>
              </Box>

              {/* Accordion */}
              <Accordion
                expanded={expandedComplaint === complaint._id}
                onChange={() =>
                  setExpandedComplaint(
                    expandedComplaint === complaint._id ? null : complaint._id
                  )
                }
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Description</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{complaint.description}</Typography>
                  <FormControl fullWidth className="mt-2">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={complaint.status}
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
                      className="mt-2"
                    >
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                  <MapComponent
                    latitude={location.latitude}
                    longitude={location.longitude}
                    markers={[{ location: complaint?.location }]}
                  />
                </AccordionDetails>
              </Accordion>
            </Box>
          ))}

          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
}

export default Complaints;
