import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  rightText?: string;
};

const SectionTitle = ({ title, rightText }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {rightText ? (
        <Text style={styles.rightText}>{rightText}</Text>
      ) : null}
    </View>
  );
};

export default SectionTitle;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#212121",
  },

  rightText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1565C0",
  },
});