import './App.css'
import { useEffect, useState } from 'react'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import axios from 'axios';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

import Header from "./components/Header"

const App = () => {
  
  const [quakedata, setQuakedata] = useState([])
  
  const dataLoaded = quakedata.length >= 1

  useEffect(()=>{
    async function getData() {
      try {
        const { data } = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')       
        const transformed_data = data?.features?.map(
          (f: { properties: { mag: number; place: any; time: any; url: any; }; geometry: { coordinates: number[]; }; id: any; }) => ({
            mag: f.properties.mag.toFixed(1),
            place: f.properties.place,
            time: dayjs(f.properties.time).format('lll'),
            url: f.properties.url,
            lat: f.geometry.coordinates[1],
            long: f.geometry.coordinates[0],
            depth: f.geometry.coordinates[2].toFixed(0),
            id: f.id
          }))
        setQuakedata(transformed_data)
      } catch (e) {
        console.error(`Error fetching earthquake data: ${e}`)
      }
    }
    getData();
  }, [])

  interface Earthquake {
    id: string,
    mag: number,
    place: string,
    time: string,
    url: string,
    lat: number,
    long: number,
    depth: number,
  }

  const renderMarkers = () => {
    return quakedata.map((q:Earthquake) => {
      return(
        <CircleMarker key={q.id} center={[q.lat,q.long]} radius={q.mag * 2.7}>
        <Popup>
          <h2>{`Magnitude: ${q.mag}`}</h2><br /><h3>{q.place}<br />{q.time}</h3>
        </Popup>
      </CircleMarker>
      )
    })
  }

  return (
    <div id="app">
      <Header />
      {dataLoaded && <MapContainer
        center={[29, -20]}
        zoom={2}
        scrollWheelZoom={true}
        minZoom={2}
        >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
        <MarkerClusterGroup
        chunkedLoading
      >
        {renderMarkers()}
      </MarkerClusterGroup>
      </MapContainer>}
    </div>
  );
};

export default App
