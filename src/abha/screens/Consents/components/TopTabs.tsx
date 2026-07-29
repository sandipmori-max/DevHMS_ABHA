import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ERP_COLOR_CODE } from "../../../../utils/constants";

type Props = {
  value: "requests" | "approved";
  onChange: (
    value: "requests" | "approved"
  ) => void;
};

export default function TopTabs({
  value,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onChange("requests")}
        style={[
          styles.tab,
          value === "requests" &&
            styles.activeTab,
           value === "requests" && {
            backgroundColor :ERP_COLOR_CODE.ERP_APP_COLOR
           } 
        ]}
      >
        <Text
          style={[
            styles.text,
            value === "requests" &&
              styles.activeText,
          ]}
        >
          Requests
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onChange("approved")}
        style={[
          styles.tab,
          value === "approved" &&
            styles.activeTab,
            value === "approved" && {
            backgroundColor :ERP_COLOR_CODE.ERP_APP_COLOR
           } 
        ]}
      >
        <Text
          style={[
            styles.text,
            value === "approved" &&
              styles.activeText,
          ]}
        >
          Approved
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",  
    marginBottom: 16,
    backgroundColor: "#faf5f5",
    borderRadius: 8,
    padding: 4,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },

  activeTab: {
    backgroundColor: "#1565C0",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  text: {
    fontSize: 15,

    fontWeight: "600",

    color: "#5F6368",
  },

  activeText: {
    color: "#FFF",
  },
});