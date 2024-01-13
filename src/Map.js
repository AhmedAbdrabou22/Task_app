// import React, { useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// const MapWithMarker = ({ location }) => {
//     const map = useMap();

//     useEffect(() => {
//         // Parse the location string into lat and lng
//         const [lat, lng] = location.split(',').map(parseFloat);

//         // Remove previous markers
//         map.eachLayer((layer) => {
//             if (layer instanceof L.Marker) {
//                 map.removeLayer(layer);
//             }
//         });

//         // Add a new marker at the updated location
//         const newMarker = L.marker([lat, lng]);
//         newMarker.addTo(map);
//     }, [location, map]);

//     return null;
// };

// const position = [24.7136, 46.6753]; // Set a default position for the map

// const MapWithMarkerContainer = () => (
//     <div style={{ height: '500px', width: '100%', overflow: 'hidden' }}>
//         <MapContainer center={position} zoom={10} style={{ height: '500px', width: '100%' }}>
//             <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
//             <MapWithMarker location={'24.7136,46.6753'} />
//         </MapContainer>
//     </div>
// );

// export default MapWithMarkerContainer;
