import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { ERP_COLOR_CODE } from "../../../../utils/constants";

type Props = {
  title: string;
  selected: boolean;
  onPress: () => void;
};

const HiTypeChip = ({
  title,
  selected,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        selected && {
            backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
            borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
        },
      ]}
    >
      <MaterialIcons
        name={
          selected
            ? 'check-box'
            : "check-box-outline-blank"
        }
        size={18}
        color={
          selected
            ? "#FFFFFF"
            : ERP_COLOR_CODE.ERP_APP_COLOR
        }
      />

      <Text
        style={[
          styles.text,
          selected && styles.selectedText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default HiTypeChip;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },

  selectedContainer: {
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
  },

  text: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: ERP_COLOR_CODE.ERP_APP_COLOR,
  },

  selectedText: {
    color: "#FFFFFF",
  },
});