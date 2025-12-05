import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Alert, BackHandler, StyleSheet} from 'react-native';
 
import {RESULTS} from 'react-native-permissions'; 
import { usePermissions } from '../../../../permissions/usePermissions';
import { EPermissionTypes } from '../../../../constants';
import { getShadowProps, goToSettings } from '../../../../utils/helpers';
 import { CameraScanner } from '../../../../components/CameraScanner/CameraScanner';
import { ERP_COLOR_CODE } from '../../../../utils/constants';
import { useAppSelector } from '../../../../store/hooks';

  const ScanScreen = ({item} : any) => {
  console.log("item-----------------", item)
  const {askPermissions} = usePermissions(EPermissionTypes.CAMERA);
  const [cameraShown, setCameraShown] = useState(false);
  const [qrText, setQrText] = useState('');
  const theme = useAppSelector(state => state?.theme.mode);

  let items = [
    {
      id: 1,
      title: 'QR code Scanner',
    },
  ];

  function handleBackButtonClick() {
    if (cameraShown) {
      setCameraShown(false);
    }
    return false;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      // BackHandler.removeEventListener(
      //   'hardwareBackPress',
      //   handleBackButtonClick,
      // );
    };
  }, []);

  const takePermissions = async () => {
    askPermissions()
      .then(response => {
        //permission given for camera
        if (
          response.type === RESULTS.LIMITED ||
          response.type === RESULTS.GRANTED
        ) {
          setCameraShown(true);
        }
      })
      .catch(error => {
        if ('isError' in error && error.isError) {
          Alert.alert(
            error.errorMessage ||
              'Something went wrong while taking camera permission',
          );
        }
        if ('type' in error) {
          if (error.type === RESULTS.UNAVAILABLE) {
            Alert.alert('This feature is not supported on this device');
          } else if (
            error.type === RESULTS.BLOCKED ||
            error.type === RESULTS.DENIED
          ) {
            Alert.alert(
              'Permission Denied',
              'Please give permission from settings to continue using camera.',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Go To Settings', onPress: () => goToSettings()},
              ],
            );
          }
        }
      });
  };

  const handleReadCode = (value: string) => {
    console.log(value);
    setQrText(value);
    setCameraShown(false);
  };

  return (
    <>
     <Text style={[styles.label, theme === 'dark' && {
                   color: 'white'
                 }]}>{item?.fieldtitle}</Text>
                 {item?.tooltip !== item?.fieldtitle && <Text style={[styles.label, theme === 'dark' && {
                   color: 'white'
                 }]}> - ( {item?.tooltip} ) </Text>}
                 {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
    
     <View style={[ cameraShown ? styles.container : {
      height: 60
    }]}>
      <TouchableOpacity
            onPress={takePermissions}
            activeOpacity={0.5}
           
            style={styles.itemContainer}>
            <Text style={styles.itemText}>Test</Text>
          </TouchableOpacity>
      {cameraShown && (
        <CameraScanner
          setIsCameraShown={setCameraShown}
          onReadCode={handleReadCode}
        />
      )}
    </View>
    </>
   
  );
};

export default ScanScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  label: {
      fontSize: 14,
      color: ERP_COLOR_CODE.ERP_333,
      marginBottom: 6,
      fontWeight: '600',
    },
  itemContainer: {
    width: '100%', 
    backgroundColor: 'white',
    justifyContent: 'center',
    marginVertical: 8,
    paddingVertical: 10,
    borderStartColor: "red"
  },
  itemText: {
    fontSize: 17,
    color: 'black',
  },
});
