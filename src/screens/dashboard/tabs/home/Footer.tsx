import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Dimensions, StyleSheet, Modal, Pressable, TouchableOpacity, Platform } from "react-native";
import AutoHeightWebView from "../../page/components/AutoHeightWebView";
import TranslatedText from "./TranslatedText";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setBirthdayUsers } from "../../../../store/slices/auth/authSlice";

const { width } = Dimensions.get("screen");

const MarqueeFooterV2 = ({ html }: any) => {
  console.log(" html -------- MarqueeFooter -------------- ", html);
  const translateX = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -250,
        duration: 10000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View
      style={{
        overflow: "hidden",
        backgroundColor: "#f0f8ff",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Animated.View
        style={{ flexDirection: "row", transform: [{ translateX }] }}
      >
        <Text>{html.replace(/<[^>]+>/g, "")}</Text>
      </Animated.View>
    </View>
  );
};

const MarqueeFooter = ({ html }: any) => {
  const dispatch = useAppDispatch();

  const {
    user, birthdayUsers
  } = useAppSelector((state) => state?.auth);

  const theme = useAppSelector(
    (state) => state?.theme.mode
  );

  const [visible, setVisible] = useState(false);

  const scaleAnim = useRef(
    new Animated.Value(0.7)
  ).current;

  const opacityAnim = useRef(
    new Animated.Value(0)
  ).current;

  // ✅ prevent duplicate modal
  const previousModalKeyRef = useRef("");

  // ✅ Extract Users
  const extractUsers = (html: string) => {
    if (!html) return [];

    let cleanText = html
      .replace(/<[^>]+>/g, "")
      .replace(/happy birthday/gi, "");

    return cleanText
      .split("•")
      .map((item) =>
        item
          .replace(/\./g, "")
          .replace(/\s+/g, " ")
          .trim()
      )
      .filter((item) => item.length > 0);
  };

  const users = extractUsers(html);

  // ✅ Store users in redux only when changed
  useEffect(() => {
    const currentUsersKey = [...users]
      .sort()
      .join(",");

    const reduxUsersKey = [...birthdayUsers]
      .sort()
      .join(",");

    if (currentUsersKey !== reduxUsersKey) {
      dispatch(setBirthdayUsers(users));
    }
  }, [users]);

  // ✅ Show Modal Logic
  const checkModal = () => {
    try {

      const isSame =
      users.length === birthdayUsers.length &&
      users.every((value, index) => value === birthdayUsers[index]);

      if(isSame){
        return;
      }
      const usersKey = [...birthdayUsers]
        .sort()
        .join(",");

      const currentUserId = user?.id || "";

      // unique modal key
      const modalKey = `${currentUserId}_${usersKey}`;

      console.log(
        "Current Modal Key:",
        modalKey
      );

      console.log(
        "Previous Modal Key:",
        previousModalKeyRef.current
      );

      // already shown
      if (
        previousModalKeyRef.current === modalKey
      ) {
        return;
      }

      // save current modal key
      previousModalKeyRef.current = modalKey;

      setVisible(true);

      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver:
            Platform.OS === "ios",
        }),

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver:
            Platform.OS === "ios",
        }),
      ]).start();
    } catch (e) {
      console.log("Modal error", e);
    }
  };

  // ✅ Trigger modal
  useEffect(() => {
    if (users.length > 0) {
      checkModal();
    }
  }, [user]);

  // ✅ Close Modal
  const closeModal = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),

      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  return (
    <>
      {/* Modal */}
      <Modal
        transparent
        visible={visible}
        animationType="none"
      >
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {}}
          />

          <Animated.View
            style={[
              styles.modalContainer,
              {
                backgroundColor:
                  theme === "dark"
                    ? "#1c1c1e"
                    : "#ffffff",

                opacity: opacityAnim,

                transform: [
                  {
                    scale: scaleAnim,
                  },
                ],
              },
            ]}
          >
            {/* ICON */}
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name="cake"
                size={28}
                color="#fff"
              />
            </View>

            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>
                Today's Birthdays
              </Text>

              <TouchableOpacity
                onPress={closeModal}
              >
                <MaterialIcons
                  name="close"
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* SUBTITLE */}
            <Text style={styles.subtitle}>
              Celebrate your teammates 🎉
            </Text>

            <View style={styles.divider} />

            {/* USERS LIST */}
            <View style={{ maxHeight: 250 }}>
              {users.map((name, index) => (
                <View
                  key={index}
                  style={[
                    styles.row,
                    {
                      gap: 8,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="cake"
                    size={18}
                    color="#ff9800"
                  />

                  <Text
                    style={{
                      fontSize: 14,
                      color:
                        theme === "dark"
                          ? "#fff"
                          : "#000",
                    }}
                  >
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Footer List */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingBottom: 10,
        }}
      >
        {users.map((name, index) => (
          <View
            key={index}
            style={styles.row}
          >
            <MaterialIcons
              name="cake"
              size={18}
              color="green"
            />

            <Text
              style={{
                fontSize: 14,
                color:
                  theme === "dark"
                    ? "white"
                    : "black",
              }}
            >
              - {name}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
};

const Footer = ({
  footer,
  index,
  accentColors,
  isHorizontal,
  isFromMenu,
  textColor,
  isFromListPage,
  isForChart,
  chartType
}: any) => {
  const isHTML = typeof footer === "string" && /<[^>]+>/.test(footer);
  const isMarquee = footer.includes("<marquee");

  if (isMarquee) {
    return <MarqueeFooter html={footer} />;
  } else if (isHTML) {
    return (
      <AutoHeightWebView
        isFromListPage={isFromListPage}
        textColor={textColor}
        isHorizontal={isHorizontal}
        isFromMenu={isFromMenu}
        isFromPage={false}
        html={footer}
        isForChart={isForChart}
        chartType={chartType}
        accentColors={accentColors}
      />
    );
  } else {
    return (
      <TranslatedText
        style={{
          color: accentColors[index % accentColors.length],
          fontSize: 14,
          fontWeight: "600",
        }}
        text={footer}
        numberOfLines={3}
      ></TranslatedText>
    );
  }
};

export default Footer;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "85%",
    borderRadius: 12,
    padding: 18,
  },

  iconWrapper: {
    position: "absolute",
    top: -28,
    alignSelf: "center",
    backgroundColor: "#ff9800",
    padding: 12,
    borderRadius: 50,
  },

  header: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ff9800",
    marginRight: 10,
  },

  name: {
    fontSize: 15,
  },

  button: {
    marginTop: 16,
    backgroundColor: "#ff9800",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});