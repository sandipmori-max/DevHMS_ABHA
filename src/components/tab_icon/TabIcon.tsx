import React from 'react';
import {  View } from 'react-native';
import { TabIconProps } from './type';
import { styles } from './tab_style';
import { useAppSelector } from '../../store/hooks';
import { ERP_COLOR_CODE } from '../../utils/constants';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const TabIcon: React.FC<TabIconProps & { focused: boolean }> = ({ name, color, size, focused }) => {
  const theme = useAppSelector(state => state.theme.mode);
  return (
    <View style={styles.container}>
      {focused && <View style={[styles.activeLine, {
        backgroundColor: theme === 'dark' ? 'white' : ERP_COLOR_CODE.ERP_APP_COLOR
      }]} />}
      <MaterialIcons name={name} size={size} color={color}  />
    </View>
  );
};

export default TabIcon;
