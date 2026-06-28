import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function BloodMap({ requests, userCoords }) {
  return (
    <MapContainer
      center={userCoords ? [userCoords.lat, userCoords.lng] : [30.3753, 69.3451]}
      zoom={6}
      style={{ height: "500px", width: "100%", borderRadius: "12px" }}
    >
      {/* OpenStreetMap layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Hospital markers */}
      {requests.map((r) => {
        const [lat, lng] = r.coordinates.split(',').map(Number)

        return (
          <Marker key={r._id} position={[lat, lng]}>
            <Popup>
              <b>{r.hospital}</b>
              <br />
              {r.bloodType} Required
              <br />
              {r.city}
            </Popup>
          </Marker>
        )
      })}

      {/* User location marker */}
      {userCoords && (
        <Marker position={[userCoords.lat, userCoords.lng]}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
    </MapContainer>
  )
}