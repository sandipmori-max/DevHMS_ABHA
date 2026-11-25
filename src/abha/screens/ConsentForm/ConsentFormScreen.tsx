import React, { useCallback, useEffect, useRef, useState } from "react";
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
import {
    ABDM_REQUESTER_IDENTIFIER_SYSTEM,
    ABDM_REQUESTER_IDENTIFIER_TYPE,
    ABDM_REQUESTER_IDENTIFIER_VALUE,
} from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import {
    ConsentRequestStatusResult,
    useConsentRequestMutation,
    usePollConsentRequestStatusMutation,
} from "../../redux/api/consentRequestApi";
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
            code: "HPAYMT",
            refUri: "deverp.com",
        },
    },
    {
        label: "Disease Specific Healthcare Research",
        value: {
            text: "Disease Specific Healthcare Research",
            code: "DSRCH",
            refUri: "deverp.com",
        },
    },
     {
        label: "Self Requested",
        value: {
            text: "Self Requested",
            code: "PATRQT",
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
    const [purpose, setPurpose] = useState(PURPOSES[0].value);
    const dispatch = useDispatch();
    const [selectedHip, setSelectedHip] = useState<any>(null);
    const [service, setSelectedService] = useState<any>(null);
    const hiuServices = (Array.isArray(bridgeServices?.services)
        ? bridgeServices.services
        : [])
        .filter((item: any) => {
            const supportsHiu = Array.isArray(item?.types)
                ? item.types.some(
                    (type: unknown) =>
                        typeof type === "string" &&
                        type.trim().toUpperCase() === "HIU",
                )
                : item?.isHiu === true;
            const serviceId = item?.id ?? item?.serviceId;
            return item?.active !== false &&
                supportsHiu &&
                serviceId !== undefined &&
                serviceId !== null &&
                String(serviceId).trim() !== "";
        });
    const options = hiuServices.map((item: any) => ({
        value: item.id ?? item.serviceId,
        label: item.name ?? "Unnamed HIU service",
    }));
    const [
        createSession
    ] = useCreateSessionMutation();
    const [consentRequest, { isLoading }] =
        useConsentRequestMutation();
    const [pollConsentRequestStatus, { isLoading: isPollingStatus }] =
        usePollConsentRequestStatusMutation();
    const [consentPollId, setConsentPollId] = useState<string | null>(null);
    const [consentStatus, setConsentStatus] =
        useState<ConsentRequestStatusResult | null>(null);
    const [statusPollError, setStatusPollError] = useState<string | null>(null);
    const statusPollInFlight = useRef(false);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

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
    const selectedHiuService = hiuServices.find(
        (item: any) =>
            service !== null &&
            service !== undefined &&
            String(item.id ?? item.serviceId) === String(service),
    );
    const getValue = (fieldName: string): string => {
        if (!Array.isArray(abhaDetail)) {
            return "";
        }

        const normalize = (value: string) =>
            value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        const field = abhaDetail.find(
            (item: any) =>
                typeof item?.field === "string" &&
                normalize(item.field) === normalize(fieldName),
        );
        return field?.text === undefined || field?.text === null
            ? ""
            : String(field.text).trim();
    };

    const toggleHiType = (item: string) => {
        if (selectedHiTypes.includes(item)) {
            setSelectedHiTypes(selectedHiTypes.filter(x => x !== item));
        } else {
            setSelectedHiTypes([...selectedHiTypes, item]);
        }
    };

    const checkConsentStatus = useCallback(async (showFailureToast = true) => {
        if (!consentPollId || statusPollInFlight.current) {
            return;
        }

        statusPollInFlight.current = true;
        if (isMounted.current) {
            setStatusPollError(null);
        }

        try {
            const result = await pollConsentRequestStatus(consentPollId).unwrap();
            if (isMounted.current) {
                setConsentStatus(result);
            }
        } catch (error: any) {
            const message =
                error?.data?.error ||
                error?.error ||
                "Could not check consent status.";
            if (isMounted.current) {
                setStatusPollError(message);
                if (showFailureToast) {
                    showToast("error", "Status Check Failed", message);
                }
            }
        } finally {
            statusPollInFlight.current = false;
        }
    }, [consentPollId, pollConsentRequestStatus]);

    useEffect(() => {
        if (
            !consentPollId ||
            (consentStatus?.status !== "PENDING" &&
                consentStatus?.status !== "REQUESTED")
        ) {
            return;
        }

        let isActive = true;
        let timer: ReturnType<typeof setTimeout>;
        const poll = async () => {
            await checkConsentStatus(false);
            if (isActive) {
                timer = setTimeout(poll, 5000);
            }
        };

        timer = setTimeout(poll, 5000);
        return () => {
            isActive = false;
            clearTimeout(timer);
        };
    }, [checkConsentStatus, consentPollId, consentStatus?.status]);

    const onSubmit = async () => {
        if (toDate < fromDate) {
            showToast(
                'error',
                "Invalid Date Range",
                "To Date should be greater than or equal to From Date."
            );
            return;
        }

        if (!selectedHiuService) {
            showToast(
                'error',
                "HIU service required",
                "Select an active service that has the HIU role.",
            );
            return;
        }

        if (!selectedHiuService.name?.trim()) {
            showToast(
                "error",
                "HIU service name unavailable",
                "Choose a registered HIU service with a name.",
            );
            return;
        }

        const patientAddress = getValue("preferredabhaaddress");
        if (!patientAddress) {
            showToast(
                "error",
                "ABHA Address Missing",
                "The selected patient does not have an ABHA address.",
            );
            return;
        }

        const missingRequesterIdentityFields = [
            {
                key: "ABDM_REQUESTER_IDENTIFIER_TYPE",
                value: ABDM_REQUESTER_IDENTIFIER_TYPE,
            },
            {
                key: "ABDM_REQUESTER_IDENTIFIER_VALUE",
                value: ABDM_REQUESTER_IDENTIFIER_VALUE,
            },
            {
                key: "ABDM_REQUESTER_IDENTIFIER_SYSTEM",
                value: ABDM_REQUESTER_IDENTIFIER_SYSTEM,
            },
        ]
            .filter(({ value }) => !value?.trim())
            .map(({ key }) => key);

        if (missingRequesterIdentityFields.length > 0) {
            showToast(
                "error",
                "Requester Identity Missing",
                `Missing app config: ${missingRequesterIdentityFields.join(", ")}. Update the root .env and rebuild/reinstall the app.`,
            );
            return;
        }

        if (selectedHiTypes.length === 0) {
            showToast(
                "error",
                "Select Health Information",
                "Choose at least one health-information type.",
            );
            return;
        }

        const frequencyUnit = {
            "One Time": "HOUR",
            Hourly: "HOUR",
            Daily: "DAY",
            Weekly: "WEEK",
            Monthly: "MONTH",
        }[frequency] as "HOUR" | "DAY" | "WEEK" | "MONTH";

        const payload = {
            consent: {
                purpose,
                patient: {
                    id: patientAddress,
                },
                hiu: {
                    id: String(
                        selectedHiuService.id ?? selectedHiuService.serviceId,
                    ),
                },
                hip: null,
                careContexts: null,
                requester: {
                    name: selectedHiuService.name.trim(),
                    identifier: {
                        type: ABDM_REQUESTER_IDENTIFIER_TYPE,
                        value: ABDM_REQUESTER_IDENTIFIER_VALUE,
                        system: ABDM_REQUESTER_IDENTIFIER_SYSTEM,
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
                    frequency: {
                        unit: frequencyUnit,
                        value: 1,
                        repeats: 0,
                    }

                },
            },
        };

        dispatch(showLoader());
        try {
            await createSession().unwrap();
            const response = await consentRequest(payload).unwrap();
            setConsentPollId(response.pollId);
            setConsentStatus({
                status: "PENDING",
                consentArtefactIds: [],
            });
            showToast(
                "success",
                "Request Submitted",
                "Patient can review the consent request in the ABHA app.",
            );
        } catch (error: any) {
            showToast(
                "error",
                "Consent Request Failed",
                error?.data?.message ||
                    error?.error ||
                    "Something went wrong."
            );
        } finally {
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
                    title="Requester (HIU service)"
                    icon="person"
                    data={[
                        {
                            label: "Service",
                            value: selectedHiuService?.name ?? "Select an HIU service",
                        },

                        {
                            label: "HIU ID",
                            value: selectedHiuService?.id ??
                                selectedHiuService?.serviceId ??
                                "-",
                        },
                    ]}
                />
                <Dropdown
                    label="Service"
                    data={options}
                    selected={service}
                    onChange={setSelectedService}
                />
                {options.length === 0 && (
                    <Text style={styles.serviceWarning}>
                        No active HIU service found. The selected ABDM service must include the HIU role.
                    </Text>
                )}

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
                {consentPollId && consentStatus && (
                    <View style={styles.consentStatusCard}>
                        <Text style={styles.consentStatusTitle}>
                            Consent status: {consentStatus.status}
                        </Text>
                        <Text style={styles.consentStatusMessage}>
                            {consentStatus.status === "PENDING"
                                ? "Waiting for ABDM to confirm the request."
                                : consentStatus.status === "REQUESTED"
                                ? "Request sent. The patient must approve it in the ABHA app."
                                : consentStatus.status === "GRANTED"
                                ? `Patient approved. ${consentStatus.consentArtefactIds.length} consent artefact(s) received.`
                                : consentStatus.status === "FAILED"
                                ? consentStatus.error || "ABDM could not create the request."
                                : `Consent ${consentStatus.status.toLowerCase()}.`}
                        </Text>
                        {statusPollError && (
                            <Text style={styles.consentStatusError}>
                                Could not refresh status. Retrying automatically: {statusPollError}
                            </Text>
                        )}
                        <TouchableOpacity
                            disabled={isPollingStatus}
                            onPress={() => checkConsentStatus()}
                            style={styles.checkStatusButton}
                        >
                            <Text style={styles.checkStatusText}>
                                {isPollingStatus ? "Checking..." : "Refresh Status"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity
                    disabled={isLoading}
                    style={[styles.button, {
                        backgroundColor: isLoading
                            ? "#98A2B3"
                            : ERP_COLOR_CODE.ERP_APP_COLOR,
                    }]}
                    onPress={onSubmit}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? "Submitting..." : "Request Consent"}
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

    consentStatusCard: {
        marginBottom: 10,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#F2F4F7",
    },

    consentStatusTitle: {
        fontWeight: "700",
        color: "#101828",
    },

    consentStatusMessage: {
        marginTop: 4,
        color: "#475467",
    },
    consentStatusError: {
        marginTop: 4,
        color: "#B42318",
    },
    serviceWarning: {
        color: "#B42318",
        fontSize: 13,
        marginHorizontal: 16,
        marginBottom: 8,
    },

    checkStatusButton: {
        alignSelf: "flex-start",
        marginTop: 8,
        paddingVertical: 5,
    },

    checkStatusText: {
        fontWeight: "600",
        color: ERP_COLOR_CODE.ERP_APP_COLOR,
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