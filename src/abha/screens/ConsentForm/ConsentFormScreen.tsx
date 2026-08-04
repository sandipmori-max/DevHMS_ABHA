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
import { useConsentRequestMutation } from "../../redux/api/consentRequestApi";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { useCreateSessionMutation } from "../../redux/api/sessionApi";


//"code": "CAREMGT",//CAREMGT,BTG ,PUBHLTH ,HPAYMT ,DSRCH
const PURPOSES = [
    {
        label: "Care Management",
        value: {
            text: "Care Management",
            code: "CAREMGT",
            refUri: "deverp.com",
        },
    },
    {
        label: "Break the Glass",
        value: {
            text: "Break the Glass",
            code: "BTG",
            refUri: "deverp.com",
        },
    },
    {
        label: "Public Health",
        value: {
            text: "Public Health",
            code: "PUBHLTH",
            refUri: "deverp.com",
        },
    },
    {
        label: "Healthcare Payment",
        value: {
            text: "Healthcare Payment",
            code: "HEALTHCAREPAYMENT",
            refUri: "deverp.com",
        },
    },
    {
        label: "Disease Specific Healthcare Research",
        value: {
            text: "Disease Specific Healthcare Research",
            code: "DISEASESPECIFICHEALTHCARERESEARCH",
            refUri: "deverp.com",
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
    {
        label: "Prescription",
        id: "Prescription"
    },
    {
        label: "Diagnostic Report",
        id: "DiagnosticReport"
    },
    {
        label: "OP Consultation",
        id: "OPConsultation"
    },
    {
        label: "Discharge Summary",
        id: "DischargeSummary"
    },
    {
        label: "Immunization Record",
        id: "ImmunizationRecord"
    },
    {
        label: "Health Document Record",
        id: "HealthDocumentRecord"
    },
    {
        label: "Wellness Record",
        id: "WellnessRecord"
    },
];

const ConsentFormScreen = ({ route }: any) => {
    const { abhaDetail, bridgeServices } = route.params || {};
    console.log("bridgeServices+ + + + + ++ + + + + + + + + + + + + + +", bridgeServices);
    const [purpose, setPurpose] = useState(PURPOSES[0].value);
    const dispatch = useDispatch();
    const [selectedHip, setSelectedHip] = useState<any>(null);
    const [service, setSelectedService] = useState<any>(null);
    const options = bridgeServices?.services.map(item => ({
        value: item.id,
        label: item.name,
    }));
    const [
        createSession
    ] = useCreateSessionMutation();
    const [consentRequest, { isLoading }] =
        useConsentRequestMutation();

    const [selectedHiTypes, setSelectedHiTypes] = useState<string[]>([
        "Prescription",
    ]);

    const [fromDate, setFromDate] = useState(new Date());

    const [toDate, setToDate] = useState(new Date());

    const [accessMode, setAccessMode] = useState("VIEW");

    const [frequency, setFrequency] = useState("One Time");

    const initialEraseAt = new Date();
    initialEraseAt.setDate(initialEraseAt.getDate() + 2);

    const [eraseAt, setEraseAt] = useState(initialEraseAt);
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

    const onSubmit = async () => {
        if (toDate < fromDate) {
            showToast(
                'error',
                "Invalid Date Range",
                "To Date should be greater than or equal to From Date."
            );
            return;
        }

        if (!service) {
            showToast(
                'error',
                "Invalid service",
                "Please select service first"
            );
            return
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

                },
            },
        };

        console.log(
            "Consent Payload =>",
            JSON.stringify(payload, null, 2)
        );

        try {
            dispatch(showLoader());
            await createSession().unwrap();
            const response = await consentRequest(payload).unwrap();

            console.log(
                "Consent Response =>",
                JSON.stringify(response, null, 2)
            );

            showToast(
                "success",
                "Success",
                "Consent request sent successfully."
            );
            dispatch(hideLoader());
        } catch (error: any) {

            console.log(
                "Consent Error =>",
                JSON.stringify(error, null, 2)
            );

            showToast(
                "error",
                "Consent Request Failed",
                error?.data?.message || "Something went wrong."
            );
            dispatch(hideLoader());

        }
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
                            label: "Entity",
                            value: bridgeServices?.bridge.entity,
                        },
                    ]}
                />
                {/* <Dropdown
                    label="Service"
                    data={options}
                    selected={service}
                    onChange={setSelectedService}
                /> */}

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
                            key={item?.id}
                            title={item?.label}
                            selected={selectedHiTypes.includes(item?.id)}
                            onPress={() => toggleHiType(item?.id)}
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
                        eraseDate.setDate(eraseDate.getDate() + 2);
                        setEraseAt(date);
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
        bottom: 10,
        width: "100%",
        backgroundColor: "#FFF", 
        borderColor: "#ECECEC",
        paddingHorizontal: 16,
    },

    button: {
        height: 46,
        borderRadius: 8,
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