import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Animated,
  PanResponder,
  AppState,
  useWindowDimensions,
} from "react-native";
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from "react-native-image-picker";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import CustomAlert from "../../../../components/alert/CustomAlert";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
import { useAppSelector } from "../../../../store/hooks";
import { useTranslation } from "react-i18next";
import InputError from "../../../../components/error/InputError";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";

const Media = ({
  isValidate,
  item,
  handleAttachment,
  infoData,
  baseLink,
  isFromNew,
  errors,
}: any) => {
  const { t } = useTranslation();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [modalClose, setModalClose] = useState(false);
  const [loadingSmall, setLoadingSmall] = useState(false);
  const [loadingLarge, setLoadingLarge] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const [alertVisible, setAlertVisible] = useState(false);
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [imageExists, setImageExists] = useState(true);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info" as "error" | "success" | "info",
  });

  console.log("Media Rendered with imageUri:", imageUri, "and errors:", errors);
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastTranslate = useRef({ x: 0, y: 0 });
  const theme = useAppSelector((state) => state?.theme.mode);

  const pendingCameraAction = useRef(false);
  const appState = useRef(AppState.currentState);

  const getImageUri = (type: "small" | "large") => {
    const base =
      imageUri ||
      `${baseLink}fileupload/1/${infoData?.tableName}/${infoData?.id}/${
        type === "small" ? `d_${item?.text}` : item?.text
      }`;
    console.log("Generated image URI:", base);
    return `${base}?cb=${cacheBuster}`;
  };

  // -------------------- Permissions --------------------
  const requestPermission = async (
    type: "camera" | "gallery",
  ): Promise<boolean> => {
    try {
      let permission;

      if (type === "camera") {
        permission =
          Platform.OS === "ios"
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA;
      } else {
        // Gallery / Photos
        if (Platform.OS === "ios") {
          permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
        }
        // else {
        //   // Android 13+
        //   if (Platform.Version >= 33) {
        //     permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
        //   } else {
        //     permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        //   }
        // }
      }

      let result = await check(permission);

      if (result === RESULTS.GRANTED) return true;

      if (result === RESULTS.DENIED) {
        result = await request(permission);
        if (result === RESULTS.GRANTED) return true;
      }

      if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
        setAlertConfig({
          title: `${type === "camera" ? "Camera" : "Gallery"} ${t("text28")}`,
          message: `${t("text29")} ${
            type === "camera" ? "camera" : "gallery"
          } ${t("text30")}`,
          type: "error",
        });
        setModalClose(true);
        setIsSettingVisible(true);
        setAlertVisible(true);

        if (type === "camera") pendingCameraAction.current = true;
        return false;
      }

      return result === RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  };

  // -------------------- AppState listener --------------------
  useEffect(() => {
    const writeLog = async (title: string, data?: any) => {
      try {
        const logPath = RNFS.DocumentDirectoryPath + "/camera_logs.txt";

        const time = new Date().toISOString();

        const log = `\n\n========== ${title} ==========\nTIME: ${time}\nDATA: ${JSON.stringify(
          data,
          null,
          2,
        )}\n`;

        await RNFS.appendFile(logPath, log, "utf8");

        console.log(title, data);
      } catch (e) {
        console.log("Log Write Error:", e);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        try {
          await writeLog("APP STATE CHANGED", {
            previous: appState.current,
            next: nextAppState,
            pendingCameraAction: pendingCameraAction.current,
          });

          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active" &&
            pendingCameraAction.current
          ) {
            await writeLog("RETURNED FROM SETTINGS");

            const granted = await requestPermission("camera");

            await writeLog("CAMERA PERMISSION RESULT", { granted });

            if (granted) {
              setIsSettingVisible(false);

              setAlertVisible(false);

              pendingCameraAction.current = false;

              await writeLog("LAUNCHING CAMERA");

              launchCamera(
                {
                  mediaType: "photo",

                  quality: 0.4,

                  includeBase64: true,

                  maxWidth: 500,
                  maxHeight: 500,

                  saveToPhotos: false,
                },
                async (response) => {
                  try {
                    await writeLog("CAMERA RESPONSE RECEIVED", {
                      didCancel: response?.didCancel,
                      errorCode: response?.errorCode,
                      errorMessage: response?.errorMessage,
                    });

                    if (response?.didCancel) {
                      await writeLog("USER CANCELLED CAMERA");
                      return;
                    }

                    if (response?.errorCode) {
                      await writeLog("CAMERA ERROR", {
                        errorCode: response?.errorCode,
                        errorMessage: response?.errorMessage,
                      });

                      return;
                    }

                    if (!response?.assets?.length) {
                      await writeLog("NO ASSETS FOUND");
                      return;
                    }

                    const asset = response.assets[0];

                    await writeLog("ORIGINAL ASSET", {
                      uri: asset?.uri,
                      type: asset?.type,
                      fileName: asset?.fileName,
                      fileSize: asset?.fileSize,
                      width: asset?.width,
                      height: asset?.height,
                    });

                    if (!asset?.uri) {
                      await writeLog("ASSET URI MISSING++++++++++++++++++++++++++++");
                      return;
                    }

                    let finalUri = asset.uri;

                    let finalBase64 = asset.base64 || "";

                    const base64SizeInMB =
                      (finalBase64.length * 3) / 4 / 1024 / 1024;

                    await writeLog("BASE64 SIZE", {
                      size: base64SizeInMB.toFixed(2) + " MB",
                    });

                    // AUTO COMPRESS
                    if (base64SizeInMB > 5) {
                      await writeLog("COMPRESSING IMAGE");

                      const resizedImage =
                        await ImageResizer.createResizedImage(
                          asset.uri,
                          500,
                          500,
                          "JPEG",
                          40,
                          0,
                        );

                      await writeLog("COMPRESSED IMAGE", resizedImage);

                      const compressedBase64 = await RNFS.readFile(
                        resizedImage.uri,
                        "base64",
                      );

                      const compressedSize =
                        (compressedBase64.length * 3) / 4 / 1024 / 1024;

                      await writeLog("COMPRESSED SIZE", {
                        size: compressedSize.toFixed(2) + " MB",
                      });

                      finalUri = resizedImage.uri;

                      finalBase64 = compressedBase64;
                    }

                    // UPDATE UI
                    setImageUri(finalUri);

                    setImageExists(true);

                    setCacheBuster(Date.now());

                    await writeLog("UI UPDATED");

                    // SEND TO BACKEND
                    handleAttachment(
                      `${item?.field}.jpeg;data:image/jpeg;base64,${finalBase64}`,
                      item.field,
                    );

                    await writeLog("BASE64 SENT TO BACKEND");

                    // CLEAN MEMORY
                    response.assets = [];

                    await writeLog("MEMORY CLEANED");
                  } catch (err) {
                    setImageExists(false);

                    await writeLog("IMAGE PROCESS ERROR", err);
                  }
                },
              );
            }
          }

          appState.current = nextAppState;
        } catch (error) {
          await writeLog("APPSTATE ERROR", error);
        }
      },
    );

    return () => {
      subscription.remove();

      writeLog("APPSTATE SUBSCRIPTION REMOVED");
    };
  }, []);

  // useLayoutEffect(()=>{
  //     setLoadingSmall(false)
  // },[])
  // -------------------- Render Media Options --------------------
  const renderMedia = () => {
    if (item?.ctltype === "IMAGE") {
      return [
        {
          text: "Camera",
          icon: "photo-camera",

          onPress: async () => {
            try {
              console.log("========== CAMERA START ==========");

              const granted = await requestPermission("camera");

              console.log("Camera Permission:", granted);

              if (!granted) {
                console.log("Permission Denied");
                return;
              }

              launchCamera(
                {
                  mediaType: "photo",
                  // INITIAL COMPRESS
                  quality: 0.4,
                  // BACKEND REQUIREMENT
                  includeBase64: true,

                  maxWidth: 500,
                  maxHeight: 500,

                  saveToPhotos: false,
                },
                async (response) => {
                  try {
                    console.log("Camera Response Received");

                    if (response?.didCancel) {
                      console.log("User Cancelled Camera");
                      return;
                    }

                    if (response?.errorCode) {
                      console.log(
                        "Camera Error:",
                        response?.errorCode,
                        response?.errorMessage,
                      );
                      return;
                    }

                    if (!response?.assets?.length) {
                      console.log("No Assets Found");
                      return;
                    }

                    const asset = response.assets[0];

                    console.log("Original Asset:", {
                      uri: asset?.uri,
                      type: asset?.type,
                      fileName: asset?.fileName,
                      fileSize: asset?.fileSize,
                      width: asset?.width,
                      height: asset?.height,
                    });

                    if (!asset?.uri) {
                      console.log("Asset URI Missing");
                      return;
                    }

                    let finalUri = asset.uri;
                    let finalBase64 = asset.base64 || "";

                    const base64SizeInMB =
                      (finalBase64.length * 3) / 4 / 1024 / 1024;

                    console.log(
                      "Original Base64 Size:",
                      base64SizeInMB.toFixed(2),
                      "MB",
                    );

                    // LARGE IMAGE -> AUTO COMPRESS
                    if (base64SizeInMB > 5) {
                      console.log("Large Image Detected -> Compressing");

                      const resizedImage =
                        await ImageResizer.createResizedImage(
                          asset.uri,
                          500,
                          500,
                          "JPEG",
                          40,
                          0,
                        );

                      console.log("Compressed Image:", resizedImage);

                      const compressedBase64 = await RNFS.readFile(
                        resizedImage.uri,
                        "base64",
                      );

                      const compressedSize =
                        (compressedBase64.length * 3) / 4 / 1024 / 1024;

                      console.log(
                        "Compressed Base64 Size:",
                        compressedSize.toFixed(2),
                        "MB",
                      );

                      finalUri = resizedImage.uri;
                      finalBase64 = compressedBase64;
                    } else {
                      console.log("Compression Not Required");
                    }

                    // UI UPDATE
                    setImageExists(true);

                    setImageUri(finalUri);

                    setCacheBuster(Date.now());

                    console.log("Image State Updated");

                    // SEND TO BACKEND
                    handleAttachment(
                      `${item?.field}.jpeg;data:image/jpeg;base64,${finalBase64}`,
                      item?.field,
                    );

                    console.log("Base64 Sent To Backend");

                    // CLEAN MEMORY
                    response.assets = [];

                    console.log("Memory Cleaned");

                    console.log("========== CAMERA SUCCESS ==========");
                  } catch (err) {
                    console.log(
                      "Image Process Error:",
                      JSON.stringify(err, null, 2),
                    );

                    setImageExists(false);
                  }
                },
              );
            } catch (error) {
              console.log(
                "Camera Launch Error:",
                JSON.stringify(error, null, 2),
              );
            }
          },
        },
      ];
    } else if (item?.ctltype === "PHOTO") {
      return [
        {
          text: "Camera",
          icon: "photo-camera",

          onPress: async () => {
            try {
              console.log("========== CAMERA START ==========");

              const granted = await requestPermission("camera");

              console.log("Camera Permission:", granted);

              if (!granted) {
                console.log("Permission Denied");
                return;
              }

              launchCamera(
                {
                  mediaType: "photo",
                  quality: 0.4,
                  includeBase64: true,
                  maxWidth: 500,
                  maxHeight: 500,
                  saveToPhotos: false,
                },
                async (response) => {
                  try {
                    console.log("Camera Response Received");
                    if (response?.didCancel) {
                      console.log("User Cancelled Camera");
                      return;
                    }

                    if (response?.errorCode) {
                      console.log(
                        "Camera Error:",
                        response?.errorCode,
                        response?.errorMessage,
                      );
                      return;
                    }

                    if (!response?.assets?.length) {
                      console.log("No Assets Found");
                      return;
                    }

                    const asset = response.assets[0];

                    console.log("Original Asset:", {
                      uri: asset?.uri,
                      type: asset?.type,
                      fileName: asset?.fileName,
                      fileSize: asset?.fileSize,
                      width: asset?.width,
                      height: asset?.height,
                    });

                    if (!asset?.uri) {
                      console.log("Asset URI Missing");
                      return;
                    }

                    let finalUri = asset.uri;
                    let finalBase64 = asset.base64 || "";

                    const base64SizeInMB =
                      (finalBase64.length * 3) / 4 / 1024 / 1024;

                    console.log(
                      "Original Base64 Size:",
                      base64SizeInMB.toFixed(2),
                      "MB",
                    );

                    // LARGE IMAGE -> AUTO COMPRESS
                    if (base64SizeInMB > 5) {
                      console.log("Large Image Detected -> Compressing");

                      const resizedImage =
                        await ImageResizer.createResizedImage(
                          asset.uri,
                          500,
                          500,
                          "JPEG",
                          40,
                          0,
                        );

                      console.log("Compressed Image:", resizedImage);

                      const compressedBase64 = await RNFS.readFile(
                        resizedImage.uri,
                        "base64",
                      );

                      const compressedSize =
                        (compressedBase64.length * 3) / 4 / 1024 / 1024;

                      console.log(
                        "Compressed Base64 Size:",
                        compressedSize.toFixed(2),
                        "MB",
                      );

                      finalUri = resizedImage.uri;
                      finalBase64 = compressedBase64;
                    } else {
                      console.log("Compression Not Required");
                    }

                    // UI UPDATE
                    setImageExists(true);

                    setImageUri(finalUri);

                    setCacheBuster(Date.now());

                    console.log("Image State Updated");

                    // SEND TO BACKEND
                    handleAttachment(
                      `${item?.field}.jpeg;data:image/jpeg;base64,${finalBase64}`,
                      item?.field,
                    );

                    console.log("Base64 Sent To Backend");

                    // CLEAN MEMORY
                    response.assets = [];

                    console.log("Memory Cleaned");

                    console.log("========== CAMERA SUCCESS ==========");
                  } catch (err) {
                    console.log(
                      "Image Process Error:",
                      JSON.stringify(err, null, 2),
                    );

                    setImageExists(false);
                  }
                },
              );
            } catch (error) {
              console.log(
                "Camera Launch Error:",
                JSON.stringify(error, null, 2),
              );
            }
          },
        },
        {
          text: "Gallery",
          icon: "photo-library",
          onPress: async () => {
            const granted = await requestPermission("gallery");
            if (!granted) return;

            launchImageLibrary(
              { mediaType: "photo", quality: 0.5, includeBase64: true },
              (response) => {
                if (response.assets && response.assets.length > 0) {
                  const asset: Asset = response.assets[0];
                  setImageUri(asset.uri || null);
                  setCacheBuster(Date.now());
                  handleAttachment(
                    `${item?.field}.jpeg; data:${asset.type};base64,${asset.base64}`,
                    item.field,
                  );
                }
              },
            );
          },
        },
      ];
    }
    return [];
  };

  const handleChooseImage = () => {
    setPickerModalVisible(true);
  };
  // -------------------- PanResponder & Zoom --------------------
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gesture) => {
        if (gesture.numberActiveTouches === 1) {
          translateX.setValue(lastTranslate.current.x + gesture.dx);
          translateY.setValue(lastTranslate.current.y + gesture.dy);
        } else if (gesture.numberActiveTouches === 2) {
          const touches = evt.nativeEvent.touches;
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (!lastScale.currentDistance) lastScale.currentDistance = distance;
          const scaleFactor = distance / lastScale.currentDistance;
          scale.setValue(
            Math.max(1, Math.min(3, lastScale.current * scaleFactor)),
          );
        }
      },
      onPanResponderRelease: (_, gesture) => {
        lastTranslate.current.x += gesture.dx;
        lastTranslate.current.y += gesture.dy;
        lastScale.current = scale.__getValue();
        lastScale.currentDistance = undefined;
      },
    }),
  ).current;

  const zoomIn = () => {
    scale.setValue(Math.min(3, scale.__getValue() + 0.2));
    lastScale.current = scale.__getValue();
  };

  const zoomOut = () => {
    scale.setValue(Math.max(1, scale.__getValue() - 0.2));
    lastScale.current = scale.__getValue();
  };
  // -------------------- JSX --------------------
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={[
            styles.label,
            theme === "dark" && {
              color: "white",
            },
          ]}
        >
          {item?.fieldtitle}
        </Text>
        {item?.tooltip !== item?.fieldtitle && (
          <Text
            style={[
              styles.label,
              theme === "dark" && {
                color: "white",
              },
            ]}
          >
            {" "}
            - ( {item?.tooltip} ){" "}
          </Text>
        )}
        {item?.mandatory === "1" && (
          <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          if (!imageExists) {
            handleChooseImage();
          } else if (!isFromNew) {
            setModalVisible(true);
          }
        }}
        style={[
          styles.imageWrapper,
          !imageExists && {
            width: "100%",
            borderWidth: 1.5,
            borderRadius: 10,
            borderColor:
              theme === "dark" ? "#fff" : ERP_COLOR_CODE.ERP_APP_COLOR,
            marginBottom: 8,
            borderStyle: "dashed",
            backgroundColor: theme === "dark" ? "#000" : "#f8f9ff",
          },
          errors[item?.field] && {
            borderColor: ERP_COLOR_CODE.ERP_ERROR,
          },
        ]}
      >
        <View
          style={[
            theme === "dark" && {
              borderWidth: imageExists ? 1 : 0,
              borderColor: "white",
            },
            { width: imageExists ? 100 : 200, height: 100 },
          ]}
        >
          {/* {loadingSmall && (
      <ActivityIndicator
        style={StyleSheet.absoluteFill}
        size="small"
        color={theme === 'dark' ? 'white' : 'black'}
      />
    )} */}

          {!imageExists && (
            <View
              style={{
                marginTop: 18,
                alignItems: "center",
                gap: 4,
              }}
            >
              <MaterialIcons
                name="add-photo-alternate"
                color={
                  theme === "dark" ? "white" : ERP_COLOR_CODE.ERP_APP_COLOR
                }
                size={38}
              />
              <Text style={{ color: ERP_COLOR_CODE.ERP_999 }}>
                Please upload image
              </Text>
            </View>
          )}

          {imageExists && (
            <Image
              source={{
                uri: imageUri ? imageUri : getImageUri("small"),
              }}
              style={styles.imageThumb}
              resizeMode="cover"
              onLoadStart={() => setLoadingSmall(true)}
              onLoad={() => {
                setImageExists(true);
                setLoadingSmall(false);
              }}
              onError={() => {
                setImageExists(false);
                setLoadingSmall(false);
              }}
              fadeDuration={0}
            />
          )}
        </View>

        {imageExists && (
          <TouchableOpacity
            onPress={handleChooseImage}
            style={[
              styles.editBtn,
              theme === "dark" && {
                borderWidth: 1,
                borderColor: "white",
                backgroundColor: "black",
              },
            ]}
          >
            <MaterialIcons
              name="edit"
              color={theme === "dark" ? "white" : ERP_COLOR_CODE.ERP_BLACK}
              size={20}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {!imageExists && errors[item?.field] && (
        <>
          <InputError error={errors[item?.field]} />
          <View style={{ height: 8 }} />
        </>
      )}
      {/* Fullscreen Image Modal */}
      {modalVisible && (
        <Modal
          supportedOrientations={["portrait", "landscape"]}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            scale.setValue(1);
            translateX.setValue(0);
            translateY.setValue(0);
            lastTranslate.current = { x: 0, y: 0 };
            lastScale.current = 1;
            setModalVisible(false);
          }}
        >
          <View
            style={[
              styles.fullscreenModalOverlay,
              isLandscape && {
                alignContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={[
                styles.fullscreenModalContent,
                {
                  width: isLandscape ? "50%" : "100%",
                },
              ]}
            >
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  scale.setValue(1);
                  translateX.setValue(0);
                  translateY.setValue(0);
                  lastTranslate.current = { x: 0, y: 0 };
                  lastScale.current = 1;
                  setModalVisible(false);
                }}
              >
                <MaterialIcons
                  name="close"
                  size={30}
                  color={theme === "dark" ? "white" : ERP_COLOR_CODE.ERP_WHITE}
                />
              </TouchableOpacity>

              {loadingLarge && (
                <ActivityIndicator
                  style={StyleSheet.absoluteFill}
                  size="large"
                  color={ERP_COLOR_CODE.ERP_WHITE}
                />
              )}

              <Animated.View
                style={{
                  width: "100%",
                  height: "100%",
                  transform: [{ scale }, { translateX }, { translateY }],
                }}
                {...panResponder.panHandlers}
              >
                <Image
                  source={{ uri: getImageUri("large") }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"
                  onLoadStart={() => setLoadingLarge(true)}
                  onLoadEnd={() => setLoadingLarge(false)}
                />
              </Animated.View>

              <View style={styles.zoomControls}>
                <TouchableOpacity style={styles.zoomBtn} onPress={zoomIn}>
                  <MaterialIcons name="zoom-in" size={28} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.zoomBtn} onPress={zoomOut}>
                  <MaterialIcons name="zoom-out" size={28} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Picker Modal */}
      {pickerModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          supportedOrientations={["portrait", "landscape"]}
          visible={pickerModalVisible}
          onRequestClose={() => setPickerModalVisible(false)}
        >
          <View
            style={[
              styles.modalOverlay,
              isLandscape && {
                alignContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={[
                styles.modalContent,
                theme === "dark" && {
                  borderWidth: 1,
                  borderColor: "white",
                  backgroundColor: "black",
                },
                {
                  width: isLandscape ? "50%" : "100%",
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text
                  style={[
                    styles.modalTitle,
                    theme === "dark" && {
                      color: "white",
                    },
                  ]}
                >
                  {t("text31")}
                </Text>
                <TouchableOpacity onPress={() => setPickerModalVisible(false)}>
                  <MaterialIcons
                    name="close"
                    size={24}
                    color={theme === "dark" ? "white" : "black"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.optionRow}>
                {renderMedia().map((option, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.optionCard,
                      theme === "dark" && {
                        backgroundColor: "black",
                        borderWidth: 1,
                        borderColor: "white",
                      },
                    ]}
                    onPress={async () => {
                      setPickerModalVisible(false);
                      await option.onPress();
                    }}
                  >
                    <MaterialIcons
                      name={option?.icon}
                      size={36}
                      color={theme === "dark" ? "white" : "black"}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: theme === "dark" ? "white" : "black",
                        },
                      ]}
                    >
                      {option?.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Custom Alert for permissions */}
      {alertVisible && (
        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={() => {
            if (!modalClose) {
              setAlertVisible(false);
            }
          }}
          isSettingVisible={isSettingVisible}
          actionLoader={undefined}
          closeHide={undefined}
        />
      )}
    </>
  );
};
const styles = StyleSheet.create({
  imageWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },

  label: {
    fontSize: 14,
    color: ERP_COLOR_CODE.ERP_333,
    marginBottom: 6,
    fontWeight: "600",
  },

  imageThumb: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 10,
  },

  editBtn: {
    height: 36,
    width: 36,
    borderRadius: 8,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    position: "absolute",
    bottom: 28,
    left: Dimensions.get("screen").width / 1.84,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  /* ---------- Bottom Sheet ---------- */

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    alignItems: "center",
    maxHeight: "60%",
    width: "100%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 12,
  },

  optionCard: {
    width: 100,
    height: 100,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },

  optionLabel: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
  },

  /* ---------- FULLSCREEN IMAGE MODAL (IMPROVED) ---------- */

  fullscreenModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullscreenModalContent: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  fullscreenImage: {
    width: "100%",
    height: "100%",
  },

  closeBtn: {
    position: "absolute",
    top: 48,
    right: 20,
    zIndex: 20,

    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  zoomControls: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    gap: 16,

    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },

  zoomBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Media;
