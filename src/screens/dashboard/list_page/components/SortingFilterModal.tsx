import MaterialIcons from "@react-native-vector-icons/material-icons";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  data?: string[];
  selectedValue?: string;
  onSelect: (item: string) => void;
  renderRight?: (item: string) => React.ReactNode;
};

const SortingFilterModal: React.FC<Props> = ({
  visible,
  onClose,
  title = "Select Option",
  data = [],
  selectedValue,
  onSelect,
  renderRight,
}) => {
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
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "#fff",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            maxHeight: "80%",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
         <View
                   style={{
                     padding: 14,
                     marginVertical: 10,
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

          {/* LIST */}
          <FlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected =
                selectedValue === item;

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  style={{
                    paddingHorizontal: 16,
                    marginHorizontal: 12,
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor:
                      "#f3f4f6",
                    backgroundColor:
                      isSelected
                        ? "#eef2ff"
                        : "#fff",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#111827",
                        fontWeight:
                          isSelected
                            ? "700"
                            : "500",
                        textTransform:
                          "capitalize",
                      }}
                    >
                      {item}
                    </Text>

                    {renderRight?.(item)}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
 
        </View>
      </View>
    </Modal>
  );
};

export default SortingFilterModal;