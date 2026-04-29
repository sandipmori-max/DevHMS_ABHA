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

import { ERP_ICON } from "../../assets";
import { styles } from "./splash_style";
import { SplashProps } from "./types";
import { useAppSelector } from "../../store/hooks";
import useTranslations from "../../hooks/useTranslations";
import { firstLetterUpperCase } from "../../utils/helpers";
import { ERP_COLOR_CODE } from "../../utils/constants";

const CustomSplashScreen: React.FC<SplashProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const textTranslateY = useRef(new Animated.Value(40)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const greetingOpacity = useRef(new Animated.Value(0)).current;

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
    const MIN_SPLASH = 1800;

    Animated.sequence([
      // 🔥 Logo entry
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 8,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(100),

      // 🔥 Greeting animation
      Animated.parallel([
        Animated.timing(greetingOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),

      // 🔥 Subtitle fade
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const elapsed = Date.now() - start;

      if (elapsed >= MIN_SPLASH) {
        onFinish();
      } else {
        setTimeout(onFinish, MIN_SPLASH - elapsed);
      }
    });
  }, []);

  const gradientColors =
    theme ===  "dark" ? ["#000000", "#1a1a1a"] :  appColorCode ? [ERP_COLOR_CODE.ERP_APP_COLOR , "#4c669f", "#3b5998",]:  ["#4c669f", "#3b5998", "#192f6a"]

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <StatusBar hidden />

      {isLandscape ? (
        <View style={{ flexDirection: "row", flex: 1 }}>
          {/* LEFT SIDE */}
          <View
            style={{
              width: "50%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }], 
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
                transform: [{ scale: scaleAnim }], 
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