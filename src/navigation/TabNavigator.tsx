import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {  ERP_COLOR_CODE } from "../utils/constants";
import MenuTab from "../screens/dashboard/tabs/MenuTab/MenuTab";
import HomeScreen from "../screens/dashboard/tabs/home/HomeTab";
import ProfileTab from "../screens/dashboard/tabs/profile/ProfileTab";
import useTranslations from "../hooks/useTranslations";
import { useAppSelector } from "../store/hooks";
import AnimatedTabIcon from "../components/tab_icon/AnimatedTabIcon";
import { Platform, useWindowDimensions } from "react-native";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {

  const theme = useAppSelector((state) => state.theme.mode);
  const { t } = useTranslations();
  const { appBottomMenuList } = useAppSelector((state) => state?.auth);

  const [hidden, setHidden] = useState(false);
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;

  const navigationItems = (appBottomMenuList || []).map((item) => ({
    name: item?.name,
    type: item?.type,
    icon: item?.icon,
    label: item?.name,
    search: item?.name,
  }));

  const tabConfig = [
    {
      name: t("navigation.home"),
      component: HomeScreen,
      icon: "home",
      label: t("navigation.home"),
    },
    {
      name: t("navigation.entry"),
      type: "E",
      icon: "entry",
      label: t("navigation.entry"),
      search: t("navigation.search_entry"),
    },
    {
      name: t("navigation.report"),
      type: "R",
      icon: "report",
      label: t("navigation.report"),
      search: t("navigation.search_report"),
    },
    {
      name: t("navigation.auth"),
      type: "A",
      icon: "auth",
      label: t("navigation.auth"),
      search: t("navigation.search_auth"),
    },
    {
      name: t("navigation.profile"),
      component: ProfileTab,
      icon: "profile",
      label: t("navigation.profile"),
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "left",
        tabBarActiveTintColor:
          theme === "dark" ? "white" : ERP_COLOR_CODE.ERP_APP_COLOR,
        tabBarInactiveTintColor:
          theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_APP_COLOR,
        tabBarStyle: {
          display: hidden ? "none" : "flex",
          backgroundColor:
            theme === "dark" ? ERP_COLOR_CODE.ERP_APP_COLOR : ERP_COLOR_CODE.ERP_WHITE,
          height: Platform.OS === 'ios' ? 65 : 80,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor:  ERP_COLOR_CODE.ERP_APP_COLOR,
        },
        headerTintColor: "white",

      }}
    >
      {tabConfig.map((tab, index) => (
        <Tab.Screen
          key={index}
          name={tab.name}
          children={
            tab.component
              ? () => <tab.component hideTab={hidden} setHideTab={setHidden} />
              : () => (
                  <MenuTab
                    hideTab={hidden}
                    setHideTab={setHidden}
                    type={tab.type}
                    headerText={tab.label}
                    searchPlaceholder={tab.search}
                  />
                )
          }
          options={{
            tabBarLabel: tab.label,
            title: tab.label,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "500",
              marginTop: 8,
            },
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon
                name={tab.icon}
                color={color}
                size={size}
                focused={focused}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabNavigator;

// import React, { useState } from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { DARK_COLOR, ERP_COLOR_CODE } from "../utils/constants";
// import MenuTab from "../screens/dashboard/tabs/MenuTab/MenuTab";
// import HomeScreen from "../screens/dashboard/tabs/home/HomeTab";
// import ProfileTab from "../screens/dashboard/tabs/profile/ProfileTab";
// import { useAppSelector } from "../store/hooks";
// import AnimatedTabIcon from "../components/tab_icon/AnimatedTabIcon";
// import { Platform } from "react-native";
// import useTranslations from "../hooks/useTranslations";

// const Tab = createBottomTabNavigator();

// const TabNavigator = () => {
//   const theme = useAppSelector((state) => state.theme.mode);
//   const { appBottomMenuList } = useAppSelector((state) => state?.auth);
//   const { t } = useTranslations();
//   const [hidden, setHidden] = useState(false);

//   console.log("Bottom Menu List:", appBottomMenuList);
//   const navigationItems = (appBottomMenuList || []).map((item) => ({
//     name: item?.name,
//     type: item?.code,
//     icon: item?.iconname?.toLowerCase(),
//     label: item?.name,
//   }));

//   const getComponent = (item) => {
//     if (item.name === "Home") return HomeScreen;
//     if (item.name === "Profile") return ProfileTab;
//     return null;
//   };

//   const tabConfig = [
//     {
//       name: t("navigation.home"),
//       component: HomeScreen,
//       icon: "home",
//       label: t("navigation.home"),
//     },

//     {
//       name: t("navigation.profile"),
//       component: ProfileTab,
//       icon: "person",
//       label: t("navigation.profile"),
//     },
//   ];

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: true,
//         headerTitleAlign: "left",
        
//         tabBarActiveTintColor:
//           theme === "dark" ? "white" : ERP_COLOR_CODE.ERP_APP_COLOR,
//         tabBarInactiveTintColor:
//           theme === "dark" ? "black" : 'gray',
//         tabBarStyle: {
//           display: hidden ? "none" : "flex",
//           backgroundColor:
//             theme === "dark" ? DARK_COLOR : ERP_COLOR_CODE.ERP_WHITE,
//           height: Platform.OS === "ios" ? 60 : 70,
//           paddingBottom: 5,
//           paddingTop: 5,
//         },
//         headerStyle: {
//           backgroundColor:
//             theme === "dark" ? DARK_COLOR : ERP_COLOR_CODE.ERP_APP_COLOR,
//         },
//         headerTintColor: "white", 
//       }}
//     >
//       {navigationItems.length > 0 &&
//         navigationItems.map((item, index) => {
//           const Component = getComponent(item);

//           return (
//             <Tab.Screen
//               key={index}
//               name={item.name}
//               children={
//                 Component
//                   ? () => <Component hideTab={hidden} setHideTab={setHidden} />
//                   : () => (
//                       <MenuTab
//                         hideTab={hidden}
//                         setHideTab={setHidden}
//                         type={item.type}
//                         headerText={item.label}
//                         searchPlaceholder={`Search ${item.label}`}
//                       />
//                     )
//               }
//               options={{
//                 tabBarLabel: item.label,
//                 title: item.label,
//                 tabBarLabelStyle: {
//                   fontSize: 12,
//                   fontWeight: "500",
//                   marginTop: 8,
//                 },
//                 tabBarIcon: ({ color, size, focused }) => (
//                   <AnimatedTabIcon
//                     name={item.icon}
//                     color={color}
//                     size={size}
//                     focused={focused}
//                   />
//                 ),
//               }}
//             />
//           );
//         })}
//       {navigationItems.length === 0 &&
//         tabConfig.map((item, index) => {
//           const Component = getComponent(item);

//           return (
//             <Tab.Screen
//               key={index}
//               name={item.name}
//               children={
//                 Component
//                   ? () => <Component hideTab={hidden} setHideTab={setHidden} />
//                   : () => (
//                       <MenuTab
//                         hideTab={hidden}
//                         setHideTab={setHidden}
//                         type={item.type}
//                         headerText={item.label}
//                         searchPlaceholder={`Search ${item.label}`}
//                       />
//                     )
//               }
//               options={{
//                 tabBarLabel: item.label,
//                 title: item.label,
                
//                 tabBarLabelStyle: {
//                   fontSize: 12,
//                   fontWeight: "500",
//                   marginTop: 8,
//                   color: theme === "dark" ? "white" : 'black',
//                 },
//                 tabBarIcon: ({ color, size, focused }) => (
//                   <AnimatedTabIcon
//                     name={item.icon}
//                     color={color}
//                     size={size}
//                     focused={focused}
//                   />
//                 ),
//               }}
//             />
//           );
//         })}
//     </Tab.Navigator>
//   );
// };

// export default TabNavigator;
