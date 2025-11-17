import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { styles } from '../page_style';
import { DARK_COLOR, ERP_COLOR_CODE } from '../../../../utils/constants';
import { getDDLThunk } from '../../../../store/slices/dropdown/thunk';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FullViewLoader from '../../../../components/loader/FullViewLoader';

const CustomPicker = ({isValidate, label, selectedValue, onValueChange, item, errors, dtext }: any) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [loader, setLoader] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const theme = useAppSelector(state => state?.theme.mode);
  
  const optionsCache = useRef<{ [key: string]: any[] }>({});

  useEffect(() => {
    setSelectedOption(dtext);
  }, [dtext]);

  const handleOpen = useCallback(async () => {
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);

    // Check cache first
    if (item?.dtlid && optionsCache.current[item.dtlid]) {
      setOptions(optionsCache.current[item.dtlid]);
      return;
    }

    setLoader(true);
    try {
      const res = await dispatch(
        getDDLThunk({ dtlid: item?.dtlid, where: item?.ddlwhere }),
      ).unwrap();

      const data = res?.data ?? [];
      setOptions(data);
      if (item?.dtlid) optionsCache.current[item.dtlid] = data;
    } catch (e) {
      setOptions([]);
    } finally {
      setLoader(false);
    }
  }, [dispatch, item?.dtlid, item?.ddlwhere, open]);

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.label,  theme === 'dark' && {
          color: 'white'
        }]}>{label}</Text>
        {item?.tooltip !== label && <Text style={[styles.label,  theme === 'dark' && {
          color: 'white'
        }]}> - ( {item?.tooltip} ) </Text>}
        {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
      </View>

      <TouchableOpacity
        style={[styles.pickerBox, item?.disabled === '1' && styles.disabledBox,
          errors[item?.field] && {
            borderColor: ERP_COLOR_CODE.ERP_ERROR
          }, 
        (   isValidate && item?.mandatory === '1' &&  selectedOption) && {
            borderColor: 'green',
            borderWidth: 0.8
          },
          theme === 'dark' && {
            backgroundColor: DARK_COLOR
          },
          item?.disabled === '1' && theme === 'dark' && {
            backgroundColor: DARK_COLOR
          }
        ]}
        onPress={() => {
          if (item?.disabled !== '1') handleOpen();
        }}
        activeOpacity={0.7}
      >
        <Text style={{ color: theme === 'dark' ? 'white' : selectedOption ? ERP_COLOR_CODE.ERP_BLACK : ERP_COLOR_CODE.ERP_888, flex: 1 }}>
          {selectedOption || `Select ${label}`}
        </Text>
        <MaterialIcons name={open ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} color={ERP_COLOR_CODE.ERP_555} />
      </TouchableOpacity>

      {open && (
        <View style={[styles.dropdownCard, theme === 'dark' && {
          backgroundColor :'black'
        }]}>
          {loader ? (
            <FullViewLoader />
          ) : (
            options.length > 0 ? (
              options.map((opt: any, i: number) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        selectedOption === opt?.name
                          ? ERP_COLOR_CODE.ERP_APP_COLOR
                          : ERP_COLOR_CODE.ERP_WHITE,
                    },
                    theme === 'dark' && selectedOption === opt?.name && {
                      backgroundColor: 'white'
                    },
                    theme === 'dark' && {
                      backgroundColor: 'black',
                    }
                  ]}
                  onPress={() => {
                    onValueChange(opt?.value);
                    setOpen(false);
                    setSelectedOption(opt?.name);
                  }}
                >
                  <Text
                    style={{
                      color: theme === 'dark' ? 'white' :
                        selectedOption === opt?.name
                          ? ERP_COLOR_CODE.ERP_WHITE
                          : ERP_COLOR_CODE.ERP_BLACK,
                    }}
                  >
                    {opt?.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ marginVertical: 12, justifyContent: 'center', alignItems: 'center', height: 100 }}>
                <Text>No data</Text>
              </View>
            )
          )}
        </View>
      )}

      {errors[item?.field] && (
        <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR, marginTop: 4 }}>
          {errors[item?.field]}
        </Text>
      )}
    </View>
  );
};

export default React.memo(CustomPicker);
