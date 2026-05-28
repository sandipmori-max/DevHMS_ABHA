// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Animated,
//   useWindowDimensions,
// } from "react-native";
// import {
//   DrawerContentComponentProps,
//   DrawerContentScrollView,
//   useDrawerStatus,
// } from "@react-navigation/drawer";
// import { useNavigation, useNavigationState } from "@react-navigation/native";
// import MaterialIcons from "@react-native-vector-icons/material-icons";
// import FastImage from "react-native-fast-image";

// import { useAppSelector } from "../../store/hooks";
// import {
//   firstLetterUpperCase,
//   handleEmailPress,
//   handlePhonePress,
// } from "../../utils/helpers";
// import { ERP_DRAWER_LIST } from "../../constants";
// import { styles } from "./drawer_style";
// import { useBaseLink } from "../../hooks/useBaseLink";
// import { DARK_COLOR, ERP_COLOR_CODE } from "../../utils/constants";
// import ContactRow from "./ContactRow";
// import ImageBottomSheetModal from "../bottomsheet/ImageBottomSheetModal";
// import { useTranslation } from "react-i18next";
// import TranslatedText from "../../screens/dashboard/tabs/home/TranslatedText";
// import InAppReview from "react-native-in-app-review";
// import AboutBottomSheet from "./AboutBottomSheet";
// import { ERP_ICON } from "../../assets";

// const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
//   const navigation = useNavigation();
//   const [showAbout, setShowAbout] = useState(false);
//   const { t } = useTranslation();
//   const drawerStatus = useDrawerStatus();
//   const [showModal, setShowModal] = useState(false);
//   const [img, setImg] = useState("");
//   const { height, width } = useWindowDimensions();
//   const isLandscape = width > height;
//   const { user } = useAppSelector((state) => state.auth);
//   const theme = useAppSelector((state) => state.theme.mode);
//   const baseLink = useBaseLink();
//   /*  = SAFE CURRENT ROUTE  = */
//   const currentRoute = useNavigationState((state) => {
//     const route = state.routes[state.index];
//     return route?.name;
//   });

//   /*  = ANIMATION VALUES  = */
//   const menuAnim = useRef(
//     ERP_DRAWER_LIST.map(() => new Animated.Value(-40)),
//   ).current;

//   const footerTranslateY = useRef(new Animated.Value(40)).current;
//   const footerOpacity = useRef(new Animated.Value(0)).current;

//   /*  = HEADER ANIMATION  = */
//   const headerTranslateY = useRef(new Animated.Value(-60)).current;
//   const headerOpacity = useRef(new Animated.Value(0)).current;

//   /*  = RUN ON EVERY DRAWER OPEN  = */
//   useEffect(() => {
//     if (drawerStatus !== "open") return;

//     // reset menu items
//     menuAnim.forEach((anim) => anim.setValue(-40));

//     // reset footer
//     footerTranslateY.setValue(40);
//     footerOpacity.setValue(0);

//     // reset header
//     headerTranslateY.setValue(-60);
//     headerOpacity.setValue(0);

//     // header animation (top → down)
//     Animated.parallel([
//       Animated.timing(headerTranslateY, {
//         toValue: 0,
//         duration: 700,
//         useNativeDriver: true,
//       }),
//       Animated.timing(headerOpacity, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // menu animation (left → right)
//     Animated.stagger(
//       70,
//       menuAnim.map((anim) =>
//         Animated.timing(anim, {
//           toValue: 0,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//       ),
//     ).start();

//     // footer animation (bottom → up)
//     Animated.parallel([
//       Animated.timing(footerTranslateY, {
//         toValue: 0,
//         duration: 850,
//         useNativeDriver: true,
//       }),
//       Animated.timing(footerOpacity, {
//         toValue: 1,
//         duration: 350,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, [drawerStatus]);
//   const [imageExists, setImageExists] = useState(true);

