import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { ERP_COLOR_CODE } from "../../../../utils/constants";

export type DropdownItem = {
  label: string;
  value: any;
};

type Props = {
  label: string;
  data: DropdownItem[];
  selected: any;
  onChange: (value: any) => void;
};

const Dropdown = ({
  label,
  data,
  selected,
  onChange,
}: Props) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel = useMemo(() => {
    const item = data.find(
      x => JSON.stringify(x.value) === JSON.stringify(selected),
    );

    return item?.label ?? "Select";
  }, [selected, data]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.input}
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.value}>{selectedLabel}</Text>

        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      <Modal
        transparent
        animationType="slide"
        visible={visible}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <Pressable style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {label}
              </Text>

              <TouchableOpacity
                onPress={() => setVisible(false)}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={data}
              keyExtractor={(_, index) =>
                index.toString()
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.itemText}>
                    {item.label}
                  </Text>

                  {selectedLabel === item.label && (
                    <MaterialIcons
                      name="check-circle"
                      size={22}
                      color={ERP_COLOR_CODE.ERP_APP_COLOR}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 6
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#616161",
    marginBottom: 8,
  },

  input: {
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  value: {
    fontSize: 15,
    color: "#212121",
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "60%",
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  itemText: {
    fontSize: 16,
    color: "#212121",
  },
});