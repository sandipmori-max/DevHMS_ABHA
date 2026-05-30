import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Platform, Text, useWindowDimensions, View } from "react-native";
import FastImage from "react-native-fast-image";
import { useFocusEffect } from "@react-navigation/native";

import { ERP_GIF } from "../../assets";
import { styles } from "./no_data_style";
import { useAppSelector } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { ERP_COLOR_CODE } from "../../utils/constants";
import DeviceInfo from "react-native-device-info";

const NoData = ({ isShowTop = true, text }: any) => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state?.theme.mode);
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const opacity = useRef(new Animated.Value(0)).current;

  const imageTranslateY = useRef(new Animated.Value(20)).current;
  const titleTranslateX = useRef(new Animated.Value(-20)).current;
  const subtitleTranslateX = useRef(new Animated.Value(20)).current;

  const [shouldRender, setShouldRender] = useState(false);
  const isIpad =
    (Platform.OS === "ios" && Platform.isPad) || DeviceInfo.isTablet() || Platform.isTV;
  useFocusEffect(
    useCallback(() => {
      opacity.setValue(0);
      imageTranslateY.setValue(200);
      titleTranslateX.setValue(-200);
      subtitleTranslateX.setValue(200);

      setShouldRender(true);

      return () => {
        setShouldRender(false);
      };
    }, []),
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: theme === 'dark' ? 0 : 420,
        useNativeDriver: true,
      }),
      Animated.timing(imageTranslateY, {
        toValue: 0,
        duration: 480,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateX, {
        toValue: 0,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleTranslateX, {
        toValue: 0,
        duration: 580,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!shouldRender) return null;

  return (
    <>
      {isShowTop && theme !== 'dark' && (
        <View
          style={{
            height: Platform.OS === "ios" ? 16 : 6,
            width: "100%",
            backgroundColor:  ERP_COLOR_CODE.ERP_APP_COLOR,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        ></View>
      )}
      <Animated.View
        style={[
          styles.container,
          theme === "dark" && { backgroundColor: "black" },
          { opacity },
        ]}
      >
        {isLandscape ? (
          <>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "50%",

                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Animated.View
                  style={{ transform: [{ translateY: imageTranslateY }] }}
                >
                  <FastImage
                    source={ERP_GIF.NO_DATA}
                    style={[
                      styles.image,
                      {
                        height: 150,
                        width: 150,
                      },
                    ]}
                    resizeMode="contain"
                  />
                </Animated.View>
              </View>
              <View
                style={{
                  width: "50%",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                {/* TITLE */}
                <Animated.Text
                  style={[
                    styles.title,
                    { transform: [{ translateX: titleTranslateX }] },
                  ]}
                >
                  {t("test8")}
                </Animated.Text>

                {/* SUBTITLE */}
                <Animated.Text
                  style={[
                    styles.subtitle,
                    { transform: [{ translateX: subtitleTranslateX }] },
                  ]}
                >
                  {t("test9")}
                </Animated.Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* GIF */}
            <Animated.View
              style={{ transform: [{ translateY: imageTranslateY }] }}
            >
              <FastImage
                source={ERP_GIF.NO_DATA}
                style={[
                  styles.image,
                  {
                    width: isIpad ? 150 : width * 0.4,
                    height: isIpad ? 150 : width * 0.4,
                  },
                ]}
                resizeMode="contain"
              />
            </Animated.View>

            {/* TITLE */}
            <Animated.Text
              style={[
                styles.title,
                { transform: [{ translateX: titleTranslateX }] },
              ]}
            >
              {t("test8")}
            </Animated.Text>

            {/* SUBTITLE */}
            <Animated.Text
              style={[
                styles.subtitle,
                { transform: [{ translateX: subtitleTranslateX }] },
              ]}
            >
              {t("test9")}
            </Animated.Text>
          </>
        )}
      </Animated.View>
    </>
  );
};

export default NoData;

 
