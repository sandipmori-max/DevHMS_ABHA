import React, { useRef, useEffect } from "react";
import { Animated, View, StyleSheet, Platform } from "react-native";
import { ERP_COLOR_CODE } from "../../utils/constants";
import { useAppSelector } from "../../store/hooks";
import TranslatedText from "../../screens/dashboard/tabs/home/TranslatedText";

const Toast = ({
  visible,
  message,
  onHide,
  tbackgroundColor,
  textColor,
}: any) => {
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-80)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          // Hide animation
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -80,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.9,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start(onHide);
        }, 400);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.wrapper}>
      <Animated.View
        style={[
          styles.toastContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY }, { scale }],
            backgroundColor:
              tbackgroundColor ||
              (theme === "dark" ? "#fff" : ERP_COLOR_CODE.ERP_APP_COLOR),
          },
        ]}
      >
        <TranslatedText
          text={message}
          numberOfLines={2}
          style={[
            styles.toastText,
            {
              color:
                textColor ||
                (theme === "dark" ? "#000" : "#fff"),
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 20 : 10,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },

  toastContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8, // pill shape
    maxWidth: "90%",
 
  },

  toastText: {
    fontSize: 14,
    fontWeight: "600",
  },
});