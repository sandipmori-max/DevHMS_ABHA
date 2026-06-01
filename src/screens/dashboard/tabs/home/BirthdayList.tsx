import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";

import MaterialIcons from "@react-native-vector-icons/material-icons";

import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setBirthdayUsers } from "../../../../store/slices/auth/authSlice";
import { ERP_COLOR_CODE } from "../../../../utils/constants";

const BirthdayList = ({ html, item }: any) => {
  const dispatch = useAppDispatch();

  const [showModal, setShowModal] =
    useState(false);

  const { birthdayUsers } =
    useAppSelector(
      (state) => state.auth
    );

  const theme = useAppSelector(
    (state) => state.theme.mode
  );

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
      .filter(
        (item) => item.length > 0
      );
  };

  const users = extractUsers(html);

  useEffect(() => {
    const currentUsersKey = [
      ...users,
    ]
      .sort()
      .join(",");

    const reduxUsersKey = [
      ...birthdayUsers,
    ]
      .sort()
      .join(",");

    if (
      currentUsersKey !==
      reduxUsersKey
    ) {
      dispatch(
        setBirthdayUsers(users)
      );
    }
  }, [users]);

  if (!users.length) return null;

  const visibleUsers =
    users.length > 5
      ? users.slice(0, 5)
      : users;

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              theme === "dark"
                ? "#1c1c1e"
                : "#ffffff",
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={
              styles.iconContainer
            }
          >
            <MaterialIcons
              name="cake"
              size={18}
              color="#fff"
            />
          </View>

          <View
            style={{ flex: 1 }}
          >
            <Text
              style={[
                styles.title,
                {
                  color:
                    theme ===
                    "dark"
                      ? "#fff"
                      : "#000",
                },
              ]}
            >
            Today's {item?.title}
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Celebrate your
              teammates
            </Text>
          </View>
        </View>

        <View
          style={styles.divider}
        />

        {/* Birthday Users */}
        {visibleUsers.map(
          (name, index) => (
            <View
              key={`${name}-${index}`}
              style={
                styles.userRow
              }
            >
              <View
                style={
                  styles.userIcon
                }
              >
                <MaterialIcons
                  name="cake"
                  size={14}
                  color="#ff9800"
                />
              </View>

              <Text
                style={[
                  styles.userName,
                  {
                    color:
                      theme ===
                      "dark"
                        ? "#fff"
                        : "#000",
                  },
                ]}
              >
                {name}
              </Text>
            </View>
          )
        )}

        {/* View More */}
        {users.length > 5 && (
          <TouchableOpacity
            style={
              styles.viewMoreBtn
            }
            onPress={() =>
              setShowModal(true)
            }
          >
            <Text
              style={
                styles.viewMoreText
              }
            >
              View All (
              {users.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setShowModal(false)
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={[
              styles.bottomSheet,
              {
                backgroundColor:
                  theme ===
                  "dark"
                    ? "#1c1c1e"
                    : "#fff",
              },
            ]}
          >
            <View
              style={
                styles.dragIndicator
              }
            />

            <View
              style={
                styles.modalHeader
              }
            >
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color:
                      theme ===
                      "dark"
                        ? "#fff"
                        : "#000",
                  },
                ]}
              >
                🎂 Birthday List
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setShowModal(
                    false
                  )
                }
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={users}
              numColumns={2}
              keyExtractor={(
                item,
                index
              ) =>
                `${item}-${index}`
              }
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={{
                paddingBottom: 30,
              }}
              renderItem={({
                item,
              }) => (
                <View
                  style={[
                    styles.gridItem,
                    {
                      backgroundColor:
                        theme ===
                        "dark"
                          ? "#2c2c2e"
                          : "#f7f7f7",
                    },
                  ]}
                >
                  <MaterialIcons
                    name="cake"
                    size={14}
                    color="#ff9800"
                  />

                  <Text
                    style={[
                      styles.gridText,
                      {
                        color:
                          theme ===
                          "dark"
                            ? "#fff"
                            : "#000",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BirthdayList;

const styles =
  StyleSheet.create({
    container: {
      marginVertical: 8,
      width:'100%',
      borderWidth: 0.8, 
      borderColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
      borderRadius: 6,
      padding: 16,
      marginLeft: 8
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
    },

    iconContainer: {
      width: 28,
      height: 28,
      borderRadius: 2,
      backgroundColor:
        "#ff9800",
      justifyContent:
        "center",
      alignItems: "center",
      marginRight: 12,
    },

    title: {
      fontSize: 16,
      fontWeight: "700",
    },

    subtitle: {
      fontSize: 13,
      color: "#888",
      marginTop: 2,
    },

    divider: {
      height: 1,
      backgroundColor:
        "#ececec",
      marginVertical: 8,
    },

    userRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
    },

    userIcon: {
      width: 24,
      height: 24,
      borderRadius: 4,
      backgroundColor:
        "#FFF3E0",
      justifyContent:
        "center",
      alignItems: "center",
      marginRight: 10,
    },

    userName: { 
      fontWeight: "500",
      flex: 1,
    },

    viewMoreBtn: {
      marginTop: 10,
      alignSelf: "center",
    },

    viewMoreText: {
      color: "#ff9800",
      fontSize: 14,
      fontWeight: "600",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor:
        "rgba(0,0,0,0.45)",
      justifyContent:
        "flex-end",
    },

    bottomSheet: {
      height: "70%",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 16,
    },

    dragIndicator: {
      width: 50,
      height: 5,
      borderRadius: 5,
      backgroundColor:
        "#ccc",
      alignSelf: "center",
      marginBottom: 15,
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
    },

    gridItem: {
      flex: 1,
      margin: 6,
      borderRadius: 12,
      padding: 16,
      minHeight: 90,
      justifyContent:
        "center",
      alignItems: "center",
    },

    gridText: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: "500",
      textAlign: "center",
    },
  });