import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";

import MaterialIcons from "@react-native-vector-icons/material-icons";


type Props = {
    hospitalName: string;
    requester: string;
    purpose: string;
    requestDate: string;
    expiryDate: string;

    status:
    | "Pending"
    | "Granted"
    | "Denied"
    | "Expired"
    | "Revoked";

    isRequest?: boolean;

    onApprove?: () => void;
    onReject?: () => void;
    onView?: () => void;
};


export default function ConsentCard({
    hospitalName,
    requester,
    purpose,
    requestDate,
    expiryDate,
    status,
    isRequest = true,
    onApprove,
    onReject,
    onView,
}: Props) {


    return (

        <View style={styles.card}>


            {/* HEADER */}

            <View style={styles.header}>


                <View style={styles.profileSection}>


                    <Image
                        source={{
                            uri:
                                "https://dummyimage.com/100x100/1565C0/ffffff.png&text=H"
                        }}
                        style={styles.logo}
                    />


                    <View style={{ flex: 1 }}>

                        <View style={styles.titleRow}>

                            <Text style={styles.hospital}>
                                {hospitalName}
                            </Text>


                            <MaterialIcons
                                name="verified"
                                size={18}
                                color="#1565C0"
                            />

                        </View>


                        <Text style={styles.provider}>
                            Healthcare Provider
                        </Text>


                    </View>


                </View>



                <View
                    style={[
                        styles.status,
                        getStatusBg(status)
                    ]}
                >

                    <Text
                        style={[
                            styles.statusText,
                            getStatusColor(status)
                        ]}
                    >
                        {status}
                    </Text>

                </View>


            </View>




            {/* PURPOSE */}

            <View style={styles.purposeBox}>


                <MaterialIcons
                    name="description"
                    size={20}
                    color="#1565C0"
                />


                <View style={{ flex: 1 }}>

                    <Text style={styles.smallLabel}>
                        Purpose
                    </Text>


                    <Text style={styles.purpose}>
                        {purpose}
                    </Text>

                </View>


            </View>




            {/* DETAILS */}


            <InfoRow
                icon="person"
                label="Requested By"
                value={requester}
            />


            <InfoRow
                icon="calendar-month"
                label="Requested On"
                value={requestDate}
            />


            <InfoRow
                icon="event"
                label="Valid Till"
                value={expiryDate}
            />





            {/* ACTIONS */}


            {/* {
                isRequest ?

                    <View style={styles.actionRow}>


                        <TouchableOpacity
                            style={styles.reject}
                            onPress={onReject}
                        >

                            <MaterialIcons
                                name="close"
                                size={20}
                                color="#D32F2F"
                            />

                            <Text style={styles.rejectText}>
                                Deny
                            </Text>

                        </TouchableOpacity>




                        <TouchableOpacity
                            style={styles.approve}
                            onPress={onApprove}
                        >


                            <MaterialIcons
                                name="check"
                                size={20}
                                color="#FFF"
                            />


                            <Text style={styles.approveText}>
                                Approve
                            </Text>


                        </TouchableOpacity>


                    </View>


                    :


                    <TouchableOpacity
                        style={styles.view}
                        onPress={onView}
                    >

                        <MaterialIcons
                            name="visibility"
                            size={20}
                            color="#1565C0"
                        />


                        <Text style={styles.viewText}>
                            View Details
                        </Text>


                    </TouchableOpacity>


            } */}



        </View>


    );

}





const InfoRow = ({
    icon,
    label,
    value
}: {
    icon: string;
    label: string;
    value: string;
}) => (

    <View style={styles.infoRow}>


        <View style={styles.iconBox}>

            <MaterialIcons
                name={icon}
                size={18}
                color="#1565C0"
            />

        </View>


        <View>

            <Text style={styles.smallLabel}>
                {label}
            </Text>

            <Text style={styles.infoValue}>
                {value}
            </Text>


        </View>


    </View>

);





const getStatusBg = (status: string) => {

    switch (status) {

        case "Pending":
            return {
                backgroundColor: "#FFF3E0"
            };

        case "Granted":
            return {
                backgroundColor: "#E8F5E9"
            };


        case "Denied":
        case "Revoked":
            return {
                backgroundColor: "#FFEBEE"
            };


        case "Expired":
            return {
                backgroundColor: "#ECEFF1"
            };


        default:
            return {};

    }

}




const getStatusColor = (status: string) => {

    switch (status) {

        case "Pending":
            return {
                color: "#EF6C00"
            };

        case "Granted":
            return {
                color: "#2E7D32"
            };


        case "Denied":
        case "Revoked":
            return {
                color: "#C62828"
            };


        case "Expired":
            return {
                color: "#546E7A"
            };


        default:
            return {};

    }

}






const styles = StyleSheet.create({


    card: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 18,

        borderWidth: 1,
        borderColor: "#E5E7EB",

     

    },



    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },



    profileSection: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center"
    },


    logo: {
        width: 56,
        height: 56,
        borderRadius: 8,
        marginRight: 12
    },


    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },


    hospital: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827"
    },


    provider: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 4
    },



    status: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 2
    },


    statusText: {
        fontSize: 12,
        fontWeight: "700"
    },




    purposeBox: {
        marginTop: 18,
        backgroundColor: "#F1F7FF",
        borderRadius: 8,
        padding: 14,

        flexDirection: "row",
        gap: 12
    },


    smallLabel: {
        fontSize: 12,
        color: "#6B7280"
    },


    purpose: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        marginTop: 3
    },




    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16
    },


    iconBox: {
        height: 34,
        width: 34,
        borderRadius: 6,
        backgroundColor: "#E3F2FD",

        alignItems: "center",
        justifyContent: "center",

        marginRight: 12
    },


    infoValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1F2937",
        marginTop: 2
    },




    actionRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 22
    },



    reject: {
        flex: 1,
        height: 48,
        borderRadius: 8,

        borderWidth: 1,
        borderColor: "#EF5350",

        alignItems: "center",
        justifyContent: "center",

        flexDirection: "row",
        gap: 6
    },


    approve: {
        flex: 1,
        height: 48,
        borderRadius: 8,

        backgroundColor: "#1565C0",

        alignItems: "center",
        justifyContent: "center",

        flexDirection: "row",
        gap: 6
    },



    rejectText: {
        color: "#D32F2F",
        fontWeight: "700"
    },


    approveText: {
        color: "#FFF",
        fontWeight: "700"
    },



    view: {
        marginTop: 22,
        height: 48,

        borderRadius: 14,

        borderWidth: 1,
        borderColor: "#1565C0",

        alignItems: "center",
        justifyContent: "center",

        flexDirection: "row",
        gap: 8
    },


    viewText: {
        color: "#1565C0",
        fontWeight: "700"
    }


});