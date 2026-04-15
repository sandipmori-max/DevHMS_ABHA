import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppSelector } from "../../../../store/hooks";

const TypingLoading = ({ text = "...", speed = 400, visible = true }) => {
  const [displayed, setDisplayed] = useState("");
  const theme = useAppSelector((state) => state?.theme.mode);

  useEffect(() => {
    if (!visible) return;

    let index = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, index + 1));
      index++;
      if (index === text.length) index = 0;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, visible]);

  if (!visible) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={[styles.text, {
        color: theme === "dark" ? "#aaa" : "#555",
      }]}>Loading</Text>
      <Text style={[styles.text,  {
        color: theme === "dark" ? "#aaa" : "#555",
      }]}>{displayed}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "800",
    color: "black",
    fontStyle: "italic",
    letterSpacing: 6, // optional, spacing for effect
  },
});

export default TypingLoading;
