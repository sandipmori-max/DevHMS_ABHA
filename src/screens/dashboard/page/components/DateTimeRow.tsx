import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { styles } from "../page_style";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { formatDateHr } from "../../../../utils/helpers";
import { useAppSelector } from "../../../../store/hooks";
import InputError from "../../../../components/error/InputError";
import LableInfo from "./LableInfo";

const DateTimeRow = ({
  isValidate,
  item,
  errors,
  value,
  showDateTimePicker,
  isFromChild = false
}: any) => {
  const theme = useAppSelector((state) => state?.theme.mode);

  return (
    <View style={{ marginBottom: Platform.OS === 'android' ? 6  : 8 }}>
      <LableInfo isFromChild={isFromChild}
        item={item}
        theme={theme}
        value={value} />
    
      <TouchableOpacity
        style={[
          styles.dateBox,
          errors[item.field] && { borderColor: ERP_COLOR_CODE.ERP_ERROR },
          isValidate &&
            item?.mandatory === "1" &&
            value && {
              borderColor: "green",
              borderWidth: 0.8,
            },
          theme === "dark" && {
            backgroundColor: "black",
          },
          isFromChild && {
            padding : 6,
            borderRadius: 4,
          }
        ]}
        onPress={() => showDateTimePicker(item?.field, value)}
      >
        <Text
          style={{
            color:
              theme === "dark"
                ? "white"
                : value
                ? ERP_COLOR_CODE.ERP_BLACK
                : ERP_COLOR_CODE.ERP_888,
          }}
        >
          {value ? formatDateHr(value, true) : "dd/mmm/yyyy hh:mm"}
        </Text>
        <MaterialIcons name="event" size={20} color={ERP_COLOR_CODE.ERP_555} />
      </TouchableOpacity>
      {!value && errors[item.field] && (
        <InputError error={errors[item?.field]} />
      )}
    </View>
  );
};

export default DateTimeRow;
