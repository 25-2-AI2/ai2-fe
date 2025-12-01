import { GoogleMap, Marker } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import { geocodeAddress, Coordinates } from '@/shared/utils/geocoding';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

interface Props {
  address: string;
  name: string;
}

export function SingleRestaurantMap({ address, name }: Props) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMarker, setShowMarker] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const coords = await geocodeAddress(address);
        setCoordinates(coords);
        // 지도가 로드된 후 마커 표시
        setTimeout(() => setShowMarker(true), 100);
      } catch (err) {
        console.error('Failed to geocode address:', err);
        setError('지도를 불러올 수 없습니다');
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchCoordinates();
    }
  }, [address]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">지도 로딩 중...</p>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">{error || '지도를 표시할 수 없습니다'}</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={coordinates}
      zoom={16}
      options={mapOptions}
    >
      {showMarker && (
        <Marker
          position={coordinates}
          title={name}
        />
      )}
    </GoogleMap>
  );
}
