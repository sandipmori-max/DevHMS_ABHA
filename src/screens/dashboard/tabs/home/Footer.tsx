import React, { useRef, useEffect } from "react";
import { Animated, Text, View, Dimensions } from "react-native";
import AutoHeightWebView from "../../page/components/AutoHeightWebView";
import TranslatedText from "./TranslatedText";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const { width } = Dimensions.get("screen");

const MarqueeFooterV2 = ({ html }: any) => {
  console.log(" html -------- MarqueeFooter -------------- ", html);
  const translateX = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -250,
        duration: 10000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View
      style={{
        overflow: "hidden",
        backgroundColor: "#f0f8ff",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Animated.View
        style={{ flexDirection: "row", transform: [{ translateX }] }}
      >
        <Text>{html.replace(/<[^>]+>/g, "")}</Text>
      </Animated.View>
    </View>
  );
};

const MarqueeFooter = ({html}: any) => {
  const extractUsers = (html) => {
  if (!html) return [];

   let cleanText = html
    .replace(/<[^>]+>/g, "")
    .replace(/happy birthday/gi, "")

  return cleanText
    .split("•")
    .map((item) =>
      item
    
        .replace(/\./g, "") // dot remove
        .replace(/\s+/g, " ") // extra spaces fix
        .trim()
    )
    .filter((item) => item.length > 0);
};
  const users = extractUsers(html);
console.log("users", users)
  return (
    <View
      style={{
        paddingHorizontal: 12,
        borderRadius: 10,
        paddingBottom: 10,
      }}
    >
      {/* Header */}

      {/* Names */}
      <View style={{ marginTop: 0 }}>
        {users.map((name, index) => (
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              alignContent: "center",
              alignItems: "center",
              marginVertical: 4,
            }}
          >
            <MaterialIcons color={"green"} size={18} name="cake" />
            <Text
              key={index}
              style={{
                fontSize: 14,
              }}
            >
              - {name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const Footer = ({
  footer,
  index,
  accentColors,
  isHorizontal,
  isFromMenu,
  textColor,
  isFromListPage,
}: any) => {
  const isHTML = typeof footer === "string" && /<[^>]+>/.test(footer);
  const isMarquee = footer.includes("<marquee");

  if (isMarquee) {
    return <MarqueeFooter html={footer} />;
  } else if (isHTML) {
    return (
      <AutoHeightWebView
        isFromListPage={isFromListPage}
        textColor={textColor}
        isHorizontal={isHorizontal}
        isFromMenu={isFromMenu}
        isFromPage={false}
        html={footer}
      />
    );
  } else {
    return (
      <TranslatedText
        style={{
          color: accentColors[index % accentColors.length],
          fontSize: 14,
          fontWeight: "600",
        }}
        text={footer}
        numberOfLines={3}
      ></TranslatedText>
    );
  }
};

export default Footer;
