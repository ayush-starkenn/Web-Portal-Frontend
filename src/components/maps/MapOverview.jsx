import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { TabView, TabPanel } from "primereact/tabview";
import Cookies from "js-cookie";
import icon from "../../assets/img/truck.png";

const CONTAINER_STYLE = {
  width: "100%",
  height: "400px",
  border: "2px #ddd solid",
  borderRadius: "10px",
  zIndex: "0",
};

const CENTER = {
  lat: 21.1466,
  lng: 79.0882,
};

const MapOverview = () => {
  const token = Cookies.get("token");
  const user_uuid = Cookies.get("user_uuid");

  const [markers, setMarkers] = useState([]);

  const filters = [
    { name: "All", code: "all" },
    { name: "Ongoing", code: "LOC" },
    { name: "Limp Mode", code: "LMP" },
    { name: "Accident", code: "ACD" },
  ];
  const [filter, setFilter] = useState(filters[0]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabChange = (e) => {
    setActiveTabIndex(e.index);
    setFilter(filters[e.index]);
  };

  useEffect(() => {
    const fetchOngoingTrips = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/dashboardCustomers/getOngoingLoc/${user_uuid}`,
          {
            params: { filter: filter.code },
            headers: { authorization: `bearer ${token}` },
          }
        );

        const tripData = response.data.Trip_data;
        const parsedMarkers = tripData.map((e) => ({
          lat: parseFloat(e.lat),
          lng: parseFloat(e.lng),
          vehicleName: e.vehicle_name,
          timestamp: e.timestamp,
        }));

        setMarkers(parsedMarkers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOngoingTrips();
  }, [filter, user_uuid, token]);

  const getTimeStamp = (time) => {
    const formattedDate = new Date(time * 1000);
    return formattedDate.toLocaleString();
  };

  const legalIcon = new L.Icon({
    iconUrl: icon,
    iconSize: [35, 35],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  });

  return (
    <>
      <TabView
        activeIndex={activeTabIndex}
        className="w-[67vw] rounded-lg bg-gray-600  dark:bg-navy-800 sm-max:w-[90vw]"
        onTabChange={handleTabChange}
      >
        {filters.map((f, index) => (
          <TabPanel
            key={index}
            className="!sm-max:px-[-10px] mx-auto rounded-sm sm-max:mx-[-12px]"
            header={f.name}
          >
            <MapContainer
              className="map"
              center={CENTER}
              zoom={13}
              style={CONTAINER_STYLE}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  icon={legalIcon}
                >
                  <Popup>
                    <div style={{ lineHeight: "5px" }}>
                      <p
                        style={{
                          borderRadius: "50%",
                          backgroundColor: "#fca311",
                          height: "fit-content",
                          width: "fit-content",
                          padding: "8px 8px",
                          textAlign: "center",
                          color: "#fefefe",
                        }}
                      >
                        {index + 1}
                      </p>
                      <p>
                        <strong>Vehicle Name: {marker.vehicleName}</strong>
                      </p>
                      <p>Latitude: {marker.lat}</p>
                      <p>Longitude: {marker.lng}</p>
                      <p>Timestamp: {getTimeStamp(marker.timestamp)}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </TabPanel>
        ))}
      </TabView>
    </>
  );
};

export default MapOverview;
