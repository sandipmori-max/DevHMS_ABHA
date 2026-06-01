import { ActivityIndicator, Platform, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { ERPIconProps } from "./type";
import { baseStyle } from "./icon_style";
import { ERP_COLOR_CODE } from "../../utils/constants";

const ERPIcon: React.FC<ERPIconProps> = ({
  name,
  isMenu = false,
  onPress,
  extStyle,
  extSize = 20,
  color = ERP_COLOR_CODE.ERP_ICON,
  isLoading = false,
}) => {
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[baseStyle(color, isMenu), extStyle]}
    >
      {isLoading ? (
        <ActivityIndicator color={ERP_COLOR_CODE.ERP_ICON} size={"small"} />
      ) : (
        <>
          {
            name === 'G1' || name === 'G2' ? <Text style={{
              fontStyle: 'italic',
              fontWeight: '400',
              color: 'white'
            }}>{name}</Text> :
              <MaterialIcons name={name} color={color} size={extSize} />

          }
        </>
      )}
    </TouchableOpacity>
  );
};

export default ERPIcon;
