import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  NativeModules,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const { DocumentScanner } = NativeModules;

const launchScannerAsync = (options: any) => {
  return new Promise<any>((resolve, reject) => {
    if (!DocumentScanner) {
      reject(new Error("DocumentScanner module not linked"));
      return;
    }

    try {
      DocumentScanner.launchScanner(options, (result: any) => {
        resolve(result);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export interface ScannedImage {
  uri: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  base64?: string;
}

interface DocScanProps {
  label?: string;
  onScanResult?: (data: ScannedImage[]) => void;
}

const DocScan: React.FC<DocScanProps> = ({
  label = "Scan Document",
  onScanResult,
}) => {
  const [images, setImages] = useState<ScannedImage[]>([]);
  const [status, setStatus] = useState("");

  // 📸 Scan
  const handleScan = async () => {
    try {
      setStatus("Opening scanner...");

      const result = await launchScannerAsync({
        quality: 0.8,
        includeExif: true,
        includeBase64: true,
        includeLocationExif: false,
      });

      if (result?.didCancel) {
        setStatus("Scan cancelled");
        return;
      }

      if (result?.error) {
        setStatus(result?.errorMessage || "Scan failed");
        Alert.alert("Error", result?.errorMessage || "Scan failed");
        return;
      }

      if (result?.images?.length > 0) {
        const processed = result.images.map((img: any) => ({
          ...img,
          base64: img.base64 || null,
        }));

        const updated = [...images, ...processed];

        setImages(updated);
        setStatus("Scan successful ✅");
        onScanResult?.(updated);
      } else {
        setStatus("No image found");
      }
    } catch (error: any) {
      setStatus(error.message);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  // 🗑 Delete
  const handleDelete = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onScanResult?.(updated);
  };

  // 🔁 Replace
  const handleReplace = async (index: number) => {
    try {
      const result = await launchScannerAsync({
        quality: 0.8,
        includeBase64: true,
      });

      if (result?.images?.length > 0) {
        const newImage = result.images[0];

        const updated = [...images];
        updated[index] = newImage;

        setImages(updated);
        onScanResult?.(updated);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to replace image");
    }
  };

  return (
    <TouchableOpacity
     onPress={
        () =>{
            if(images.length === 0){
                handleScan();
            }
        }
     }
     style={styles.container}>
      {/* Scan Button */}
      
      

      {/* Status */}

      {/* Empty state */}
      {images.length === 0 && (
        <View style={styles.emptyBox}>
          <MaterialIcons name="document-scanner" size={42} color="#9ca3af" />
          <Text style={styles.emptyText}>No documents scanned yet</Text>
        </View>
      )}

      {/* Images */}
      {images.length > 0 && (
  <View style={styles.singleCard}>
    <Image source={{ uri: images[images.length - 1].uri }} style={styles.singleImage} />

    {/* overlay actions */}
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => handleReplace(images.length - 1)}
      >
        <MaterialIcons name="edit" size={18} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.iconBtn, { backgroundColor: "#ef4444" }]}
        onPress={() => handleDelete(images.length - 1)}
      >
        <MaterialIcons name="delete" size={18} color="#fff" />
      </TouchableOpacity>
    </View>

    <View style={styles.infoBox}>
      <Text style={styles.fileName} numberOfLines={1}>
        {images[images.length - 1].fileName || "Document"}
      </Text>

      <Text style={styles.fileSize}>
        {(images[images.length - 1].fileSize / 1024).toFixed(1)} KB
      </Text>
    </View>
  </View>
)}
    </TouchableOpacity>
  );
};

export default DocScan;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    width: "100%",

  },
singleCard: {
    width: Dimensions.get("window").width - 29,
  borderRadius: 16,
  overflow: "hidden",
  shadowColor: "#000",
  shadowOpacity: 0.12,
},

singleImage: {
  width: Dimensions.get("window").width - 30,
  height: 220,
  resizeMode: 'contain',
},

overlay: {
  position: "absolute",
  top: 0,
  right: 0,
  gap: 8,
  flexDirection: "column",
},

iconBtn: {
  backgroundColor: "#4f46e5",
  padding: 7,
  borderRadius: 10,
},

infoBox: {
  padding: 10,
},
  scanBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  scanText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },

  status: {
    marginTop: 10,
    fontSize: 12,
    color: "#374151",
    backgroundColor: "#eef2ff",
    padding: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 20,
  },

  emptyText: {
    marginTop: 8,
    color: "#9ca3af",
    fontSize: 13,
  },

  card: {
    width: 140,
    marginRight: 12,
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#e5e7eb",
  },

  overlay: {
    position: "absolute",
    top: 8,
    right: 8,
    gap: 6,
  },

  iconBtn: {
    backgroundColor: "#4f46e5",
    padding: 6,
    borderRadius: 8,
    marginBottom: 6,
  },

  infoBox: {
    padding: 8,
  },

  fileName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
  },

  fileSize: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
});