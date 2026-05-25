import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { styles } from "../page_style";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
import { getDDLThunk } from "../../../../store/slices/dropdown/thunk";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import FullViewLoader from "../../../../components/loader/FullViewLoader";
import useTranslations from "../../../../hooks/useTranslations";
import InputError from "../../../../components/error/InputError";
import NoData from "../../../../components/no_data/NoData";
import TranslatedText from "../../tabs/home/TranslatedText";
import { getDashboardIcon } from "../../../../utils/helpers";
import LableInfo from "./LableInfo";

const CustomPicker = ({
  isValidate,
  label,
  selectedValue,
  onValueChange,
  item,
  errors,
  dtext,
  isForceOpen,
  isForMultipleSelection = false,
  isFromDashboard = false,
  isFromChild = false,
}: any) => {
  const { t } = useTranslations();
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const SCREEN_HEIGHT = height;
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [loader, setLoader] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const theme = useAppSelector((state) => state?.theme.mode);
  const { user } = useAppSelector((state) => state?.auth);

  const optionsCache = useRef<{ [key: string]: any[] }>({});

  // Bottom sheet animation
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    setSelectedOption(dtext);
  }, [dtext]);

  // Animate bottom sheet OPEN
  const openBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  // Animate bottom sheet CLOSE
  const closeBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setOpen(false));
  };

  const handleOpen = useCallback(async () => {
    if (open) {
      closeBottomSheet();
      return;
    }

    setOpen(true);
    openBottomSheet();

    if (item?.dtlid && optionsCache.current[item.dtlid]) {
      setOptions(optionsCache.current[item.dtlid]);
      return;
    }

    setLoader(true);
    try {
      const res = await dispatch(
        getDDLThunk({
          dtlid: item?.dtlid,
          where: !isForceOpen ? `UserID in (${user?.id}, -1)` : item?.ddlwhere,
        }),
      ).unwrap();
      console.log("res of dropdown ++++++ +++ ++ + + ++ + + + + + + ", res);
      const data = res?.data ?? [];
      setOptions(data);
      if (item?.dtlid) optionsCache.current[item.dtlid] = data;
    } catch (e) {
      setOptions([]);
    } finally {
      setLoader(false);
    }
  }, [dispatch, item?.dtlid, item?.ddlwhere, open]);

  // const filtered = options.filter(item => item.value !== -1);
  const [contentHeight, setContentHeight] = useState(0);
  const MAX_HEIGHT = SCREEN_HEIGHT * 0.75;
  const MIN_HEIGHT = SCREEN_HEIGHT * 0.25;

  const dynamicHeight = Math.min(
    Math.max(contentHeight + 80, MIN_HEIGHT), // +80 header + padding
    MAX_HEIGHT,
  );
  return (
    <View style={{ marginBottom: isFromDashboard ? 2 : Platform.OS === 'android' ? 6  :8 }}>
      {/* Label */}
     
      <LableInfo 
      isFromDashboard={isFromDashboard}
      isFromChild={isFromChild}
        item={item}
        theme={theme}
      />
      {/* Picker Touch */}
      <TouchableOpacity
        style={[
          styles.pickerBox,
          item?.disabled === "1" && styles.disabledBox,
          item?.disabled === "1" &&
            theme === "dark" && {
              backgroundColor: "gray",
              borderWidth: 1,
            },
          isForceOpen &&
            errors[item?.field] && {
              borderColor: ERP_COLOR_CODE.ERP_ERROR,
            },
          isForceOpen &&
            isValidate &&
            item?.mandatory === "1" &&
            selectedOption && {
              borderColor: "green",
              borderWidth: 0.8,
            },
          isForceOpen &&
            theme === "dark" && {
              backgroundColor: "gray",
            },
          item?.background && {
            backgroundColor: item?.background,
          },
          theme === "dark" && {
            backgroundColor: "black",
          },

          item?.disabled == "1" &&
            theme === "dark" && {
              backgroundColor: "gray",
            },
          isFromDashboard && {
            paddingVertical: Platform.OS === 'android' ? 4 : 6,
            borderRadius: 4,
          },
          isFromChild && {
            padding: 6,
            borderRadius: 4,
          },
        ]}
        onPress={() => {
          if (item?.disabled !== "1") handleOpen();
        }}
        activeOpacity={0.7}
      >
        <TranslatedText
          numberOfLines={1}
          style={{
            color:
              theme === "dark"
                ? "white"
                : selectedOption
                ? ERP_COLOR_CODE.ERP_BLACK
                : ERP_COLOR_CODE.ERP_888,
            flex: 1,
          }}
          text={selectedOption || `Select ${label}`}
        ></TranslatedText>

        <MaterialIcons
          name={open ? "arrow-drop-up" : "arrow-drop-down"}
          size={24}
          color={ERP_COLOR_CODE.ERP_555}
        />
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <Modal
        transparent
        visible={open}
        animationType="none"
        supportedOrientations={["portrait", "landscape"]}
      >
        {/* Close outside area */}
        <TouchableWithoutFeedback>
          <View style={{ flex: 1, backgroundColor: "#00000099" }} />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: slideAnim,

              height: dynamicHeight,
              maxHeight: SCREEN_HEIGHT * 0.65,
              backgroundColor: theme === "dark" ? "black" : "white",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: theme === "dark" ? "white" : "black",
              width: isLandscape ? "50%" : "100%",
              justifyContent: "flex-end",
            },
            !isLandscape && {
              left: 0,
              right: 0,
            },
            isLandscape && {
              right: width * 0.25,
              justifyContent: "center",
            },
          ]}
        >
          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 4,
              },
              isLandscape && {
                alignContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <TranslatedText
              style={{
                color: theme === "dark" ? "white" : ERP_COLOR_CODE.ERP_BLACK,
                fontSize: 16,
                fontWeight: "800",
                marginBottom: 2,
              }}
              numberOfLines={1}
              text={`${t("text.text34")} ${label}`}
            ></TranslatedText>

            <TouchableOpacity
              onPress={() => {
                setOpen(false);
              }}
            >
              <MaterialIcons
                name={"close"}
                size={24}
                color={ERP_COLOR_CODE.ERP_555}
              />
            </TouchableOpacity>
          </View>

          {loader ? (
            <FullViewLoader isShowTop={false} />
          ) : (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              onContentSizeChange={(w, h) => {
                setContentHeight(h);
              }}
            >
              {options.length > 0 ? (
                options.map((opt: any, i: number) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.option,
                      {
                        backgroundColor:
                          selectedOption === opt?.name
                            ? ERP_COLOR_CODE.ERP_F8F9FA
                            : ERP_COLOR_CODE.ERP_WHITE,
                        marginBottom: 4,
                        borderRadius: 8,
                        padding: 12,
                      },
                      
                      theme === "dark" && {
                        backgroundColor: "black",
                        borderBottomColor: ERP_COLOR_CODE.ERP_F8F9FA,
                      },
                      theme === "dark" &&
                        selectedOption === opt?.name && {
                          backgroundColor: "gray",
                        },
                    ]}
                    onPress={() => {
                      if (!isForceOpen) {
                        onValueChange(opt);
                      } else {
                        onValueChange(opt?.value);
                      }
                      setSelectedOption(opt?.name);
                      closeBottomSheet();
                    }}
                  >
                    {isFromDashboard &&
                    (item?.title === "Branch" || item?.title === "Type") ? (
                      <>
                        <View style={{ flexDirection: "row", gap: 8 }}>
                          <MaterialIcons
                            name={getDashboardIcon(opt?.name)}
                            size={18}
                            color={theme === 'dark' ? 'white' : selectedOption === opt?.name ? ERP_COLOR_CODE.ERP_APP_COLOR : 'black'}
                          />
                          <TranslatedText
                            style={[
                              {
                                color:
                                  theme === "dark"
                                    ? "white"
                                    : selectedOption === opt?.name
                                    ? ERP_COLOR_CODE.ERP_APP_COLOR
                                    : ERP_COLOR_CODE.ERP_BLACK,
                              },
                              selectedOption === opt?.name && {
                                fontSize: 16,
                                fontWeight: "600",
                              },
                            ]}
                            numberOfLines={1}
                            text={opt?.name}
                          ></TranslatedText>
                        </View>
                      </>
                    ) : (
                      <TranslatedText
                        style={[
                          {
                            color:
                              theme === "dark"
                                ? "white"
                                : selectedOption === opt?.name
                                ? ERP_COLOR_CODE.ERP_APP_COLOR
                                : ERP_COLOR_CODE.ERP_BLACK,
                          },
                          selectedOption === opt?.name && {
                            fontSize: 16,
                            fontWeight: "600",
                          },
                        ]}
                        numberOfLines={1}
                        text={opt?.name}
                      ></TranslatedText>
                    )}

                    {selectedOption === opt?.name && (
                      <MaterialIcons
                        name="done-all"
                        size={24}
                        color={
                          theme === "dark"
                            ? "white"
                            : ERP_COLOR_CODE.ERP_APP_COLOR
                        }
                      />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View
                  style={{
                    marginVertical: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                    alignContent: "center",
                    marginTop: 200,
                  }}
                >
                  <NoData isShowTop={false} />
                </View>
              )}
            </ScrollView>
          )}
        </Animated.View>
      </Modal>

      {/* Error */}
      {isForceOpen && errors[item?.field] && (
        <InputError error={errors[item?.field]} />
      )}
    </View>
  );
};

export default React.memo(CustomPicker);
