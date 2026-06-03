import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import { ERP_COLOR_CODE } from "../../../../utils/constants";
import { useAppSelector } from "../../../../store/hooks";

const AttendanceLeaveToggle = ({
  value = "attendance",
  onChange,
}: any) => {
  const [selected, setSelected] = useState(value);

    const handleSelect = (type: string) => {
        setSelected(type);
        onChange?.(type);
    };
    const { user, } = useAppSelector(
      (state) => state.auth,
    );
  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        {/* Attendance */}
        <Pressable
          style={[
            styles.tab,
            selected === "attendance" && styles.activeTab,
          ]}
          onPress={() => handleSelect("attendance")}
        >
          <MaterialIcons
            name="calendar-today"
            size={16}
            color={selected === "attendance" ? "#FFF" : "#667085"}
            style={styles.icon}
          />
          <Text
            style={[
              styles.tabText,
              selected === "attendance" && styles.activeText,
            ]}
          >
            Attendance
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AttendanceLeaveToggle;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginTop: 12,
  },

  segment: {
    flexDirection: "row",
    backgroundColor: "#F2F4F7",
    borderRadius: 8,
    padding: 4,
    borderWidth: 0.3,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    flexDirection: "row",
  },

  activeTab: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#667085",
  },

  activeText: {
    color: "#FFF",
  },

  icon: {
    marginRight: 6,
  },
});