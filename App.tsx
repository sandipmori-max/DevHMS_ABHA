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
  ActivityIndicator,
  Text,
  Image,
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
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
import GlobalLoader from "./GlobalLoader";
import Toast from 'react-native-toast-message';
import { toastConfig } from "./ToastConfig";
import { getGetAuthPayload, useGetAuthMutation } from "./src/abha/redux/api/getAuth";
import { useCreateSessionMutation } from "./src/abha/redux/api/sessionApi";
import { hideLoader, showLoader } from "./src/abha/redux/slices/loaderSlice";

const App = () => {
  return (
    <Provider store={store}>
      <TranslationProvider>
        <AppContent />
        {/* {
          Platform.OS === 'android' && <ExitBottomSheet />
        } */}
        <GlobalLoader />
        <Toast config={toastConfig} topOffset={Platform.OS === 'ios' ? 70 : 80} />
      </TranslationProvider>
    </Provider>
  );
};

const AppContent = () => {
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const appOpacity = useRef(new Animated.Value(0)).current;
  const appTranslateY = useRef(new Animated.Value(120)).current;
  const dispatch = useDispatch();
  const proReduxData = useSelector(
    (state: any) => state.abha.activeUser
  );
  const appId = useSelector(
    (state: any) => state.auth.appId
  );
  const deviceName = useSelector(
    (state: any) => state.auth.deviceName
  );
  const [getAuth] = useGetAuthMutation();
  const [ready, setReady] = useState(false);

  const [
    createSession
  ] = useCreateSessionMutation();



  const { width } = useWindowDimensions();

  const isConnected = useNetworkStatus();

  const theme = useAppSelector((state) => state?.theme?.mode);
  const user = useAppSelector((state) => state?.auth);

  const [statusBarColor, setStatusBarColor] = useState(theme === "dark" ? "#000000" : ERP_COLOR_CODE.ERP_APP_COLOR)

  const [isSplashVisible, setSplashVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);

  const barStyle = "light-content";

  const isTv = Platform.isTV;
  // 🔹 Clear temp files
  useEffect(() => {
    clearAllTempFiles();
  }, []);

  useEffect(() => {
    setStatusBarColor(theme === "dark" ? "#000000" : ERP_COLOR_CODE.ERP_APP_COLOR)
  }, [user])

  const handleSession = async () => {
    try {
      const response =
        await createSession()
          .unwrap();
      console.log(
        "Session Response+++++++++++++++",
        response
      );
    } catch (err) {
      console.log(
        "Session Error+++++++++++",
        err
      );
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        dispatch(showLoader());

        await handleSession();
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(hideLoader());
      }
    };

    init();
  }, []);


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
      await requestUserPermission();

      // KILLED STATE
      const initialNotification =
        await notifee?.getInitialNotification();

      if (initialNotification) {
        console.log(
          'APP OPENED FROM KILLED NOTIFICATION',
          initialNotification?.notification?.data,
        );

        const screen =
          initialNotification?.notification?.data?.screen;

        if (screen) {
          navigate(
            screen,
            initialNotification?.notification?.data,
          );
        }
      } else {
        console.log('NORMAL APP LAUNCH');
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 300); // 300–500ms

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!proReduxData) return;
    if (!appId || !deviceName) return;

    const fetchAuth = async () => {
      try {
        const response = await getAuth(
          getGetAuthPayload(appId, deviceName)
        ).unwrap();

        console.log("Auth + + + + + + + + + + + + + + + + + +  Response =>", response);
      } catch (error) {
        console.log("Auth Error =>", error);
      }
    };

    fetchAuth();
  }, [appId, deviceName]);

   

  // 🔥 Loader
  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1 }}>
  //       <FullViewLoader />
  //     </View>
  //   );
  // }

  // 🔥 Terms
  // if (!accepted && !isTv) {
  //   return <TermsAndConsent onAccept={handleAccept} />;
  // }

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
            backgroundColor: theme === 'dark' ? 'black' : 'white'
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
          <NoInternetScreen onRetry={() => { }} />
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


// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Linking,
// } from 'react-native';

// import Share from 'react-native-share';
// import RNFS from 'react-native-fs';

// const App = () => {
//   // Share text to specific WhatsApp number
//   const shareTextToWhatsApp = async () => {
//     try {
//       const phone = '918154877969';
//       const text = encodeURIComponent(
//         'Hello Sandip,\n\nThis is test message.',
//       );

//       await Linking.openURL(
//         `https://wa.me/${phone}?text=${text}`,
//       );
//     } catch (e: any) {
//       Alert.alert('Error', e?.message || JSON.stringify(e));
//     }
//   };

//   // Download PDF
//   const downloadPdf = async () => {
//     const pdfUrl = 'https://pdfobject.com/pdf/sample.pdf';

//     const localFile =
//       `${RNFS.CachesDirectoryPath}/sample.pdf`;

//     try {
//       if (await RNFS.exists(localFile)) {
//         await RNFS.unlink(localFile);
//       }

//       const result = await RNFS.downloadFile({
//         fromUrl: pdfUrl,
//         toFile: localFile,
//       }).promise;

//       if (result.statusCode !== 200) {
//         throw new Error(
//           `Download failed : ${result.statusCode}`,
//         );
//       }

//       const exists = await RNFS.exists(localFile);

//       if (!exists) {
//         throw new Error('PDF not found');
//       }

//       return localFile;
//     } catch (e) {
//       throw e;
//     }
//   };

//   // Native Share Dialog
//   const openShareDialog = async () => {
//     try {
//       await Share.open({
//         message: 'Hello from React Native',
//         failOnCancel: false,
//       });
//     } catch (e: any) {
//       Alert.alert(
//         'Share Error',
//         e?.message || JSON.stringify(e),
//       );
//     }
//   };

//   // PDF Share Dialog
//   const sharePdf = async () => {
//     try {
//       const file = await downloadPdf();

//       await Share.open({
//         title: 'Share PDF',
//         url: `file://${file}`,
//         type: 'application/pdf',
//         filename: 'sample.pdf',
//         failOnCancel: false,
//       });

//       Alert.alert('Success');
//     } catch (e: any) {
//       console.log(e);

//       Alert.alert(
//         'PDF Error',
//         JSON.stringify(
//           {
//             code: e?.code,
//             message: e?.message,
//             error: e,
//           },
//           null,
//           2,
//         ),
//       );
//     }
//   };

//   // WhatsApp PDF
//   const sharePdfOnWhatsApp = async () => {
//     try {
//       const file = await downloadPdf();

//       await Share.shareSingle({
//         social: Share.Social.WHATSAPP,
//         url: `file://${file}`,
//         type: 'application/pdf',
//         filename: 'sample.pdf',
//         failOnCancel: false,
//       });

//       Alert.alert('WhatsApp Opened');
//     } catch (e: any) {
//       console.log(e);

//       Alert.alert(
//         'WhatsApp Error',
//         JSON.stringify(
//           {
//             code: e?.code,
//             message: e?.message,
//             error: e,
//           },
//           null,
//           2,
//         ),
//       );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={shareTextToWhatsApp}>
//         <Text style={styles.text}>
//           Share Text
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={sharePdf}>
//         <Text style={styles.text}>
//           Share PDF
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={openShareDialog}>
//         <Text style={styles.text}>
//           Share Dialog
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={sharePdfOnWhatsApp}>
//         <Text style={styles.text}>
//           WhatsApp PDF
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   button: {
//     backgroundColor: '#0066cc',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 15,
//     alignItems: 'center',
//   },
//   text: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });