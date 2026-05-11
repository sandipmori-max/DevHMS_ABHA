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
import { useAppSelector } from "../../../../store/hooks";
import useTranslations from "../../../../hooks/useTranslations";

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
  parsedConfig
}: any) => {
  const navigation = useNavigation();
  const { t } = useTranslations();

  const screenWidth = Dimensions.get("window").width;
  const theme = useAppSelector((state) => state?.theme?.mode);

  /* ================= COLUMN WIDTH ================= */

  const columnWidth = Math.max(
    110,
    Math.min(150, screenWidth / 4.2),
  );

  /* ================= BUTTON META ================= */

  const getButtonMeta = (key: string) => {
    if (!key || !configData?.length) {
      return {
        label: "Action",
        color: ERP_COLOR_CODE.ERP_COLOR,
      };
    }

    const configItem = configData?.find(
      (cfg: any) =>
        cfg?.datafield?.toLowerCase() === key?.toLowerCase(),
    );

    return {
      label: configItem?.headertext || "Action",
      color: configItem?.colorcode || ERP_COLOR_CODE.ERP_COLOR,
    };
  };

  /* ================= ALL KEYS ================= */

  const allKeys =
    filteredData && filteredData?.length > 0
      ? [
          "#ID",
          ...Object.keys(filteredData[0]).filter(
            (key) =>
              key !== "id" &&
              key !== "html" &&
              !key.startsWith("btn_"),
          ),
        ]
      : [];

  /* ================= FORMAT VALUE ================= */

  const formatValue = (value: any) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
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
      <View
        style={{
          flexDirection: "row",
          backgroundColor:
            ERP_COLOR_CODE.ERP_APP_COLOR,
          height: 40,
        }}
      >
        {allKeys.map((key, idx) => (
          <View
            key={`${key}-${idx}`}
            style={{
              width:
                key === "#ID"
                  ? 40
                  : columnWidth,
              minWidth:
                key === "#ID"
                  ? 40
                  : 110,
              maxWidth:
                key === "#ID"
                  ? 40
                  : 150,
              height: 40,
              paddingHorizontal: 8,
              borderRightWidth: 1,
              borderRightColor:
                "rgba(255,255,255,0.15)",
              justifyContent: "center",
              alignItems:
                key === "#ID"
                  ? "center"
                  : "flex-start",
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
              {key === "#ID"
                ? "#ID"
                : formatHeaderTitle(key)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  /* ================= ROW ================= */

  const renderItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const btnKeys = Object.keys(item).filter((key) =>
      key.startsWith("btn_"),
    );

    const authUser = item?.authuser;

    return (
      <TouchableOpacity
        activeOpacity={0.95}
         onPress={async () => {
              if (!parsedConfig) {
                return;
              }
              if (authUser) return;
              if (
                parsedConfig?.editentry === 1 ||
                parsedConfig?.editentry === "1"
              ) {
                setIsFilterVisible(false);
                setSearchQuery("");
                navigation.navigate("Page", {
                  item,
                  title: pageParamsName,
                  id: item?.id,
                  url: pageName,
                  isFromBusinessCard,
                });
              }
            }}
        style={{
          backgroundColor:
            index % 2 === 0
              ? "#fff"
              : "#f8fafc",
          borderBottomWidth: 1,
          borderBottomColor: "#e2e8f0",
          padding: 4,
        }}
      >
        {/* TABLE ROW */}
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {allKeys.map((key, idx) => {
            const value =
              key === "#ID"
                ? index + 1
                : formatValue(item[key]);

            return (
              <View
                key={`${key}-${idx}`}
                style={{
                  width:
                    key === "#ID"
                      ? 40
                      : columnWidth,
                  minWidth:
                    key === "#ID"
                      ? 40
                      : 110,
                  maxWidth:
                    key === "#ID"
                      ? 40
                      : 150,
                  borderRightWidth: 1,
                  borderRightColor: "#edf2f7",
                  justifyContent: "center",
                  alignItems:
                    key === "#ID"
                      ? "center"
                      : "flex-start",
                  paddingHorizontal: 4,
                  paddingVertical: 6,
                }}
              >
                <Text
                  selectable
                  numberOfLines={2}
                  style={{
                    fontSize: 12,
                    color: "#0f172a",
                    fontWeight:
                      key === "#ID"
                        ? "700"
                        : "500",
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

              const { label, color } =
                getButtonMeta(key);

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
                      color:
                        ERP_COLOR_CODE.ERP_WHITE,
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
            <MemoizedFooterView
              item={item}
              index={index}
            />
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
        margin: 4,
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
              item?.id?.toString() ||
              index.toString()
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={TableHeader}
            stickyHeaderIndices={[0]}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
             
          />
         
        </View>
      </ScrollView>
       {filteredData?.length > 0 && (
                    <View
                      style={{
                        marginTop: 6,
                        padding: 8,
                        borderRadius: 8,
                        backgroundColor:
                          theme === "dark"
                            ? "#000"
                            : "#f1f1f1",
                        borderWidth: 1,
                        borderColor:
                          ERP_COLOR_CODE.ERP_ddd,
                        marginBottom: 6,
                        marginHorizontal: 8,
                        width: "96%",
                      }}
                    >
                      <View
                        style={{
                          justifyContent:
                            "space-between",
                          flexDirection: "row",
                          width: "90%",
                        }}
                      >
                        {totalQty && (
                          <View
                            style={{
                              flexDirection: "row",
                              width: "50%",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "700",
                                color:
                                  theme === "dark"
                                    ? "white"
                                    : ERP_COLOR_CODE.ERP_333,
                              }}
                            >
                              {t("text.text28")} :-
                            </Text>

                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color:
                                  theme === "dark"
                                    ? "white"
                                    : "#28a745",
                                marginLeft: 8,
                              }}
                            >
                              {totalQty?.toFixed(2)}
                            </Text>
                          </View>
                        )}

                        {totalAmount && (
                          <View
                            style={{
                              flexDirection: "row",
                              width: "50%",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "700",
                                flexShrink: 1,
                                color:
                                  theme === "dark"
                                    ? "white"
                                    : ERP_COLOR_CODE.ERP_333,
                              }}
                            >
                              {t("text.text29")} :-
                            </Text>

                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color:
                                  theme === "dark"
                                    ? "white"
                                    : "#28a745",
                                marginLeft: 8,
                              }}
                            >
                              ₹{" "}
                              {totalAmount?.toFixed(
                                2,
                              )}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View
                        style={{
                          justifyContent:
                            "space-between",
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color:
                              theme === "dark"
                                ? "white"
                                : ERP_COLOR_CODE.ERP_333,
                          }}
                        >
                          {filteredData?.length}{" "}
                          {t("text.text31")}
                        </Text>
                      </View>
                    </View>
                  )}
    </View>
  );
};

export default TableView;