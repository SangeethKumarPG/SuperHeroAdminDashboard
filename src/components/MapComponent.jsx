import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function MapComponent({ latitude, longitude, markers = [] }) {
  const mapRef = useRef(null);

  useEffect(() => {

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
      zoom: 8,
    });

    
    new window.google.maps.Marker({
      position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
      map: map,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', 
      },
    });

    
    markers.forEach((marker) => {
        console.log(marker);
      new window.google.maps.Marker({
        position: { lat: parseFloat(marker.location.lat), lng: parseFloat(marker.location.lng) },
        map: map,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', 
        },
      });
    });
  }, [latitude, longitude, markers]);

  return (
    <Card style={{ width: '100%', height: '550px' }}>
      <CardContent style={{ padding: 0 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Locations
        </Typography>
        <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
      </CardContent>
    </Card>
  );
}

export default MapComponent;
