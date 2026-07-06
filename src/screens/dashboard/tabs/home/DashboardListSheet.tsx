import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useAppSelector } from "../../../../store/hooks";
import DeviceInfo from "react-native-device-info";

 
export default function DashboardListSheet({
  visible,
  onClose,
  data = [],
}: any) {
  const { height, width } = useWindowDimensions();  
    const isLandscape = width > height;
  const sheetTranslateY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const theme = useAppSelector((state) => state.theme.mode);
  const isIpad =
    (Platform.OS === "ios" && Platform.isPad) || DeviceInfo.isTablet() || Platform.isTV;
  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 290,
            useNativeDriver: true,
          }),
          Animated.timing(sheetTranslateY, {
            toValue: 0,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),

        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 260,
          delay: 60,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      sheetTranslateY.setValue(height);
      backdropOpacity.setValue(0);
      contentOpacity.setValue(0);
    }
  }, [visible]);

  const renderItem = ({ item }) => {
    return (
      <Animated.View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 0.5,
          borderColor: "#eee",
          opacity: contentOpacity,
          transform: [
            {
              translateY: contentOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", width: "70%" }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 4,
              marginRight: 10,
              backgroundColor: item.color,
            }}
          />

          <Text style={{ fontSize: 15, color: theme === 'dark' ? 'gray' : 'black' }}>{item.text}</Text>
        </View>

        <Text style={{ fontWeight: "600", color: item.color }}>
          {item.value}
        </Text>
      </Animated.View>
    );
  };

  return (
    <Modal visible={visible} transparent supportedOrientations={["portrait", "landscape"]}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "flex-end",
          opacity: backdropOpacity,
          alignItems: "center", 
        }}
      >
        <Animated.View
          style={{
            height: isLandscape ? height * 0.65 : height * 0.55,
            backgroundColor: theme === 'dark' ? 'black' : "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            transform: [{ translateY: sheetTranslateY }],
            marginHorizontal: isLandscape || isIpad ?  48 : 0,
            borderWidth: 0.5,
            borderColor: 'white',
            width:  isLandscape || isIpad ? width * 0.7 : width,
          }}
        >
          {/* Header */}
          <Animated.View style={{ opacity: contentOpacity }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600", color : theme === 'dark' ? 'gray' : 'black' }}>
                Dashboard List
              </Text>

              <TouchableOpacity onPress={onClose}>
                <Text style={{ fontSize: 22, color: "gray" }}>✕</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <FlatList
            data={data}
                              bounces={false}

            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            key={isLandscape ? "landscape" : "portrait"}    
          />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
