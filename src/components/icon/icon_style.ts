import { Platform, StyleSheet } from 'react-native';

export const baseStyle = (color: string, isMenu: boolean) =>
  StyleSheet.create({
    container: {
      height: Platform.OS === 'android' ? 28 : 32,
      width: Platform.OS === 'android' ? 28 :  32,
      borderWidth: isMenu ? 0 : 1,
      borderColor: color,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
      borderRadius: 4,
    },
  }).container;
