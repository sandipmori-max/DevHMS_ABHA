import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { ERP_COLOR_CODE } from "../../../../utils/constants";

type Props = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  disablePastDates?: boolean;
};

const DateSelector = ({
  label,
  value,
  onChange,
  disablePastDates = false
}: Props) => {
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.input, disablePastDates && { backgroundColor: "#f0f0f0" }]}
        disabled={disablePastDates}
        onPress={() => {
          if(disablePastDates){
            return;
          }
          setTempDate(value);
          setVisible(true);
        }}
      >
        <Text style={styles.value}>
          {formatDate(value)}
        </Text>

        <MaterialIcons
          name="calendar-month"
          size={22}
          color={ERP_COLOR_CODE.ERP_APP_COLOR}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => setVisible(false)}
              >
                <Text style={styles.cancel}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <Text style={styles.title}>
                Select Date
              </Text>

              <TouchableOpacity
                onPress={() => {
                  onChange(tempDate);
                  setVisible(false);
                }}
              >
                <Text style={styles.done}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <DateTimePicker
              value={tempDate}
              mode="date"
              display={
                Platform.OS === "ios"
                  ? "spinner"
                  : "calendar"
              }
              onChange={(_, date) => {
                if (date) {
                  setTempDate(date);
                }
              }}
              style={{
                backgroundColor: "#FFF",
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DateSelector;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16, 
    marginTop : 8
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#616161",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  value: {
    fontSize: 15,
    color: "#212121",
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },

  header: {
    height: 55,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
  },

  cancel: {
    fontSize: 16,
    color: "#757575",
  },

  done: {
    fontSize: 16,
    fontWeight: "700",
    color: ERP_COLOR_CODE.ERP_APP_COLOR,
  },
});