import { useState, useCallback } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import * as Geolocation from "react-native-geolocation-service";

export const useCurrentLocation = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [coords, setCoords] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    if (Platform.OS !== "android") return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    const ok = await requestPermission();
    if (!ok) return;

    Geolocation.watchPosition(()=>{},()=>{},{
  enableHighAccuracy:true,
  distanceFilter:0,
  interval:1000,
});

setTimeout(()=>{
   Geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos?.coords.latitude ?? 0;
        const longitude = pos?.coords.longitude ?? 0;

        setCoords({ latitude, longitude });
        setAddress(`${latitude},${longitude}`);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        forceRequestLocation: true,
      }
    );
},1000)
    // ⭐ STEP 2 ACCURATE (fresh GPS)
   
  }, []);

return { address, coords, loading, error, refetch: getLocation, };};
