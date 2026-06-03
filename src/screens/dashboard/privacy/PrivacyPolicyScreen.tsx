import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import { useBaseLink } from "../../../hooks/useBaseLink";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isTV = Platform.isTV;

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

    try {
      webviewRef.current?.clearCache(true);
    } catch (e) {}

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
       headerShown: !isTV,
      headerStyle: {
        backgroundColor:
          theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_APP_COLOR,
       },
 
      headerTintColor: "#fff",
      headerBackTitle: "",
      headerTitle: () => (
       !isTV && (
         <Text
          numberOfLines={1}
          style={{ 
            fontSize: 18,
            fontWeight: "700",
            color: "#fff",
          }}
        >
          {title ||
            (isFromChart
              ? t("text.text52")
              : item?.name || t("title.title19"))}
        </Text>)
      ),
      headerRight: () => (
        <>
        {/* {
         finalUrl !== defaultUrl && !passedUrl && <> 
          <ERPIcon name={"refresh"} onPress={reloadWebView} />
          {!isFromChart && item?.name !== "Attendance Code" && (
            <ERPIcon
              name={isHidden ? "close" : "filter-alt"}
              onPress={toggleDiv}
            />
          )}
          </>
        } */}
          
        </>
      ),
    });
  }, [navigation, theme, isHidden, item, isFromChart]);

  const [canGoBack, setCanGoBack] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (canGoBack) {
              webviewRef.current?.goBack();
            } else {
              navigation.goBack();
            }
          }}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      ),
    });
  }, [canGoBack]);
    return (
      <SafeAreaView style={styles.container}>
        {!finalUrl || (isFromChart && !token) ? (
          <FullViewLoader />
        ) : (
          <>
            <WebView
              ref={webviewRef}
              source={{ uri: finalUrl }}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={false}
              style={styles.webview}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              bounces={false}
              scrollEnabled={true}
              decelerationRate={0.998}
              cacheEnabled={true}
              incognito={true}
              cacheMode="LOAD_DEFAULT"
              renderLoading={() => (
                <View
                  style={[
                    styles.loaderContainer,
                    theme === "dark" && {
                      backgroundColor: "black",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.loaderContainer,
                      theme === "dark" && {
                        backgroundColor: "black",
                      },
                    ]}
                  >
                    <FullViewLoader isShowTop={false} />
                  </View>
                </View>
              )}
              onNavigationStateChange={(navState) => {
                    setCanGoBack(navState.canGoBack);

                console.log("Current URL:", navState.url);
              }}
              allowsBackForwardNavigationGestures={true}
              textZoom={100}
              allowsLinkPreview={false}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                setIsReloading(false);
              }}
              onLoadStart={() => {
                webviewRef.current?.clearCache(true);
                // webviewRef.current?.clearHistory();
                setIsReloading(true);
              }}
              onLoadEnd={() => {
                setIsReloading(false);
                // const jsCode = `
                //   (function() {
                //     const div = document.getElementById('divPage');
                //     if (div) {
                //       div.style.display = 'none';
                //     }
                //   })();
                //   true;
                // `;
                // webviewRef.current?.injectJavaScript(jsCode);
                // setIsHidden(true)
              }}
              injectedJavaScript={`
                (function() {
                  const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
                  const allClasses = Array.from(document.querySelectorAll('[class]')).map(el => el.className);
                  window.ReactNativeWebView.postMessage(JSON.stringify({ ids: allIds, classes: allClasses }));
                })();
                true;
              `}
              onMessage={(event) => {
                const data = JSON.parse(event.nativeEvent.data);
              }}

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