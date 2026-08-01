import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import { ERP_COLOR_CODE } from "../../../../utils/constants";
import DateSelector from "./DateSelector";
import Dropdown from "./Dropdown";

type Props = {
  accessMode: string;
  onChangeAccessMode: (value: string) => void;

  frequency: string;
  onChangeFrequency: (value: string) => void;

  eraseAt: Date;
  onChangeEraseAt: (date: Date) => void;
};

const PermissionCard = ({
  accessMode,
  onChangeAccessMode,
  frequency,
  onChangeFrequency,
  eraseAt,
  onChangeEraseAt,
}: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialIcons
          name="verified-user"
          size={22}
          color={ERP_COLOR_CODE.ERP_APP_COLOR}
        />

        <Text style={styles.title}>
          Permission
        </Text>
      </View>

      <Dropdown
        label="Access Mode"
        selected={accessMode}
        data={[
          {
            label: "VIEW",
            value: "VIEW",
          },
        ]}
        onChange={onChangeAccessMode}
      />

      <Dropdown
        label="Frequency"
        selected={frequency}
        data={[
          {
            label: "One Time",
            value: "One Time",
          },
          {
            label: "Hourly",
            value: "Hourly",
          },
          {
            label: "Daily",
            value: "Daily",
          },
          {
            label: "Weekly",
            value: "Weekly",
          },
          {
            label: "Monthly",
            value: "Monthly",
          },
        ]}
        onChange={onChangeFrequency}
      />

      <DateSelector
        disablePastDates={true}
        label="Erase Data At"
        value={eraseAt}
        onChange={onChangeEraseAt}
      />
    </View>
  );
};

export default PermissionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 14,
    marginTop: 8, 
    borderRadius: 12,
    paddingVertical: 16,
   },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  title: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "700",
    color: ERP_COLOR_CODE.ERP_APP_COLOR,
  },
});