//   const handleReview = async () => {
//     try {
//       if (InAppReview.isAvailable()) {
//         await InAppReview.RequestInAppReview();
//       } else {
//         console.log("Not supported");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <DrawerContentScrollView
//       showsVerticalScrollIndicator={false}
//       {...props}
//       contentContainerStyle={{
//         flexGrow: 1,
//         backgroundColor: theme === "dark" ? DARK_COLOR : "white",
//       }}
//     >
//       {/*  = HEADER  = */}
//       <Animated.View
//         style={{
//           minWidth: "100%",
//           transform: [{ translateY: headerTranslateY }],
//           opacity: headerOpacity,
//         }}
//       >
//         <View
//           style={[
//             styles.header,
//             theme === "dark" && { backgroundColor: "black" },
//           ]}
//         >
//           <View>
//             <TouchableOpacity
//               onPress={() => {
//                 if (!imageExists) {
//                   return;
//                 }
//                 setImg(
//                   `${baseLink}/FileUpload/1/UserMaster/${
//                     user?.id
//                   }/profileimage.jpeg?ts=${new Date().getTime()}`,
//                 );
//                 setShowModal(true);
//               }}
//             >
//               <FastImage
//                 source={{
//                   uri: `${baseLink}/FileUpload/1/UserMaster/${
//                     user?.id
//                   }/profileimage.jpeg?ts=${new Date().getTime()}`,
//                   priority: FastImage.priority.normal,
//                   cache: FastImage.cacheControl.web,
//                 }}
//                 style={styles.profileImage}
//                 onLoad={() => {
//                   setImageExists(true);
//                 }}
//                 onError={() => {
//                   setImageExists(false);
//                 }}
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={{ height: 28, width: 100 }} />

//           <TranslatedText
//             text={firstLetterUpperCase(user?.name || "")}
//             numberOfLines={1}
//             style={[styles.username, { top: 8, color: "#FFF" }]}
//           ></TranslatedText>

//           <View style={{ height: 8, width: 100 }} />

//           <View style={{ top: 4, width: "100%", marginVertical: 1 }}>
//             {user?.mobileno && (
//               <TouchableOpacity
//                 onPress={() => {
//                   handlePhonePress(user?.mobileno);
//                 }}
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   padding: 6,
//                 }}
//               >
//                 <MaterialIcons name="call" color="white" size={14} />
//                 <TranslatedText
//                   text={user?.mobileno}
//                   numberOfLines={1}
//                   style={styles.userPhone}
//                 ></TranslatedText>
//               </TouchableOpacity>
//             )}

//             {user?.emailid && (
//               <TouchableOpacity
//                 onPress={() => {
//                   handleEmailPress(user?.emailid);
//                 }}
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   padding: 6,
//                 }}
//               >
//                 <MaterialIcons name="mail-outline" color="white" size={14} />
//                 <TranslatedText
//                   text={user?.emailid}
//                   numberOfLines={1}
//                   style={styles.userPhone}
//                 ></TranslatedText>
//               </TouchableOpacity>
//             )}

//             {user?.rolename && (
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   padding: 6,
//                 }}
//               >
//                 <MaterialIcons name="person" color="white" size={14} />
//                 <TranslatedText
//                   numberOfLines={1}
//                   text={user?.rolename}
//                   style={styles.userPhone}
//                 ></TranslatedText>
//               </View>
//             )}
//           </View>
//         </View>
//       </Animated.View>

//       {/*  = MENU  = */}

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View
//           style={[
//             !isLandscape && styles.menuContainer,
//             {
//               marginTop: isLandscape ? 45 : 5,
//             },
//           ]}
//         >
//           {ERP_DRAWER_LIST.map((item, index) => {
//             const isActive = currentRoute === item.route;

