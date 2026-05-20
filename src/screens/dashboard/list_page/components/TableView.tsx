import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native";

import React, {
  useMemo,
  useState,
} from "react";

import { useNavigation } from "@react-navigation/native";

import { formatHeaderTitle } from "../../../../utils/helpers";
import NoData from "../../../../components/no_data/NoData";
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
  parsedConfig,
  primaryGroupKey = "",
  secondaryGroupKey = "",
}: any) => {
  const navigation = useNavigation();

  const { t } = useTranslations();

  const screenWidth =
    Dimensions.get("window").width;

  const theme = useAppSelector(
    (state) => state?.theme?.mode,
  );

  console.log("primaryGroupKey++++++++++++", primaryGroupKey)
  console.log("secondaryGroupKey++++++++++", secondaryGroupKey)
  /* ================= STATE ================= */

  const [collapsedGroups, setCollapsedGroups] =
    useState<any>({});

  const [
    collapsedSubGroups,
    setCollapsedSubGroups,
  ] = useState<any>({});

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
        cfg?.datafield?.toLowerCase() ===
        key?.toLowerCase(),
    );

    return {
      label:
        configItem?.headertext || "Action",
      color:
        configItem?.colorcode ||
        ERP_COLOR_CODE.ERP_COLOR,
    };
  };

  /* ================= ALL KEYS ================= */

  const allKeys =
    filteredData?.length > 0
      ? [
          "#ID",
          ...Object.keys(
            filteredData?.[0],
          ).filter(
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

  /* ================= GROUPED DATA ================= */

  const groupedData = useMemo(() => {
    if (!filteredData?.length) {
      return [];
    }

    // NO GROUPING
    if (!primaryGroupKey) {
      return [
        {
          title: "Data",
          data: filteredData,
        },
      ];
    }

    const grouped: any = {};

    filteredData.forEach((item: any) => {
      let primaryValue =
        item?.[primaryGroupKey];

      if (
        primaryValue === null ||
        primaryValue === undefined ||
        primaryValue === ""
      ) {
        primaryValue = "Others";
      }

      primaryValue = String(primaryValue);

      // PRIMARY
      if (!grouped[primaryValue]) {
        grouped[primaryValue] = {
          title: primaryValue,
          data: [],
          children: {},
        };
      }

      // SECONDARY GROUPING
      if (secondaryGroupKey) {
        let secondaryValue =
          item?.[secondaryGroupKey];

        if (
          secondaryValue === null ||
          secondaryValue === undefined ||
          secondaryValue === ""
        ) {
          secondaryValue = "Others";
        }

        secondaryValue =
          String(secondaryValue);

        if (
          !grouped[primaryValue]
            .children[secondaryValue]
        ) {
          grouped[primaryValue].children[
            secondaryValue
          ] = [];
        }

        grouped[primaryValue].children[
          secondaryValue
        ].push(item);
      } else {
        grouped[primaryValue].data.push(
          item,
        );
      }
    });

    return Object.values(grouped);
  }, [
    filteredData,
    primaryGroupKey,
    secondaryGroupKey,
  ]);

  /* ================= TABLE HEADER ================= */

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

  /* ================= PRIMARY GROUP HEADER ================= */

  const GroupHeader = ({
    title,
    count,
  }: any) => {
    const isCollapsed =
      collapsedGroups?.[title];

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setCollapsedGroups(
            (prev: any) => ({
              ...prev,
              [title]:
                !prev?.[title],
            }),
          );
        }}
        style={{
          backgroundColor:
            ERP_COLOR_CODE.ERP_BORDER_LINE,
          
          paddingVertical: 10,
          paddingHorizontal: 12,

          borderBottomWidth: 1,
          borderBottomColor: "#ddd",

          flexDirection: "row",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginTop: 1,
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 14,
            fontWeight: "700",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: "black",
            fontSize: 13,
            fontWeight: "600",
          }}
        >
          {count} Items{" "}
          {isCollapsed ? "▼" : "▲"}
        </Text>
      </TouchableOpacity>
    );
  };

  /* ================= SECONDARY GROUP HEADER ================= */

  const SubGroupHeader = ({
    title,
    count,
    parent,
  }: any) => {
    const key = `${parent}_${title}`;

    const isCollapsed =
      collapsedSubGroups?.[key];

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setCollapsedSubGroups(
            (prev: any) => ({
              ...prev,
              [key]: !prev?.[key],
            }),
          );
        }}
        style={{
          backgroundColor: "#f1f5f9",

          paddingVertical: 8,
          paddingHorizontal: 18,

          borderBottomWidth: 1,
          borderBottomColor: "#e2e8f0",

          flexDirection: "row",

          justifyContent:
            "space-between",

          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#111827",
            fontSize: 13,
            fontWeight: "700",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: "#111827",
            fontSize: 12,
            fontWeight: "600",
          }}
        >
          {count} Items{" "}
          {isCollapsed ? "▼" : "▲"}
        </Text>
      </TouchableOpacity>
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
    const btnKeys = Object.keys(item).filter(
      (key) => key.startsWith("btn_"),
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
            parsedConfig?.editentry ===
              "1"
          ) {
            // setIsFilterVisible(false);

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

                  borderRightColor:
                    "#edf2f7",

                  justifyContent:
                    "center",

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
                    backgroundColor:
                      authUser
                        ? ERP_COLOR_CODE.ERP_APP_COLOR
                        : color,

                    paddingVertical: 8,
                    paddingHorizontal: 14,

                    borderRadius: 8,

                    marginRight: 8,
                    marginBottom: 8,

                    minWidth: 100,

                    alignItems: "center",

                    justifyContent:
                      "center",
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

  if (
    !loadingListId &&
    filteredData?.length === 0
  ) {
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
        margin: 4,
        flex: 1,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        bounces={false}
        nestedScrollEnabled={true}
      >
        <View>
          <FlatList
            data={groupedData}
            keyExtractor={(
              item: any,
              index,
            ) =>
              `${item?.title}-${index}`
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
              false
            }
            ListHeaderComponent={
              TableHeader
            }
            stickyHeaderIndices={[0]}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
            renderItem={({
              item: group,
            }: any) => {
              const isCollapsed =
                collapsedGroups?.[
                  group?.title
                ];

              return (
                <View>
                  {/* PRIMARY GROUP */}
                  <GroupHeader
                    title={group?.title}
                    count={
                      secondaryGroupKey
                        ? Object.values(
                            group?.children ||
                              {},
                          ).flat()
                            .length
                        : group?.data
                            ?.length
                    }
                  />

                  {/* DATA */}
                  {!isCollapsed && (
                    <>
                      {/* SECONDARY GROUPING */}
                      {secondaryGroupKey ? (
                        Object.keys(
                          group?.children ||
                            {},
                        ).map(
                          (
                            subGroupName,
                          ) => {
                            const subData =
                              group
                                ?.children?.[
                                subGroupName
                              ];

                            const subKey = `${group?.title}_${subGroupName}`;

                            const subCollapsed =
                              collapsedSubGroups?.[
                                subKey
                              ];

                            return (
                              <View
                                key={
                                  subKey
                                }
                              >
                                <SubGroupHeader
                                  title={
                                    subGroupName
                                  }
                                  count={
                                    subData?.length
                                  }
                                  parent={
                                    group?.title
                                  }
                                />

                                {!subCollapsed &&
                                  subData?.map(
                                    (
                                      rowItem: any,
                                      rowIndex: number,
                                    ) => (
                                      <View
                                        key={`${rowItem?.id}-${rowIndex}`}
                                      >
                                        {renderItem(
                                          {
                                            item:
                                              rowItem,
                                            index:
                                              rowIndex,
                                          },
                                        )}
                                      </View>
                                    ),
                                  )}
                              </View>
                            );
                          },
                        )
                      ) : (
                        <>
                          {group?.data?.map(
                            (
                              rowItem: any,
                              rowIndex: number,
                            ) => (
                              <View
                                key={`${rowItem?.id}-${rowIndex}`}
                              >
                                {renderItem({
                                  item:
                                    rowItem,
                                  index:
                                    rowIndex,
                                })}
                              </View>
                            ),
                          )}
                        </>
                      )}
                    </>
                  )}
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default TableView;



// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Dimensions,
//   FlatList,
//   ScrollView,
// } from "react-native";

// import React, {
//   useMemo,
//   useState,
// } from "react";

// import { useNavigation } from "@react-navigation/native";

// import { formatHeaderTitle } from "../../../../utils/helpers";
// import NoData from "../../../../components/no_data/NoData";
// import { ERP_COLOR_CODE } from "../../../../utils/constants";
// import MemoizedFooterView from "./MemoizedFooterView";
// import { useAppSelector } from "../../../../store/hooks";
// import useTranslations from "../../../../hooks/useTranslations";

// const TableView = ({
//   configData,
//   filteredData,
//   loadingListId,
//   totalAmount,
//   pageParamsName,
//   pageName,
//   handleActionButtonPressed,
//   setIsFilterVisible,
//   setSearchQuery,
//   totalQty,
//   isFromBusinessCard,
//   parsedConfig,

//   // GROUPING
//   primaryGroupKey = "",
//   secondaryGroupKey = "",
// }: any) => {
//   const navigation = useNavigation();

//   const { t } = useTranslations();

//   const screenWidth =
//     Dimensions.get("window").width;

//   const theme = useAppSelector(
//     (state) => state?.theme?.mode,
//   );

//   /* ================= STATE ================= */

//   const [collapsedGroups, setCollapsedGroups] =
//     useState<any>({});

//   const [
//     collapsedSubGroups,
//     setCollapsedSubGroups,
//   ] = useState<any>({});

//   /* ================= COLUMN WIDTH ================= */

//   const columnWidth = Math.max(
//     110,
//     Math.min(150, screenWidth / 4.2),
//   );

//   /* ================= BUTTON META ================= */

//   const getButtonMeta = (key: string) => {
//     if (!key || !configData?.length) {
//       return {
//         label: "Action",
//         color: ERP_COLOR_CODE.ERP_COLOR,
//       };
//     }

//     const configItem = configData?.find(
//       (cfg: any) =>
//         cfg?.datafield?.toLowerCase() ===
//         key?.toLowerCase(),
//     );

//     return {
//       label:
//         configItem?.headertext || "Action",

//       color:
//         configItem?.colorcode ||
//         ERP_COLOR_CODE.ERP_COLOR,
//     };
//   };

//   /* ================= ALL KEYS ================= */

//   const allKeys =
//     filteredData?.length > 0
//       ? [
//           "#ID",
//           ...Object.keys(
//             filteredData?.[0],
//           ).filter(
//             (key) =>
//               key !== "id" &&
//               key !== "html" &&
//               !key.startsWith("btn_"),
//           ),
//         ]
//       : [];

//   /* ================= FORMAT VALUE ================= */

//   const formatValue = (value: any) => {
//     if (
//       value === null ||
//       value === undefined ||
//       value === ""
//     ) {
//       return "-";
//     }

//     if (typeof value === "object") {
//       return JSON.stringify(value);
//     }

//     return String(value);
//   };

//   /* ================= GROUPED DATA ================= */

//   const groupedData = useMemo(() => {
//     if (!filteredData?.length) {
//       return [];
//     }

//     // NO GROUPING
//     if (!primaryGroupKey) {
//       return [
//         {
//           title: "Data",
//           data: filteredData,
//         },
//       ];
//     }

//     const grouped: any = {};

//     filteredData.forEach((item: any) => {
//       let primaryValue =
//         item?.[primaryGroupKey];

//       if (
//         primaryValue === null ||
//         primaryValue === undefined ||
//         primaryValue === ""
//       ) {
//         primaryValue = "Others";
//       }

//       primaryValue = String(primaryValue);

//       // PRIMARY
//       if (!grouped[primaryValue]) {
//         grouped[primaryValue] = {
//           title: primaryValue,
//           data: [],
//           children: {},
//         };
//       }

//       // SECONDARY
//       if (secondaryGroupKey) {
//         let secondaryValue =
//           item?.[secondaryGroupKey];

//         if (
//           secondaryValue === null ||
//           secondaryValue === undefined ||
//           secondaryValue === ""
//         ) {
//           secondaryValue = "Others";
//         }

//         secondaryValue =
//           String(secondaryValue);

//         if (
//           !grouped[primaryValue]
//             .children[secondaryValue]
//         ) {
//           grouped[primaryValue].children[
//             secondaryValue
//           ] = [];
//         }

//         grouped[primaryValue].children[
//           secondaryValue
//         ].push(item);
//       } else {
//         grouped[primaryValue].data.push(
//           item,
//         );
//       }
//     });

//     return Object.values(grouped);
//   }, [
//     filteredData,
//     primaryGroupKey,
//     secondaryGroupKey,
//   ]);

//   /* ================= TABLE HEADER ================= */

//   const TableHeader = () => {
//     return (
//       <View
//         style={{
//           flexDirection: "row",

//           backgroundColor:
//             ERP_COLOR_CODE.ERP_APP_COLOR,

//           height: 40,
//         }}
//       >
//         {allKeys.map((key, idx) => (
//           <View
//             key={`${key}-${idx}`}
//             style={{
//               width:
//                 key === "#ID"
//                   ? 40
//                   : columnWidth,

//               minWidth:
//                 key === "#ID"
//                   ? 40
//                   : 110,

//               maxWidth:
//                 key === "#ID"
//                   ? 40
//                   : 150,

//               height: 40,

//               paddingHorizontal: 8,

//               borderRightWidth: 1,

//               borderRightColor:
//                 "rgba(255,255,255,0.15)",

//               justifyContent: "center",

//               alignItems:
//                 key === "#ID"
//                   ? "center"
//                   : "flex-start",
//             }}
//           >
//             <Text
//               numberOfLines={1}
//               style={{
//                 color: "#fff",

//                 fontWeight: "800",

//                 fontSize: 11,

//                 textTransform: "uppercase",
//               }}
//             >
//               {key === "#ID"
//                 ? "#ID"
//                 : formatHeaderTitle(key)}
//             </Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   /* ================= PRIMARY GROUP ================= */

//   const GroupHeader = ({
//     title,
//     count,
//   }: any) => {
//     const isCollapsed =
//       collapsedGroups?.[title];

//     return (
//       <TouchableOpacity
//         activeOpacity={0.8}
//         onPress={() => {
//           setCollapsedGroups(
//             (prev: any) => ({
//               ...prev,
//               [title]:
//                 !prev?.[title],
//             }),
//           );
//         }}
//         style={{
//           backgroundColor:
//             ERP_COLOR_CODE.ERP_BORDER_LINE,

//           paddingVertical: 10,

//           paddingHorizontal: 12,

//           borderBottomWidth: 1,

//           borderBottomColor: "#ddd",

//           flexDirection: "row",

//           alignItems: "center",

//           marginTop: 1,
//         }}
//       >
//         <Text
//           style={{
//             color: "black",

//             fontSize: 14,

//             fontWeight: "700",
//           }}
//         >
//           {title}
//         </Text>

//         <Text
//           style={{
//             color: "black",

//             fontSize: 13,

//             fontWeight: "600",

//             marginLeft: "auto",
//           }}
//         >
//           {count} Items{" "}
//           {isCollapsed ? "▼" : "▲"}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   /* ================= SECONDARY GROUP ================= */

//   const SubGroupHeader = ({
//     title,
//     count,
//     parent,
//   }: any) => {
//     const key = `${parent}_${title}`;

//     const isCollapsed =
//       collapsedSubGroups?.[key];

//     return (
//       <TouchableOpacity
//         activeOpacity={0.8}
//         onPress={() => {
//           setCollapsedSubGroups(
//             (prev: any) => ({
//               ...prev,
//               [key]: !prev?.[key],
//             }),
//           );
//         }}
//         style={{
//           backgroundColor: "#f1f5f9",

//           paddingVertical: 8,

//           paddingHorizontal: 18,

//           borderBottomWidth: 1,

//           borderBottomColor: "#e2e8f0",

//           flexDirection: "row",

//           alignItems: "center",
//         }}
//       >
//         <Text
//           style={{
//             color: "#111827",

//             fontSize: 13,

//             fontWeight: "700",
//           }}
//         >
//           {title}
//         </Text>

//         <Text
//           style={{
//             color: "#111827",

//             fontSize: 12,

//             fontWeight: "600",

//             marginLeft: "auto",
//           }}
//         >
//           {count} Items{" "}
//           {isCollapsed ? "▼" : "▲"}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   /* ================= ROW ================= */

//   const renderItem = ({
//     item,
//     index,
//   }: {
//     item: any;
//     index: number;
//   }) => {
//     const btnKeys = Object.keys(item).filter(
//       (key) => key.startsWith("btn_"),
//     );

//     const authUser = item?.authuser;

//     return (
//       <TouchableOpacity
//         activeOpacity={0.95}
//         onPress={async () => {
//           if (!parsedConfig) {
//             return;
//           }

//           if (authUser) return;

//           if (
//             parsedConfig?.editentry === 1 ||
//             parsedConfig?.editentry ===
//               "1"
//           ) {
//             setIsFilterVisible(false);

//             setSearchQuery("");

//             navigation.navigate("Page", {
//               item,
//               title: pageParamsName,
//               id: item?.id,
//               url: pageName,
//               isFromBusinessCard,
//             });
//           }
//         }}
//         style={{
//           backgroundColor:
//             index % 2 === 0
//               ? "#fff"
//               : "#f8fafc",

//           borderBottomWidth: 1,

//           borderBottomColor: "#e2e8f0",

//           padding: 4,
//         }}
//       >
//         {/* TABLE ROW */}
//         <View
//           style={{
//             flexDirection: "row",
//           }}
//         >
//           {allKeys.map((key, idx) => {
//             const value =
//               key === "#ID"
//                 ? index + 1
//                 : formatValue(item[key]);

//             return (
//               <View
//                 key={`${key}-${idx}`}
//                 style={{
//                   width:
//                     key === "#ID"
//                       ? 40
//                       : columnWidth,

//                   minWidth:
//                     key === "#ID"
//                       ? 40
//                       : 110,

//                   maxWidth:
//                     key === "#ID"
//                       ? 40
//                       : 150,

//                   borderRightWidth: 1,

//                   borderRightColor:
//                     "#edf2f7",

//                   justifyContent:
//                     "center",

//                   alignItems:
//                     key === "#ID"
//                       ? "center"
//                       : "flex-start",

//                   paddingHorizontal: 4,

//                   paddingVertical: 6,
//                 }}
//               >
//                 <Text
//                   selectable
//                   numberOfLines={2}
//                   style={{
//                     fontSize: 12,

//                     color: "#0f172a",

//                     fontWeight:
//                       key === "#ID"
//                         ? "700"
//                         : "500",
//                   }}
//                 >
//                   {value}
//                 </Text>
//               </View>
//             );
//           })}
//         </View>

//         {/* ACTION BUTTONS */}
//         {btnKeys?.length > 0 && (
//           <View
//             style={{
//               flexDirection: "row",

//               flexWrap: "wrap",

//               padding: 10,

//               backgroundColor: "#fff",

//               borderTopWidth: 1,

//               borderTopColor: "#f1f5f9",
//             }}
//           >
//             {btnKeys.map((key, idx) => {
//               const actionValue = item[key];

//               const { label, color } =
//                 getButtonMeta(key);

//               return (
//                 <TouchableOpacity
//                   key={`${key}-${idx}`}
//                   activeOpacity={0.85}
//                   style={{
//                     backgroundColor:
//                       authUser
//                         ? ERP_COLOR_CODE.ERP_APP_COLOR
//                         : color,

//                     paddingVertical: 8,

//                     paddingHorizontal: 14,

//                     borderRadius: 8,

//                     marginRight: 8,

//                     marginBottom: 8,

//                     minWidth: 100,

//                     alignItems: "center",

//                     justifyContent:
//                       "center",
//                   }}
//                   onPress={() => {
//                     handleActionButtonPressed(
//                       actionValue,
//                       label,
//                       color,
//                       item?.id,
//                     );
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color:
//                         ERP_COLOR_CODE.ERP_WHITE,

//                       fontWeight: "700",

//                       fontSize: 12,
//                     }}
//                   >
//                     {label}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         )}

//         {/* FOOTER */}
//         {item?.html && (
//           <View
//             style={{
//               borderTopWidth: 1,

//               borderTopColor: "#f1f5f9",
//             }}
//           >
//             <MemoizedFooterView
//               item={item}
//               index={index}
//             />
//           </View>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   /* ================= EMPTY ================= */

//   if (
//     !loadingListId &&
//     filteredData?.length === 0
//   ) {
//     return (
//       <View
//         style={{
//           flex: 1,

//           justifyContent: "center",

//           alignItems: "center",

//           backgroundColor: "#fff",
//         }}
//       >
//         <NoData isShowTop={false} />
//       </View>
//     );
//   }

//   /* ================= MAIN ================= */

//   return (
//     <View
//       style={{
//         margin: 4,
//         flex: 1,
//       }}
//     >
//       <FlatList
//         data={groupedData}
//         keyExtractor={(
//           item: any,
//           index,
//         ) => `${item?.title}-${index}`}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: 20,
//         }}
//         ListHeaderComponent={() => (
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={
//               false
//             }
//             bounces={false}
//           >
//             <TableHeader />
//           </ScrollView>
//         )}
//         stickyHeaderIndices={[0]}
//         renderItem={({
//           item: group,
//         }: any) => {
//           const isCollapsed =
//             collapsedGroups?.[
//               group?.title
//             ];

//           return (
//             <View>
//               {/* PRIMARY GROUP */}
//               <GroupHeader
//                 title={group?.title}
//                 count={
//                   secondaryGroupKey
//                     ? Object.values(
//                         group?.children ||
//                           {},
//                       ).flat().length
//                     : group?.data
//                         ?.length
//                 }
//               />

//               {!isCollapsed && (
//                 <>
//                   {/* SECONDARY GROUPING */}
//                   {secondaryGroupKey ? (
//                     Object.keys(
//                       group?.children ||
//                         {},
//                     ).map(
//                       (
//                         subGroupName,
//                       ) => {
//                         const subData =
//                           group
//                             ?.children?.[
//                             subGroupName
//                           ];

//                         const subKey = `${group?.title}_${subGroupName}`;

//                         const subCollapsed =
//                           collapsedSubGroups?.[
//                             subKey
//                           ];

//                         return (
//                           <View
//                             key={subKey}
//                           >
//                             {/* SUB GROUP */}
//                             <SubGroupHeader
//                               title={
//                                 subGroupName
//                               }
//                               count={
//                                 subData?.length
//                               }
//                               parent={
//                                 group?.title
//                               }
//                             />

//                             {/* HORIZONTAL ROWS */}
//                             {!subCollapsed && (
//                               <ScrollView
//                                 horizontal
//                                 showsHorizontalScrollIndicator={
//                                   false
//                                 }
//                                 nestedScrollEnabled
//                               >
//                                 <View>
//                                   {subData?.map(
//                                     (
//                                       rowItem: any,
//                                       rowIndex: number,
//                                     ) => (
//                                       <View
//                                         key={`${rowItem?.id}-${rowIndex}`}
//                                       >
//                                         {renderItem(
//                                           {
//                                             item:
//                                               rowItem,
//                                             index:
//                                               rowIndex,
//                                           },
//                                         )}
//                                       </View>
//                                     ),
//                                   )}
//                                 </View>
//                               </ScrollView>
//                             )}
//                           </View>
//                         );
//                       },
//                     )
//                   ) : (
//                     <ScrollView
//                       horizontal
//                       showsHorizontalScrollIndicator={
//                         false
//                       }
//                       nestedScrollEnabled
//                     >
//                       <View>
//                         {group?.data?.map(
//                           (
//                             rowItem: any,
//                             rowIndex: number,
//                           ) => (
//                             <View
//                               key={`${rowItem?.id}-${rowIndex}`}
//                             >
//                               {renderItem({
//                                 item:
//                                   rowItem,
//                                 index:
//                                   rowIndex,
//                               })}
//                             </View>
//                           ),
//                         )}
//                       </View>
//                     </ScrollView>
//                   )}
//                 </>
//               )}
//             </View>
//           );
//         }}
//       />
//     </View>
//   );
// };

// export default TableView;