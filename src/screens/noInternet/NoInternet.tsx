import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
} from "react-native";

import FastImage from "react-native-fast-image";

import { styles } from "./nointernet_style";
import useTranslations from "../../hooks/useTranslations";
import { ERP_GIF } from "../../assets";
import { NoInterNetProps } from "./types";

const NoInternetScreen: React.FC<NoInterNetProps> = ({ onRetry }) => {
  const { t } = useTranslations();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 14,
        stiffness: 90,
        mass: 0.8,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 12,
        stiffness: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // subtle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // floating rotate effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-2deg", "2deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Background Glow */}
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      {/* GIF */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
            { scale: pulseAnim },
            { rotate },
          ],
        }}
      >
        <FastImage
          source={ERP_GIF.NO_INTERNET}
          style={styles.gif}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>
          {t("errors.noInternet")}
        </Text>

        <Text style={styles.subtitle}>
          {t("errors.somethingWentWrong")}
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.button}
          onPress={onRetry}
        >
          <Text style={styles.buttonText}>
            {t("errors.tryAgain")}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default NoInternetScreen;