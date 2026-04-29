import { Platform, StatusBar,
  SafeAreaView,
  Text, useWindowDimensions, View, 
  Dimensions} from "react-native";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import WebView from "react-native-webview";
import { ERP_COLOR_CODE } from "../../../utils/constants";
import useTranslations from "../../../hooks/useTranslations";
import FullViewLoader from "../../../components/loader/FullViewLoader";
 import { useBaseLink } from "../../../hooks/useBaseLink";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ERPIcon from "../../../components/icon/ERPIcon";
import { useAppSelector } from "../../../store/hooks";
import { styles } from "./web_style";

const WebScreen = () => {
  const { t } = useTranslations();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { item, isFromChart } = route.params;
  console.log("item:", item, "isFromChart:", isFromChart);
  const [token, setToken] = useState<string>("");
  const [isHidden, setIsHidden] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const webviewRef = useRef<WebView>(null);
  const baseLink = useBaseLink();
  const theme = useAppSelector((state) => state?.theme.mode);
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const url = isFromChart
    ? `${baseLink}app/index.html?dashboard/0/&token=${token}`
    : "";

  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem("erp_token");
      setToken(storedToken || "");
    })();
  }, []);

  useEffect(() => {
    return () => {
      try {
        webviewRef.current?.clearCache(true);
        // webviewRef.current?.clearHistory();
      } catch (e) {}
    };
  }, []);

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
    webviewRef?.current?.injectJavaScript(jsCode);
    setIsHidden((prev) => !prev);
  };
  const [webKey, setWebKey] = useState(Date.now());

  useEffect(() => {
    return () => {
      setWebKey(Date.now());
    };
  }, []);

  const reloadWebView = () => {
    setWebKey(Date.now());

    setIsReloading(true);
    setIsHidden(false);
    try {
      webviewRef.current?.clearCache(true);
      // webviewRef.current?.clearHistory();
    } catch (e) {}
    webviewRef.current?.reload();
  };

  useEffect(() =>{
    reloadWebView();
  }, [isLandscape])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          numberOfLines={1}
          style={{
            maxWidth: 180,
            fontSize: 18,
            fontWeight: "700",
            color: "white",
          }}
        >
          {isFromChart
            ? t("text.text52")
            : item?.name || t("webScreen.details")}
        </Text>
      ),
      headerBackTitle: "",
      headerRight: () => (
        <>
          {isFromChart || item?.name === "Attendance Code" ? (
            <>
              <ERPIcon name={"refresh"} onPress={reloadWebView} />
            </>
          ) : (
            <>
              <ERPIcon name={"refresh"} onPress={reloadWebView} />
              <ERPIcon
                name={isHidden ? "close" : "filter-alt"}
                onPress={toggleDiv}
              />
            </>
          )}
        </>
      ),
    });
  }, [navigation, item?.title, t, isHidden]);

  const targetUrl = useMemo(() => {
    const itemUrl = item?.url || "";
    return `${baseLink}${itemUrl}&token=${token}`;
  }, [baseLink, item?.url, token]);

  
  return (
    <View  style={[
      styles.container,
    ]}>
      {token ? (
        <View style={{
          backgroundColor: "green",
          height: Dimensions.get("window").height - 22, marginTop: 22}}>
          {/* <WebView
            ref={webviewRef}
            originWhitelist={["*"]}
            mixedContentMode="always"
            source={{ uri: isFromChart ? url : targetUrl }}
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
                  styles.webviewLoadingContainer,
                  theme === "dark" && {
                    backgroundColor: "black",
                  },
                ]}
              >
                <View
                  style={[
                    styles.webviewLoadingContent,
                    theme === "dark" && {
                      backgroundColor: "black",
                    },
                  ]}
                >
                  <FullViewLoader isShowTop={false} />
                </View>
              </View>
            )}
            allowsBackForwardNavigationGestures={true}
            textZoom={100}
            allowsLinkPreview={false}
            onError={(syntheticEvent) => {
              console.log("syntheticEvent:", syntheticEvent);
              const { nativeEvent } = syntheticEvent;
              setIsReloading(false);
            }}
            onLoadStart={() => {
              webviewRef.current?.clearCache(true);
              setIsReloading(true);
            }}
            onLoadEnd={() => {
              setIsReloading(false);
             
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
          /> */}
        </View>
      ) : (
        <FullViewLoader />
      )}
    </View>
  );
};

export default WebScreen;
