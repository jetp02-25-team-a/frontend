import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "586px",
  height: "586px",
};

const center = {
  lat: 25.033, // 台北101
  lng: 121.5654,
};

interface MapProps {
  latitude: number;
  longitude: number;
}

const Map = ({ latitude, longitude }: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY ?? "",
  });

  if (!isLoaded) return <div>Loading...</div>;

  const center = { lat: latitude, lng: longitude };

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
      <Marker position={center} />
    </GoogleMap>
  );
};

export default Map;
