/**
 * Google Maps Geocoding Utility
 * 주소를 위도/경도 좌표로 변환
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * 주소를 좌표로 변환
 */
export const geocodeAddress = (address: string): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps) {
      reject(new Error('Google Maps API not loaded'));
      return;
    }

    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

/**
 * 여러 주소를 한번에 좌표로 변환
 */
export const geocodeAddresses = async (
  addresses: string[]
): Promise<(Coordinates | null)[]> => {
  const promises = addresses.map(async (address) => {
    try {
      return await geocodeAddress(address);
    } catch (error) {
      console.error(`Failed to geocode address: ${address}`, error);
      return null;
    }
  });

  return Promise.all(promises);
};
