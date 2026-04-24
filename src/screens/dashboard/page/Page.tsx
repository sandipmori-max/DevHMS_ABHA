import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
  PermissionsAndroid,
  AppState,
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  getERPAppConfigMenuThunk,
  getERPPageThunk,
} from "../../../store/slices/auth/thunk";
import { savePageThunk } from "../../../store/slices/page/thunk";
import FullViewLoader from "../../../components/loader/FullViewLoader";
import NoData from "../../../components/no_data/NoData";
import ErrorMessage from "../../../components/error/Error";
import ERPIcon from "../../../components/icon/ERPIcon";
import ErrorModal from "./components/ErrorModal";
import CustomPicker from "./components/CustomPicker";
import Media from "./components/Media";
import Disabled from "./components/Disabled";
import Input from "./components/Input";
import CustomAlert from "../../../components/alert/CustomAlert";
import AjaxPicker from "./components/AjaxPicker";
import DateTimePicker from "react-native-modal-datetime-picker";
import {
  applyActionsToControls,
  applyFormula,
  evaluateRulesWithActions,
  parseCustomDatePage,
  requestCameraPermission,
  runDynamicRules,
} from "../../../utils/helpers";
import DateRow from "./components/Date";
import BoolInput from "./components/BoolInput";
import SignaturePad from "./components/SignaturePad";
import HtmlRow from "./components/HtmlRow";
import { useBaseLink } from "../../../hooks/useBaseLink";
import DateTimeRow from "./components/DateTimeRow";
import LocationRow from "./components/LocationRow";
import FilePickerRow from "./components/FilePicker";
import CustomMultiPicker from "./components/CustomMultiPicker";
import { ERP_COLOR_CODE } from "../../../utils/constants";
import BusinessCardView from "./components/BusinessCardImage";
import DeviceInfo from "react-native-device-info";
import useTranslations from "../../../hooks/useTranslations";
import VideoRecorder from "./components/VideoRecorder";
import ScanScreen from "./components/ScanScreen";
import BarCodeScan from "./components/BarCodeScan";
import TranslatedText from "../tabs/home/TranslatedText";
import { setReloadApp } from "../../../store/slices/reloadApp/reloadAppSlice";
import { updateAppMenuList } from "../../../store/slices/auth/authSlice";
import FastImage from "react-native-fast-image";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import DynamicTable from "./components/DynamicTable";
import DocScan from "./components/DocScan";

type PageRouteParams = { PageScreen: { item: any } };

export async function requestLocationPermissions(): Promise<
  "granted" | "foreground-only" | "denied" | "blocked"
> {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        // PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ]);

      const fine = granted["android.permission.ACCESS_FINE_LOCATION"];
      const coarse = granted["android.permission.ACCESS_COARSE_LOCATION"];
      const background =
        granted["android.permission.ACCESS_BACKGROUND_LOCATION"];

      if (
        fine === PermissionsAndroid.RESULTS.GRANTED &&
        coarse === PermissionsAndroid.RESULTS.GRANTED &&
        background === PermissionsAndroid.RESULTS.GRANTED
      ) {
        return "granted";
      }

      if (
        fine === PermissionsAndroid.RESULTS.GRANTED &&
        coarse === PermissionsAndroid.RESULTS.GRANTED &&
        background !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        return "foreground-only";
      }

      if (
        fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        coarse === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        background === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        return "blocked";
      }
      return "denied";
    } catch (err) {
      return "denied";
    }
  }
  return "granted";
}

