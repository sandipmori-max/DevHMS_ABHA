import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import RNFS from "react-native-fs";
 import { ERP_COLOR_CODE } from "../../../../utils/constants";
import { useAppSelector } from "../../../../store/hooks";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const MAX_DURATION_MS = 20000; // 20 sec
const MAX_SIZE_MB = 25;

export default function VideoRecorder({ item }: any) {
  const cameraRef = useRef(null);
  const device = useCameraDevice("back");

  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const theme = useAppSelector((state) => state?.theme.mode);

  // -------------------------------------------------
  // PERMISSIONS
  // -------------------------------------------------
  const requestPermissions = async () => {
    const cam = await Camera.requestCameraPermission();
    const mic = await Camera.requestMicrophonePermission();

    const camOK = cam === "authorized" || cam === "granted";
    const micOK = mic === "authorized" || mic === "granted";

    if (camOK && micOK) {
      setPermissionsGranted(true);
      setShowCamera(true);
    } else {
      Alert.alert("Permissions Required", "Camera & Microphone are required.");
    }
  };

  const checkFileSize = async (filePath) => {
    const stat = await RNFS.stat(filePath);
    const sizeMB = stat.size / (1024 * 1024);
    return sizeMB <= MAX_SIZE_MB;
  };

  // -------------------------------------------------
  // RECORDING
  // -------------------------------------------------
  const startRecording = () => {
    setIsRecording(true);

    cameraRef.current.startRecording({
      flash: "off",

      onRecordingFinished: async (video) => {
        setIsRecording(false);
        setLoading(true);

        const isValid = await checkFileSize(video.path);

        if (!isValid) {
          Alert.alert("Warning", "Video is larger than 25MB!");
        } else {
          Alert.alert("Success", "Video recorded successfully!");
        }

        setLoading(false);
        setShowCamera(false);
      },

      onRecordingError: (error) => {
        console.error("Recording error:", error);
        Alert.alert("Error", "Failed to record video.");
        setIsRecording(false);
      },
    });

    setTimeout(() => {
      if (isRecording) stopRecording();
    }, MAX_DURATION_MS);
  };

  const stopRecording = () => {
    try {
      cameraRef.current.stopRecording();
    } catch (_) {}
    setIsRecording(false);
  };

  // -------------------------------------------------
  // ------------------ UI FLOW -----------------------
  // -------------------------------------------------

  // 1️⃣ FIRST SCREEN – Record Button
  if (!showCamera) {
    return (
      <>
        <Text style={[styles.label, theme === "dark" && { color: "white" }]}>
          {item?.fieldtitle}
        </Text>

        {item?.tooltip !== item?.fieldtitle && (
          <Text style={[styles.subLabel, theme === "dark" && { color: "white" }]}>
            {item?.tooltip}
          </Text>
        )}

        {item?.mandatory === "1" && (
          <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>
        )}

        <View style={styles.startContainer}>
          <TouchableOpacity style={styles.startBtn} onPress={requestPermissions}>
            <MaterialIcons name="videocam" size={22} color="#fff" />
            <Text style={styles.startBtnText}>Record Video</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // 2️⃣ CAMERA LOADING
  if (!permissionsGranted || !device) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading camera...</Text>
      </View>
    );
  }

  // 3️⃣ CAMERA SCREEN WITH RECORD CONTROLS
  return (
    <View style={styles.cameraContainer}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        video={true}
        audio={true}
      />

      <View style={styles.controls}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : isRecording ? (
          <TouchableOpacity style={styles.stopBtn} onPress={stopRecording}>
            <MaterialIcons name="stop" size={28} color="#fff" />
            <Text style={styles.controlText}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.recordBtn} onPress={startRecording}>
            <MaterialIcons name="fiber-manual-record" size={30} color="red" />
            <Text style={styles.controlText}>Record</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// -------------------------------------------------
// ------------------ STYLES ------------------------
// -------------------------------------------------
const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: ERP_COLOR_CODE.ERP_333,
    fontWeight: "700",
    marginBottom: 6,
  },
  subLabel: {
    fontSize: 13,
    color: ERP_COLOR_CODE.ERP_333,
    opacity: 0.7,
    marginBottom: 6,
  },

  // First Screen
  startContainer: {
    width: "100%",
    marginTop: 10,
  },
  startBtn: {
    width: "100%",
    backgroundColor: "#1976D2",
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  startBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Camera
  cameraContainer: {
    height: 450,
    backgroundColor: "#000",
  },

  loadingContainer: {
    height: 450,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  // Controls on camera
  controls: {
    position: "absolute",
    bottom: 25,
    width: "100%",
    alignItems: "center",
  },
  recordBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  stopBtn: {
    backgroundColor: "rgba(255,0,0,0.9)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  controlText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 5,
  },
});
