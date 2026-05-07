import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, TouchableWithoutFeedback } from "react-native";
import TypingDots from "./TypingDots";
import { useAppSelector } from "../../../../store/hooks";

const GreetingBottomSheet = ({
  visible,
  message,
  title = "DevERP AI alert",
  onClose,
}: any) => {
  const [displayText, setDisplayText] = useState("");
const { height, width } = useWindowDimensions();  
    const theme = useAppSelector(state => state?.theme.mode);

  const isLandscape = width > height;
  useEffect(() => {
    if (!visible) {
      setDisplayText("");
      return;
    }

    let i = 0;

    const interval = setInterval(() => {
      setDisplayText(message.slice(0, i + 1));
      i++;

      if (i >= message.length) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [visible, message]);

  return (
    <Modal visible={visible} supportedOrientations={["portrait", "landscape"]} transparent animationType="slide">
    
     <TouchableWithoutFeedback onPress={() => onClose()}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
    
      <View style={[styles.overlay,isLandscape && {
        alignContent:'center',
        alignItems:'center'
      }]}>
        <View style={[styles.sheet,
        theme === 'dark' && {
          backgroundColor: '#000',
          borderColor: 'white',
          borderWidth: 0.4
        },
        {
          width: isLandscape ? '50%' : '100%'
        }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.aiRow}>
              <Text style={[styles.botIcon, theme === 'dark' && { color: 'white' }]}>🤖</Text>
              <Text style={[styles.title, theme === 'dark' && { color: 'white' }]}>{title}</Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.close, theme === 'dark' && { color: 'white' }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* AI Message Bubble */}
          <View style={styles.messageBubble}>
            {!displayText && <TypingDots visible={visible} />}

            <Text style={styles.message}>{displayText}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GreetingBottomSheet;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
    minHeight: 220,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  aiRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  botIcon: {
    fontSize: 22,
    marginRight: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  close: {
    fontSize: 22,
    color: "#999",
  },

  messageBubble: {
    backgroundColor: "#F3F6FF",
    padding: 16,
    borderRadius: 14,
  },

  message: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    // fontFamily: "Handlee-Regular",
  },
});
