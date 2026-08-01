import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { ERP_COLOR_CODE } from "../../../../utils/constants";

type Item = {
  label: string;
  value: string;
};

type Props = {
  title: string;
  icon: string;
  data: Item[];
};

const InfoCard = ({
  title,
  icon,
  data,
}: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialIcons
          name={icon}
          size={22}
          color={ERP_COLOR_CODE.ERP_APP_COLOR}
        />

        <Text style={styles.title}>
          {title}
        </Text>
      </View>

      {data.map((item, index) => (
        <View key={index}>
          <View style={styles.row}>
            <Text style={styles.label}>
              {item.label}
            </Text>

            <Text style={styles.value}>
              {item.value}
            </Text>
          </View>

          {index !== data.length - 1 && (
            <View style={styles.divider} />
          )}
        </View>
      ))}
    </View>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16, 
    marginHorizontal: 12,
    marginTop : 12
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  title: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "700",
    color: ERP_COLOR_CODE.ERP_APP_COLOR,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  label: {
    flex: 1,
    fontSize: 14,
    color: "#757575",
  },

  value: {
    flex: 1,
    textAlign: "right",
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
  },
});