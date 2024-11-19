import { Box, Card, Typography, CardContent } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import React, { useEffect, useState } from "react";
import { getComplaintCountByDangerLevel, getComplaintLocations, getUniqueComplaintCountByType } from "../services/allAPI";
import { toast } from "react-toastify";
import MapComponent from "./MapComponent";

function Dashboard() {
  const [complaintTypeCount, setComplaintTypeCount] = useState([]);
  const [dangerLevelCount, setDangerLevelCount] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [markers, setMarkers] = useState([]);

  const getComplaintTypeCount = async () => {
    if (sessionStorage.getItem("token")) {
      console.log("Token present");
      const token = JSON.parse(sessionStorage.getItem("token"));
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await getUniqueComplaintCountByType(headers);
      if (response.status === 200) {
        console.log("Response data", response.data);
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
    if(sessionStorage.getItem("token")){
      const token = JSON.parse(sessionStorage.getItem("token"));
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await getComplaintCountByDangerLevel(headers);
      if (response.status === 200) {
        console.log("Response data", response.data);
        const formattedData = response.data.map((item) => ({
          label: item._id,
          value: item.count,
        }));
        setDangerLevelCount(formattedData);
      }else{
        toast.error("Error fetching danger level count");
      }
    }
  }

  const getLatestLocations = async () => {
    if(sessionStorage.getItem("token")){
      const token = JSON.parse(sessionStorage.getItem("token"));
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await getComplaintLocations(headers);
      if(response.status === 200){
        console.log("Response data", response.data);
        setMarkers(response.data);
      }else{
        toast.error("Error fetching latest locations");
      }
    }else{
      toast.error("Please login to access dashboard");
    }
  }

  useEffect(() => {
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
  console.log("complaint type count", complaintTypeCount);
  return (
    <>
      <div className="row mt-2">
        <div className="col-md-4">
          <Card
            className="indexCard"
            variant="outlined"
            style={{
              backgroundColor: "red",
              color: "white",
              height: "12rem",
              borderRadius: "10px",
            }}
            sx={{
              mt: { xs: 2, sm: 0 },
              mb: { xs: 2, sm: 0 },
            }}
          >
            <CardContent className="d-flex align-items-center justify-content-center flex-column p-2 mt-5">
              <Typography variant="h6" component="div">
                Immediate Attention Required
              </Typography>
              <Typography variant="body1">1</Typography>
            </CardContent>
          </Card>
        </div>
        <div className="col-md-4">
          <Card
            className="indexCard"
            variant="outlined"
            style={{
              backgroundColor: "orange",
              color: "white",
              height: "12rem",
              borderRadius: "10px",
            }}
            sx={{
              mt: { xs: 2, sm: 0 },
              mb: { xs: 2, sm: 0 },
            }}
          >
            <CardContent className="d-flex align-items-center justify-content-center flex-column p-3 mt-5">
              <Typography variant="h6" component="div">
                New Issues
              </Typography>
              <Typography variant="body1">2</Typography>
            </CardContent>
          </Card>
        </div>
        <div className="col-md-4">
          <Card
            className="indexCard"
            variant="outlined"
            style={{
              backgroundColor: "yellowgreen",
              color: "white",
              height: "12rem",
              borderRadius: "10px",
            }}
            sx={{
              mt: { xs: 2, sm: 0 },
              mb: { xs: 2, sm: 0 },
            }}
          >
            <CardContent className="d-flex align-items-center justify-content-center flex-column p-2 mt-5">
              <Typography variant="h6" component="div">
                Pending Issues
              </Typography>
              <Typography variant="body1">3</Typography>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-6 d-flex">
          <Typography variant="h5" component="div">
            Complaint Types
          </Typography>

          <PieChart
            series={[
              {
                data: complaintTypeCount,
                // arcLabel:(item)=> `${item.label}: ${item.value}`,
                highlightScope: { fade: "global", highlight: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                },
              },
            ]}
            width={400}
            height={400}
            // margin={{ top: 100, bottom: 10, left: 10, right:100 }}
            slotProps={{ legend: { direction: "column",
              position: {
                vertical: 'bottom',
                horizontal: 'right',
              },
              itemMarkWidth: 20,
              itemMarkHeight: 20,
              markGap: 5,
              itemGap: 10,} }}
          />
        </div>
        <div className="col-md-6 d-flex">
          <Typography variant="h5" component="div">
            Danger Levels 
          </Typography>

          <PieChart
            series={[
              {
                data: dangerLevelCount,
                // arcLabel:(item)=> `${item.label}: ${item.value}`,
                
                highlightScope: { fade: "global", highlight: "item" },
                innerRadius: 100,
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                },
              },
            ]}
            width={400}
            height={400}
            // margin={{ top: 100, bottom: 10, left: 10, right:100 }}
            slotProps={{ legend: { direction: "column",
              position: {
                vertical: 'bottomed',
                horizontal: 'right',
              },
              itemMarkWidth: 20,
              itemMarkHeight: 20,
              markGap: 5,
              itemGap: 10,} }}
          />
        </div>
      </div>
      <div className="row mt-2">
        <MapComponent markers={markers} latitude={location.latitude} longitude={location.longitude}/>
      </div>
    </>
  );
}

export default Dashboard;
