import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";

type InfoTooltipProps = {
  text: string;
  title?: string;
  iconSize?: number;
  iconColor?: string;
};

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  title = "Tooltip",
  iconSize = 20,
  iconColor = "#989898",
}) => {
  const [visible, setVisible] = useState(false);
 const { height, width } = useWindowDimensions();  
  const isLandscape = width > height;
  return (
    <>
      {/* Info Icon */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
      >
        <MaterialIcons
          name="info-outline"
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
         supportedOrientations={["portrait", "landscape"]}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          {/* Backdrop Click */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
          />

          {/* Popup */}
          <View style={[styles.modalContainer, {
               width: isLandscape ? '50%' : '100%'
          }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="info-outline"
                  size={22}
                  color="#2563eb"
                />
              </View>

              <Text style={styles.title}>{title}</Text>

              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Content */}
            <Text style={styles.description}>{text}</Text>
            <View style={styles.divider} />

            
          </View>
        </View>
      </Modal>
    </>
  );
};

export default InfoTooltip;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  closeButton: {
    padding: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },

  description: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 24,
  },

  button: {
    marginTop: 24,
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});