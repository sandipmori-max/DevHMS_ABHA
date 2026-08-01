import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
} from "react-native";

import Header from "../../Components/Header";
import InfoCard from "./components/InfoCard";
import SectionTitle from "./components/SectionTitle";
import HiTypeChip from "./components/HiTypeChip";
import PermissionCard from "./components/PermissionCard";
import DateSelector from "./components/DateSelector";
import Dropdown from "./components/Dropdown";

import { ERP_COLOR_CODE } from "../../../utils/constants";
import { showToast } from "../../utils/toast";


//"code": "CAREMGT",//CAREMGT,BTG ,PUBHLTH ,HPAYMT ,DSRCH
const PURPOSES = [
    {
        label: "Care Management",
        value: {
            text: "Care Management",
            code: "CAREMGT",
            refUri: "",
        },
    },
    {
        label: "Break the Glass",
        value: {
            text: "Break the Glass",
            code: "BREAKTHEGLASS",
            refUri: "",
        },
    },
    {
        label: "Public Health",
        value: {
            text: "Public Health",
            code: "PUBLICHEALTH",
            refUri: "",
        },
    },
    {
        label: "Healthcare Payment",
        value: {
            text: "Healthcare Payment",
            code: "HEALTHCAREPAYMENT",
            refUri: "",
        },
    },
    {
        label: "Disease Specific Healthcare Research",
        value: {
            text: "Disease Specific Healthcare Research",
            code: "DISEASESPECIFICHEALTHCARERESEARCH",
            refUri: "",
        },
    },
];

const HIPS = [
    {
        label: "All Linked Hospitals",
        value: null,
    },
];

const HI_TYPES = [
    "Prescription",
    "DiagnosticReport",
    "OPConsultation", "DischargeSummary", "ImmunizationRecord",
    "HealthDocumentRecord", "WellnessRecord"
];

const ConsentFormScreen = ({ route }: any) => {
    const { abhaDetail, bridgeServices } = route.params || {};
    const [purpose, setPurpose] = useState(PURPOSES[0].value);

    const [selectedHip, setSelectedHip] = useState<any>(null);

    const [selectedHiTypes, setSelectedHiTypes] = useState<string[]>([
        "Prescription",
    ]);

    const [fromDate, setFromDate] = useState(new Date());

    const [toDate, setToDate] = useState(new Date());

    const [accessMode, setAccessMode] = useState("VIEW");

    const [frequency, setFrequency] = useState("One Time");

    const [eraseAt, setEraseAt] = useState(new Date() );

    const getValue = (fieldName: any) => {
        if (abhaDetail.length === 0) {
            return;
        }
        const fieldMap = Object.fromEntries(
            abhaDetail.map(item => [item.field, item.text])
        );
        return fieldMap[fieldName];
    };

    const toggleHiType = (item: string) => {
        if (selectedHiTypes.includes(item)) {
            setSelectedHiTypes(selectedHiTypes.filter(x => x !== item));
        } else {
            setSelectedHiTypes([...selectedHiTypes, item]);
        }
    };

    const onSubmit = () => {
        if (toDate < fromDate) {

            showToast(
                'error',
                "Invalid Date Range",
                "To Date should be greater than or equal to From Date."
            );
            return;
        }

        const payload = {
            consent: {
                purpose,

                patient: {
                    id: getValue("preferredabhaaddress"), // ABHA Address
                },

                hiu: {
                    id: bridgeServices?.bridge?.id
                },

                hip: null,

                careContexts: null,

                requester: {
                    name: bridgeServices?.bridge.name,

                    identifier: {
                        type: "REGNO",
                        value: "123456",
                        system: "https://hospital.com",
                    },
                },

                hiTypes: selectedHiTypes,

                permission: {
                    accessMode,

                    dateRange: {
                        from: fromDate.toISOString(),
                        to: toDate.toISOString(),
                    },

                    dataEraseAt: eraseAt.toISOString(),
                    "frequency": {
                        "unit": "HOUR",
                        "value": 0,
                        "repeats": 0
                    }
                    // frequency: {
                    //     unit: frequency === "One Time" ? "HOUR" : "DAY",
                    //     value: 0,
                    //     repeats: 0,
                    // },
                },
            },
        };

        console.log(
            "Consent Payload =>",
            JSON.stringify(payload, null, 2)
        );
    };

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                },
            ]}
        >
            <ScrollView
                stickyHeaderIndices={[0]}
                bounces={false}
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: "#F5F7FA" }}
                contentContainerStyle={{
                    paddingBottom: 140,
                }}
            >
                <Header
                    title="Consent Request"
                    isMenu={false}
                    isSearch={false}
                    isShare={false}
                />

                <InfoCard
                    title="Patient Information"
                    icon="person"
                    data={[
                        {
                            label: "Name",
                            value: `${getValue("firstname")} ${getValue("middlename")} ${getValue("lastname")}`,
                        },
                        {
                            label: "ABHA Address",
                            value: getValue("preferredabhaaddress"),
                        },
                        {
                            label: "Patient ID",
                            value: getValue("patientabhaid"),
                        },
                    ]}
                />

                <InfoCard
                    title="Requester"
                    icon="person"
                    data={[
                        {
                            label: "Name",
                            value: bridgeServices?.bridge.name,
                        },
                        {
                            label: "Id",
                            value: bridgeServices?.bridge.id,
                        },
                        {
                            label: "Entity",
                            value: bridgeServices?.bridge.entity,
                        },
                    ]}
                />


                <View style={{

                    margin: 14,
                    backgroundColor: 'white',
                    borderRadius: 8,
                    paddingVertical: 12
                }}>
                    <Dropdown
                        label="Purpose"
                        data={PURPOSES}
                        selected={purpose}
                        onChange={setPurpose}
                    />
                    <Dropdown
                        label="Request Data From"
                        data={HIPS}
                        selected={selectedHip}
                        onChange={setSelectedHip}
                    />

                </View>

                <SectionTitle title="Health Information Types" />

                <View style={styles.wrap}>
                    {HI_TYPES.map(item => (
                        <HiTypeChip
                            key={item}
                            title={item}
                            selected={selectedHiTypes.includes(item)}
                            onPress={() => toggleHiType(item)}
                        />
                    ))}
                </View>



                <SectionTitle title="Access Duration" />

                <DateSelector
                    label="From Date"
                    value={fromDate}
                    onChange={setFromDate}
                />

                <DateSelector
                    label="To Date"
                    value={toDate}
                    onChange={(date: Date) => {
                        if (date < fromDate) {
                            showToast(
                                'error',
                                "Invalid Date",
                                "To Date cannot be earlier than From Date."
                            );
                            return;
                        }

                        setToDate(date);

                        const eraseDate = new Date(date);
                        eraseDate.setFullYear(eraseDate.getFullYear() + 1);
                        setEraseAt(eraseDate);
                    }}
                />

                <PermissionCard
                    accessMode={accessMode}
                    onChangeAccessMode={setAccessMode}
                    frequency={frequency}
                    onChangeFrequency={setFrequency}
                    eraseAt={eraseAt}
                    onChangeEraseAt={setEraseAt}
                />
            </ScrollView>

            <View style={styles.bottom}>
                <TouchableOpacity
                    style={[styles.button, {
                        backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                    }]}
                    onPress={onSubmit}
                >
                    <Text style={styles.buttonText}>
                        Request Consent
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ConsentFormScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    wrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
    },

    bottom: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderColor: "#ECECEC",
        padding: 16,
    },

    button: {
        height: 52,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    },

    buttonText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
    },
});