import React from "react";
import { View } from "react-native";
import { TabIconProps } from "./type";
import { styles } from "./tab_style";
import { useAppSelector } from "../../store/hooks";
import { ERP_COLOR_CODE } from "../../utils/constants";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import FontAwesome from "@react-native-vector-icons/fontawesome";

const TabIcon: React.FC<TabIconProps & { focused: boolean }> = ({
  name,
  color,
  size,
  focused,
}) => {
  const theme = useAppSelector((state) => state.theme.mode);
  return (
    <View style={styles.container}>
      {focused && (
        <View
          style={[
            styles.activeLine,
            {
              backgroundColor:
                theme === "dark" ? "white" : ERP_COLOR_CODE.ERP_APP_COLOR,
            },
          ]}
        />
      )}
      {name?.includes("fa fa-") ? (
        <FontAwesome
          name={name.replace("fa fa-", "")}
          size={size}
          color={color}
        />
      ) : (
        <MaterialIcons name={name || "widgets"} size={size} color={color} />
      )}
    </View>
  );
};

export default TabIcon;
