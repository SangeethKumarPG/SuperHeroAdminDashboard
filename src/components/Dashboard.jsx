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
  const getDashboardCardsData = async () => {
    if (sessionStorage.getItem("token")) {
      const response = await getComplaintSummary(getTokenHeader());
      if (response.status === 200) {
        // console.log(response.data);
        setDashboardData(response.data);
      } else {
        toast.error("Error fetching dashboard data");
      }
    } else {
      toast.error("Please login to access dashboard");
    }
  };

  const getComplaintTypeCount = async () => {
    if (sessionStorage.getItem("token")) {
      const response = await getUniqueComplaintCountByType(getTokenHeader());
      if (response.status === 200) {
        const formattedData = response.data.map((item) => ({
          label: item._id,
          value: item.count,
        }));
        setComplaintTypeCount(formattedData);
      } else {
        toast.error("Error fetching complaint type count");
      }
    } else {
      toast.error("Please login to access dashboard");
    }
  };

  const getDangerLevelCount = async () => {
    if (sessionStorage.getItem("token")) {
      const response = await getComplaintCountByDangerLevel(getTokenHeader());
      if (response.status === 200) {
        const formattedData = response.data.map((item) => ({
          label: item._id,
          value: item.count,
        }));
        setDangerLevelCount(formattedData);
      } else {
        toast.error("Error fetching danger level count");
      }
    }
  };

  const getLatestLocations = async () => {
    if (sessionStorage.getItem("token")) {
      const response = await getComplaintLocations(getTokenHeader());
      if (response.status === 200) {
        setMarkers(response.data);
      } else {
        toast.error("Error fetching latest locations");
      }
    } else {
      toast.error("Please login to access dashboard");
    }
  };

  useEffect(() => {
    getDashboardCardsData();
    getComplaintTypeCount();
    getDangerLevelCount();
    getLatestLocations();
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
              transition: "transform 0.3s, background-color 0.3s", // smooth transition
              "&:hover": {
                transform: "scale(1.05)", // scale the card on hover
                backgroundColor: "#1976d2", // change background on hover (you can customize this)
              },
              "&:active": {
                transform: "scale(0.95)", // scale down on tap (click or touch)
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
