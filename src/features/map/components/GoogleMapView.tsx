import { GoogleMap, Marker, OverlayView } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { RestaurantWithCoords } from '@/shared/types/restaurant';
import { useChatStore } from '@/shared/store/chatStore';
import { Star } from 'lucide-react';

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
  restaurants: RestaurantWithCoords[];
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
      google.maps.event.addListenerOnce(loadedMap, 'idle', () => {
        const currentZoom = loadedMap.getZoom();
        if (currentZoom && currentZoom > 16) {
          loadedMap.setZoom(16);
        }
      });
    }
    // 지도 로드 후 마커 표시
    setTimeout(() => setShowMarkers(true), 100);
  }, [restaurants]);

  // 레스토랑 목록이 변경되면 지도 범위 조정
  const handleRestaurantsChange = useCallback(() => {
    if (map && restaurants.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      restaurants.forEach((r) => {
        bounds.extend({ lat: r.lat, lng: r.lng });
      });
      map.fitBounds(bounds);
    }
  }, [map, restaurants]);

  // restaurants가 변경될 때 지도 범위 조정
  useState(() => {
    handleRestaurantsChange();
  });

  const activeRestaurant = restaurants.find(r => r.place_id === activeMarker);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={15}
      options={mapOptions}
      onLoad={onMapLoad}
    >
      {showMarkers && restaurants.map((restaurant) => {
        return (
          <Marker
            key={restaurant.place_id}
            position={{ lat: restaurant.lat, lng: restaurant.lng }}
            onClick={() => {
              setActiveMarker(restaurant.place_id);
              setSelectedRestaurant(restaurant.place_id);
            }}
          />
        );
      })}
      
      {activeMarker && activeRestaurant && (
        <OverlayView
          position={{
            lat: activeRestaurant.lat,
            lng: activeRestaurant.lng,
          }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div style={{ transform: 'translate(-50%, calc(-100% - 40px))' }}>
            {/* InfoWindow 스타일의 컨테이너 */}
            <div 
              className="bg-white rounded-lg shadow-xl p-3 relative border border-gray-200"
              style={{ width: '280px', maxWidth: '280px', minWidth: '280px' }}
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
              <h3 className="font-bold text-gray-900 mb-1 text-sm pr-6">
                {activeRestaurant.name}
              </h3>
              
              {/* 평점 */}
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium text-gray-900 text-sm">
                  {activeRestaurant.rating ?? 'N/A'}
                </span>
                {activeRestaurant.user_ratings_total && (
                  <span className="text-xs text-gray-500">
                    ({activeRestaurant.user_ratings_total.toLocaleString()}개 리뷰)
                  </span>
                )}
              </div>

              {/* 태그 */}
              {activeRestaurant.generated_tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {activeRestaurant.generated_tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 주소 */}
              <p className="text-xs text-[#9AA6B2] leading-relaxed">
                {activeRestaurant.address}
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
