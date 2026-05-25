import { View, Text, Platform, TouchableOpacity } from "react-native";
import { styles } from "../page_style";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
import {
  formatDateHr,
} from "../../../../utils/helpers";
import { useAppSelector } from "../../../../store/hooks";

import LableInfo from "./LableInfo";

const DisabledDateTime = ({ item, value, type, isFromChild = false, handleOnSubmit }: any) => {
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

  const handleTimeGet = () => {
    const now = new Date();
    const formatted = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    handleOnSubmit(item, formatted);
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
          {
            justifyContent: 'space-between',
            flexDirection: 'row',
             alignItems: 'center',
          }
        ]}
      >
        <Text
          style={{ color: theme === "dark" ? "white" : ERP_COLOR_CODE.ERP_555 }}
        >
          {getDisplayValue()}
        </Text>

        <TouchableOpacity
          onPress={handleTimeGet}
          style={{
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
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
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DisabledDateTime;
