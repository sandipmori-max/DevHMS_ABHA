  import {
    useEffect,
    useState,
    useCallback,
    useRef,
  } from "react";

  import {
    PermissionsAndroid,
    Platform,
    NativeModules,
  } from "react-native";

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
      if (!hasPermission) {
        setError("Location permission denied");
        return;
      }
      await new Promise(res => setTimeout(res, 400));
      const res =
        await NativeModules.LocationModule.getCurrentLocation();

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