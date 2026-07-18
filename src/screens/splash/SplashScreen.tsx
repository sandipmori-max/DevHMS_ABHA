import React, { useEffect, useRef, useMemo } from "react";
import {
  View,
  Image,
  StatusBar,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
  Text,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SvgUri } from "react-native-svg";

import { ERP_ICON } from "../../assets";
import { styles } from "./splash_style";
import { SplashProps } from "./types";
import { useAppSelector } from "../../store/hooks";
import useTranslations from "../../hooks/useTranslations";
import { firstLetterUpperCase } from "../../utils/helpers";
import { ERP_COLOR_CODE } from "../../utils/constants";
import DeviceInfo from "react-native-device-info";

const CustomSplashScreen: React.FC<SplashProps> = ({ onFinish }) => {
  // EXISTING ANIMATIONS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const textTranslateY = useRef(new Animated.Value(40)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const greetingOpacity = useRef(new Animated.Value(0)).current;
 const isIpad =
   ( Platform.OS === "ios" && Platform.isPad) || DeviceInfo.isTablet() || Platform.isTV;
  // NEW SPLASH ANIMATIONS
  const topImageAnim = useRef(new Animated.Value(-200)).current;
  const bottomImageAnim = useRef(new Animated.Value(200)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;

  const theme = useAppSelector((state) => state?.theme.mode);
  const { t } = useTranslations();
  const { user, appColorCode } = useAppSelector((state) => state.auth);

  // 🔥 Dynamic Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  }, []);

    useEffect(() => {
  const start = Date.now();

  // ✅ Total splash visible time
  const TOTAL_SPLASH_TIME = 2200;

  Animated.sequence([
    // 🔥 Background animation
    Animated.parallel([
      Animated.spring(topImageAnim, {
        toValue: 0,
        damping: 14,
        stiffness: 180,
        mass: 0.7,
        useNativeDriver: true,
      }),

      Animated.spring(bottomImageAnim, {
        toValue: 0,
        damping: 14,
        stiffness: 180,
        mass: 0.7,
        useNativeDriver: true,
      }),
    ]),

    // 🔥 Logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 90,
        useNativeDriver: true,
      }),

      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]),

    // 🔥 Greeting animation
    Animated.parallel([
      Animated.timing(greetingOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]),

    // 🔥 Subtitle fade
    Animated.timing(subtitleOpacity, {
      toValue: 1,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ]).start(() => {
    const elapsed = Date.now() - start;

    const remainingTime = TOTAL_SPLASH_TIME - elapsed;

    if (remainingTime > 0) {
      setTimeout(onFinish, remainingTime);
    } else {
      onFinish();
    }
  });
}, []);
  const gradientColors =
    theme === "dark"
      ? ["#000000", "#1a1a1a"]
      : appColorCode
      ? [
          ERP_COLOR_CODE.ERP_APP_COLOR,
          "#4c669f",
          "#3b5998",
        ]
      : ["#4c669f", "#3b5998", "#192f6a"];

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-10deg", "0deg"],
  });

  return (
     <View style={styles.container}>
            <View style={styles.topSection}>
              <Image
                source={{
                  uri: 'https://play-lh.googleusercontent.com/4o2xmTJIFLjpToZnWJZUYsCYcWGuJlH_SVGue1a6z39stjg-1Xl3KWxggo9p2pSMYE94Ol2HjeF4Z-83rLmPyA=w240-h480-rw'
                }} // apna logo
                style={styles.logo}
                resizeMode="contain"
              />
    
              <Text style={styles.title}>ABHA Health</Text>
    
              <Text style={styles.subtitle}>
                Your Digital Health Identity
              </Text>
            </View>
    
            <View style={styles.loaderSection}>
              <ActivityIndicator
                size="large"
                color="#251d50"
              />
    
              <Text style={styles.loadingText}>
                Connecting securely...
              </Text>
            </View>
    
            <View style={styles.bottomSection}>
              <Text style={styles.powered}>
                Powered by
              </Text>
    
              <Text style={styles.abdm}>
                Ayushman Bharat Digital Mission
              </Text>
            </View>
          </View>
  );
};

export default CustomSplashScreen;