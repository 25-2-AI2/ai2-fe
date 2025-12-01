import { GoogleMap, Marker, OverlayView } from '@react-google-maps/api';
import { useState, useCallback, useEffect } from 'react';
import { Restaurant } from '@/shared/types/restaurant';
import { useChatStore } from '@/shared/store/chatStore';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 40.7580, // NYC Times Square로 기본값
  lng: -73.9855,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};

interface Props {
  restaurants: Restaurant[];
}

export function GoogleMapView({ restaurants }: Props) {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const { selectedRestaurantId, setSelectedRestaurant } = useChatStore();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showMarkers, setShowMarkers] = useState(false);

  const onMapLoad = useCallback((loadedMap: google.maps.Map) => {
    setMap(loadedMap);
    // 마커들이 모두 보이도록 자동 조정
    if (restaurants.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      restaurants.forEach((r) => {
        bounds.extend({ lat: r.lat, lng: r.lng });
      });
      loadedMap.fitBounds(bounds);
      
      // 너무 확대되는 것 방지
      const listener = google.maps.event.addListenerOnce(loadedMap, 'idle', () => {
        const currentZoom = loadedMap.getZoom();
        if (currentZoom && currentZoom > 16) {
          loadedMap.setZoom(16);
        }
      });
    }
    // 지도 로드 후 마커 표시
    setTimeout(() => setShowMarkers(true), 100);
  }, [restaurants]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={15}
      options={mapOptions}
      onLoad={onMapLoad}
    >
      {showMarkers && restaurants.map((restaurant, index) => {
        return (
          <Marker
            key={restaurant.id}
            position={{ lat: restaurant.lat, lng: restaurant.lng }}
            onClick={() => {
              setActiveMarker(restaurant.id);
              setSelectedRestaurant(restaurant.id);
            }}
          />
        );
      })}
      
      {activeMarker && restaurants.find(r => r.id === activeMarker) && (
        <OverlayView
          position={{
            lat: restaurants.find(r => r.id === activeMarker)!.lat,
            lng: restaurants.find(r => r.id === activeMarker)!.lng,
          }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div style={{ transform: 'translate(-50%, calc(-100% - 40px))' }}>
            {/* InfoWindow 스타일의 컨테이너 */}
            <div 
              className="bg-white rounded-lg shadow-xl p-3 relative border border-gray-200"
              style={{ width: '240px', maxWidth: '240px', minWidth: '240px' }}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={() => setActiveMarker(null)}
                className="absolute w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200 z-10"
                style={{ top: '8px', right: '8px', cursor: 'pointer' }}
              >
                <span className="text-base leading-none">×</span>
              </button>
              
              {/* 내용 */}
              <h3 className="font-bold text-gray-900 mb-1 text-sm">
                {restaurants.find(r => r.id === activeMarker)!.name}
              </h3>
              <p className="text-xs text-[#9AA6B2] mb-2">
                {restaurants.find(r => r.id === activeMarker)!.category}
              </p>
              <div className="flex items-center gap-1 mb-2">
                <svg className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium text-gray-900 text-sm">
                  {restaurants.find(r => r.id === activeMarker)!.rating}
                </span>
              </div>
              <p className="text-xs text-[#9AA6B2] leading-relaxed">
                {restaurants.find(r => r.id === activeMarker)!.summary}
              </p>
              
              {/* 말풍선 꼬리 */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 w-0 h-0" 
                style={{
                  bottom: '-12px',
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderTop: '12px solid white',
                  filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.1))'
                }}
              />
            </div>
          </div>
        </OverlayView>
      )}
    </GoogleMap>
  );
}
