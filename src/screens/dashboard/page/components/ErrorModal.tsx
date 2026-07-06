import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  PanResponder,
  useWindowDimensions,
  Platform,
} from "react-native";
import { styles } from "../page_style";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useAppSelector } from "../../../../store/hooks";
import useTranslations from "../../../../hooks/useTranslations";
import FastImage from "react-native-fast-image";
import { ERP_ICON } from "../../../../assets";
import DeviceInfo from "react-native-device-info";

const CLOSE_THRESHOLD = 120;
const HIDDEN_POSITION = 300;

const ErrorModal = ({ visible, errors, onClose }: any) => {
  const theme = useAppSelector((state) => state?.theme.mode);
  const { t } = useTranslations();
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const translateY = useRef(new Animated.Value(HIDDEN_POSITION)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const isIpad =
    (Platform.OS === "ios" && Platform.isPad) || DeviceInfo.isTablet() || Platform.isTV;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dy > 5 && Math.abs(g.dy) > Math.abs(g.dx),

      onPanResponderGrant: () => {
        translateY.setOffset(translateY.__getValue());
        translateY.setValue(0);
      },

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },

      onPanResponderRelease: (_, g) => {
        translateY.flattenOffset();

        if (g.dy > CLOSE_THRESHOLD) {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: HIDDEN_POSITION,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      supportedOrientations={["portrait", "landscape"]}
      animationType="none"
    >
      <View {...panResponder.panHandlers}></View>
      <Animated.View
        style={[
          styles.overlay,
          (isLandscape || isIpad) && {
            alignContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Animated.View
          style={[
            styles.bottomSheet,
            { transform: [{ translateY }] },
            theme === "dark" && {
              backgroundColor: "black",
              borderWidth: 1,
              borderColor: "white",
            },
            {
              width: isLandscape || isIpad ? "80%" : "100%",
            },
          ]}
        >
          {/* 👇 ONLY THIS PART IS DRAGGABLE */}
          <View {...panResponder.panHandlers}>
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#ccc",
                alignSelf: "center",
                marginBottom: 10,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.title,
                  theme === "dark" && {
                    color: "white",
                  },
                ]}
              >
                {t("text.text35")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Animated.parallel([
                    Animated.timing(translateY, {
                      toValue: HIDDEN_POSITION,
                      duration: 360,
                      easing: Easing.in(Easing.ease),
                      useNativeDriver: true,
                    }),
                    Animated.timing(overlayOpacity, {
                      toValue: 0,
                      duration: 360,
                      useNativeDriver: true,
                    }),
                  ]).start(() => {
                    onClose();
                  });
                }}
              >
                <MaterialIcons
                  name="close"
                  color={theme === "dark" ? "white" : "black"}
                  size={22}
                />
              </TouchableOpacity>
            </View>
          </View>

          {isLandscape || isIpad ? (
            <>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: "50%",
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <FastImage
                      source={ERP_ICON.VALIDATON}
                      style={{ height: 160, width: 120 }}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                <View
                  style={{
                    width: "50%",
                  }}
                >
                  <FlatList
                    data={errors}
                                      bounces={false}

                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item }) => (
                      <Text style={styles.errorText}>• {item}</Text>
                    )}
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              {/* CONTENT – NOT DRAGGABLE */}
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    position: "absolute",
                    top: -90,
                    height: 70,
                    width: 70,
                    backgroundColor: theme === "dark" ? "#000" : "#fff",
                    borderRadius: 40,
                    overflow: "hidden",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FastImage
                    source={ERP_ICON.VALIDATON}
                    style={{
                      position: "absolute",
                      height: 50,
                      width: 50,
                    }}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <View style={{ height: 20 }} />
              <FlatList
                data={errors}
                                  bounces={false}

                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.errorText}>• {item}</Text>
                )}
              />
              <View style={{ height: 20 }} />

            </>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default ErrorModal;
