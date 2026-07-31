import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
  Animated,
  PanResponder,
} from "react-native";
import Header from "../Components/Header";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import CustomBottomSheet from "./Profile/CustomBottomSheet";
import RNPrint from 'react-native-print';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { getPagePayload, useGetPageMutation } from "../redux/api/getPageApi";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/slices/loaderSlice";
import Clipboard from "@react-native-clipboard/clipboard";
import { showToast } from "../utils/toast";
import { useAppSelector } from "../../store/hooks";
import { ERP_COLOR_CODE } from "../../utils/constants";
import { useGenerateLinkTokenMutation } from "../redux/api/linkAbhaApi";
import { useNavigation } from "@react-navigation/native";
import { useCreateSessionMutation } from "../redux/api/sessionApi";
import { useLazyGetBridgeServicesQuery } from "../redux/api/bridgeServicesApi";

const DetailsScreen = ({ route }: any) => {
  const { item } = route.params || {};
  const navigation = useNavigation();

  const [open, setOpen] = useState(false);
  const [abhaDetail, setAbhaDetail] = useState<any>([]);
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.loader.loading);
  const baseURL = useSelector((state: any) => state.auth.user?.companyLink)
  const baseUrl = baseURL.substring(0, baseURL.lastIndexOf("/") + 1);
  const url = new URL(baseUrl).origin;
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [bridgeServices, setBridgeServices] = useState<any>()
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastTranslate = useRef({ x: 0, y: 0 });
 
  const [getBridgeServices] =
    useLazyGetBridgeServicesQuery();

  const [getPage] = useGetPageMutation();
  const { accounts, user } = useAppSelector((state) => state.auth);
  const fetchProfile = async () => {
    try {
      dispatch(showLoader())
      const payload = getPagePayload(
        user?.token,
        "PatientABHAProfile",
        item?.id
      );
      const response = await getPage(payload);
      const parsedData = JSON.parse(response?.data.d);
      const pagectl = parsedData.pagectl;
      console.log("respon+ + + + + + ++ + + se", pagectl)
      setAbhaDetail(pagectl);
    } catch (error) {
      console.log("error++++++++++++++++++++++", error)
      dispatch(hideLoader())
    } finally {
      dispatch(hideLoader())
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [route]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getBridgeServices().unwrap();
        console.log(response);
        setBridgeServices(response)
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gesture) => {
        if (gesture.numberActiveTouches === 1) {
          translateX.setValue(lastTranslate.current.x + gesture.dx);
          translateY.setValue(lastTranslate.current.y + gesture.dy);
        } else if (gesture.numberActiveTouches === 2) {
          const touches = evt.nativeEvent.touches;
          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (!lastScale.currentDistance) lastScale.currentDistance = distance;
          const scaleFactor = distance / lastScale.currentDistance;
          scale.setValue(
            Math.max(1, Math.min(3, lastScale.current * scaleFactor)),
          );
        }
      },
      onPanResponderRelease: (_, gesture) => {
        lastTranslate.current.x += gesture.dx;
        lastTranslate.current.y += gesture.dy;
        lastScale.current = scale.__getValue();
        lastScale.currentDistance = undefined;
      },
    }),
  ).current;

  const getValue = (fieldName: any) => {
    if (abhaDetail.length === 0) {
      return;
    }
    const fieldMap = Object.fromEntries(
      abhaDetail.map(item => [item.field, item.text])
    );
    return fieldMap[fieldName];
  };

  const authMethods = getValue("authmethods")
    ?.split(",")
    .map((item: string) => item.trim())
    .filter(Boolean) || [];


  const DetailItem = ({
    icon,
    label,
    value,
    color
  }: {
    icon: string;
    label: string;
    value: any;
    color?: any
  }) => (
    <View style={styles.detailRow}>

      <View style={styles.leftContent}>

        <MaterialIcons
          name={icon}
          size={22}
          color="#616161"
        />

        <Text style={styles.detailLabel}>
          {label}
        </Text>

      </View>

      <Text style={[styles.detailValue, color && {
        color: color
      }]}
        numberOfLines={3}
      >
        {value || "-"}
      </Text>

    </View>
  );

  const downloadPDF = async (url) => {
    const filePath = `${RNFS.DocumentDirectoryPath}/sample.pdf`;

    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
    }).promise;

    if (result.statusCode === 200) {
      return filePath;
    }

    throw new Error('Download failed');
  };

  const sharePDF = async (filePath) => {
    try {
      await Share.open({
        title: 'Share ABHA Card',
        url: `file://${filePath}`,
        type: 'application/pdf',
        failOnCancel: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const shareImage = async (imageUrl) => {
    try {
      await Share.open({
        title: 'Share ABHA Card',
        message: 'ABHA Card',
        url: imageUrl,
        type: 'image/jpeg', // image/png ho to change karo
        failOnCancel: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const printPdfFromUrl = async () => {
    try {
      let uri = `${Platform.OS === 'ios' ? url : url.replace("https://", "http://")}/fileupload/1/PatientABHAProfile/${item?.id}/abhacard.jpeg?t=${Date.now()}`;

      const pdfPath = await downloadPDF(
        uri
      );

      await RNPrint.print({
        filePath: pdfPath,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    return date.split(" ")[0];
  };

  const [showAadhaar, setShowAadhaar] = useState(false);
  const maskAadhaar = (number: string, show: boolean) => {
    if (!number) return "-";

    const clean = number.replace(/\s/g, "");

    if (clean.length < 4) return number;

    if (show) {
      return clean.replace(/(.{4})/g, "$1 ").trim();
    }

    return `XXXX XXXX ${clean.slice(-4)}`;
  };


  const copyText = (text: string) => {
    Clipboard.setString(text);
    showToast('success', 'Copied!!')
  };

  const zoomIn = () => {
    scale.setValue(Math.min(3, scale.__getValue() + 0.2));
    lastScale.current = scale.__getValue();
  };

  const zoomOut = () => {
    scale.setValue(Math.max(1, scale.__getValue() - 0.2));
    lastScale.current = scale.__getValue();
  };
 
  return (
    <SafeAreaView style={[styles.container, {
      backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR
    }]}>


      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{
          backgroundColor: '#F5F7FA'
        }}
      >
        <Header title="ABHA Details" isMenu={false} isSearch={false} isShare={true} handleShare={() => {
          setOpen(true)

        }} />
        {
          loading ? <></> : <>

            {/* Profile */}
            <View style={styles.profileCard}>
              <View style={styles.profileTop}>
                <View>

                  {getValue("profilephoto") ? (
                    <TouchableOpacity onPress={() => {
                      setModalVisible(true);
                      setImageUri(`${Platform.OS === 'ios' ? url : url.replace("https://", "http://")}/fileupload/1/PatientABHAProfile/${item?.id}/profilephoto.jpeg?t=${Date.now()}`)
                    }}>
                      <Image
                        source={{
                          uri: `${Platform.OS === 'ios' ? url : url.replace("https://", "http://")}/fileupload/1/PatientABHAProfile/${item?.id}/profilephoto.jpeg?t=${Date.now()}`,
                        }}
                        style={styles.profileImage}
                      />
                    </TouchableOpacity>

                  ) : (
                    <View style={styles.profilePlaceholder}>
                      <MaterialIcons
                        name="person"
                        size={42}
                        color="#FFFFFF"
                      />
                    </View>
                  )}
                  <View style={{ height: 8 }} />
                  <TouchableOpacity onPress={() => {
                    setModalVisible(true);
                    setImageUri(`${Platform.OS === 'ios' ? url : url.replace("https://", "http://")}/fileupload/1/PatientABHAProfile/${item?.id}/qrcode.jpeg?t=${Date.now()}`)
                  }}>
                    <Image
                      source={{
                        uri: `${Platform.OS === 'ios' ? url : url.replace("https://", "http://")}/fileupload/1/PatientABHAProfile/${item?.id}/qrcode.jpeg?t=${Date.now()}`,
                      }}
                      style={styles.profileImage}
                    />
                  </TouchableOpacity>

                </View>


                <View style={{ flex: 1, marginLeft: 16 }}>

                  <Text
                    numberOfLines={1}
                    style={[styles.profileName,]}>
                    {getValue("firstname")} {getValue("middlename")} {getValue("lastname")}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#7eadf5',
                      fontSize: 14
                    }}
                  >
                    {getValue("localizedname")}
                  </Text>

                  <Text style={styles.profileLabel}>
                    ABHA ID
                  </Text>

                  <View style={styles.numberRow}>

                    <Text style={styles.abhaNumber}>
                      {getValue("abhanumber")}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        copyText(getValue("abhanumber"))
                      }}
                    >
                      <MaterialIcons
                        name="content-copy"
                        size={20}
                        color="#1565C0"
                      />
                    </TouchableOpacity>

                  </View>

                  <Text style={styles.profileLabel}>
                    ABHA Address
                  </Text>

                  <View style={styles.numberRow}>

                    <Text style={styles.abhaNumber}>
                      {getValue("preferredabhaaddress")}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        copyText(getValue("preferredabhaaddress"))
                      }}
                    >
                      <MaterialIcons
                        name="content-copy"
                        size={20}
                        color="#1565C0"
                      />
                    </TouchableOpacity>

                  </View>

                  <Text style={styles.profileLabel}>
                    Aadhaar Number
                  </Text>

                  <View style={styles.numberRow}>

                    <Text style={styles.abhaNumber}>
                      {maskAadhaar(getValue("aadharnumber"), showAadhaar)}
                    </Text>

                    <TouchableOpacity onPress={() => setShowAadhaar(prev => !prev)}>
                      <MaterialIcons
                        name={showAadhaar ? "visibility-off" : "visibility"}
                        size={20}
                        color="#1565C0"
                      />
                    </TouchableOpacity>

                  </View>
                </View>
              </View>
              <View style={styles.statusContainer}>

                {/* KYC */}
                <View
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor: "#E8F5E9",
                    },
                  ]}>

                  <MaterialIcons
                    name="verified"
                    color="#2E7D32"
                    size={14}
                  />

                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: "#2E7D32",
                      },
                    ]}>
                    {getValue("verificationstatus") === "VERIFIED"
                      ? "KYC Verified"
                      : "KYC Pending"}
                  </Text>

                </View>

                {/* Mobile */}

                {<View
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor: "#E3F2FD",
                    },
                  ]}>

                  <MaterialIcons
                    name="phone-android"
                    color="#1565C0"
                    size={14}
                  />

                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: "#1565C0",
                      },
                    ]}>
                    {
                      getValue("communicationmobile") ? 'Verified' : 'Not Verified'
                    }

                  </Text>

                </View>}


                {/* Email */}

                <View
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor: "#FFF3E0",
                    },
                  ]}>

                  <MaterialIcons
                    name="email"
                    color="#EF6C00"
                    size={14}
                  />

                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: "#EF6C00",
                      },
                    ]}>
                    {getValue("communicationemail")
                      ? "Verified"
                      : "Not Verified"}
                  </Text>

                </View>

              </View>
            </View>

            {/* Personal Information */}
            <View style={styles.sectionCard}>

              <View style={styles.sectionHeader}>

                <View style={styles.iconCircle}>

                  <MaterialIcons
                    name="person"
                    size={18}
                    color="#1565C0"
                  />

                </View>

                <Text style={styles.sectionTitle}>
                  Personal Information
                </Text>

              </View>

              <DetailItem
                icon="calendar-month"
                label="Date of Birth"
                value={formatDate(getValue("dob"))}
              />

              <DetailItem
                icon="wc"
                label="Gender"
                value={
                  getValue("gender") === "M"
                    ? "Male"
                    : getValue("gender") === "F"
                      ? "Female"
                      : getValue("gender")
                }
              />

              <DetailItem
                icon="bloodtype"
                label="Blood Group"
                value={getValue("bloodgroup")}
              />

              <DetailItem
                icon="badge"
                label="ABHA Address"
                value={getValue("preferredabhaaddress")}
              />

            </View>

            {/* Contact information */}
            <View style={styles.sectionCard}>

              <View style={styles.sectionHeader}>

                <View style={styles.iconCircle}>
                  <MaterialIcons
                    name="contact-phone"
                    size={18}
                    color="#1565C0"
                  />
                </View>

                <Text style={styles.sectionTitle}>
                  Contact Information
                </Text>

              </View>

              <DetailItem
                icon="phone"
                label="Mobile Number"
                value={getValue("mobileno")}
              />



              {getValue("communicationmobile") ? (
                <DetailItem
                  icon="call"
                  label="Communication mobile"
                  value={getValue("communicationmobile")}
                />
              ) : null}
              {getValue("communicationemail") ? (
                <DetailItem
                  icon="email"
                  label="Email Address"
                  value={getValue("communicationemail")}
                />
              ) : null}

            </View>

            {/* Address */}
            <View style={styles.sectionCard}>

              <View style={styles.sectionHeader}>

                <View style={styles.iconCircle}>
                  <MaterialIcons
                    name="location-on"
                    size={18}
                    color="#1565C0"
                  />
                </View>

                <Text style={styles.sectionTitle}>
                  Address
                </Text>

              </View>

              <DetailItem
                icon="home"
                label="Address"
                value={getValue("address")}
              />

              <DetailItem
                icon="location-city"
                label="District"
                value={getValue("districtname")}
              />

              <DetailItem
                icon="map"
                label="State"
                value={getValue("statename")}
              />

            </View>
            {/* Verification */}
            <View style={styles.sectionCard}>

              <View style={styles.sectionHeader}>

                <View style={styles.iconCircle}>
                  <MaterialIcons
                    name="verified"
                    color="#1565C0"
                    size={18}
                  />
                </View>

                <Text style={styles.sectionTitle}>
                  Verification
                </Text>

              </View>

              <DetailItem
                icon="verified-user"
                label="KYC Status"
                value={getValue("verificationstatus") ? getValue("verificationstatus") : 'Not verifed'}
                color={getValue("verificationstatus") ? 'green' : 'red'}
              />

              <DetailItem
                icon="badge"
                label="Profile Status"
                value={getValue("profilestatus")}
              />

              <DetailItem
                icon="calendar-month"
                label="Created On"
                value={formatDate(getValue("cdt"))}
              />

            </View>

            {/* Authentication */}
            <View style={styles.sectionCard}>

              <View style={styles.sectionHeader}>

                <View style={styles.iconCircle}>
                  <MaterialIcons
                    name="security"
                    size={18}
                    color="#1565C0"
                  />
                </View>

                <Text style={styles.sectionTitle}>
                  Authentication Methods
                </Text>

              </View>

              <View style={styles.authContainer}>

                {authMethods.length > 0 ? (

                  authMethods.map((item: string, index: number) => (

                    <View
                      key={index}
                      style={styles.authChip}>

                      <MaterialIcons
                        name="verified-user"
                        color="#1565C0"
                      />

                      <Text style={styles.authText}>
                        {item}
                      </Text>

                    </View>

                  ))

                ) : (

                  <Text style={{ color: "#999" }}>
                    No Authentication Methods
                  </Text>

                )}

              </View>

            </View>

            <View style={styles.sectionCard}>

              <View style={styles.dateContainer}>

                <View style={styles.dateItem}>

                  <View style={styles.dateHeader}>
                    <View style={styles.iconCircleSmall}>
                      <MaterialIcons
                        name="calendar-month"
                        size={18}
                        color="#1565C0"
                      />
                    </View>

                    <Text style={styles.dateTitle}>
                      Creation Date
                    </Text>
                  </View>

                  <Text style={styles.dateValue}>
                    {formatDate(getValue("cdt"))}
                  </Text>

                </View>

                <View style={styles.dateDivider} />

                <View style={styles.dateItem}>

                  <View style={styles.dateHeader}>
                    <View style={styles.iconCircleSmall}>
                      <MaterialIcons
                        name="verified-user"
                        size={20}
                        color="#1565C0"
                      />
                    </View>

                    <Text style={styles.dateTitle}>
                      Last Updated
                    </Text>
                  </View>

                  <Text style={styles.dateValue}>
                    {formatDate(getValue("udt"))}
                  </Text>

                </View>

              </View>

            </View>

            <View style={styles.infoCard}>

              <MaterialIcons
                name="info-outline"
                size={28}
                color="#1565C0"
              />

              <Text style={styles.infoText}>
                Your ABHA number uniquely identifies you in the Ayushman Bharat Digital Mission (ABDM) ecosystem.
              </Text>

            </View>
            <View style={{ height: 30 }} />
          </>
        }
        {
          open && <CustomBottomSheet
            visible={open}
            title="Share & Print ABHA Card"
            onClose={() => setOpen(false)}
          >
            <View style={styles.qrCard}>
              <TouchableOpacity onPress={() => {
                setOpen(false)
                setModalVisible(true);
                setImageUri(`${Platform.OS === 'ios' ? url : url.replace("https://", "http://")}/fileupload/1/PatientABHAProfile/${item?.id}/abhacard.jpeg?t=${Date.now()}`)
              }}>
                <Image
                  source={{
                    uri: `${Platform.OS === 'ios' ? url : url.replace("https://", "http://")}/fileupload/1/PatientABHAProfile/${item?.id}/abhacard.jpeg?t=${Date.now()}`,
                  }}
                  style={styles.qrImage}
                />
              </TouchableOpacity>


              <Text style={styles.qrInfo}>
                The client's ABHA has been created successfully. You can now view the ABHA details and download the ABHA card.
              </Text>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.shareBtn}
                activeOpacity={0.8}
                onPress={async () => {
                  let uri = `${Platform.OS === 'ios' ? url : url.replace("https://", "http://")}/fileupload/1/PatientABHAProfile/${item?.id}/abhacard.jpeg?t=${Date.now()}`;
                  await shareImage(uri)
                }}
              >
                <MaterialIcons
                  name='share'
                  size={20}
                  color="#FFF"
                />

                <Text style={styles.shareText}>
                  Share
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadBtn}
                activeOpacity={0.8}
                onPress={printPdfFromUrl}
              >
                <MaterialIcons
                  name='print'
                  size={20}
                  color={'#FF6B35'}
                />

                <Text style={styles.downloadText}>
                  Print
                </Text>
              </TouchableOpacity>
            </View>
          </CustomBottomSheet>
        }
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("BridgeServices", {
            bridgeServices: bridgeServices,
            abhaDetail: abhaDetail
          })
          // handleLinkAbha()
        }}
        style={{
          height: 46,
          width: '92%',
          backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          marginLeft: 14
        }}>
        <Text style={{
          color: '#fff',
          fontSize: 16,
          fontWeight: '600'
        }}>Find Services</Text>
      </TouchableOpacity>
      {modalVisible && (
        <Modal
          supportedOrientations={["portrait", "landscape"]}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            scale.setValue(1);
            translateX.setValue(0);
            translateY.setValue(0);
            lastTranslate.current = { x: 0, y: 0 };
            lastScale.current = 1;
            setModalVisible(false);
          }}
        >
          <View
            style={[
              styles.fullscreenModalOverlay,

            ]}
          >
            <View
              style={[
                styles.fullscreenModalContent,
                {
                  width: "100%",
                },
              ]}
            >


              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  scale.setValue(1);
                  translateX.setValue(0);
                  translateY.setValue(0);
                  lastTranslate.current = { x: 0, y: 0 };
                  lastScale.current = 1;
                  setModalVisible(false);
                }}
              >
                <MaterialIcons
                  name="close"
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>



              <Animated.View
                style={{
                  width: "100%",
                  height: "100%",
                  transform: [{ scale }, { translateX }, { translateY }],
                }}
                {...panResponder.panHandlers}
              >
                <Image
                  source={{
                    uri: imageUri,
                  }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"

                />
              </Animated.View>

              <View style={styles.zoomControls}>
                <TouchableOpacity style={styles.zoomBtn} onPress={zoomIn}>
                  <MaterialIcons name="zoom-in" size={28} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.zoomBtn} onPress={zoomOut}>
                  <MaterialIcons name="zoom-out" size={28} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F7FA",

  },
  zoomBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    justifyContent: "center",
    alignItems: "center",
  },
  zoomControls: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    gap: 16,

    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  closeBtn: {
    position: "absolute",
    top: 80,
    right: 20,
    zIndex: 20,

    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  closeBtnShare: {
    position: "absolute",
    top: 80,
    right: 80,
    zIndex: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  fullscreenModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenModalContent: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 0.8
  },

  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 0.4
  },

  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  abhaNo: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#2563EB",
  },

  abhaAddress: {
    marginTop: 5,
    color: "#6B7280",
    fontSize: 14,
  },

  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
  },

  statusText: {
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    padding: 18,
  },

  cardTitle: {
    padding: 8,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center'
  },

  cardText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1565C0",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },

  label: {
    color: "#6B7280",
    fontSize: 15,
    flex: 1,
    width: '40%',
  },

  value: {
    flex: 1.3,
    color: "#111827",
    fontWeight: "600",
    fontSize: 15,
  },

  methodChip: {
    backgroundColor: "#E8F1FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  methodText: {
    color: "#2563EB",
    fontWeight: "600",
  },

  empty: {
    color: "#999",
    textAlign: "center",
    paddingVertical: 10,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    padding: 20,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  userInfo: {
    flex: 1,
    marginLeft: 16,
  },

  address: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },

  numberCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 18,
    alignItems: "center",
  },

  numberLabel: {
    fontSize: 12,
    color: "#64748B",
    letterSpacing: 1.5,
    marginBottom: 8,
    fontWeight: "600",
  },

  number: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 1,
  },

  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerText: {
    color: "#64748B",
    fontSize: 14,
  },

  footerCheck: {
    color: "#16A34A",
    fontWeight: "700",
    fontSize: 14,
  },
  qrCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop: 10,
  },

  qrImage: {
    width: Dimensions.get('screen').width - 20,
    height: 300,
  },

  qrInfo: {
    marginTop: 18,
    textAlign: "center",
    color: "#64748B",
  },

  actionContainer: {
    flexDirection: "row",
    marginTop: 28,
    justifyContent: "space-between",
  },

  shareBtn: {
    flex: 1,
    height: 42,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  downloadBtn: {
    flex: 1,
    height: 42,
    marginLeft: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF6B35",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  actionIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#FFFFFF",
  },

  shareText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8
  },

  downloadText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8
  },
  methodsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10, // RN 0.71+ support
  },

  methodChip: {
    width: "48%",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: 'blue'
  },

  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff'
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 10,
    marginTop: 16,
    borderRadius: 8,
    padding: 14,
  },

  profileTop: {
    flexDirection: "row",
  },

  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },

  profilePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1565C0",
    justifyContent: "center",
    alignItems: "center",
  },

  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },

  profileLabel: {
    marginTop: 10,
    color: "#777",
    fontSize: 13,
  },

  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  abhaNumber: {
    flex: 1,
    color: "#1565C0",
    fontWeight: "700",
  },

  maskNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginTop: 4,
  },

  editButton: {
    position: "absolute",
    right: 18,
    top: 18,
    zIndex: 10,
  },

  statusContainer: {
    marginTop: 18,
    flexDirection: "row",
    gap: 10,
  },

  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },

  statusText: {
    marginLeft: 6,
    fontSize: 10
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 10,
    marginTop: 6,
    borderRadius: 8,
    padding: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#1565C0",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  detailLabel: {
    marginLeft: 12,
    fontSize: 15,
    color: "#555",
  },

  detailValue: {
    flex: 1,
    color: "#212121",
    fontWeight: "600",
    marginLeft: 12,
  },
  detailLabel: {
    marginLeft: 12,
    fontSize: 15,
    color: "#616161",
    width: '54%',
  },
  authContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  authChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },

  authText: {
    marginLeft: 8,
    color: "#1565C0",
    fontSize: 14,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateItem: {
    width: '48%'
  },

  dateDivider: {
    width: 1,
    height: 60,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 16,
  },

  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  iconCircleSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  dateTitle: {
    color: "#1565C0",
  },

  dateValue: {
    marginLeft: 46,
    color: "#212121",
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#d3d9e3",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 30,
    borderRadius: 8,
    padding: 16,
  },

  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    lineHeight: 22,
    color: "#1565C0",
  },
});