//             return (
//               <Animated.View
//                 key={item.route}
//                 style={{ transform: [{ translateX: menuAnim[index] }] }}
//               >
//                 <TouchableOpacity
//                   style={[
//                     styles.drawerItem,
//                     isActive && styles.activeItemBackground,
//                     isActive &&
//                       theme === "dark" && { backgroundColor: "black" },
//                   ]}
//                   onPress={() => {
//                     if (item?.route === "AboutUs") {
//                       setShowAbout(true);
//                       return;
//                     }
//                     if (item?.route === "AppRatting") {
//                       handleReview();
//                       return;
//                     }
//                     if (item?.route === "Alert") {
//                       props?.navigation.navigate("List", {
//                         item: {
//                           title: "Notification",
//                           name: "Notification",
//                           url: "DEVNOTIFY",
//                           isFromBusinessCard: false,
//                           isFromAlertCard: true,
//                           id: "0",
//                         },
//                       });
//                       props?.navigation.closeDrawer();
//                       return;
//                     }
//                     if (item?.route === "List") {
//                       props?.navigation.navigate("List", {
//                         item: {
//                           title: "Business Card",
//                           name: "Business Card",
//                           url: "BusinessCardMst",
//                           isFromBusinessCard: true,
//                           id: "0",
//                         },
//                       });
//                       props?.navigation.closeDrawer();
//                       return;
//                     }
//                     if (item?.route === "Attendance") {
//                       // NativeModules.OrientationModule.enableLandscape();
//                       props?.navigation.closeDrawer();
//                       navigation.navigate(item?.route, { isFor: "Attendance" });
//                       return;
//                     }
//                     if (item?.route === "MyAttendance") {
//                       props?.navigation.closeDrawer();
//                       navigation.navigate(item?.route, {
//                         isFor: "MyAttendance",
//                       });
//                       return;
//                     }
//                     if (item?.route === "Home") {
//                       props?.navigation.navigate("Home", { screen: "Home" });
//                       props?.navigation.closeDrawer();
//                       return;
//                     } else {
//                       props?.navigation.closeDrawer();
//                       navigation.navigate(item?.route as never);
//                     }
//                   }}
//                 >
//                   <View style={styles.itemRow}>
//                     <MaterialIcons
//                       name={item.icon}
//                       size={20}
//                       color={
//                         theme === "dark"
//                           ? "#FFF"
//                           : isActive
//                           ? "#FFF"
//                           : ERP_COLOR_CODE.ERP_APP_COLOR
//                       }
//                     />
//                     <TranslatedText
//                       style={[
//                         styles.itemLabel,
//                         isActive && styles.activeText,
//                         {
//                           color:
//                             theme === "dark"
//                               ? "white"
//                               : isActive
//                               ? "#FFF"
//                               : "#000",
//                         },
//                       ]}
//                       numberOfLines={1}
//                       text={item.label}
//                     ></TranslatedText>
//                   </View>
//                 </TouchableOpacity>
//               </Animated.View>
//             );
//           })}
//         </View>
//       </ScrollView>

//       <ImageBottomSheetModal
//         visible={showModal}
//         onClose={() => setShowModal(false)}
//         imageUrl={img}
//       />

//       <AboutBottomSheet
//         visible={showAbout}
//         onClose={() => setShowAbout(false)}
//       />

//       {/*  = FOOTER  = */}
//       <Animated.View
//         style={{
//           transform: [{ translateY: footerTranslateY }],
//           opacity: footerOpacity,
//         }}
//       >
//         <View style={{ alignItems: "center", marginBottom: 0 }}>
//           <Image
//             source={{
//               uri: `${baseLink}fileupload/1/InvoiceByConfig/1/logo.jpg`,
//             }}
//             style={{ height: 80, width: 80 }}
//             resizeMode="contain"
//           />
//         </View>

//         <View style={styles.logoutButton}>
//           <Text
//             style={[
//               styles.logoutText,
//               {
//                 fontSize: 12,
//                 color: ERP_COLOR_CODE.ERP_777,
//               },
//               theme === "dark" && { color: "white" },
//             ]}
//           >
//             {t("test24")}
//           </Text>
//           <View style={{ flexDirection: "row" }}>
//             <Image
//               source={ERP_ICON.APP_LOGO}
//               style={{
//                 height: 20,
//                 width: 20,
//               }}
//               resizeMode="contain"
//             />
//             <Text
//               style={[
//                 styles.logoutText,
//                 theme === "dark" && { color: "white" },
//                 {
//                   marginLeft: 8
//                 }
//               ]}
//             >
//               (c) DevERP Solutions Pvt. Ltd.
//             </Text>
//           </View>

//           {/* <ContactRow /> */}
//         </View>
//       </Animated.View>
//     </DrawerContentScrollView>
//   );
// };

