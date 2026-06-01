import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const AttendanceLeaveToggle = ({
    value = "attendance",
    onChange,
}: any) => {
    const [selected, setSelected] = useState(value);

    const handleSelect = (type) => {
        setSelected(type);
        onChange?.(type);
    };

    return (
        <View style={styles.container}>
            <View style={styles.segment}>
                <Pressable
                    style={[
                        styles.tab,
                        selected === "attendance" && {
                              backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                        },
                    ]}
                    onPress={() => handleSelect("attendance")}
                >
                    <MaterialIcons
                        name='calendar-today'
                        size={16}
                        color={selected === "attendance" ? "#FFF" : "#667085"}
                        style={{ marginRight: 6 }}
                    />
                    <Text
                        style={[
                            styles.tabText,
                            selected === "attendance" && {
                                color: "#FFF",
                                backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                            },
                        ]}
                    >
                        Attendance
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.tab,
                        selected === "leave" && {

                            backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                        },
                    ]}
                    onPress={() => handleSelect("leave")}
                >
                    <MaterialIcons
                        name='punch-clock'
                        size={16}
                        color={selected === "leave" ? "#FFF" : "#667085"}
                        style={{ marginRight: 6 }} />
                    <Text
                        style={[
                            styles.tabText,
                            selected === "leave" && styles.activeText,
                        ]}
                    >
                        Leave
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default AttendanceLeaveToggle;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        marginTop: 12,
    },

    segment: {
        flexDirection: "row",
        backgroundColor: "#F2F4F7",
        borderRadius: 8,
        padding: 4,
        borderWidth: 0.3,
    },

    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
    },

    activeTab: {
        backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    },

    tabText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#667085",
    },

    activeText: {
        color: "#FFF",
    },
});