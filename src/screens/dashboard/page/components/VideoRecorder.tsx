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

const MAX_DURATION_MS = 20000; // 20 sec
const MAX_SIZE_MB = 25;

export default function VideoRecorder({item}: any) {
    console.log("item-------VideoRecorder **************----------", item)

  const cameraRef = useRef(null);
  const device = useCameraDevice("back");

  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const theme = useAppSelector(state => state?.theme.mode);

  // -------------------------------------------------
  // REQUEST PERMISSIONS WHEN USER PRESSES START
  // -------------------------------------------------
  const requestPermissions = async () => {
    const cam = await Camera.requestCameraPermission();
    const mic = await Camera.requestMicrophonePermission();

    const camOK = cam === "authorized" || cam === "granted";
    const micOK = mic === "authorized" || mic === "granted";

    if (camOK && micOK) {
      setPermissionsGranted(true);
      setShowCamera(true); // show camera after permission
    } else {
      Alert.alert("Permissions Required", "Camera & Microphone are required.");
    }
  };

  // Check file size
  const checkFileSize = async (filePath) => {
    const stat = await RNFS.stat(filePath);
    const sizeMB = stat.size / (1024 * 1024);
    return sizeMB <= MAX_SIZE_MB;
  };

  // Start Recording
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
        setShowCamera(false); // hide camera after recording
      },

      onRecordingError: (error) => {
        console.error("Recording error:", error);
        Alert.alert("Error", "Failed to record video.");
        setIsRecording(false);
      },
    });

    // Auto-stop at 20 sec
    setTimeout(() => {
      if (isRecording) stopRecording();
    }, MAX_DURATION_MS);
  };

  // Stop recording
  const stopRecording = () => {
    try {
      cameraRef.current.stopRecording();
    } catch (_) {}
    setIsRecording(false);
  };

  // -------------------------------------------------
  // UI FLOW
  // -------------------------------------------------

  // 1️⃣ Show START button first
  if (!showCamera) {
    return (
     <>
      <Text style={[styles.label, theme === 'dark' && {
               color: 'white'
             }]}>{item?.fieldtitle}</Text>
             {item?.tooltip !== item?.fieldtitle && <Text style={[styles.label, theme === 'dark' && {
               color: 'white'
             }]}> - ( {item?.tooltip} ) </Text>}
             {item?.mandatory === '1' && <Text style={{ color: ERP_COLOR_CODE.ERP_ERROR }}>*</Text>}
            
      <View style={styles.startContainer}>
        <TouchableOpacity style={styles.startBtn} onPress={requestPermissions}>
          <Text style={styles.btnText}>Video Record</Text>
        </TouchableOpacity>
      </View>
     </>
    );
  }

  // 2️⃣ After pressing START → show camera
  if (!permissionsGranted || !device) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#fff" }}>Loading camera...</Text>
      </View>
    );
  }

  // 3️⃣ Show recording UI
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
            <Text style={styles.btnText}>STOP</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.recordBtn} onPress={startRecording}>
            <Text style={styles.btnText}>RECORD</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// -------------------------------------------------
// STYLES
// -------------------------------------------------
const styles = StyleSheet.create({
  startContainer: {
     backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,

  },
   label: {
      fontSize: 14,
      color: ERP_COLOR_CODE.ERP_333,
      marginBottom: 6,
      fontWeight: '600',
    },
  startBtn: {
    width:'100%',
    backgroundColor: "blue",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },

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

  controls: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },

  recordBtn: {
    backgroundColor: "red",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },

  stopBtn: {
    backgroundColor: "orange",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },

  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
