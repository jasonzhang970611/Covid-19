import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './Map.css';
import { showDataOnMap } from "./util";
function Map({countries, casesType}) {
    return ( 
        <div className="map">

            <MapContainer center={[34.80746, 100.4796]} zoom={4} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(countries,casesType)}

            </MapContainer>

        </div>
    );
}

export default Map;
