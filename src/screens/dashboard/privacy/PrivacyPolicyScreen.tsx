import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import FullViewLoader from "../../../components/loader/FullViewLoader";
import { ERP_COLOR_CODE } from "../../../utils/constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAppSelector } from "../../../store/hooks";
import useTranslations from "../../../hooks/useTranslations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ERPIcon from "../../../components/icon/ERPIcon";
import { useBaseLink } from "../../../hooks/useBaseLink";

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const theme = useAppSelector((state) => state.theme.mode);
  const { t } = useTranslations();
  const baseLink = useBaseLink();

  const webviewRef = useRef<WebView>(null);

  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;

  // Params
  const item = route?.params?.item;
  const isFromChart = route?.params?.isFromChart;
  const passedUrl = route?.params?.url;
  const title = route?.params?.titlePage || "";

  const defaultUrl =
    "http://www.deverp.com/index.aspx?q=deverp_privacy_policy";

  const [token, setToken] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [isReloading, setIsReloading] = useState(true);
  const [webKey, setWebKey] = useState(Date.now());

  // Load token
  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem("erp_token");
      setToken(storedToken || "");
    })();
  }, []);

  // Build URL
  const finalUrl = useMemo(() => {
    if (passedUrl) return passedUrl;

    if (isFromChart) {
      return `${baseLink}app/index.html?dashboard/0/&token=${token}`;
    }

    if (item?.url) {
      return `${baseLink}${item.url}&token=${token}`;
    }

    return defaultUrl;
  }, [passedUrl, isFromChart, item, token, baseLink]);

  // Reload on landscape
  useEffect(() => {
    reloadWebView();
  }, [isLandscape]);

  // Cleanup
  useEffect(() => {
    return () => {
      try {
        webviewRef.current?.clearCache(true);
      } catch (e) {}
    };
  }, []);

  // Reload function
  const reloadWebView = () => {
    setWebKey(Date.now());
    setIsReloading(true);
    setIsHidden(false);
  };

  // Toggle div inside WebView
  const toggleDiv = () => {
    const jsCode = `
      (function() {
        const div = document.getElementById('divPage');
        if (div) {
          div.style.display = '${isHidden ? "block" : "none"}';
        }
      })();
      true;
    `;
    webviewRef.current?.injectJavaScript(jsCode);
    setIsHidden((prev) => !prev);
  };

  // Header config
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor:
          theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_APP_COLOR,
      },
      headerTintColor: "#fff",
      headerBackTitle: "",
      headerTitle: () => (
        <Text
          numberOfLines={1}
          style={{
            maxWidth: 180,
            fontSize: 18,
            fontWeight: "700",
            color: "#fff",
          }}
        >
          {title ||
            (isFromChart
              ? t("text.text52")
              : item?.name || t("title.title19"))}
        </Text>
      ),
      headerRight: () => (
        <>
          <ERPIcon name={"refresh"} onPress={reloadWebView} />
          {!isFromChart && item?.name !== "Attendance Code" && (
            <ERPIcon
              name={isHidden ? "close" : "filter-alt"}
              onPress={toggleDiv}
            />
          )}
        </>
      ),
    });
  }, [navigation, theme, isHidden, item, isFromChart]);

  const injectedCSS = `
  (function() {
    var meta = document.createElement('meta'); 
    meta.name = 'viewport'; 
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'; 
    document.getElementsByTagName('head')[0].appendChild(meta);

    document.body.style.overflow = 'hidden';   // extra scroll remove
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  })();
  true;
`;


  return (
    <SafeAreaView style={styles.container}>
      {!finalUrl || (isFromChart && !token) ? (
        <FullViewLoader />
      ) : (
        <>
          <WebView
            key={webKey}
            ref={webviewRef}
            source={{ uri: finalUrl }}
            javaScriptEnabled={true} 
            style={styles.webview}  
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onLoadStart={() => setIsReloading(true)}
            onLoadEnd={() => setIsReloading(false)}
            onError={() => setIsReloading(false)}
            onLoadProgress={({ nativeEvent }) => {
              if (nativeEvent.progress === 1) {
                setIsReloading(false);
              }
            }} 
            originWhitelist={['*']}
            setBuiltInZoomControls={false}
            setDisplayZoomControls={false}
            bounces={false}
            overScrollMode="never"  
            androidLayerType="hardware"
            scrollEnabled={true}
            injectedJavaScriptBeforeContentLoaded={injectedCSS} 
            automaticallyAdjustContentInsets={false}
             allowsInlineMediaPlayback={true} 

           />

          {isReloading && (
            <View style={styles.loaderContainer}>
              <FullViewLoader isShowTop={false} />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
  webview: {
    flex: 1,
     backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
  },
});