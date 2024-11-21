import { Box, Card, Typography, CardContent } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import React, { useEffect, useState } from "react";
import {
  getComplaintCountByDangerLevel,
  getComplaintLocations,
  getUniqueComplaintCountByType,
  getTokenHeader,
  getComplaintSummary,
} from "../services/allAPI";
import { toast } from "react-toastify";
import MapComponent from "./MapComponent";
import ReactLoading from "react-loading";

function Dashboard({
  complaintTypeFilter,
  setComplaintTypeFilter,
  setSelectedView,
}) {
  const [complaintTypeCount, setComplaintTypeCount] = useState([]);
  const [dangerLevelCount, setDangerLevelCount] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [markers, setMarkers] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const cardColors = ["red", "orange", "yellowgreen"];
  const [loading, setLoading] = useState(false); // General loading state for all API calls

  // common method to fetch data from the backend and populate cards and charts
  const fetchData = async () => {
    setLoading(true); // Show spinner
    try {
      if (!sessionStorage.getItem("token")) {
        toast.error("Please login to access dashboard");
        return;
      }

      const [
        summaryResponse,
        complaintTypeResponse,
        dangerLevelResponse,
        locationsResponse,
      ] = await Promise.all([
        getComplaintSummary(getTokenHeader()),
        getUniqueComplaintCountByType(getTokenHeader()),
        getComplaintCountByDangerLevel(getTokenHeader()),
        getComplaintLocations(getTokenHeader()),
      ]);

      if (summaryResponse.status === 200) {
        setDashboardData(summaryResponse.data);
      } else {
        toast.error("Error fetching dashboard data");
      }

      if (complaintTypeResponse.status === 200) {
        setComplaintTypeCount(
          complaintTypeResponse.data.map((item) => ({
            label: item._id,
            value: item.count,
          }))
        );
      } else {
        toast.error("Error fetching complaint type count");
      }

      if (dangerLevelResponse.status === 200) {
        setDangerLevelCount(
          dangerLevelResponse.data.map((item) => ({
            label: item._id,
            value: item.count,
          }))
        );
      } else {
        toast.error("Error fetching danger level count");
      }

      if (locationsResponse.status === 200) {
        setMarkers(locationsResponse.data);
      } else {
        toast.error("Error fetching latest locations");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false); // Hide spinner
    }
  };

 

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Get's the user's current location and sets the location state on page load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);
  if (loading) {
    // Show spinner while loading
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <ReactLoading type="spin" color="#1976d2" height={80} width={80} />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={4} mt={5}>
      {/* Cards Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        {dashboardData?.map((item, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              backgroundColor: cardColors[index],
              color: "white",
              height: "12rem",
              borderRadius: "10px",
              flex: "1 1 30%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              transition: "transform 0.3s, background-color 0.3s", 
              "&:hover": {
                transform: "scale(1.05)", 
                backgroundColor: "#1976d2", 
              },
              "&:active": {
                transform: "scale(0.95)", 
              },
            }}
            onClick={() => {
              setComplaintTypeFilter(index);
              setSelectedView(1);
            }}
          >
            <CardContent>
              <Typography variant="h6" textAlign="center">
                {item.title}
              </Typography>
              <Typography variant="body1" textAlign="center">
                {item.count}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pie Charts Section */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={4}
        justifyContent="space-between"
      >
        <Box
          flex="1 1 45%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography variant="h5">Complaint Types</Typography>
          <PieChart
            series={[
              {
                data: complaintTypeCount,
                highlightScope: { fade: "global", highlight: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                },
              },
            ]}
            width={300}
            height={300}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "bottom", horizontal: "center" },
                itemMarkWidth: 15,
                itemMarkHeight: 15,
                itemGap: 10,
              },
            }}
          />
        </Box>
        <Box
          flex="1 1 45%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography variant="h5">Danger Levels</Typography>
          <PieChart
            series={[
              {
                data: dangerLevelCount,
                highlightScope: { fade: "global", highlight: "item" },
                innerRadius: 80,
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                },
              },
            ]}
            width={300}
            height={300}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "bottom", horizontal: "center" },
                itemMarkWidth: 15,
                itemMarkHeight: 15,
                itemGap: 10,
              },
            }}
          />
        </Box>
      </Box>

      {/* Map Section */}
      <Box>
        <MapComponent
          markers={markers}
          latitude={location.latitude}
          longitude={location.longitude}
        />
      </Box>
    </Box>
  );
}

export default Dashboard;
