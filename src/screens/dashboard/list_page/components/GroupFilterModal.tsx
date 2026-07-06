import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { useMemo, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";

const GroupFilterModal = ({
  visible,
  onClose,
  data = [],
  selectedKey,
  onSelectKey,
}: any) => {
  /* ================= ALL AVAILABLE KEYS ================= */

  const availableKeys = useMemo(() => {
    if (!data?.length) {
      return [];
    }

    return Object.keys(data[0]).filter(
      (key) =>
        key !== "id" &&
        key !== "html" &&
        !key.startsWith("btn_"),
    );
  }, [data]);

  /* ================= RENDER ================= */

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
       supportedOrientations={[
        "portrait",
        "landscape",
      ]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor:
            "rgba(0,0,0,0.4)", 
          alignContent:'center', 
          alignItems:'center',
          justifyContent: "flex-end", 
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            maxHeight: "80%",
            overflow: "hidden",
            width: '100%',
            padding: 12
          }}
        >
          {/* HEADER */}
          <View
            style={{
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
              flexDirection:'row',
              justifyContent:'space-between'
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Select Group By
            </Text>

              <TouchableOpacity 
            onPress={onClose}
            style={{  
              height: 22,
              width: 22,
              borderRadius: 4,
              justifyContent:'center',
              alignContent:'center',
              alignItems:'center',
              borderWidth: 1 
            }}
          >
             <MaterialIcons name="close"/>
          </TouchableOpacity>
          </View>


          {/* KEY LIST */}
          <FlatList
            data={availableKeys}
                              bounces={false}

            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected =
                selectedKey === item;

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    onSelectKey(item);
                    onClose();
                  }}
                  style={{
                    padding: 14,
                    borderBottomWidth: 1,
                    borderBottomColor:
                      "#f1f1f1",
                    backgroundColor:
                      isSelected
                        ? "#eef2ff"
                        : "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight:
                        isSelected
                          ? "700"
                          : "500",
                      color: "#111827",
                      textTransform:
                        "capitalize",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* FOOTER */}
        
        </View>
      </View>
    </Modal>
  );
};

export default GroupFilterModal;