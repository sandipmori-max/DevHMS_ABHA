import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuthStateThunk } from '../store/slices/auth/thunk';
import DevERPService from '../services/api/deverp';
import AuthNavigator from './AuthNavigator';
import StackNavigator from './StackNavigator';
import FullViewLoader from '../components/loader/FullViewLoader';
import DeviceInfo from 'react-native-device-info';
import { generateGUID } from '../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RootNavigatorTvOS = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, } = useAppSelector(state => state.auth);
 
  const app_id = generateGUID();

  useEffect(() => {
    const fetchDeviceName = async () => {
      const name = await DeviceInfo.getDeviceName();
      let appid = await AsyncStorage.getItem('appid');
      if (!appid) {
        appid = app_id;
        await AsyncStorage.setItem('appid', appid);
      }
      await AsyncStorage.setItem('device', name);

      DevERPService.initialize();
      DevERPService.setAppId(appid);
      DevERPService.setDevice(name);

      dispatch(checkAuthStateThunk());
    };
    fetchDeviceName();
  }, [dispatch]);
 
  if (isLoading) {
    return <FullViewLoader />;
  }

  return (
    <>
      {isAuthenticated ? <StackNavigator /> : <AuthNavigator />}
    </>
  );
};

export default RootNavigatorTvOS;
