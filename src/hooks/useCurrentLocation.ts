  import {
    useEffect,
    useState,
    useCallback,
    useRef,
  } from "react";
import Geolocation from "@react-native-community/geolocation";

  import {
    PermissionsAndroid,
    Platform,
    NativeModules,
  } from "react-native";
import DeviceInfo from "react-native-device-info";

  type Coords = {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };

  export const useCurrentAddress = () => {

    const [address, setAddress] =
      useState<string | null>(null);

    const [coords, setCoords] =
      useState<Coords | null>(null);

    const [loading, setLoading] =
      useState(false);

    const [error, setError] =
      useState<string | null>(null);

    const loadingRef = useRef(false);

    const requestLocationPermission =
      async (): Promise<boolean> => {

        if (Platform.OS !== "android") {
          return true;
        }

        try {

          const granted =
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS
                .ACCESS_FINE_LOCATION
            );

          return (
            granted ===
            PermissionsAndroid.RESULTS.GRANTED
          );

        } catch {

          return false;
        }
      };

  const getLocation = useCallback(async (silent = false) => {
    try {
      if (loadingRef.current) return;

      loadingRef.current = true;

      // ONLY SHOW LOADER IF NOT SILENT
      if (!silent) {
        setLoading(true);
      }

      setError(null);

      const hasPermission = await requestLocationPermission();
      console.log("Location permission:", hasPermission);
      if (!hasPermission) {
        setError("Location permission denied");
        return;
      }
      await new Promise(res => setTimeout(res, 400));
       const androidVersion = parseInt(DeviceInfo.getSystemVersion(), 10);
        if (androidVersion <= 9 && Platform.OS === "android") {
          Geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              setCoords({ latitude, longitude, accuracy });
              setAddress(`${latitude},${longitude}`);
            },
            error => {
              console.log('FINAL ERROR:', error);

              let message = '';

              switch (error.code) {
                case 1:
                  message = 'Location permission denied';
                  break;
                case 2:
                  message = 'Location unavailable (GPS/Network issue)';
                  break;
                case 3:
                  message = 'Location timeout (slow network)';
                  break;
                default:
                  message = error?.message || 'Failed to fetch location';
              }
              setError(message);
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 10000,
            },
          );
          return;
        }
          
      const res = await NativeModules.LocationModule.getCurrentLocation();

      const { latitude, longitude, accuracy } = res;

      setCoords({ latitude, longitude, accuracy });
      setAddress(`${latitude},${longitude}`);

    } catch (e: any) {
      setError(e?.message || "Failed to fetch location");

    } finally {
      if (!silent) {
        setLoading(false);
      }

      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    getLocation(false);
    const interval = setInterval(() => {
      getLocation(true);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

    return {
      address,
      coords,
      loading,
      error,
      refetch: getLocation,
    };
  };