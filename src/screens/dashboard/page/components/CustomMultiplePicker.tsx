import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  useWindowDimensions,
  TextInput,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { styles } from "../page_style";
import { DARK_COLOR, ERP_COLOR_CODE } from "../../../../utils/constants";
import { getDDLThunk } from "../../../../store/slices/dropdown/thunk";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import FullViewLoader from "../../../../components/loader/FullViewLoader";
import useTranslations from "../../../../hooks/useTranslations";
import InputError from "../../../../components/error/InputError";
import NoData from "../../../../components/no_data/NoData";
import TranslatedText from "../../tabs/home/TranslatedText";
import { updateSelectedBranchesState } from "../../../../store/slices/auth/authSlice";

const CustomMultiplePicker = ({
  isValidate,
  label,
  selectedValue,
  onValueChange,
  item,
  errors,
  dtext,
  isForceOpen,
  isForMultipleSelection = false,
}: any) => {
  const { t } = useTranslations();
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const SCREEN_HEIGHT = height;

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const dispatch = useAppDispatch();
  const [loader, setLoader] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");
 
  const theme = useAppSelector((state) => state?.theme.mode);
  const { user, selectedBranches } = useAppSelector((state) => state?.auth);

  const optionsCache = useRef<{ [key: string]: any[] }>({});
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (!isForMultipleSelection) setSelectedOption(dtext);
  }, [dtext]);

  useEffect(() => {
    if (!search) {
      setFilteredOptions(options);
    } else {
      const lower = search.toLowerCase();
      setFilteredOptions(
        options.filter((o) => o.name?.toLowerCase().includes(lower)),
      );
    }
  }, [search, options]);

  const openBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT * 0.25,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setOpen(false);
      setSearch("");
    });
  };

  const handleOpen = useCallback(async () => {
    if (open) return closeBottomSheet();

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
          where: !isForceOpen
            ? `UserID in (${user?.id}, -1) and selected = 1`
            : item?.ddlwhere,
        }),
      ).unwrap();

      const data = res?.data ?? [];
      setOptions(data);
      if (item?.dtlid) optionsCache.current[item.dtlid] = data;
    } finally {
      setLoader(false);
    }
  }, [open, item]);

  // ================= MULTI =================
  const toggleSelection = (opt: any) => {
    const exists = selectedBranches.find((o) => o.value === opt.value);

    let updatedOptions;

    if (exists) {
      updatedOptions = selectedBranches.filter((o) => o.value !== opt.value);
    } else {
      updatedOptions = [...selectedBranches, opt];
    }
 

    // Redux update
    dispatch(updateSelectedBranchesState(updatedOptions));
  };

  const isSelected = (opt: any) =>
    selectedBranches.some((o) => o.value === opt.value);

  const handleSelectAll = () => {
  let updatedOptions = [];

  if (selectedBranches.length === options.length) {
    updatedOptions = [];
  } else {
    updatedOptions = options;
  }
 
  dispatch(updateSelectedBranchesState(updatedOptions));
};

const handleDone = () => {
    onValueChange(selectedBranches);
    closeBottomSheet();
};

  return (
    <View style={{ marginVertical: 6 }}>
      {/* LABEL */}

      {/* CHIPS */}
      {isForMultipleSelection && selectedBranches.length > 0 && (
        <View
          style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 6 }}
        >
          {selectedBranches.map((opt, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 20,
                margin: 2,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "white",
              }}
            >
              <Text style={{ color: "white", marginRight: 4 }}>{opt.name}</Text>
              <TouchableOpacity
                onPress={() => {
                    const updatedOptions = selectedBranches.filter(
                    (o) => o.value !== opt.value
                    );
 
                    dispatch(updateSelectedBranchesState(updatedOptions));
                }}
              >
                <MaterialIcons name="close" size={14} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* PICKER */}
      <TouchableOpacity
        style={[styles.pickerBox]}
        onPress={() => {
          if (item?.disabled !== "1") handleOpen();
        }}
      >
        <TranslatedText
          text={
            isForMultipleSelection
              ? selectedBranches.length > 0
                ? `${selectedBranches.length} selected`
                : `Select ${label}`
              : selectedOption || `Select ${label}`
          }
          numberOfLines={1}
          style={{ flex: 1 }}
        />

        <MaterialIcons
          name={open ? "arrow-drop-up" : "arrow-drop-down"}
          size={24}
        />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal transparent visible={open} animationType="none">
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <View style={{ flex: 1, backgroundColor: "#00000066" }} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            position: "absolute",
            top: slideAnim,
            height: SCREEN_HEIGHT * 0.75,
            backgroundColor: theme === "dark" ? "black" : "white",
            width: isLandscape ? "50%" : "100%",
            padding: 16,
          }}
        >
          {/* HEADER */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "800" }}>
              {t("text.text34")} {label}
            </Text>

            <TouchableOpacity onPress={closeBottomSheet}>
              <MaterialIcons name="close" size={24} />
            </TouchableOpacity>
          </View>

          {/* SEARCH */}
          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginVertical: 8,
            }}
          />

          {/* SELECT ALL */}
          {isForMultipleSelection && (
            <TouchableOpacity
              onPress={handleSelectAll}
              style={{ marginBottom: 8 }}
            >
              <Text style={{ color: ERP_COLOR_CODE.ERP_APP_COLOR }}>
                {selectedBranches.length === options.length
                  ? "Unselect All"
                  : "Select All"}
              </Text>
            </TouchableOpacity>
          )}

          {/* LIST */}
          {loader ? (
            <FullViewLoader isShowTop={false} />
          ) : (
            <ScrollView>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt: any, i: number) => {
                  const selected = isForMultipleSelection
                    ? isSelected(opt)
                    : selectedOption === opt.name;

                  return (
                    <TouchableOpacity
                      key={i}
                      style={{
                        padding: 12,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                      onPress={() => {
                        if (isForMultipleSelection) {
                          toggleSelection(opt);
                        } else {
                          onValueChange(isForceOpen ? opt.value : opt);
                          setSelectedOption(opt.name);
                          closeBottomSheet();
                        }
                      }}
                    >
                      <Text>{opt.name}</Text>

                      {selected && (
                        <MaterialIcons
                          name="done"
                          size={20}
                          color={ERP_COLOR_CODE.ERP_APP_COLOR}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <NoData isShowTop={false} />
              )}
            </ScrollView>
          )}

          {/* DONE */}
          {isForMultipleSelection && (
            <TouchableOpacity
              onPress={handleDone}
              style={{
                marginTop: 10,
                padding: 12,
                backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>Done</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </Modal>

      {isForceOpen && errors[item?.field] && (
        <InputError error={errors[item?.field]} />
      )}
    </View>
  );
};

export default React.memo(CustomMultiplePicker);
