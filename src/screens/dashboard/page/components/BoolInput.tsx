import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import { useAppSelector } from '../../../../store/hooks';
import useTranslations from '../../../../hooks/useTranslations';
import TranslatedText from '../../tabs/home/TranslatedText';

type BoolInputProps = {
  value: any;
  onChange: (val: boolean) => void;
  label?: string;
  isFromChild?: boolean
};

const BoolInput = ({ value, onChange, label, isFromChild = false }: BoolInputProps) => {
  const theme = useAppSelector(state => state?.theme.mode);
  const { t } = useTranslations();

  return (
    <View style={{ marginBottom: 8 }}>
      { label && <TranslatedText
      
      style={[{  fontWeight: '600' }, theme === 'dark' && { color: 'white' }]}
      numberOfLines={1}
      text={label}
      
      ></TranslatedText>}
      <View style={{ 
        padding: 10,
        marginVertical: 6,
        borderWidth: 0.4,
        borderRadius: 8,
        width:'98%',
        flexDirection: 'row', alignItems: 'center' }}>
        <View style={{flexDirection:'row', width:'40%', alignContent:'center', alignItems:'center'}}>
          <TouchableOpacity
          style={[styles.radio, value && styles.radioSelected, value && {
            borderColor :   ERP_COLOR_CODE.ERP_APP_COLOR  
          }]}
          onPress={() => onChange(true)}
        >
          {value && <View style={[styles.radioInner, {
            backgroundColor:   ERP_COLOR_CODE.ERP_APP_COLOR  
          }]} />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onChange(true)}
        >
        <Text style={[
          { marginRight: 16, }, theme === 'dark' && { color: 'white' },
          value ?
          {
            fontWeight: '600',
          color: theme === 'dark' ? ERP_COLOR_CODE.ERP_APP_COLOR : 'black'
          } :  {
             color: 'gray'
          }
          ]}>{t("title.title7")}</Text>

        </TouchableOpacity>
        </View>

        <View style={{
          marginLeft: 18,
          flexDirection:'row' , width:'40%', alignContent:'center', alignItems:'center'}}>
          <TouchableOpacity
          style={[styles.radio, !value && styles.radioSelected, !value && {
            borderColor :   ERP_COLOR_CODE.ERP_APP_COLOR  
          }]}
          onPress={() => onChange(false)}
        >
          {!value && <View style={[styles.radioInner, {
            backgroundColor:   ERP_COLOR_CODE.ERP_APP_COLOR  
          }]} />}
        </TouchableOpacity>
         <TouchableOpacity
          onPress={() => onChange(false)}
        >
        <Text style={[theme === 'dark' && { color: 'white' },

           !value ?
          {
            fontWeight: '600',
            color: theme === 'dark' ? ERP_COLOR_CODE.ERP_APP_COLOR : 'black'
          } :  {
             color: 'gray'
          }
        ]}>{t("title.title8")}</Text>

        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: ERP_COLOR_CODE.ERP_333,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    
  },
  radioSelected: {
    borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
  },
});

export default BoolInput;
