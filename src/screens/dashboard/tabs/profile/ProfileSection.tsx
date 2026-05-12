import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import FastImage from "react-native-fast-image";
import { useAppSelector } from "../../../../store/hooks";
import { firstLetterUpperCase } from "../../../../utils/helpers";
import ImageBottomSheetModal from "../../../../components/bottomsheet/ImageBottomSheetModal";
import { ERP_COLOR_CODE } from "../../../../utils/constants";

const ProfileSection = ({ baseLink, user, onEditPress }: any) => {
  const theme = useAppSelector((state) => state?.theme.mode);
  const [showModal, setShowModal] = useState(false);
  const [img, setImg] = useState("");

  if (!user) return null;

  const avatar = `${baseLink}/FileUpload/1/UserMaster/${
    user?.id
  }/profileimage.jpeg?ts=${Date.now()}`;

  return (
    <>
      <View
        style={[
          styles.container,

          theme === "dark" && { backgroundColor: "#0f0f0f", borderColor : 'white', borderWidth: 0.8 },
        ]}
      >
        {/* TOP HEADER STRIP */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
            },
            theme === "dark" && { backgroundColor: "#1a1a1a" },
          ]}
        />

        {/* AVATAR FLOATING */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.avatarWrapper}
          onPress={() => {
            setImg(avatar);
            setShowModal(true);
          }}
        >
          <FastImage source={{ uri: avatar }} style={styles.avatar} />
        </TouchableOpacity>

        {/* EDIT BUTTON */}
        <TouchableOpacity
          onPress={onEditPress}
          style={[
            styles.editBtn,
            theme === "dark" && { backgroundColor: "#2a2a2a" },
          ]}
        >
          <MaterialIcons name="edit" size={Platform.OS === 'android' ? 16 : 18} color="#fff" />
        </TouchableOpacity>

        {/* INFO */}
        <View style={styles.info}>
          <Text style={[styles.name, theme === "dark" && { color: "#fff" }]}>
            {firstLetterUpperCase(user?.name || "User")}
          </Text>

          <Text style={styles.company}>{user?.companyName || "Company"}</Text>
        </View>
        <View style={styles.rowCards}>
          {/* EMAIL */}
          <View
            style={[
              styles.infoCard,
              theme === "dark" && {
                backgroundColor: "#1a1a1a",
                borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
              },
            ]}
          >
            <MaterialIcons name="email" size={18} color="#6366f1" />
            <Text style={[styles.cardValue, {
              color: theme === "dark" ? 'white' : 'black'
            }]} numberOfLines={1}>
              {user?.emailid || "-"}
            </Text>
          </View>

          {/* MOBILE */}
          <View
            style={[
              styles.infoCard,
              theme === "dark" && {
                backgroundColor: "#1a1a1a",
               borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
              },
            ]}
          >
            <MaterialIcons name="phone" size={18} color="#22c55e" />
            <Text style={[styles.cardValue, {
              color: theme === "dark" ? 'white' : 'black'
            }]}>{user?.mobileno || "-"}</Text>
          </View>

          {/* ROLE */}
          <View
            style={[
              styles.infoCard,
              theme === "dark" && {
                backgroundColor: "#1a1a1a",
               borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
              },
            ]}
          >
            <MaterialIcons name="badge" size={18} color="#f59e0b" />
            <Text style={[styles.cardValue, {
              color: theme === "dark" ? 'white' : 'black'
            }]}>{user?.rolename || "-"}</Text>
          </View>
        </View>
      </View>

      <ImageBottomSheetModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        imageUrl={img}
      />
    </>
  );
};

export default ProfileSection;

const styles = StyleSheet.create({

  rowCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 12,
  },

  infoCard: {
    width: "32%",
    backgroundColor: ERP_COLOR_CODE.ERP_f0f0f0,
    borderRadius: Platform.OS === 'android' ?  6 : 8,
    padding: Platform.OS === 'android' ?  8 : 10,
    borderWidth: 1,
    borderColor: "#eee",
    minHeight: 70,
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },

  cardLabel: {
    fontSize: 11,
    color: "#888",
    marginTop: 6,
  },

  cardValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
    marginTop: 10,
  },

  container: {
    marginHorizontal: Platform.OS === 'android' ? 14 : 16,
    marginVertical: Platform.OS === 'android' ?  12 : 14,
    borderTopRightRadius: Platform.OS === 'android' ?  10 : 12,
    borderTopLeftRadius: Platform.OS === 'android' ?  10 : 12,
    paddingBottom: Platform.OS === 'android' ? 12 : 16,
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
    borderWidth: 0.4,
    overflow: "hidden",
  },

  header: {
    height: 70,
    backgroundColor: "#4f46e5",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  avatarWrapper: {
    position: "absolute",
    top: 30,
    left: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: ERP_COLOR_CODE.ERP_f0f0f0,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 4,
    backgroundColor: ERP_COLOR_CODE.ERP_f0f0f0,
  },

  editBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    borderWidth: 1,
    borderColor: "#fff",
    width: Platform.OS === 'android' ? 30 : 36,
    height: Platform.OS === 'android' ? 30  : 36,
    borderRadius: Platform.OS === 'android' ? 6 : 8,
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    marginTop: 42,
    paddingHorizontal: 16,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  company: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  pill: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#eef2ff",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 2,
  },

  pillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4f46e5",
  },
  
});
