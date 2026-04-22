import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";

import { styles } from "./nointernet_style";
import useTranslations from "../../hooks/useTranslations";
import { ERP_GIF } from "../../assets";
import FastImage from "react-native-fast-image";
import { NoInterNetProps } from "./types";

const NoInternetScreen: React.FC<NoInterNetProps> = ({ onRetry }) => {
  const { t } = useTranslations();

  // Single animation controller for cleaner orchestration
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  // button press animation
  const buttonScale = useRef(new Animated.Value(1)).current;

  // subtle floating animation for GIF
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // floating loop animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <View style={styles.container}>
      {/* GIF */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale },
            { translateY: floatTranslate },
          ],
        }}
      >
        <FastImage
          source={ERP_GIF.NO_INTERNET}
          style={styles.gif}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        {t("errors.noInternet")}
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        {t("errors.somethingWentWrong")}
      </Animated.Text>

      {/* Button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.button}
          onPress={onRetry}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
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