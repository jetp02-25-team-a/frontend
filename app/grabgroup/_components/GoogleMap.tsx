import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

let containerStyle = {
  width: '100%',
  height: '100%',
};

interface MapProps {
  latitude: number;
  longitude: number;
  width?: number;
  height?: number;
}

const Map = ({ latitude, longitude, width, height }: MapProps) => {
  if (width && height) {
    containerStyle = { width: `${width}px`, height: `${height}px` };
  } else {
    containerStyle = { width: '100%', height: '100%' };
  }
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY ?? '',
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