const PageScreen = () => {
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const flatListRef = useRef<FlatList>(null);
  const baseLink = useBaseLink();
  const theme = useAppSelector((state) => state?.theme.mode);
  const { t } = useTranslations();
  const [buttonSave, setButtonSave] = useState(true);
  const [loadingPageId, setLoadingPageId] = useState<string | null>(null);
  const [controls, setControls] = useState<any[]>([]);
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isValidate, setIsValidate] = useState(false);

  console.log(
    "controls+++++++++++++++++++++++++++++++++++------------------------------++++",
    controls,
  );
  const [tapLoader, setTapLoader] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<any>({});

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [activeDateTimeField, setActiveDateTimeField] = useState<string | null>(
    null,
  );
  const [activeDateTime, setActiveDateTime] = useState<string | null>(null);

  const [activeDateField, setActiveDateField] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const [loader, setLoader] = useState(false);
  const [actionLoader, setActionLoader] = useState(false);
  const [actionSaveLoader, setActionSaveLoader] = useState(false);
  const [infoData, setInfoData] = useState<any>({});
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "info" as "error" | "success" | "info",
  });

  const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);
  const [modalClose, setModalClose] = useState(false);
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const [myScript, setMyScript] = useState();

  console.log("myScript", myScript);
  const [backgroundDeniedModal, setBackgroundDeniedModal] = useState(false);

  const isCheckingPermission = useRef(false);
  const locationSyncInterval = useRef<NodeJS.Timeout | null>(null);
  const [scriptErrorMessage, setScriptErrorMessage] = useState<any>();
  const [isVisibleScriptError, setIsVisibleScriptError] = useState(false);

  const hasLocationField = controls.some(
    (item) =>
      item?.defaultvalue &&
      item?.defaultvalue === "#location" &&
      item?.visible === "0",
  );

  const hasMediaField = controls.some(
    (item) => item?.ctltype === "IMAGE" || item?.ctltype === "PHOTO",
  );

  useFocusEffect(
    useCallback(() => {
      setTapLoader(false);
      return () => {};
    }, [navigation]),
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const checkLocation = async () => {
      const enabled = await DeviceInfo.isLocationEnabled();
      setLocationEnabled(enabled);
    };

    checkLocation();

    interval = setInterval(checkLocation, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      return await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
    return true;
  };

  const startLocationSync = async () => {
    const enabled = await DeviceInfo.isLocationEnabled();
    if (!enabled) return;

    const hasPermission = await requestLocationPermission();
    const fullPermission = await requestLocationPermissions();

    if (fullPermission === "foreground-only") {
      setBackgroundDeniedModal(true);
      return;
    }

    if (
      !hasPermission ||
      fullPermission === "denied" ||
      fullPermission === "blocked"
    )
      return;

    if (locationSyncInterval.current)
      clearInterval(locationSyncInterval.current);

    checkLocation();
  };

  const checkLocation = async () => {
    try {
      const enabled = await DeviceInfo.isLocationEnabled();

      if (enabled !== locationEnabled) {
        setAlertConfig({
          title: t("title.title13"),
          message: enabled ? t("title.title14") : t("title.title15"),
          type: enabled ? "success" : "error",
        });
        setAlertVisible(!enabled);
        setModalClose(false);
        setLocationEnabled(enabled);
      }

      if (hasLocationField && enabled) {
        if (Platform.OS === "android") {
          const granted = await requestLocationPermissions();
          if (granted === "granted") {
            // location access
            setLocationVisible(true);
          } else if (granted === "foreground-only") {
            setBackgroundDeniedModal(true);
            setLocationVisible(true);
          }
        }
      }
    } catch (err) {
      setLocationVisible(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const checkPermissionsOnFocus = async () => {
        if (isCheckingPermission.current) return;
        isCheckingPermission.current = true;

        const hasPermission = await requestLocationPermission();
        const fullPermission = await requestLocationPermissions();

        if (hasPermission && fullPermission === "granted") {
          setAlertVisible(false);
          setIsSettingVisible(false);
          setModalClose(true);
          startLocationSync();
        } else if (hasPermission && fullPermission === "foreground-only") {
          setBackgroundDeniedModal(true);
        } else {
          setAlertConfig({
            title: t("title.title13"),
            message: t("title.title15"),
            type: "error",
          });
          setModalClose(false);

          setAlertVisible(true);
          setIsSettingVisible(true);
        }

        isCheckingPermission.current = false;
      };

      const subscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (nextAppState === "active" && hasLocationField) {
            checkPermissionsOnFocus();
          }
        },
      );

      if (hasLocationField) {
        checkPermissionsOnFocus();
      }

      return () => subscription.remove();
    }, []),
  );

  const route = useRoute<RouteProp<PageRouteParams, "PageScreen">>();
  const { item, title, id, isFromNew, url, pageTitle, isFromProfile }: any =
    route?.params;
  const isFromBusinessCard = route?.params?.isFromBusinessCard || false;

  const validateForm = useCallback(() => {
    setTapLoader(true);
    const validationErrors: Record<string, string> = {};
    const errorMessages: string[] = [];

    controls.forEach((ctrl) => {
      if (ctrl?.mandatory === "1" && !formValues[ctrl?.field]) {
        validationErrors[ctrl.field] = `${ctrl?.fieldtitle || ctrl?.field} ${t(
          "text.text43",
        )}`;
        errorMessages.push(
          `${ctrl?.fieldtitle || ctrl?.field} ${t("text.text43")}`,
        );
      }
    });

    setErrors(validationErrors);
    setErrorsList(errorMessages);
    setTimeout(() => {
      if (errorMessages?.length > 0) setShowErrorModal(true);
    }, 780);

    return errorMessages?.length === 0;
  }, [controls, formValues]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor:
          theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_APP_COLOR,
      },
      headerBackTitle: "",
      headerTintColor: "#fff",
      headerTitle: () => (
        <View
          style={{ flexDirection: "row", alignItems: "center", maxWidth: 210 }}
        >
          <TranslatedText
            numberOfLines={1}
            style={{
              flexShrink: 1,
              fontSize: 18,
              fontWeight: "700",
              color: theme === "dark" ? "white" : ERP_COLOR_CODE.ERP_WHITE,
            }}
            text={title || pageTitle || "Details"}
          ></TranslatedText>
          {isFromProfile === false && (
            <TranslatedText
              numberOfLines={1}
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: ERP_COLOR_CODE.ERP_WHITE,
                marginLeft: 4,
              }}
              text={
                isFromNew
                  ? `( ${t("text.text44")} )`
                  : `( ${t("text.text45")} )`
              }
            ></TranslatedText>
          )}
        </View>
      ),
      headerRight: () => (
        <>
          {!error && !isFromNew && (
            <ERPIcon
              name="refresh"
              isLoading={actionLoader}
              onPress={() => {
                setControls([]);
                setFormValues(null);
                setButtonSave(true);
                setActionLoader(true);
                fetchPageData();
                setErrors({});
                setErrorsList([]);
              }}
            />
          )}
          {controls.length > 0 && (
            <ERPIcon
              name="save-as"
              isLoading={actionSaveLoader || tapLoader}
              onPress={async () => {
                try {
                  setTapLoader(true);
                  if (myScript) {
                    let rules;

                    if (typeof myScript === "string") {
                      try {
                        rules = JSON.parse(myScript);
                      } catch (e) {
                        console.error("Invalid JSON from backend", e);
                        setTapLoader(false);
                        return;
                      }
                    } else {
                      rules = myScript;
                    }

                    const { actions, messages } = evaluateRulesWithActions(
                      rules,
                      formValues,
                    );
                    const hasButtonSaveEnable = actions.some(
                      (item) => item?.field === "buttonSave",
                    );
                    if (hasButtonSaveEnable) {
                      const hasButtonSaveEnable = actions.some(
                        (item) =>
                          item?.field === "buttonSave" &&
                          item.action === "enable",
                      );
                      const updatedControls = applyActionsToControls(
                        controls,
                        actions,
                      );
                      setControls(updatedControls);
                      setButtonSave(hasButtonSaveEnable);
                      if (!hasButtonSaveEnable) {
                        setTapLoader(false);
                        setScriptErrorMessage(messages);
                        setIsVisibleScriptError(true);
                        return;
                      }
                    }
                    const updatedControls = applyActionsToControls(
                      controls,
                      actions,
                    );
                    setControls(updatedControls);
                  }

                  const locationEnabled = hasLocationField
                    ? await DeviceInfo.isLocationEnabled()
                    : true;

                  const permissionStatus = hasLocationField
                    ? await requestLocationPermissions()
                    : "granted";

                  const hasCameraPermission = hasMediaField
                    ? await requestCameraPermission()
                    : true;

                  if (!hasCameraPermission && hasMediaField) {
                    setAlertVisible(true);
                    setModalClose(true);
                    setIsSettingVisible(true);
                    setAlertConfig({
                      title: t("title.title16"),
                      message: t("msg.msg15"),
                      type: "error",
                    });

                    return;
                  }

                  if (hasLocationField && !locationEnabled) {
                    setAlertConfig({
                      title: t("title.title13"),
                      message: t("title.title15"),
                      type: "error",
                    });
                    setAlertVisible(true);
                    setModalClose(true);
                    setIsSettingVisible(true);
                    return;
                  }

                  if (
                    hasLocationField &&
                    (permissionStatus === "denied" ||
                      permissionStatus === "blocked")
                  ) {
                    setAlertConfig({
                      title: t("title.title13"),
                      message: t("title.title15"),
                      type: "error",
                    });
                    setAlertVisible(true);
                    setModalClose(false);
                    return;
                  }

                  // ✅ Permissions are granted, proceed
                  setLocationVisible(true);
                  setActionSaveLoader(true);
                  setIsValidate(true);

                  if (validateForm()) {
                    const submitValues: Record<string, any> = {};
                    controls?.forEach((f) => {
                      if (f.refcol !== "1")
                        submitValues[f?.field] = formValues[f?.field];
                    });

                    try {
                      setLoader(true);
                      await dispatch(
                        savePageThunk({
                          page: url,
                          id,
                          data: { ...submitValues },
                        }),
                      ).unwrap();
                      setLoader(false);
                      setIsValidate(false);
                      try {
                        dispatch(getERPAppConfigMenuThunk());
                      } catch (error) {
                        dispatch(updateAppMenuList([])); // Clear menu on error
                        console.log("Error fetching app config menu:", error);
                      }
                      if (isFromProfile) {
                        setTimeout(() => {
                          dispatch(setReloadApp());
                        }, 1000);
                      }
                      fetchPageData();
                      setAlertConfig({
                        title: t("title.title17"),
                        message: t("title.title18"),
                        type: "success",
                      });
                      setAlertVisible(true);
                      setGoBack(true);

                      setTimeout(() => {
                        setAlertVisible(false);
                        navigation.goBack();
                      }, 1800);
                    } catch (err: any) {
                      setLoader(false);
                      setAlertConfig({
                        title: t("title.title17"),
                        message: err,
                        type: "error",
                      });
                      setAlertVisible(true);
                      setGoBack(false);
                    }
                  }

                  setActionSaveLoader(false);
                  setTimeout(() => {
                    setTapLoader(false);
                  }, 600);
                } catch (error) {
                  console.error("Save error:", error);
                  setTimeout(() => {
                    setTapLoader(false);
                  }, 600);
                  setActionSaveLoader(false);
                }
              }}
            />
          )}
        </>
      ),
    });
  }, [
    tapLoader,
    navigation,
    item?.name,
    id,
    controls,
    formValues,
    validateForm,
    goBack,
    alertVisible,
    loader,
    actionLoader,
    actionSaveLoader,
    buttonSave,
    error,
  ]);

  const fetchPageData = useCallback(async () => {
    try {
      setError(null);
      setLoadingPageId(isFromNew ? "0" : id);
      const parsed = await dispatch(
        getERPPageThunk({ page: url, id: isFromNew ? 0 : id }),
      ).unwrap();
      console.log("script---++++++------------------++++++++++---", parsed);
      if (parsed?.script) {
        console.log("script---++++++++++++++++---", parsed?.script);
        setMyScript(parsed?.script);
      }

      if (!isFromNew) {
        setInfoData({
          id: id?.toString(),
          tableName: parsed?.table,
          title: parsed?.title,
        });
      }

      const pageControls = Array.isArray(parsed?.pagectl)
        ? parsed?.pagectl
        : [];
      const normalizedControls = pageControls?.map((c) => ({
        ...c,
        disabled: String(c?.disabled ?? "0"),
        visible: String(c?.visible ?? "1"),
        mandatory: String(c?.mandatory ?? "0"),
      }));

      setControls(normalizedControls);

      setFormValues((prev) => {
        const merged: any = { ...prev };
        normalizedControls.forEach((c) => {
          if (merged[c?.field] === undefined) {
            merged[c?.field] = c?.text ?? "";
          }
        });
        return merged;
      });
    } catch (e: any) {
      setError(JSON.stringify(e?.data) || "Failed to load page");
    } finally {
      setLoadingPageId(null);
      setTimeout(() => {
        setActionLoader(false);
      }, 10);
    }
  }, [dispatch, id, url]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handleAttachment = (base64: string, val: any) => {
    console.log("base64", base64);
    setFormValues((prev) => {
      return { ...prev, [val]: base64 };
    });
  };

  const handleSignatureAttachment = (base64: string, val: any) => {
    setFormValues((prev) => {
      return { ...prev, [val]: base64 };
    });
  };

  const showDateTimePicker = (field: string, date: any) => {
    setActiveDateTimeField(field);
    setActiveDateTime(date);
    setDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisible(false);
    setActiveDateTimeField(null);
  };

  const handleDateTimeConfirm = (date: Date) => {
    if (activeDateTimeField) {
      setFormValues((prev) => ({
        ...prev,
        [activeDateTimeField]: date.toISOString(),
      }));
    }
    hideDateTimePicker();
  };

  const safeParse = (data) => {
    if (!data) return [];

    if (typeof data === "object") return data; // already parsed ✅

    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.log("❌ Invalid JSON:", data);
        return [];
      }
    }

    return [];
  };

  const [vendorTemplate] = useState({
    title: "P1",
    pageControls: [
      {
        dtlid: 200002608,
        id: 156,
        seqno: 1,
        field: "projectteamid",
        dfield: "",
        fieldtitle: "Project Team ID",
        title: "Project Team ID",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Project Team",
        size: "",
        ctltype: "NUMERIC",
        ddl: "",
        ddlfield: "",
        ddlwhere: "",
        ajax: 0,
        visible: "1",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
      {
        dtlid: 200002609,
        id: 156,
        seqno: 2,
        field: "projectid",
        dfield: "projectname",
        fieldtitle: "Project Name",
        title: "Project Name",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Project Name",
        size: "",
        ctltype: "NUMERIC",
        ddl: "ViewProjects-ProjectName,ProjectID",
        ddlfield: "ProjectName",
        ddlwhere: "Status in (~A~,~R~,~N~)",
        ajax: 1,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002610,
        id: 156,
        seqno: 3,
        field: "userid",
        dfield: "developer",
        fieldtitle: "Developer",
        title: "Developer",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Developer Name",
        size: "",
        ctltype: "NUMERIC",
        ddl: "ViewUserMaster-UserName,UserID,RoleID,RoleName",
        ddlfield: "Developer,DesigID",
        ddlwhere: "Status=~A~",
        ajax: 1,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002611,
        id: 156,
        seqno: 4,
        field: "desigid",
        dfield: "",
        fieldtitle: "Role Name",
        title: "Role Name",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Designation",
        size: "",
        ctltype: "INT",
        ddl: "RoleMst-RoleID,RoleName",
        ddlfield: "RoleName",
        ddlwhere: "Status=~A~",
        ajax: 0,
        visible: "1",
        refcol: 0,
        mandatory: "0",
        disabled: "0",
      },
      {
        dtlid: 200002612,
        id: 156,
        seqno: 5,
        field: "fordays",
        dfield: "",
        fieldtitle: "For Days",
        title: "For Days",
        text: 1,
        dtext: "",
        defaultvalue: 1,
        tooltip: "For Days",
        size: "",
        ctltype: "INT",
        ddl: "1,2,3,4,5,6,7-",
        ddlfield: "ForDays",
        ddlwhere: "1=1",
        ajax: 0,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002613,
        id: 156,
        seqno: 6,
        field: "todate",
        dfield: "",
        fieldtitle: "To Date",
        title: "To Date",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "To Date",
        size: "",
        ctltype: "STRING",
        ddl: "",
        ddlfield: "",
        ddlwhere: "",
        ajax: 0,
        visible: "0",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
      {
        dtlid: 200002614,
        id: 156,
        seqno: 7,
        field: "cuid",
        dfield: "entryby",
        fieldtitle: "Entry By",
        title: "Entry By",
        text: 113,
        dtext: "Sandip Mori",
        defaultvalue: "#useridname",
        tooltip: "Entry By (Who have entered the entry)",
        size: "",
        ctltype: "NUMERIC",
        ddl: "UserMaster-UserName,UserID",
        ddlfield: "EntryBy",
        ddlwhere: "Status=~A~",
        ajax: 1,
        visible: "0",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
      {
        dtlid: 200002615,
        id: 156,
        seqno: 8,
        field: "editmode",
        dfield: "",
        fieldtitle: "Edit Mode",
        title: "Edit Mode",
        text: "Edit",
        dtext: "",
        defaultvalue: "Edit",
        tooltip: "Edit Mode",
        size: "",
        ctltype: "STRING",
        ddl: "Edit,View-",
        ddlfield: "EditMode",
        ddlwhere: "1=1",
        ajax: 0,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002616,
        id: 156,
        seqno: 9,
        field: "muid",
        dfield: "updateby",
        fieldtitle: "Update By",
        title: "Update By",
        text: 113,
        dtext: "Sandip Mori",
        defaultvalue: "#useridname",
        tooltip: "Update By (Who have last updated the entry)",
        size: "",
        ctltype: "NUMERIC",
        ddl: "UserMaster-UserName,UserID",
        ddlfield: "UpdateBy",
        ddlwhere: "Status=~A~",
        ajax: 1,
        visible: "1",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
    ],
    buttonControls: [],
  });

  const [purchaseTemplate] = useState({
    title: "P2",
    pageControls: [
      {
        dtlid: 200002608,
        id: 156,
        seqno: 1,
        field: "projectteamid",
        dfield: "",
        fieldtitle: "Project Team ID",
        title: "Project Team ID",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Project Team",
        size: "",
        ctltype: "NUMERIC",
        ddl: "",
        ddlfield: "",
        ddlwhere: "",
        ajax: 0,
        visible: "1",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
      {
        dtlid: 200002609,
        id: 156,
        seqno: 2,
        field: "projectid",
        dfield: "projectname",
        fieldtitle: "Project Name",
        title: "Project Name",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Project Name",
        size: "",
        ctltype: "NUMERIC",
        ddl: "ViewProjects-ProjectName,ProjectID",
        ddlfield: "ProjectName",
        ddlwhere: "Status in (~A~,~R~,~N~)",
        ajax: 1,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002610,
        id: 156,
        seqno: 3,
        field: "userid",
        dfield: "developer",
        fieldtitle: "Developer",
        title: "Developer",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Developer Name",
        size: "",
        ctltype: "NUMERIC",
        ddl: "ViewUserMaster-UserName,UserID,RoleID,RoleName",
        ddlfield: "Developer,DesigID",
        ddlwhere: "Status=~A~",
        ajax: 1,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002611,
        id: 156,
        seqno: 4,
        field: "desigid",
        dfield: "",
        fieldtitle: "Role Name",
        title: "Role Name",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Designation",
        size: "",
        ctltype: "INT",
        ddl: "RoleMst-RoleID,RoleName",
        ddlfield: "RoleName",
        ddlwhere: "Status=~A~",
        ajax: 0,
        visible: "1",
        refcol: 0,
        mandatory: "0",
        disabled: "0",
      },
      {
        dtlid: 200002612,
        id: 156,
        seqno: 5,
        field: "fordays",
        dfield: "",
        fieldtitle: "For Days",
        title: "For Days",
        text: 1,
        dtext: "",
        defaultvalue: 1,
        tooltip: "For Days",
        size: "",
        ctltype: "INT",
        ddl: "1,2,3,4,5,6,7-",
        ddlfield: "ForDays",
        ddlwhere: "1=1",
        ajax: 0,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002613,
        id: 156,
        seqno: 6,
        field: "todate",
        dfield: "",
        fieldtitle: "To Date",
        title: "To Date",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "To Date",
        size: "",
        ctltype: "STRING",
        ddl: "",
        ddlfield: "",
        ddlwhere: "",
        ajax: 0,
        visible: "0",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
      {
        dtlid: 200002614,
        id: 156,
        seqno: 7,
        field: "cuid",
        dfield: "entryby",
        fieldtitle: "Entry By",
        title: "Entry By",
        text: 113,
        dtext: "Sandip Mori",
        defaultvalue: "#useridname",
        tooltip: "Entry By (Who have entered the entry)",
        size: "",
        ctltype: "NUMERIC",
        ddl: "UserMaster-UserName,UserID",
        ddlfield: "EntryBy",
        ddlwhere: "Status=~A~",
        ajax: 1,
        visible: "0",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
      {
        dtlid: 200002615,
        id: 156,
        seqno: 8,
        field: "editmode",
        dfield: "",
        fieldtitle: "Edit Mode",
        title: "Edit Mode",
        text: "Edit",
        dtext: "",
        defaultvalue: "Edit",
        tooltip: "Edit Mode",
        size: "",
        ctltype: "STRING",
        ddl: "Edit,View-",
        ddlfield: "EditMode",
        ddlwhere: "1=1",
        ajax: 0,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002616,
        id: 156,
        seqno: 9,
        field: "muid",
        dfield: "updateby",
        fieldtitle: "Update By",
        title: "Update By",
        text: 113,
        dtext: "Sandip Mori",
        defaultvalue: "#useridname",
        tooltip: "Update By (Who have last updated the entry)",
        size: "",
        ctltype: "NUMERIC",
        ddl: "UserMaster-UserName,UserID",
        ddlfield: "UpdateBy",
        ddlwhere: "Status=~A~",
        ajax: 1,
        visible: "1",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
    ],
    buttonControls: [],
  });
  const [userTemplate] = useState({
    title: "P3",
    pageControls: [
      {
        dtlid: 200002608,
        id: 156,
        seqno: 1,
        field: "projectteamid",
        dfield: "",
        fieldtitle: "Project Team ID",
        title: "Project Team ID",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Project Team",
        size: "",
        ctltype: "NUMERIC",
        ddl: "",
        ddlfield: "",
        ddlwhere: "",
        ajax: 0,
        visible: "1",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
      {
        dtlid: 200002609,
        id: 156,
        seqno: 2,
        field: "projectid",
        dfield: "projectname",
        fieldtitle: "Project Name",
        title: "Project Name",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Project Name",
        size: "",
        ctltype: "NUMERIC",
        ddl: "ViewProjects-ProjectName,ProjectID",
        ddlfield: "ProjectName",
        ddlwhere: "Status in (~A~,~R~,~N~)",
        ajax: 1,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002610,
        id: 156,
        seqno: 3,
        field: "userid",
        dfield: "developer",
        fieldtitle: "Developer",
        title: "Developer",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Developer Name",
        size: "",
        ctltype: "NUMERIC",
        ddl: "ViewUserMaster-UserName,UserID,RoleID,RoleName",
        ddlfield: "Developer,DesigID",
        ddlwhere: "Status=~A~",
        ajax: 1,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002611,
        id: 156,
        seqno: 4,
        field: "desigid",
        dfield: "",
        fieldtitle: "Role Name",
        title: "Role Name",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "Designation",
        size: "",
        ctltype: "INT",
        ddl: "RoleMst-RoleID,RoleName",
        ddlfield: "RoleName",
        ddlwhere: "Status=~A~",
        ajax: 0,
        visible: "1",
        refcol: 0,
        mandatory: "0",
        disabled: "0",
      },
      {
        dtlid: 200002612,
        id: 156,
        seqno: 5,
        field: "fordays",
        dfield: "",
        fieldtitle: "For Days",
        title: "For Days",
        text: 1,
        dtext: "",
        defaultvalue: 1,
        tooltip: "For Days",
        size: "",
        ctltype: "INT",
        ddl: "1,2,3,4,5,6,7-",
        ddlfield: "ForDays",
        ddlwhere: "1=1",
        ajax: 0,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002613,
        id: 156,
        seqno: 6,
        field: "todate",
        dfield: "",
        fieldtitle: "To Date",
        title: "To Date",
        text: "",
        dtext: "",
        defaultvalue: "",
        tooltip: "To Date",
        size: "",
        ctltype: "STRING",
        ddl: "",
        ddlfield: "",
        ddlwhere: "",
        ajax: 0,
        visible: "0",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
      {
        dtlid: 200002614,
        id: 156,
        seqno: 7,
        field: "cuid",
        dfield: "entryby",
        fieldtitle: "Entry By",
        title: "Entry By",
        text: 113,
        dtext: "Sandip Mori",
        defaultvalue: "#useridname",
        tooltip: "Entry By (Who have entered the entry)",
        size: "",
        ctltype: "NUMERIC",
        ddl: "UserMaster-UserName,UserID",
        ddlfield: "EntryBy",
        ddlwhere: "Status=~A~",
        ajax: 1,
        visible: "0",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
      {
        dtlid: 200002615,
        id: 156,
        seqno: 8,
        field: "editmode",
        dfield: "",
        fieldtitle: "Edit Mode",
        title: "Edit Mode",
        text: "Edit",
        dtext: "",
        defaultvalue: "Edit",
        tooltip: "Edit Mode",
        size: "",
        ctltype: "STRING",
        ddl: "Edit,View-",
        ddlfield: "EditMode",
        ddlwhere: "1=1",
        ajax: 0,
        visible: "0",
        refcol: 0,
        mandatory: "1",
        disabled: "0",
      },
      {
        dtlid: 200002616,
        id: 156,
        seqno: 9,
        field: "muid",
        dfield: "updateby",
        fieldtitle: "Update By",
        title: "Update By",
        text: 113,
        dtext: "Sandip Mori",
        defaultvalue: "#useridname",
        tooltip: "Update By (Who have last updated the entry)",
        size: "",
        ctltype: "NUMERIC",
        ddl: "UserMaster-UserName,UserID",
        ddlfield: "UpdateBy",
        ddlwhere: "Status=~A~",
        ajax: 1,
        visible: "1",
        refcol: 0,
        mandatory: "0",
        disabled: "1",
      },
    ],
    buttonControls: [
      {
        btn_name: "Save",
        btn_color: "black",
        btn_icon_name: "add",
      },
      {
        btn_name: "Update",
        btn_color: "green",
        btn_icon_name: "edit",
      },
      {
        btn_name: "Delete",
        btn_color: "red",
        btn_icon_name: "delete",
      },
    ],
  });
  const sections = [
    {
      key: vendorTemplate?.title,
      template: vendorTemplate?.pageControls,
      buttons: vendorTemplate?.buttonControls,
    },
    {
      key: "purchase",
      template: purchaseTemplate?.pageControls,
      buttons: purchaseTemplate?.buttonControls,
    },
    {
      key: "userInfo",
      template: userTemplate?.pageControls,
      buttons: userTemplate?.buttonControls,
    },
  ];

  const [allData, setAllData] = useState({});

  const renderItem = useCallback(
    ({
      item,
      index,
      isFromChild = false,
    }: {
      item: any;
      index: number;
      isFromChild: boolean;
    }) => {
      const setValue = (val) => {
        console.log("SET VALUE START 👉", item?.field, val);

        setFormValues((prev) => {
          let updatedValues;

          if (typeof val === "object" && val !== null) {
            updatedValues = { ...prev, ...val };
          } else {
            updatedValues = { ...prev, [item.field]: val };
          }

          console.log(
            "Updated Values (before rules):",
            myScript,
            typeof myScript,
          );
          const parsed = safeParse(myScript);
          console.log("parsed-----------------", parsed);

          const safeRules = Array.isArray(parsed) ? parsed : [parsed];

          console.log("safeRules-----------------", safeRules);
          const result = runDynamicRules(safeRules, updatedValues, item.field);

          console.log("After Rules Values 👉", result.values);
          console.log("Actions 👉", result.actions);
          console.log("Messages 👉", result.messages);

          let finalValues = { ...result.values };

          result.actions.forEach((action) => {
            if (action?.action === "setValue" && action?.field) {
              finalValues[action.field] = action.value ?? "";
              console.log(`📝 setValue → ${action.field} = ${action.value}`);
            }
          });

          //   ===
          // 4️⃣ UPDATE CONTROLS
          //   ===
          if (result.actions?.length) {
            const updatedControls = applyActionsToControls(
              controls,
              result.actions,
            );
            setControls(updatedControls);
          }

          //   ===
          // 5️⃣ CLEAR ERROR
          //   ===
          setErrors((prevErr) => ({
            ...prevErr,
            [item.field]: "",
          }));

          console.log("FINAL VALUES ✅", finalValues);
          console.log("SET VALUE END  ==");

          return finalValues;
        });
      };

      const value =
        formValues[item?.field] === "#location"
          ? ""
          : formValues[item?.field] || formValues[item?.text] || "";

      console.log("item 0000000 ------------------------------- ", item);
      if (item?.visible === "1") return null;

      let content = null;

      // if(true){
      // return content = ( <DocScan
      //   label="📄 Scan Invoice"
      //   onScanResult={(files) => {
      //     console.log("BASE64 IMAGES:", files);

      //     // example: send to API
      //     // handleAttachment(files);
      //   }}
      //   /> )
      // }
      //BoolInput
      if (item?.ctltype === "BOOL") {
        const rawVal = formValues[item?.field] ?? item?.text;
        const boolVal = String(rawVal).toLowerCase() === "true";
        content = (
          <BoolInput
            isFromChild={isFromChild}
            label={item?.fieldtitle}
            value={boolVal}
            onChange={(val) => {
              setValue({ [item?.field]: val });
            }}
          />
        );
      }
      //----PENDING----CustomMultiPicker
      else if (item?.field === "---") {
        content = (
          <CustomMultiPicker
            isFromChild={isFromChild}
            isValidate={isValidate}
            label={item?.fieldtitle}
            selectedValue={value}
            dtext={item?.dtext || item?.text || ""}
            onValueChange={setValue}
            options={item?.options || []}
            item={item}
            errors={errors}
          />
        );
      }
      //FilePickerRow
      else if (item?.ctltype === "FILE") {
        content = (
          <FilePickerRow
            isFromChild={isFromChild}
            isValidate={isValidate}
            baseLink={baseLink}
            infoData={infoData}
            item={item}
            handleAttachment={handleAttachment}
            errors={errors}
          />
        );
      }
      //VideoRecorder
      else if (item?.ctltype === "VIDEO") {
        content = <VideoRecorder isFromChild={isFromChild} item={item} />;
      }
      //ScanScreen
      else if (item?.ctltype === "QRSCANNER" && item?.title === "QR Scan") {
        content = <ScanScreen isFromChild={isFromChild} item={item} />;
      }
      //BarCodeScan
      else if (
        item?.ctltype === "QRSCANNER" &&
        item?.title === "Barcode Scan"
      ) {
        content = <BarCodeScan isFromChild={isFromChild} item={item} />;
      }
      //LocationRow
      else if (item?.defaultvalue === "#location") {
        content = (
          <LocationRow
            isFromChild={isFromChild}
            locationVisible={locationVisible}
            isValidate={isValidate}
            locationEnabled={locationEnabled}
            item={item}
            setValue={setValue}
          />
        );
      }
      //HtmlRow
      else if (item?.defaultvalue === "#html") {
        content = (
          <View>
            <HtmlRow item={item} isFromPage={true} />
          </View>
        );
      }
      //SignaturePad
      else if (item?.ctltype === "IMAGE" && item?.field === "signature") {
        content = (
          <SignaturePad
            isValidate={isValidate}
            infoData={infoData}
            item={item}
            handleSignatureAttachment={handleSignatureAttachment}
          />
        );
      }
      //Media - BusinessCardView
      else if (
        item?.ctltype === "FILE" ||
        item?.ctltype === "IMAGE" ||
        item?.ctltype === "PHOTO"
      ) {
        content = (
          <>
            {isFromBusinessCard ? (
              <BusinessCardView
                baseLink={baseLink}
                infoData={infoData}
                setValue={setValue}
                controls={controls}
                item={item}
              />
            ) : (
              <Media
                isValidate={isValidate}
                baseLink={baseLink}
                infoData={infoData}
                item={item}
                isFromNew={isFromNew}
                handleAttachment={handleAttachment}
                errors={errors}
               />
            )}
          </>
        );
      }
      //Disabled
      else if (item?.disabled === "1" && item?.ajax !== 1) {
        content = (
          <Disabled
            isFromChild={isFromChild}
            item={item}
            value={value}
            type={item?.ctltype}
          />
        );
      }
      //CustomPicker
      else if (item?.ddl && item?.ddl !== "" && item?.ajax === 0) {
        content = (
          <CustomPicker
            isFromChild={isFromChild}
            isForceOpen={true}
            isValidate={isValidate}
            label={item?.fieldtitle}
            selectedValue={value}
            dtext={item?.dtext || item?.text || ""}
            onValueChange={setValue}
            options={item?.options || []}
            item={item}
            errors={errors}
          />
        );
      }
      //AjaxPicker
      else if (item?.ddl && item?.ddl !== "" && item?.ajax === 1) {
        content = (
          <AjaxPicker
            isFromChild={isFromChild}
            isForceOpen={true}
            isValidate={isValidate}
            label={item?.fieldtitle}
            selectedValue={value}
            dtext={item?.dtext || item?.text || ""}
            onValueChange={setValue}
            options={item?.options || []}
            item={item}
            errors={errors}
            formValues={formValues}
          />
        );
      }
      //DATE
      else if (item?.ctltype === "DATE") {
        content = (
          <DateRow
            isFromChild={isFromChild}
            isValidate={isValidate}
            item={item}
            errors={errors}
            value={value}
            showDatePicker={showDatePicker}
            // setValue={setValue}
          />
        );
      }
      //DATETIME
      else if (item?.ctltype === "DATETIME") {
        content = (
          <DateTimeRow
            isFromChild={isFromChild}
            isValidate={isValidate}
            item={item}
            errors={errors}
            value={value}
            showDateTimePicker={showDateTimePicker}
          />
        );
      }
      //Input
      else {
        content = (
          <Input
            isFromChild={isFromChild}
            id={item?.fieldtitle}
            isValidate={isValidate}
            onFocus={() =>
              flatListRef.current?.scrollToIndex({ index, animated: true })
            }
            item={item}
            errors={errors}
            value={value}
            setValue={setValue}
          />
        );
      }
      //content
      return (
        <>
          {isFromChild ? (
            <>
              <View style={{ width: width * (isLandscape ? 0.42 : 0.46) }}>
                {content}
              </View>
            </>
          ) : (
            <>
              {" "}
              <Animated.View
                entering={FadeInUp.delay(index * 70).springify()}
                layout={Layout.springify()}
                style={[
                  isLandscape && {
                    width: "100%",
                    flex: 1,
                    marginHorizontal: 4,
                  },
                ]}
              >
                {content}
              </Animated.View>{" "}
            </>
          )}
        </>
      );
    },
    [formValues, errors, controls, locationEnabled, isLandscape],
  );

  const showDatePicker = (field: string, date: any) => {
    setActiveDateField(field);
    setActiveDate(date);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    setActiveDateField(null);
  };

  const handleConfirm = (date: Date) => {
    if (!activeDateField) return;
    if (myScript) {
      setFormValues((prev) => {
        const updatedValues = {
          ...prev,
          [activeDateField]: date.toISOString(),
        };

        const parsed = safeParse(myScript);

        const safeRules = Array.isArray(parsed) ? parsed : [parsed];

        // const result = runDynamicRules(
        //   safeRules,
        //   updatedValues,
        //   item.field
        // );

        const result = runDynamicRules(
          safeRules,
          updatedValues,
          activeDateField,
        );

        return result.values;
      });

      hideDatePicker();
    } else {
      if (activeDateField) {
        setFormValues((prev) => ({
          ...prev,
          [activeDateField]: date.toISOString(),
        }));
      }
      hideDatePicker();
    }
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e: KeyboardEvent) => setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (loadingPageId) {
    return <FullViewLoader isShowTop={theme === "dark" ? false : true} />;
  }

  const groupControls = (ctr) => {
    const rows = [];

    if (ctr.length < 10) {
      return ctr.filter((item) => item?.visible !== "1").map((item) => [item]);
    }

    const isHidden = (item) => item?.visible === "1";

     const isLongTitle = (item) => {
      const text = item?.fieldtitle ? String(item.fieldtitle) : "";
      const dtext = item?.tooltip ? String(item.tooltip) : "";

      return text.length > 10 || dtext.length > 20;
    };
    const isLongText = (item) => {
      const text = item?.text ? String(item.text) : "";
      const dtext = item?.dtext ? String(item.dtext) : "";

      return text.length > 20 || dtext.length > 20;
    };

    // ✅ FORCE SINGLE (1×1 only)
    const isForceSingle = (item) => {
      return (
        item?.ctltype === "FILE" ||
        item?.ctltype === "VIDEO" ||
        item?.ctltype === "IMAGE" ||
        item?.ctltype === "PHOTO" ||
        (item?.ctltype === "IMAGE" && item?.field === "signature") ||
        (item?.ctltype === "QRSCANNER" && item?.title === "QR Scan") ||
        (item?.ctltype === "QRSCANNER" && item?.title === "Barcode Scan") ||
        item?.defaultvalue === "#location" ||
        item?.defaultvalue === "#html"
      );
    };

    const isPairable = (item) => {
      return (
        (item?.ddl && item?.ddl !== "" && item?.ajax === 0) ||
        (item?.ddl && item?.ddl !== "" && item?.ajax === 1) ||
        item?.disabled === "1" ||
        item?.ctltype === "DATE" ||
        item?.ctltype === "BOOL" 
      );
    };

    for (let i = 0; i < ctr.length; i++) {
      const current = ctr[i];

      if (isHidden(current)) continue;

      // ✅ FORCE SINGLE RULE (highest priority)
      if (isForceSingle(current) || isLongText(current) || isLongTitle(current)) {
        rows.push([current]);
        continue;
      }

      let nextIndex = i + 1;

      while (nextIndex < ctr.length && isHidden(ctr[nextIndex])) {
        nextIndex++;
      }

      const next = ctr[nextIndex];

      if (
        isPairable(current) &&
        next &&
        !isForceSingle(next) && // ❗ prevent pairing
        !isLongText(next) && // ❗ prevent pairing
        isPairable(next)
      ) {
        rows.push([current, next]);
        i = nextIndex;
      } else {
        rows.push([current]);
      }
    }

    return rows;
  };

  return (
    <>
      {tapLoader && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <View
            style={{
              height: 80,
              width: 80,
              borderRadius: 10,
              backgroundColor: "white",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={"large"} />
          </View>
        </View>
      )}
      {theme !== "dark" && (
        <View
          style={{
            height: 6,
            width: "100%",
            backgroundColor:
              theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_APP_COLOR,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        ></View>
      )}
      <View
        style={{
          flex: 1,
          padding: 10,
          backgroundColor:
            theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_WHITE,
        }}
      >
        {loadingPageId ? (
          <FullViewLoader />
        ) : !!error ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              backgroundColor:
                theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_WHITE,
            }}
          >
            <ErrorMessage message={error} isShowTop={false} />
          </View>
        ) : controls?.length > 0 ? (
          <>
            <View
              style={{
                flex: 1,
                height: Dimensions.get("screen").height,
                backgroundColor:
                  theme === "dark" ? "black" : ERP_COLOR_CODE.ERP_WHITE,
              }}
            >
              {isLandscape ? (
                <>
                  {" "}
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={controls}
                    key={
                      isLandscape
                        ? `${isLandscape}-landscape`
                        : `${isLandscape}-portrait`
                    }
                    ref={flatListRef}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: keyboardHeight }}
                    keyboardShouldPersistTaps="handled"
                    numColumns={isLandscape ? 2 : 1}
                    //  ListFooterComponent={() => {
                    //   return (
                    //     <ScrollView>
                    //       {sections.map((section) => (
                    //         <DynamicTable
                    //           key={section.key}
                    //           sectionKey={section.key}
                    //           template={section.template}
                    //           buttons={section.buttons}
                    //           allData={allData}
                    //           setAllData={setAllData}
                    //           renderItem={renderItem}
                    //         />
                    //       ))}
                    //     </ScrollView>

                    //   );
                    // }}
                  />{" "}
                </>
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={groupControls(controls)}
                  key={
                    isLandscape
                      ? `${isLandscape}-landscape`
                      : `${isLandscape}-portrait`
                  }
                  ref={flatListRef}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item: row, index }) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        {row.map((col, colIndex) => (
                          <View
                            key={colIndex}
                            style={{
                              flex: 1,
                              marginLeft: 4,
                            }}
                          >
                            {renderItem({
                              item: col,
                              index,
                              isFromChild: false,
                            })}
                          </View>
                        ))}
                      </View>
                    );
                  }}
                  contentContainerStyle={{ paddingBottom: keyboardHeight }}
                  keyboardShouldPersistTaps="handled"
                  numColumns={isLandscape ? 2 : 1}
                  // ListFooterComponent={() => {
                  //   return (
                  //     <ScrollView>
                  //       {sections.map((section) => (
                  //         <DynamicTable
                  //           key={section.key}
                  //           sectionKey={section.key}
                  //           template={section.template}
                  //           buttons={section.buttons}
                  //           allData={allData}
                  //           setAllData={setAllData}
                  //           renderItem={renderItem}
                  //         />
                  //       ))}
                  //     </ScrollView>
                  //   );
                  // }}
                />
              )}

              {/* <View style={{ bottom: -6, width: '100%'}}>
                <TouchableOpacity
                onPress={async() =>{ 
                   try {
                  setTapLoader(true);
                  if (myScript) {
                    let rules;

                    if (typeof myScript === "string") {
                      try {
                        rules = JSON.parse(myScript);
                      } catch (e) {
                        console.error("Invalid JSON from backend", e);
                        setTapLoader(false);
                        return;
                      }
                    } else {
                      rules = myScript;
                    }

                    const { actions, messages } = evaluateRulesWithActions(
                      rules,
                      formValues,
                    );
                    const hasButtonSaveEnable = actions.some(
                      (item) => item?.field === "buttonSave",
                    );
                    if (hasButtonSaveEnable) {
                      const hasButtonSaveEnable = actions.some(
                        (item) =>
                          item?.field === "buttonSave" &&
                          item.action === "enable",
                      );
                      const updatedControls = applyActionsToControls(
                        controls,
                        actions,
                      );
                      setControls(updatedControls);
                      setButtonSave(hasButtonSaveEnable);
                      if (!hasButtonSaveEnable) {
                        setTapLoader(false);
                        setScriptErrorMessage(messages);
                        setIsVisibleScriptError(true);
                        return;
                      }
                    }
                    const updatedControls = applyActionsToControls(
                      controls,
                      actions,
                    );
                    setControls(updatedControls);
                  }

                  const locationEnabled = hasLocationField
                    ? await DeviceInfo.isLocationEnabled()
                    : true;

                  const permissionStatus = hasLocationField
                    ? await requestLocationPermissions()
                    : "granted";

                  const hasCameraPermission = hasMediaField
                    ? await requestCameraPermission()
                    : true;

                  if (!hasCameraPermission && hasMediaField) {
                    setAlertVisible(true);
                    setModalClose(true);
                    setIsSettingVisible(true);
                    setAlertConfig({
                      title: t("title.title16"),
                      message: t("msg.msg15"),
                      type: "error",
                    });

                    return;
                  }

                  if (hasLocationField && !locationEnabled) {
                    setAlertConfig({
                      title: t("title.title13"),
                      message: t("title.title15"),
                      type: "error",
                    });
                    setAlertVisible(true);
                    setModalClose(true);
                    setIsSettingVisible(true);
                    return;
                  }

                  if (
                    hasLocationField &&
                    (permissionStatus === "denied" ||
                      permissionStatus === "blocked")
                  ) {
                    setAlertConfig({
                      title: t("title.title13"),
                      message: t("title.title15"),
                      type: "error",
                    });
                    setAlertVisible(true);
                    setModalClose(false);
                    return;
                  }

                  // ✅ Permissions are granted, proceed
                  setLocationVisible(true);
                  setActionSaveLoader(true);
                  setIsValidate(true);

                  if (validateForm()) {
                    const submitValues: Record<string, any> = {};
                    controls?.forEach((f) => {
                      if (f.refcol !== "1")
                        submitValues[f?.field] = formValues[f?.field];
                    });

                    try {
                      setLoader(true);
                      await dispatch(
                        savePageThunk({
                          page: url,
                          id,
                          data: { ...submitValues },
                        }),
                      ).unwrap();
                      setLoader(false);
                      setIsValidate(false);
                      try {
                        dispatch(getERPAppConfigMenuThunk());
                      } catch (error) {
                        dispatch(updateAppMenuList([])); // Clear menu on error
                        console.log("Error fetching app config menu:", error);
                      }
                      if (isFromProfile) {
                        setTimeout(() => {
                          dispatch(setReloadApp());
                        }, 1000);
                      }
                      fetchPageData();
                      setAlertConfig({
                        title: t("title.title17"),
                        message: t("title.title18"),
                        type: "success",
                      });
                      setAlertVisible(true);
                      setGoBack(true);

                      setTimeout(() => {
                        setAlertVisible(false);
                        navigation.goBack();
                      }, 1800);
                    } catch (err: any) {
                      setLoader(false);
                      setAlertConfig({
                        title: t("title.title17"),
                        message: err,
                        type: "error",
                      });
                      setAlertVisible(true);
                      setGoBack(false);
                    }
                  }

                  setActionSaveLoader(false);
                  setTimeout(() => {
                    setTapLoader(false);
                  }, 600);
                } catch (error) {
                  console.error("Save error:", error);
                  setTimeout(() => {
                    setTapLoader(false);
                  }, 600);
                  setActionSaveLoader(false);
                }
                }}
                style={{
                  backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR, padding: 12, borderRadius: 8}}>
                  <View style={{flexDirection:'row', justifyContent:'center', alignContent:'center', alignItems:'center', gap: 4}}>
                    <MaterialIcons size={22} name="save" color={'white'}/>
                    <Text style={{
                      color:'white',
                      fontSize: 18,
                      fontWeight: '600'
                    }}>Save</Text>
                  </View>
                </TouchableOpacity>
              </View> */}
            </View>

            <CustomAlert
              visible={alertVisible}
              title={alertConfig.title}
              message={alertConfig.message}
              type={alertConfig.type}
              onClose={() => {
                setTapLoader(false);
                if (modalClose) setAlertVisible(false);
              }}
              actionLoader={undefined}
              isSettingVisible={isSettingVisible}
              closeHide={undefined}
              isForLoading={tapLoader}
            />
            {loader && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 999,
                }}
              >
                <FullViewLoader />
              </View>
            )}
          </>
        ) : (
          <View
            style={[
              { flex: 1 },
              theme === "dark" && {
                backgroundColor: "black",
                width: "100%",
              },
            ]}
          >
            <NoData isShowTop={false} />
          </View>
        )}

        <ErrorModal
          visible={isVisibleScriptError}
          errors={scriptErrorMessage}
          onClose={() => {
            setTapLoader(false);
            setIsVisibleScriptError(false);
          }}
        />
        <ErrorModal
          visible={showErrorModal}
          errors={errorsList}
          onClose={() => {
            setTapLoader(false);
            setShowErrorModal(false);
          }}
        />

        {dateTimePickerVisible && Platform.OS === "ios" && (
          <DateTimePicker
            isVisible={dateTimePickerVisible}
            mode="datetime"
            display="spinner"
            is24Hour={false}
            date={
              activeDateTime ? parseCustomDatePage(activeDateTime) : new Date()
            }
            onConfirm={handleDateTimeConfirm}
            onCancel={hideDateTimePicker}
            cancelTextIOS="Cancel"
            confirmTextIOS="Done"
          />
        )}

        {datePickerVisible && Platform.OS === "ios" && (
          <DateTimePicker
            isVisible={datePickerVisible}
            mode="date"
            date={activeDate ? parseCustomDatePage(activeDate) : new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            display="spinner"
            is24Hour={false}
            cancelTextIOS="Cancel"
            confirmTextIOS="Done"
          />
        )}

        {Platform.OS !== "ios" && (
          <DateTimePicker
            isVisible={dateTimePickerVisible}
            mode="datetime"
            display="spinner"
            is24Hour={false}
            date={
              activeDateTime ? parseCustomDatePage(activeDateTime) : new Date()
            }
            onConfirm={handleDateTimeConfirm}
            onCancel={hideDateTimePicker}
            cancelTextIOS="Cancel"
            confirmTextIOS="Done"
          />
        )}

        {Platform.OS !== "ios" && (
          <DateTimePicker
            isVisible={datePickerVisible}
            mode="date"
            display="spinner"
            is24Hour={false}
            date={activeDate ? parseCustomDatePage(activeDate) : new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            cancelTextIOS="Cancel"
            confirmTextIOS="Done"
          />
        )}

        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={() => {
            setTapLoader(false);
            setAlertVisible(false);
            if (goBack) {
              navigation.goBack();
            }
          }}
          actionLoader={undefined}
          closeHide={undefined}
        />
      </View>
    </>
  );
};

export default PageScreen;

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: "bold", margin: 15 },
  section: { fontSize: 16, margin: 10, fontWeight: "600" },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },

  rowHeader: {
    flexDirection: "row",
    marginLeft: 8,
    backgroundColor: "#eee",
  },
  rowItem: {
    flexDirection: "row",
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  cellH: {
    width: 120,
    fontWeight: "bold",
  },

  cell: {
    width: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    margin: 2,
    padding: 6,
    borderRadius: 5,
  },

  delete: {
    color: "red",
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  deleteBtn: {
    backgroundColor: ERP_COLOR_CODE.ERP_ERROR,
    padding: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  addBtn: {
    backgroundColor: "#4CAF50",
    margin: 8,
    padding: 6,
    borderRadius: 8,
    alignSelf: "flex-end",
  },

  addText: { color: "#fff", fontWeight: "bold" },

  total: { margin: 15, fontWeight: "bold" },

  saveBtn: {
    backgroundColor: "#2196F3",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  saveText: { color: "#fff", fontWeight: "bold" },
});
