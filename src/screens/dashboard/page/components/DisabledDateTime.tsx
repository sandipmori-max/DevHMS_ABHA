import { View, Text, Platform } from "react-native";
import React from "react";
import { styles } from "../page_style";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
import {
  formatDateHr,
} from "../../../../utils/helpers";
import { useAppSelector } from "../../../../store/hooks";
import ShortAction from "./ShortAction";
import InfoTooltip from "./Tooltip";
import LableInfo from "./LableInfo";

const DisabledDateTime = ({ item, value, type, isFromChild = false }: any) => {
  console.log("item", item?.title)
  const theme = useAppSelector((state) => state?.theme.mode);

  const getDisplayValue = () => {
    if (type === "DATETIME") {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return formatDateHr(date, true);
      } else {
        return value || "-";
      }
    }
    return value || "-";
  };

  return (
    <View style={{ marginBottom: Platform.OS === 'android' ? 6 : 8 }}>
      <LableInfo isFromChild={isFromChild}
        item={item}
        theme={theme}
        value={value} />

      <View
        style={[
          styles.disabledBox,
          theme === "dark" && {
            backgroundColor: 'gray',
          },
          isFromChild && {
            padding: 9,
            borderRadius: 4,
          }
        ]}
      >
        <Text
          style={{ color: theme === "dark" ? "white" : ERP_COLOR_CODE.ERP_555 }}
        >
          {getDisplayValue()}
        </Text>

         <View style={{
            height: 30, 
            justifyContent:'center',
            alignItems:'center',
             backgroundColor: 'blue',
             borderRadius: 4,
             paddingHorizontal: 8,
         }}>
          <Text style={{
            color: 'white',
          }}>
            {
              item?.field.includes("starttime") ? "Start Time" : "End Time"
            }
           </Text>
         </View>
      </View>
    </View>
  );
};

export default DisabledDateTime;
