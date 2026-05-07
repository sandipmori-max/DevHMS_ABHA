import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native";
import React from "react";
import { formatHeaderTitle } from "../../../../utils/helpers";
import NoData from "../../../../components/no_data/NoData";
import { useNavigation } from "@react-navigation/native";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
import MemoizedFooterView from "./MemoizedFooterView";

const TableView = ({
  configData,
  filteredData,
  loadingListId,
  totalAmount,
  pageParamsName,
  pageName,
  handleActionButtonPressed,
  setIsFilterVisible,
  setSearchQuery,
  totalQty,
  isFromBusinessCard,
}: any) => {
  const navigation = useNavigation();

  const screenWidth = Dimensions.get("window").width;

  /* ================= COLUMN WIDTH ================= */

  // 4-5 columns visible on screen
  const columnWidth = Math.max(110, Math.min(150, screenWidth / 4.2));

  /* ================= BUTTON META ================= */

  const getButtonMeta = (key: string) => {
    if (!key || !configData?.length) {
      return {
        label: "Action",
        color: ERP_COLOR_CODE.ERP_COLOR,
      };
    }

    const configItem = configData?.find(
      (cfg: any) => cfg?.datafield?.toLowerCase() === key?.toLowerCase(),
    );

    return {
      label: configItem?.headertext || "Action",
      color: configItem?.colorcode || ERP_COLOR_CODE.ERP_COLOR,
    };
  };

  /* ================= ALL KEYS ================= */

  const allKeys =
    filteredData && filteredData?.length > 0
      ? Object.keys(filteredData[0]).filter(
          (key) => key !== "id" && key !== "html" && !key.startsWith("btn_"),
        )
      : [];

  /* ================= FORMAT VALUE ================= */

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  /* ================= HEADER ================= */

  const TableHeader = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
            height: 40,
          }}
        >
          {allKeys.map((key, idx) => (
            <View
              key={`${key}-${idx}`}
              style={{
                width: columnWidth,
                height: 40,
                minWidth: 80,
                maxWidth: 150,
                paddingVertical: 14,
                paddingHorizontal: 8,
                borderRightWidth: 1,
                borderRightColor: "rgba(255,255,255,0.15)",
                justifyContent: "center",
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: 11,
                  textTransform: "uppercase",
                }}
              >
                {formatHeaderTitle(key)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  /* ================= ROW ================= */

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const btnKeys = Object.keys(item).filter((key) => key.startsWith("btn_"));

    const authUser = item?.authuser;

    return (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => {
          if (authUser) {
            return;
          }

          if (item?.id !== undefined) {
            setIsFilterVisible(false);
            setSearchQuery("");

            navigation.navigate("Page", {
              item,
              title: pageParamsName,
              id: item?.id,
              url: pageName,
              isFromBusinessCard,
              isFromProfile: false,
            });
          }
        }}
        style={{
          backgroundColor: index % 2 === 0 ? "#fff" : "#f8fafc",
          borderBottomWidth: 1,
          borderBottomColor: "#e2e8f0",
          padding: 4
        }}
      >
        {/* TABLE ROW */}
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {allKeys.map((key, idx) => {
            const value = formatValue(item[key]);

            return (
              <View
                key={`${key}-${idx}`}
                style={{
                  width: columnWidth,
                  minWidth: 110,
                  maxWidth: 150,
                  borderRightWidth: 1,
                  borderRightColor: "#edf2f7",
                  justifyContent: "center",
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                }}
              >
                <Text
                  selectable
                  numberOfLines={2}
                  style={{
                    fontSize: 12,
                    color: "#0f172a",
                    fontWeight: "500",
                    textDecorationStyle: "dotted",
                  }}
                >
                  {value}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ACTION BUTTONS */}
        {btnKeys?.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              padding: 10,
              backgroundColor: "#fff",
              borderTopWidth: 1,
              borderTopColor: "#f1f5f9",
            }}
          >
            {btnKeys.map((key, idx) => {
              const actionValue = item[key];

              const { label, color } = getButtonMeta(key);

              return (
                <TouchableOpacity
                  key={`${key}-${idx}`}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: authUser
                      ? ERP_COLOR_CODE.ERP_APP_COLOR
                      : color,
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 8,
                    marginRight: 8,
                    marginBottom: 8,
                    minWidth: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    handleActionButtonPressed(
                      actionValue,
                      label,
                      color,
                      item?.id,
                    );
                  }}
                >
                  <Text
                    style={{
                      color: ERP_COLOR_CODE.ERP_WHITE,
                      fontWeight: "700",
                      fontSize: 12,
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* FOOTER */}
        {item?.html && (
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#f1f5f9",
            }}
          >
            <MemoizedFooterView item={item} index={index} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  /* ================= EMPTY ================= */

  if (!loadingListId && filteredData?.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <NoData isShowTop={false} />
      </View>
    );
  }

  /* ================= MAIN ================= */

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f1f5f9",
        marginTop: 4
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        <View>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item?.id?.toString() || index.toString()
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={TableHeader}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default TableView;
