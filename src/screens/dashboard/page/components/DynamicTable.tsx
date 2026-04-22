import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
import { useAppSelector } from "../../../../store/hooks";

const { width } = Dimensions.get("window");

export default function DynamicTable({
  template,
  allData,
  setAllData,
  renderItem,
  sectionKey,
  buttons,
}: any) {
  const theme = useAppSelector((state) => state?.theme.mode);

    const { height, width } = useWindowDimensions();
    const isLandscape = width > height;

  // 🔹 Helper: chunk array into 2 items (2 column layout)
  const chunkArray = (arr, size = 2) => {
    const result: any[] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  // 🔹 Initialize first row
  useEffect(() => {
    if (!allData[sectionKey]) {
      const firstRow = template.map((item) => ({
        ...item,
        rowId: Date.now(),
        text: "",
      }));

      setAllData((prev) => ({
        ...prev,
        [sectionKey]: [firstRow],
      }));
    }
  }, []);

  const rows = allData[sectionKey] || [];

  // 🔹 Add Row
  const addRow = () => {
    const newId = Date.now();

    const newRow = template.map((item) => ({
      ...item,
      rowId: newId,
      text: "",
    }));

    setAllData((prev) => ({
      ...prev,
      [sectionKey]: [...rows, newRow],
    }));
  };

  // 🔹 Update Value
  const updateValue = (rowId, field, value) => {
    setAllData((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((row) =>
        row[0].rowId === rowId
          ? row.map((item) =>
              item.field === field ? { ...item, text: value } : item
            )
          : row
      ),
    }));
  };

  // 🔹 Delete Row
  const deleteRow = (rowId) => {
    setAllData((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter(
        (row) => row[0].rowId !== rowId
      ),
    }));
  };

  // 🔹 Prepare Header (visible filter + chunk)
  const headerChunks = chunkArray(
    template.filter((item) => item.visible !== "1")
  );

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
        {sectionKey}
      </Text>

      <View
        style={{
          backgroundColor:  theme ? "#000" : "#fffbfb",
          borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
          shadowColor: "#fde1e1",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          borderWidth: 0.5,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* 🔹 Header */}
        <View>
          {headerChunks.map((chunk, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: "row" }}>
              {chunk.map((item, i) => (
                <View
                  key={i}
                  style={{
                    width: "50%",
                    backgroundColor: "#eee",
                    borderWidth: 0.5,
                    borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE
                   }}
                >
                  <Text style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    fontWeight: '700'
                  }}>{item.fieldtitle}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* 🔹 Rows */}
        {rows.map((row, rowIndex) => {
          const rowId = row[0].rowId;

          const visibleItems = row.filter(
            (item) => item.visible !== "1"
          );

          const rowChunks = chunkArray(visibleItems);

          return (
            <View key={rowIndex} style={{ paddingTop: 8,
              paddingHorizontal: 2
             }}>
              {rowChunks.map((chunk, chunkIndex) => (
                <View key={chunkIndex} style={{ flexDirection: "row" }}>
                  {chunk.map((item, colIndex) => (
                    <View
                      key={colIndex}
                      style={{
                        width: "50%",
                      }}
                    >
                      {renderItem({
                        item: {
                          ...item,
                          value: item.text,
                          onChange: (val) =>
                            updateValue(rowId, item.field, val),
                        },
                        index: colIndex,
                        isFromChild: true,
                      })}
                    </View>
                  ))}
                </View>
              ))}

              {/* 🔹 Delete */}
              <TouchableOpacity
                style={{
                  backgroundColor: ERP_COLOR_CODE.ERP_ERROR,
                  padding: 6,
                  borderRadius: 6,
                  alignSelf: "flex-end",
                  marginRight: 6,
                }}
                onPress={() => deleteRow(rowId)}
              >
                <MaterialIcons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          );
        })}

        {/* 🔹 Footer Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 10,
            borderTopWidth: 0.5,
            borderTopColor: ERP_COLOR_CODE.ERP_BORDER_LINE
          }}
        >
          {/* Left Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row",  }}>
              {buttons.map((btn, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => console.log(btn.btn_name)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: btn.btn_color,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 6,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: "white", marginRight: 4 }}>
                    {btn.btn_name}
                  </Text>
                  <MaterialIcons
                    size={16}
                    name={btn.btn_icon_name}
                    color={"white"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Add Button */}
          <TouchableOpacity
            style={{
              backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
              padding: 8,
              borderRadius: 8,
              marginTop: 8
            }}
            onPress={addRow}
          >
            <MaterialIcons size={20} name="add" color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}