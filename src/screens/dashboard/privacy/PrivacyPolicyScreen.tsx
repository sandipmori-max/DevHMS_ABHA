import React, { useEffect, useLayoutEffect } from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import FullViewLoader from '../../../components/loader/FullViewLoader';
import { ERP_COLOR_CODE } from '../../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../store/hooks';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();
    const theme = useAppSelector(state => state.theme.mode);

   useLayoutEffect(() => {
       navigation.setOptions({
          headerStyle: {
                                backgroundColor: theme === 'dark' ? 'black' : ERP_COLOR_CODE.ERP_APP_COLOR,   // <-- BLACK HEADER
                              },
                              headerTintColor: '#fff', 
         headerTitle: () => (
           <Text
             numberOfLines={1}
             style={{
               maxWidth: 180,
               fontSize: 18,
               fontWeight: '700',
               color:  theme === 'dark' ? "white" : ERP_COLOR_CODE.ERP_WHITE,
             }}
           >
             {'Privacy policy'}
           </Text>
         ),
       
       });
   }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{
          uri: Platform.OS === 'ios'
            ? 'https://www.deverp.com/index.aspx?q=deverp_privacy_policy'
            : 'http://www.deverp.com/index.aspx?q=deverp_privacy_policy'
        }}      
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={false}
        style={styles.webview}
        renderLoading={() => (
          <View style={styles.loaderContainer}>
            <FullViewLoader />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE, 
  },
});

export default PrivacyPolicyScreen;
