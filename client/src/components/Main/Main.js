import React, { useEffect, useState } from "react";
import L, { popup } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import {motion} from "framer-motion";
import "./Main.css";
import mapData from "../../countries-data/countries.json"
import {useSnapshot} from 'valtio'
import {theme} from '../../theme'

var myIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
});

function Main() {
  const [dataFetch, updateDataFetch] = useState([]);
  const [val, updateVal] = useState(0);
  useEffect(() => {
    fetch("http://localhost:5000/vehicles").then((res) =>
      res.json().then((result) => updateDataFetch(result.vehicles))
    );
    console.log(dataFetch);
  }, [val]);
  const corner1 = L.latLng(-90, -190)
  const corner2 = L.latLng(90, 190)
  const bounds = L.latLngBounds(corner1, corner2)
  const snap = useSnapshot(theme);
  return (
    <>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 1.5, delay: dataFetch*0.3}}>
      <div class="map-container">
        <MapContainer
          className="map"
          center={[28, 75]}
          zoom={3}
          scrollWheelZoom={false}
          maxBoundsViscosity={1.0}
          maxBounds={bounds}
        >
          {snap.isDarkTheme && <GeoJSON style={{ fillColor: 'black', fillOpacity: 1.0 }} data={mapData.features} />}
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {console.log(dataFetch)}
          <MarkerClusterGroup className="cluster">
            {dataFetch.map((value, index) => {
              return (
                <Marker
                className="marker"
                  position={[
                    value.Status.location.lat,
                    value.Status.location.lon,
                  ]}
                  icon={myIcon}
                >
                  <Popup>
                    <h4> Driver : {value.Driver} </h4>
                    <h4> Vin : {value.vin} </h4>
                    <h4> Speed : {value.Status.speed} </h4>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
      </motion.div>
      <button className="update"
        style={{
          backgroundColor: "#03071e" /* Green */,
          borderColor: "#F7544D",
          borderRadius: "20px",
          color: "white",
          padding: "6px 30px",
          textAlign: "center",
          textDecoration: "none",
          display: "block",
          fontSize: "12px",
          margin: "10px 30px",
          cursor: "pointer",
        }}
        onClick={() => updateVal(1)}
      >
        Update
      </button>
    </>
  );
}

export default Main;