// export default CustomDrawerContent;

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  useWindowDimensions,
  Platform,
} from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import FastImage from "react-native-fast-image";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  firstLetterUpperCase,
  handleEmailPress,
  handlePhonePress,
} from "../../utils/helpers";
import { ERP_DRAWER_LIST } from "../../constants";
import { styles } from "./drawer_style";
import { useBaseLink } from "../../hooks/useBaseLink";
import { ERP_COLOR_CODE } from "../../utils/constants";
import ImageBottomSheetModal from "../bottomsheet/ImageBottomSheetModal";
import { useTranslation } from "react-i18next";
import TranslatedText from "../../screens/dashboard/tabs/home/TranslatedText";
import InAppReview from "react-native-in-app-review";
import AboutBottomSheet from "./AboutBottomSheet";
import { ERP_ICON } from "../../assets";
import { getERPConfigDataThunk } from "../../store/slices/auth/thunk";

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const navigation = useNavigation();
  const [showAbout, setShowAbout] = useState(false);
  const { t } = useTranslation();
  const drawerStatus = useDrawerStatus();
  const [showModal, setShowModal] = useState(false);
  const [img, setImg] = useState("");
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const { user } = useAppSelector((state) => state.auth);
  const theme = useAppSelector((state) => state.theme.mode);
  const baseLink = useBaseLink();
  const { appDrawerMenuList } = useAppSelector((state) => state?.auth);
  const dispatch = useAppDispatch();

  /* ================= SAFE CURRENT ROUTE ================= */
  const currentRoute = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route?.name;
  });
  const menuAnimRef = useRef<Animated.Value[]>([]);

  /* ================= ANIMATION VALUES ================= */
  const list =
    appDrawerMenuList.length > 0 ? appDrawerMenuList : ERP_DRAWER_LIST;

  useEffect(() => {
    // recreate animation array whenever list changes
    menuAnimRef.current = list.map(() => new Animated.Value(-40));
  }, [list]);

  const menuAnim = menuAnimRef.current;

  const footerTranslateY = useRef(new Animated.Value(40)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  /* ================= HEADER ANIMATION ================= */
  const headerTranslateY = useRef(new Animated.Value(-60)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  /* ================= RUN ON EVERY DRAWER OPEN ================= */
  useEffect(() => {
    if (drawerStatus !== "open") return;
    // reset menu items
    menuAnim.forEach((anim) => anim.setValue(-40));

    // reset footer
    footerTranslateY.setValue(40);
    footerOpacity.setValue(0);

    // reset header
    headerTranslateY.setValue(-60);
    headerOpacity.setValue(0);

    // header animation (top → down)
    Animated.parallel([
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // menu animation (left → right)
    Animated.stagger(
      70,
      menuAnim.map((anim) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ),
    ).start();

    // footer animation (bottom → up)
    Animated.parallel([
      Animated.timing(footerTranslateY, {
        toValue: 0,
        duration: 850,
        useNativeDriver: true,
      }),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [drawerStatus]);
  const [imageExists, setImageExists] = useState(true);

  const handleReview = async () => {
    try {
      if (InAppReview.isAvailable()) {
        await InAppReview.RequestInAppReview();
      } else {
        console.log("Not supported");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGreetingMeta = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return {
        text: "Good Morning",
        icon: "wb-sunny",
        color: "#FFA726",
      };
    }

    if (hour < 17) {
      return {
        text: "Good Afternoon",
        icon: "light-mode",
        color: "#29B6F6",
      };
    }

    return {
      text: "Good Evening",
      icon: "nights-stay",
      color: "#9575CD",
    };
  };

  const greetingMeta = useMemo(() => getGreetingMeta(), []);
  const extractConfig = (raw: any) => {
    try {
      const parsedRaw = typeof raw === "string" ? JSON.parse(raw) : raw;

      let msg = parsedRaw?.data?.message;
      if (!msg) return null;

      // remove outer quotes + last }
      msg = msg.replace(/^"+|"+$/g, "").replace(/}$/, "");

      const obj: any = {};

      msg.split(",").forEach((pair) => {
        let [key, value] = pair.split(":");

        if (!key || !value) return;

        // clean key
        key = key.replace(/"/g, "").trim();

        // clean value
        value = value.trim();

        // number detect
        if (!isNaN(Number(value))) {
          obj[key] = Number(value);
        } else {
          obj[key] = value.replace(/"/g, "").trim();
        }
      });

      return obj;
    } catch (e) {
      console.log("Parse Failed:", e);
      return null;
    }
  };

  return (
    <DrawerContentScrollView
      showsVerticalScrollIndicator={false}
      {...props}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: theme === "dark" ? "black" : "white",
      }}
    >
      {/* ================= HEADER ================= */}
      <Animated.View
        style={{
          minWidth: "100%",
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
        }}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
            },
            theme === "dark" && {
              backgroundColor: "#000",
              borderWidth: 1,
              borderColor: "#fff",
            },
          ]}
        >
          <View>
            <TouchableOpacity
              onPress={() => {
                if (!imageExists) {
                  return;
                }
                setImg(
                  `${baseLink}/FileUpload/1/UserMaster/${
                    user?.id
                  }/profileimage.jpeg?ts=${new Date().getTime()}`,
                );
                setShowModal(true);
              }}
            >
              <FastImage
                source={{
                  uri: `${baseLink}/FileUpload/1/UserMaster/${
                    user?.id
                  }/profileimage.jpeg?ts=${new Date().getTime()}`,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.web,
                }}
                style={[
                  styles.profileImage,
                  {
                    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                  },
                ]}
                onLoad={() => {
                  setImageExists(true);
                }}
                onError={() => {
                  setImageExists(false);
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ height: 28, width: 100 }} />

          <TranslatedText
            text={firstLetterUpperCase(user?.name || "")}
            numberOfLines={1}
            style={[styles.username, { top: 8, color: "#FFF" }]}
          ></TranslatedText>

          <View style={{ height: 8, width: 100 }} />

          <View style={{ top: 4, width: "100%", marginVertical: 1 }}>
            {user?.mobileno && (
              <TouchableOpacity
                onPress={() => {
                  // handlePhonePress(user?.mobileno);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: Platform.OS === 'android' ? 4 : 6,
                }}
              >
                <MaterialIcons name="call" color="white" size={14} />
                <TranslatedText
                  text={user?.mobileno}
                  numberOfLines={1}
                  style={styles.userPhone}
                ></TranslatedText>
              </TouchableOpacity>
            )}

            {user?.emailid && (
              <TouchableOpacity
                onPress={() => {
                  // handleEmailPress(user?.emailid);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: Platform.OS === 'android' ? 4 : 6,
                }}
              >
                <MaterialIcons name="mail-outline" color="white" size={14} />
                <TranslatedText
                  text={user?.emailid}
                  numberOfLines={1}
                  style={styles.userPhone}
                ></TranslatedText>
              </TouchableOpacity>
            )}

            {user?.rolename && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: Platform.OS === 'android' ? 4 : 6,
                }}
              >
                <MaterialIcons name="person" color="white" size={14} />
                <TranslatedText
                  numberOfLines={1}
                  text={user?.rolename}
                  style={styles.userPhone}
                ></TranslatedText>
              </View>
            )}
          </View>
        </View>
      </Animated.View>

      {/* ================= MENU ================= */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            !isLandscape && styles.menuContainer,
            {
              marginTop: isLandscape ? 45 : 5,
            },
          ]}
        >
          <View
            style={{
              paddingHorizontal: 4,
              backgroundColor: theme === "dark" ? "black" : "white",
              marginBottom: 4,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: Platform.OS === 'android' ? 8 : 10,
                paddingHorizontal: Platform.OS === 'android' ? 10 : 14,
                borderRadius: 12,
                alignSelf: "flex-start",
              }}
            >
              <MaterialIcons
                name={greetingMeta.icon}
                size={22}
                color={greetingMeta.color}
                style={{ marginRight: 8 }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  letterSpacing: 0.3,
                  color: theme === "dark" ? "white" : "black",
                }}
              >
                {greetingMeta.text}
              </Text>
            </View>
          </View>

          {appDrawerMenuList.length > 0 &&
            appDrawerMenuList.map((item, index) => {
              const isActive = currentRoute === item.name;
              return (
                <Animated.View
                  key={item.name}
                  style={{
                    transform: [
                      { translateX: menuAnim[index] || new Animated.Value(0) },
                    ],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      isActive && styles.activeItemBackground,
                      isActive && {
                        backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                      },
                      isActive &&
                        theme === "dark" && { backgroundColor: "gray" },
                    ]}
                    onPress={async () => {
                      console.log("Drawer Item Pressed:", item);
                      if (item?.link === "AboutUs") {
                        setShowAbout(true);
                        return;
                      }
                      if (item?.link === "AppRatting") {
                        handleReview();
                        return;
                      }
                      ////// APP LIST NAVIGATE -------
                      if (item?.name === "Attendance") {
                        props?.navigation.closeDrawer();
                        navigation.navigate(item?.name, {
                          isFor: "Attendance",
                        });
                        return;
                      }
                      if (item?.name === "My Attendance") {
                        props?.navigation.closeDrawer();
                        navigation.navigate("MyAttendance", {
                          isFor: "MyAttendance",
                        });
                        return;
                      }

                      // isAppLink  + title  + url + isFromBusinessCard + isFromAlertCard
                      if (
                        item?.isapplink === "true" ||
                        item?.isapplink === true ||
                        item?.isapplink === "True"
                      ) {
                        let raw = null;
                        try {
                          raw = await dispatch(
                            getERPConfigDataThunk({
                              page: item?.url,
                            }),
                          ).unwrap();

                          console.log(
                            "++++++++++++++++++++++++++++++++++++++raw",
                            raw,
                          );
                        } catch (error) {
                          console.log(
                            "++++++++++++++++++++++++++++++++++++++error",
                            error,
                          );
                        }

                        const parsedConfig = extractConfig(raw);

                        props?.navigation.navigate("List", {
                          item: {
                            title: item?.name,
                            name: item?.name,
                            url: item?.link,
                            isFromBusinessCard:
                              item?.isfrombusinesscard === "True"
                                ? true
                                : false,
                            isFromAlertCard:
                              item?.isfromalertcard === "True" ? true : false,
                            id: "0",
                          },
                          parsedConfig,
                        });
                        props?.navigation.closeDrawer();
                        return;
                      }

                      if (item?.link === "home") {
                        props?.navigation.navigate("Home", { screen: "Home" });
                        props?.navigation.closeDrawer();
                        return;
                      } else {
                        props?.navigation.closeDrawer();
                        navigation.navigate(item?.name as never);
                      }
                    }}
                  >
                    <View style={styles.itemRow}>
                      <MaterialIcons
                        name={item.iconname.toLowerCase().trim()}
                        size={20}
                        color={
                          theme === "dark"
                            ? isActive
                              ? "white"
                              : "gray"
                            : isActive
                            ? "#FFF"
                            : "gray"
                        }
                      />
                      <TranslatedText
                        style={[
                          styles.itemLabel,
                          isActive && styles.activeText,
                          {
                            color:
                              theme === "dark"
                                ? isActive
                                  ? "white"
                                  : "gray"
                                : isActive
                                ? "#FFF"
                                : "#000",
                          },
                        ]}
                        numberOfLines={1}
                        text={item.name}
                      ></TranslatedText>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
        </View>
      </ScrollView>

      <ImageBottomSheetModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        imageUrl={img}
      />

      <AboutBottomSheet
        visible={showAbout}
        onClose={() => setShowAbout(false)}
      />

      {/* ================= FOOTER ================= */}
      <Animated.View
        style={{
          transform: [{ translateY: footerTranslateY }],
          opacity: footerOpacity,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Image
            source={{
              uri: `${baseLink}fileupload/1/InvoiceByConfig/1/logo.jpg`,
            }}
            style={{ height: 60, width: 60 }}
            resizeMode="contain"
          />
        </View>

        <View
          style={[
            styles.logoutButton,
            {
              borderColor:
                theme === "dark" ? "gray" : ERP_COLOR_CODE.ERP_APP_COLOR,
            },
          ]}
        >
          <Text
            style={[
              styles.logoutText,
              {
                fontSize: 12,
                color: ERP_COLOR_CODE.ERP_777,
              },
              theme === "dark" && { color: "gray" },
            ]}
          >
            {t("test24")}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={ERP_ICON.DEV_APP_LOGO}
              style={{
                height: 20,
                width: 20,
              }}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.logoutText,
                {
                  color: ERP_COLOR_CODE.ERP_APP_COLOR,
                },
                theme === "dark" && { color: "gray" },
                {
                  marginLeft: 8,
                },
              ]}
            >
              (c) DevERP Solutions Pvt. Ltd.
            </Text>
          </View>

          {/* <ContactRow /> */}
        </View>
      </Animated.View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
