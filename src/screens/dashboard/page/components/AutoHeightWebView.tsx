import React, { useState, useRef } from 'react';
import { Platform, View, useWindowDimensions } from 'react-native';
import WebView from 'react-native-webview';
import RenderHTML from 'react-native-render-html';
import { useAppSelector } from '../../../../store/hooks';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import DashboardChart from './DashboardChart';
import DeviceInfo from 'react-native-device-info';

const AutoHeightWebView = ({
  html,
  isFromPage,
  isHorizontal,
  isFromMenu,
  textColor,
  isFromListPage,
  isForChart,
  chartType,
  accentColors
}: {
  html: string;
  isFromPage?: boolean;
  isHorizontal: any;
  isFromMenu: any;
  textColor: any;
  isFromListPage: any;
  isForChart: any;
  chartType: any;
  accentColors: any

}) => {
  const [webViewHeight, setWebViewHeight] = useState(0);
  const { width, height } = useWindowDimensions();
  const webviewRef = useRef<WebView>(null);
  const theme = useAppSelector(state => state?.theme.mode);
  const isLandscape = width > height;
  const isDark = theme === "dark";
   const isIpad =
   ( Platform.OS === "ios" && Platform.isPad) || DeviceInfo.isTablet() || Platform.isTV;

  const BG = isDark ? "#000000" : "#FFFFFF";
  const TEXT = isDark ? "#FFFFFF" : "#222222";
  const BORDER = isDark ? "#444" : "#ccc";
  const TH_BG = isDark ? "#1A1A1A" : "#f1f1f1";
  const EVEN_ROW = isDark ? "#111" : "#fafafa";
  
  const defaultCSS = `
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        overflow-y: scroll;
        overflow-x: scroll;
        background-color: ${BG} !important;
      }
      * {
        color: ${TEXT} !important;
        font-family: -apple-system, Roboto, 'Segoe UI', sans-serif !important;
        font-size: 15px !important;
        word-wrap: break-word !important;
      }
      body > *:last-child { margin-bottom: 0 !important; }
      table {
        height: 100% !important;
        width: ${isIpad ? '44%' :  isFromListPage ? isLandscape ? '40%' : '89.8%' : isFromPage ? '92%' : isLandscape ? '82%' : '88%'} !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        word-break: break-word !important;
      }
        
      th, td {
        border: 1px solid ${BORDER} !important;
        padding: 6px !important;
        text-align: left !important;
      } 
      tr:nth-child(even) { background: ${EVEN_ROW} !important; }
      img { max-width: 100% !important; height: auto !important; display: block !important; }
      div, p, span, h1,h2,h3,h4,h5,h6 {
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
    </style>
  `;


  const cleanedHTML = html
    .replace(/<h[1-6]>\s*<table/gi, "<table")
    .replace(/<\/table>\s*<\/h[1-6]>/gi, "</table>");

   const formattedHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
        ${defaultCSS}
      </head>
      <body>${cleanedHTML}</body>
    </html>
  `;

  const injectedJS = `
    (function() {
      function sendHeight() {
        const body = document.body;
        const html = document.documentElement;
        const height = Math.max(
          body.scrollHeight, body.offsetHeight,
          html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        window.ReactNativeWebView.postMessage(height.toString());
      }

      const resizeObserver = new ResizeObserver(sendHeight);
      resizeObserver.observe(document.body);

      sendHeight();
    })();
    true;
  `;


  

  const renderers = {
    i: ({ tnode }) => {
      const className = tnode?.domNode?.attribs?.class || "";
      const match = className.match(/fa fa-([a-z-]+)/);

      if (match) {
        const iconName = match[1];

        return (
          <FontAwesome
            name={iconName}
            size={20}
            color={iconName.includes("down") ? "red" : "green"}
            style={{ marginHorizontal: 4 }}
          />
        );
      }

      return null;
    },
  };

  console.log("html", html)
const cleanedHtml1 = html
  // remove onclick
  .replace(/onclick='[^']*'/gi, "")

  // remove button completely
  .replace(/<button[\s\S]*?<\/button>/gi, "")

  // show hidden section
  .replace(/display:none/gi, "display:block");
  return (
    <View
      style={{
        overflow: 'hidden',
        width: isLandscape ? width - 150 : width - 40,
        backgroundColor: BG,
        marginVertical: 4
      }}
    >
      {html.includes('<table ') ? (
        <>
          {
            isForChart ? <>
              <DashboardChart
                accentColors={textColor}
                isForChart={isForChart}
                chartType={chartType}
                html={cleanedHTML} />
            </> : <WebView
              ref={webviewRef}
              source={{ html: formattedHTML }}
              style={{
                width,
                height: webViewHeight || 1,
                backgroundColor: BG
              }}
              injectedJavaScript={injectedJS}
              onMessage={event => {
                const height = Number(event.nativeEvent.data);
                if (!isNaN(height) && height > 0) {
                  setWebViewHeight(height);
                }
              }}
              scrollEnabled={false}
              originWhitelist={['*']}
            />
          }
        </>

      ) : (
        <RenderHTML
          contentWidth={width}
          source={{ html }}
          baseStyle={{
            borderRadius: 6,
            width:  isLandscape ? width / 5.5 : isFromMenu ? '80%' : isHorizontal ? '100%' : width / 2.5,
          }}
          tagsStyles={{
            p: {
              flexDirection: 'row',
              overflow: 'hidden',
              color: isFromMenu ? textColor : TEXT,
              maxWidth: isFromMenu ? '80%' : isHorizontal ? '100%' : 100,
            },
            b: {
              flexDirection: 'row',
              overflow: 'hidden',
              color: isFromMenu ? textColor : TEXT,
              maxWidth: isFromMenu ? '80%' : isHorizontal ? '100%' : 100,
            },
            strong: {
              fontSize: 16,
              fontWeight: 'bold',
              flexDirection: 'row',
              overflow: 'hidden',
              color: isFromMenu ? textColor : TEXT,
              maxWidth: isFromMenu ? '80%' : isHorizontal ? '100%' : 100,
            },
            i: { fontStyle: 'italic' },
            div: {
              flexDirection: 'row',
              flexWrap: 'wrap',
              maxWidth: width,
              color: isFromMenu ? textColor : TEXT,
            },
          }}
          renderers={renderers}
        />

      )}
    </View>
  );
};

export default AutoHeightWebView;
