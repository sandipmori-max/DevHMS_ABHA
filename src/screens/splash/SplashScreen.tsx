import React, { useEffect, useRef, useMemo } from "react";
import {
  View,
  Image,
  StatusBar,
  Animated,
  Easing,
  useWindowDimensions,
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

const CustomSplashScreen: React.FC<SplashProps> = ({ onFinish }) => {
  // EXISTING ANIMATIONS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const textTranslateY = useRef(new Animated.Value(40)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const greetingOpacity = useRef(new Animated.Value(0)).current;

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
    <LinearGradient colors={gradientColors} style={styles.container}>
      <StatusBar hidden />

      {/* TOP LEFT SVG */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: isLandscape ? 180 : 300,
          width: isLandscape ? 120 : 190,
          zIndex: 1,
          transform: [{ translateY: topImageAnim }],
        }}
      >
        <SvgUri
          width="100%"
          height="100%"
          uri="https://res.cloudinary.com/dht4ddwtn/image/upload/v1741437043/Group_119_a7nurz.svg"
        />
      </Animated.View>

      {/* TOP RIGHT SVG */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: isLandscape ? 70 : 100,
          width: isLandscape ? 70 : 100,
          zIndex: 1,
          transform: [{ translateY: topImageAnim }],
        }}
      >
        {/* <SvgUri
          width="100%"
          height="100%"
          uri="https://res.cloudinary.com/dht4ddwtn/image/upload/v1741434380/Group_116_lclkz2.svg"
        /> */}
      </Animated.View>

      {/* BOTTOM LEFT SVG */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: -30,
          left: -10,
          height: isLandscape ? 120 : 160,
          width: isLandscape ? 120 : 160,
          zIndex: 1,
          transform: [{ translateY: bottomImageAnim }],
        }}
      >
        {/* <SvgUri
          width="100%"
          height="100%"
          uri="https://res.cloudinary.com/dht4ddwtn/image/upload/v1741411663/Group_156_qsmeiy.svg"
        /> */}
      </Animated.View>

      {isLandscape ? (
        <View style={{ flexDirection: "row", flex: 1 }}>
          {/* LEFT SIDE */}
          <View
            style={{
              width: "50%",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  opacity: fadeAnim,
                  transform: [
                    { scale: scaleAnim },
                    { rotate: rotateInterpolate },
                  ],
                },
              ]}
            >
              <Image
                source={user?.companyLogo || ERP_ICON.APP_LOGO}
                style={{ height: 90, width: 90 }}
                resizeMode="contain"
              />
            </Animated.View>

            {user?.name && (
              <Animated.Text
                style={[
                  styles.helloTitle,
                  {
                    opacity: greetingOpacity,
                    transform: [{ translateY: textTranslateY }],
                    color: "#fff",
                  },
                ]}
              >
                {greeting}, {firstLetterUpperCase(user?.name)}
              </Animated.Text>
            )}
          </View>

          {/* RIGHT SIDE */}
          <View
            style={{
              width: "50%",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
              zIndex: 2,
            }}
          >
            <Animated.Text
              style={[
                styles.title,
                {
                  transform: [{ translateY: textTranslateY }],
                  color: "#fff",
                  textAlign: "center",
                },
              ]}
            >
              {user?.companyName
                ? `Welcome to\n${user.companyName}`
                : t("text.text53")}
            </Animated.Text>

            <Animated.Text
              style={[
                styles.subtitle,
                {
                  opacity: subtitleOpacity,
                  color: "#ddd",
                  textAlign: "center",
                },
              ]}
            >
              {t("text.text54")}
            </Animated.Text>

            <Animated.Text
              style={[
                styles.poweredBy,
                {
                  opacity: subtitleOpacity,
                  color: "#aaa",
                },
              ]}
            >
              Powered by - DevERP Solutions Pvt. Ltd.
            </Animated.Text>
          </View>
        </View>
      ) : (
        <>
          {/* LOGO */}
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { rotate: rotateInterpolate },
                ],
                zIndex: 2,
              },
            ]}
          >
            <Image
              source={user?.companyLogo || ERP_ICON.APP_LOGO}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* GREETING */}
          {user?.name && (
            <Animated.Text
              style={[
                styles.helloTitle,
                {
                  opacity: greetingOpacity,
                  transform: [{ translateY: textTranslateY }],
                  color: "#fff",
                  zIndex: 2,
                },
              ]}
            >
              {greeting}, {firstLetterUpperCase(user?.name)}
            </Animated.Text>
          )}

          {/* TITLE */}
          <Animated.Text
            style={[
              styles.title,
              {
                transform: [{ translateY: textTranslateY }],
                color: "#fff",
                textAlign: "center",
                zIndex: 2,
              },
            ]}
          >
            {user?.companyName
              ? `Welcome to\n${user.companyName}`
              : t("text.text53")}
          </Animated.Text>

          {/* SUBTITLE */}
          <Animated.Text
            style={[
              styles.subtitle,
              {
                opacity: subtitleOpacity,
                color: "#ddd",
                textAlign: "center",
                zIndex: 2,
              },
            ]}
          >
            {t("text.text54")}
          </Animated.Text>

          {/* FOOTER */}
          <Animated.Text
            style={[
              styles.poweredBy,
              {
                opacity: subtitleOpacity,
                color: "#aaa",
                zIndex: 2,
              },
            ]}
          >
            Powered by - DevERP Solutions Pvt. Ltd.
          </Animated.Text>
        </>
      )}
    </LinearGradient>
  );
};

export default CustomSplashScreen;