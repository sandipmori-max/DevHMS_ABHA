import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  StatusBar,
  StyleSheet,
  View,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { store } from "./src/store/store";
import RootNavigator from "./src/navigation/RootNavigator";
import NoInternetScreen from "./src/screens/noInternet/NoInternet";
import CustomSplashScreen from "./src/screens/splash/SplashScreen";
import { TranslationProvider } from "./src/components/TranslationProvider";
import { ERP_COLOR_CODE } from "./src/utils/constants";
import useNetworkStatus from "./src/hooks/useNetworkStatus";
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

import {
  requestUserPermission,
  onMessageListener,
  setBackgroundMessageHandler,
  onNotificationOpenedAppListener,
  checkInitialNotification,
} from "./src/firebase/firebaseService";

import { clearAllTempFiles } from "./src/utils/helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FullViewLoader from "./src/components/loader/FullViewLoader";
import TermsAndConsent from "./src/screens/TermsConditions/TermsCondition";
import { useAppSelector } from "./src/store/hooks";
import ExitBottomSheet from "./src/components/ExitBottomSheet";
import RootNavigatorTvOS from "./src/navigation/RootNavigatorTvOs";
import { navigate, navigationRef } from "./src/navigation/navigationService";

const App = () => {
  return (
    <Provider store={store}>
      <TranslationProvider>
        <AppContent />
        {
          Platform.OS === 'android' &&  <ExitBottomSheet />
        }
      </TranslationProvider>
    </Provider>
  );
};

const AppContent = () => {
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const appOpacity = useRef(new Animated.Value(0)).current;
  const appTranslateY = useRef(new Animated.Value(120)).current;

  const { width } = useWindowDimensions();

  const isConnected = useNetworkStatus();

  const theme = useAppSelector((state) => state?.theme?.mode);
  const user = useAppSelector((state) => state?.auth);

  const [statusBarColor, setStatusBarColor]= useState(theme === "dark" ? "#000000" : ERP_COLOR_CODE.ERP_APP_COLOR)

  const [isSplashVisible, setSplashVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);

  const barStyle = "light-content";

  const isTv =  Platform.isTV;
  // 🔹 Clear temp files
  useEffect(() => {
    clearAllTempFiles();
  }, []);

  useEffect(() => {
    setStatusBarColor(theme === "dark" ? "#000000" : ERP_COLOR_CODE.ERP_APP_COLOR)
  }, [user])

  useEffect(() => {
    const checkAcceptance = async () => {
      const value = await AsyncStorage.getItem("TERMS_ACCEPTED");
      if (value === "true") setAccepted(true);
      setIsLoading(false);
    };
    checkAcceptance();
  }, []);

  // 🔹 AppState
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background") {
        clearAllTempFiles();
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
  async function createChannel() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }

  createChannel();
}, []);
  // 🔹 Notifications
useEffect(() => {
  const initNotifications = async () => {
    requestUserPermission();
    setBackgroundMessageHandler();

    // Killed State
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      const screen =
        initialNotification.notification?.data?.screen;

      navigate(
        screen,
        initialNotification.notification?.data,
      );
    }
  };

  initNotifications();

  // Foreground FCM
  const unsubscribeForeground = onMessageListener(
    async remoteMessage => {
      console.log(
        'FCM Foreground',
        JSON.stringify(remoteMessage, null, 2),
      );

      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,

        // IMPORTANT
        data: remoteMessage.data,

        android: {
          channelId: 'default',

          pressAction: {
            id: 'default',
          },

          actions: [
            {
              title: 'Open',
              pressAction: {
                id: 'open',
              },
            },
            {
              title: 'Dismiss',
              pressAction: {
                id: 'dismiss',
              },
            },
          ],
        },
      });
    },
  );

  // Foreground Notification Click
  const unsubscribeNotifee =
    notifee.onForegroundEvent(({ type, detail }) => {
      const data = detail.notification?.data;

      switch (type) {
        case EventType.PRESS:
          navigate(data?.screen, data);
          break;

        case EventType.ACTION_PRESS:
          if (detail.pressAction.id === 'open') {
            navigate(data?.screen, data);
          }
          break;
      }
    });

  // Background Notification Click
  const unsubscribeBackground =
    onNotificationOpenedAppListener(remoteMessage => {
      const screen = remoteMessage?.data?.screen;

      navigate(screen, remoteMessage?.data);
    });

  return () => {
    unsubscribeForeground?.();
    unsubscribeBackground?.();
    unsubscribeNotifee?.();
  };
}, []);

  const handleAccept = async () => {
    await AsyncStorage.setItem("TERMS_ACCEPTED", "true");
    setAccepted(true);
  };

  // 🔥 Loader
  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <FullViewLoader />
      </View>
    );
  }

  // 🔥 Terms
  if (!accepted && !isTv) {
    return <TermsAndConsent onAccept={handleAccept} />;
  }

  return (
    <>
      <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />

      {/* 🔥 MAIN APP */}
      <Animated.View
        style={{
          flex: 1,
          width: width,
          opacity: appOpacity,
          transform: [{ translateY: appTranslateY }],
        }}
      >
        <SafeAreaView
          edges={["top"]}
          style={{ backgroundColor: statusBarColor }}
        />

        <SafeAreaView
          edges={["left", "right", "bottom"]}
          style={[styles.safeArea, {
            backgroundColor : theme === 'dark' ? 'black' : 'white'
          }]}
        >
          <NavigationContainer ref={navigationRef}>
            {
              Platform.isTV ? <RootNavigatorTvOS /> : <RootNavigator />
            } 
          </NavigationContainer>
        </SafeAreaView>
      </Animated.View>

      {/* 🔥 No Internet */}
      {!isConnected && (
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 1000 }]}>
          <NoInternetScreen onRetry={() => {}} />
        </View>
      )}

      {/* 🔥 Splash */}
      {isSplashVisible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              opacity: splashOpacity,
              zIndex: 999,
            },
          ]}
        >
          <CustomSplashScreen
            onFinish={() => {
              // 1️⃣ Splash Fade Out
              Animated.timing(splashOpacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }).start(() => {
                setSplashVisible(false);

                // 2️⃣ App Slide Up Animation 🔥
                setTimeout(() => {
                  Animated.parallel([
                    Animated.timing(appOpacity, {
                      toValue: 1,
                      duration: 500,
                      easing: Easing.out(Easing.exp),
                      useNativeDriver: true,
                    }),
                    Animated.timing(appTranslateY, {
                      toValue: 0,
                      duration: 500,
                      easing: Easing.out(Easing.exp),
                      useNativeDriver: true,
                    }),
                  ]).start();
                }, 100);
              });
            }}
          />
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
});

export default App;
 