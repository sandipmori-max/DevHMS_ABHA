import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DARK_COLOR, ERP_COLOR_CODE } from "../utils/constants";
import MenuTab from "../screens/dashboard/tabs/MenuTab/MenuTab";
import HomeScreen from "../screens/dashboard/tabs/home/HomeTab";
import ProfileTab from "../screens/dashboard/tabs/profile/ProfileTab";
import { useAppSelector } from "../store/hooks";
import AnimatedTabIcon from "../components/tab_icon/AnimatedTabIcon";
import { Platform } from "react-native";
import useTranslations from "../hooks/useTranslations";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const { appBottomMenuList } = useAppSelector((state) => state?.auth);
  const { t } = useTranslations();
  const [hidden, setHidden] = useState(false);
 
  const navigationItems = (appBottomMenuList || []).map((item) => ({
    name: item?.name,
    type: item?.code,
    icon: item?.iconname?.toLowerCase(),
    label: item?.name,
  }));

  const getComponent = (item) => {
    if (item.name === "Home") return HomeScreen;
    if (item.name === "Profile") return ProfileTab;
    return null;
  };

  const tabConfig = [
    {
      name: t("navigation.home"),
      component: HomeScreen,
      icon: "home",
      label: t("navigation.home"),
    },

    {
      name: t("navigation.profile"),
      component: ProfileTab,
      icon: "person",
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
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: hidden ? "none" : "flex",
          backgroundColor:
            theme === "dark" ? 'black' : ERP_COLOR_CODE.ERP_WHITE,
          height: Platform.OS === "ios" ? theme === "dark" ? 70 : 60 : 70,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor:
            theme === "dark" ? 'black' : ERP_COLOR_CODE.ERP_APP_COLOR,
        },
        headerTintColor: "white", 
      }}
    >
      {navigationItems.length > 0 &&
        navigationItems.map((item, index) => {
          const Component = getComponent(item);

          return (
            <Tab.Screen
              key={index}
              name={item.name}
              children={
                Component
                  ? () => <Component hideTab={hidden} setHideTab={setHidden} />
                  : () => (
                      <MenuTab
                        hideTab={hidden}
                        setHideTab={setHidden}
                        type={item.type}
                        headerText={item.label}
                        searchPlaceholder={`Search ${item.label}`}
                      />
                    )
              }
              options={{
                tabBarLabel: item.label,
                title: item.label,
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: "500",
                  marginTop: 8,
                },
                tabBarIcon: ({ color, size, focused }) => (
                  <AnimatedTabIcon
                    name={item.icon}
                    color={color}
                    size={size}
                    focused={focused}
                  />
                ),
              }}
            />
          );
        })}
      {navigationItems.length === 0 &&
        tabConfig.map((item, index) => {
          const Component = getComponent(item);

          return (
            <Tab.Screen
              key={index}
              name={item.name}
     
              children={
                Component
                  ? () => <Component hideTab={hidden} setHideTab={setHidden} />
                  : () => (
                      <MenuTab
                        hideTab={hidden}
                        setHideTab={setHidden}
                        type={item.type}
                        headerText={item.label}
                        searchPlaceholder={`Search ${item.label}`}
                      />
                    )
              }
              options={{
                tabBarLabel: item.label,
                title: item.label,
                
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: "500",
                  marginTop: 8,
                  color: theme === "dark" ? "white" : 'black',
                },
                tabBarIcon: ({ color, size, focused }) => (
                  <AnimatedTabIcon
                    name={item.icon}
                    color={color}
                    size={size}
                    focused={focused}
                  />
                ),
              }}
            />
          );
        })}
    </Tab.Navigator>
  );
};

export default TabNavigator;
