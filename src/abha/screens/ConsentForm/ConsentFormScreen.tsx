import React, { useCallback, useEffect, useRef, useState } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";

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
    ConsentDataFetchResult,
    FhirAttachment,
    FhirResource,
    ConsentRequestStatusResult,
    getSafeConsentRequestErrorMessage,
    useConsentRequestMutation,
    usePollConsentDataFetchMutation,
    usePollConsentRequestStatusMutation,
    useStartConsentDataFetchMutation,
} from "../../redux/api/consentRequestApi";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { useCreateSessionMutation } from "../../redux/api/sessionApi";
import { monitorAndPersistConsent } from "../../redux/api/consentPersistence";


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

const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

const endOfDay = (date: Date) =>
    new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999,
    );

const CONSENT_DATE_SERVER_SKEW_BUFFER_MS = 60_000;

const getConsentRangeEnd = (date: Date, now: Date) => {
    if (startOfDay(date).getTime() !== startOfDay(now).getTime()) {
        return endOfDay(date);
    }

    return new Date(
        Math.max(
            startOfDay(now).getTime(),
            now.getTime() - CONSENT_DATE_SERVER_SKEW_BUFFER_MS,
        ),
    );
};

const getDefaultFromDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return startOfDay(date);
};

const getFhirResources = (
    bundles: ConsentDataFetchResult["records"],
): FhirResource[] =>
    bundles.flatMap(bundle =>
        bundle.resourceType === "Bundle"
            ? (bundle.entry ?? [])
                .map(entry => entry.resource)
                .filter((resource): resource is FhirResource => Boolean(resource))
            : [bundle],
    );

const getFhirResourceAttachments = (resource: FhirResource): FhirAttachment[] => [
    ...(resource.content ?? [])
        .map(item => item.attachment)
        .filter((attachment): attachment is FhirAttachment => Boolean(attachment)),
    ...(resource.presentedForm ?? []),
];

const getFhirResourceLabel = (resource: FhirResource) =>
    resource.title ||
    resource.description ||
    getFhirResourceAttachments(resource)[0]?.title ||
    resource.code?.text ||
    resource.code?.coding?.find(coding => coding.display)?.display ||
    resource.resourceType ||
    "Health record";

const getFhirResourceValue = (resource: FhirResource) =>
    resource.valueString ||
    (resource.valueQuantity?.value !== undefined
        ? `${resource.valueQuantity.value} ${resource.valueQuantity.unit ?? ""}`.trim()
        : "");

const getFhirResourceDate = (resource: FhirResource) => {
    const value =
        resource.date || resource.authoredOn || resource.effectiveDateTime;
    if (!value) {
        return "";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString();
};

const ConsentDetailRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.consentDetailRow}>
        <Text style={styles.consentDetailLabel}>{label}</Text>
        <Text style={styles.consentDetailValue}>{value || "-"}</Text>
    </View>
);

const ConsentFormScreen = ({ route }: any) => {
    const { abhaDetail, bridgeServices } = route.params || {};
    const [purpose, setPurpose] = useState(PURPOSES[0].value);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();
    const erpToken = useAppSelector(state => state.auth.user?.token);
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
    const [startConsentDataFetch] = useStartConsentDataFetchMutation();
    const [pollConsentDataFetch] = usePollConsentDataFetchMutation();
    const [pollConsentRequestStatus, { isLoading: isPollingStatus }] =
        usePollConsentRequestStatusMutation();
    const [consentPollId, setConsentPollId] = useState<string | null>(null);
    const [consentStatus, setConsentStatus] =
        useState<ConsentRequestStatusResult | null>(null);
    const [statusPollError, setStatusPollError] = useState<string | null>(null);
    const [dataTransfers, setDataTransfers] =
        useState<Record<string, ConsentDataFetchResult>>({});
    const [dataTransferErrors, setDataTransferErrors] =
        useState<Record<string, string>>({});
    const [startingDataFetches, setStartingDataFetches] = useState<string[]>([]);
    const statusPollInFlight = useRef(false);
    const dataPollInFlight = useRef(new Set<string>());
    const autoFetchStartedPollId = useRef<string | null>(null);
    const lastNotifiedConsentStatus = useRef<string | null>(null);
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

    const [fromDate, setFromDate] = useState(getDefaultFromDate);

    const [toDate, setToDate] = useState(() => startOfDay(new Date()));

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

    const returnToMainScreen = () => {
        const listRoute = [...navigation.getState().routes]
            .reverse()
            .find(routeItem => routeItem.name === "List");

        if (!listRoute) {
            if (navigation.canGoBack()) {
                navigation.goBack();
                return;
            }
            showToast(
                "error",
                "Navigation Failed",
                "The main List page is not available in the current navigation stack.",
            );
            return;
        }

        navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: "List", params: listRoute.params }],
        }));
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
                if (result.status === "REVOKED" || result.status === "DENIED") {
                    setDataTransfers({});
                    setDataTransferErrors({});
                }
            }
        } catch (error: any) {
            const message = getSafeConsentRequestErrorMessage(error);
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

    const isConsentWaiting =
        consentStatus?.status === "PENDING" ||
        consentStatus?.status === "REQUESTED";
    const isConsentGranted = consentStatus?.status === "GRANTED";
    const isConsentDenied = consentStatus?.status === "DENIED";
    const hasAnyDataTransfers = Object.keys(dataTransfers).length > 0;

    useEffect(() => {
        const status = consentStatus?.status;
        if (!status) {
            lastNotifiedConsentStatus.current = null;
            return;
        }

        if (
            status === "GRANTED" &&
            lastNotifiedConsentStatus.current !== "GRANTED"
        ) {
            showToast(
                "success",
                "Consent Approved",
                "The patient approved the consent request.",
            );
        } else if (
            status === "DENIED" &&
            lastNotifiedConsentStatus.current !== status
        ) {
            showToast(
                "error",
                "Consent Rejected",
                "The patient rejected the consent request.",
            );
        }

        lastNotifiedConsentStatus.current = status;
    }, [consentStatus?.status]);

    useEffect(() => {
        if (!isConsentDenied || !consentPollId) {
            return;
        }

        const timeout = setTimeout(() => {
            setConsentPollId(null);
            setConsentStatus(null);
            setStatusPollError(null);
            setDataTransfers({});
            setDataTransferErrors({});
            setStartingDataFetches([]);
            autoFetchStartedPollId.current = null;
        }, 4000);

        return () => clearTimeout(timeout);
    }, [consentPollId, isConsentDenied]);

    useEffect(() => {
        const trackingGrantedRecords =
            isConsentGranted && hasAnyDataTransfers;
        if (!consentPollId || (!isConsentWaiting && !trackingGrantedRecords)) {
            return;
        }

        const interval = isConsentWaiting ? 5000 : 30_000;
        let isActive = true;
        let timer: ReturnType<typeof setTimeout>;
        const poll = async () => {
            await checkConsentStatus(false);
            if (isActive) {
                timer = setTimeout(poll, interval);
            }
        };

        timer = setTimeout(poll, interval);
        return () => {
            isActive = false;
            clearTimeout(timer);
        };
    }, [
        checkConsentStatus,
        consentPollId,
        isConsentGranted,
        isConsentWaiting,
        hasAnyDataTransfers,
    ]);

    const checkConsentDataStatus = useCallback(async (
        pollId: string,
        consentArtefactId: string,
    ) => {
        const requestKey = `${pollId}:${consentArtefactId}`;
        if (dataPollInFlight.current.has(requestKey)) {
            return;
        }

        dataPollInFlight.current.add(requestKey);
        try {
            const result = await pollConsentDataFetch({
                pollId,
                consentArtefactId,
            }).unwrap();
            if (isMounted.current) {
                setDataTransfers(current => ({
                    ...current,
                    [consentArtefactId]: result,
                }));
                setDataTransferErrors(current => {
                    const next = { ...current };
                    delete next[consentArtefactId];
                    return next;
                });
            }
        } catch (error) {
            if (isMounted.current) {
                setDataTransferErrors(current => ({
                    ...current,
                    [consentArtefactId]: getSafeConsentRequestErrorMessage(error),
                }));
            }
        } finally {
            dataPollInFlight.current.delete(requestKey);
        }
    }, [pollConsentDataFetch]);

    const transferPollingKey = Object.entries(dataTransfers)
        .filter(([, transfer]) =>
            ["FETCHING_CONSENT", "REQUESTING_DATA", "RECEIVING"].includes(
                transfer.status,
            ),
        )
        .map(([artefactId]) => artefactId)
        .join("|");

    useEffect(() => {
        if (!consentPollId || !transferPollingKey) {
            return;
        }

        const artefactIds = transferPollingKey.split("|");
        let isActive = true;
        let timer: ReturnType<typeof setTimeout>;
        const poll = async () => {
            await Promise.all(
                artefactIds.map(artefactId =>
                    checkConsentDataStatus(consentPollId, artefactId),
                ),
            );
            if (isActive) {
                timer = setTimeout(poll, 5000);
            }
        };

        timer = setTimeout(poll, 3000);
        return () => {
            isActive = false;
            clearTimeout(timer);
        };
    }, [
        checkConsentDataStatus,
        consentPollId,
        transferPollingKey,
    ]);

    const onFetchApprovedRecords = useCallback(async (consentArtefactId: string) => {
        if (!consentPollId) {
            showToast(
                "error",
                "Consent request unavailable",
                "Refresh consent status and try again.",
            );
            return;
        }

        setStartingDataFetches(current =>
            current.includes(consentArtefactId)
                ? current
                : [...current, consentArtefactId],
        );
        setDataTransferErrors(current => {
            const next = { ...current };
            delete next[consentArtefactId];
            return next;
        });
        try {
            const result = await startConsentDataFetch({
                pollId: consentPollId,
                consentArtefactId,
            }).unwrap();
            if (isMounted.current) {
                setDataTransfers(current => ({
                    ...current,
                    [consentArtefactId]: result,
                }));
            }
        } catch (error) {
            if (isMounted.current) {
                setDataTransferErrors(current => ({
                    ...current,
                    [consentArtefactId]: getSafeConsentRequestErrorMessage(error),
                }));
            }
        } finally {
            if (isMounted.current) {
                setStartingDataFetches(current =>
                    current.filter(id => id !== consentArtefactId),
                );
            }
        }
    }, [consentPollId, startConsentDataFetch]);

    useEffect(() => {
        if (
            !consentPollId ||
            !consentStatus ||
            !isConsentGranted ||
            autoFetchStartedPollId.current === consentPollId
        ) {
            return;
        }

        autoFetchStartedPollId.current = consentPollId;
        consentStatus.consentArtefactIds.forEach(artefactId => {
            void onFetchApprovedRecords(artefactId);
        });
    }, [
        consentPollId,
        consentStatus,
        isConsentGranted,
        onFetchApprovedRecords,
    ]);

    const isDataTransferInProgress = (artefactId: string) => {
        const status = dataTransfers[artefactId]?.status;
        return (
            startingDataFetches.includes(artefactId) ||
            status === "FETCHING_CONSENT" ||
            status === "REQUESTING_DATA" ||
            status === "RECEIVING"
        );
    };

    const onSubmit = async () => {
        const now = new Date();
        const fromDay = startOfDay(fromDate);
        const toDay = startOfDay(toDate);
        const today = startOfDay(now);

        if (toDay < fromDay) {
            showToast(
                'error',
                "Invalid Date Range",
                "To Date should be greater than or equal to From Date."
            );
            return;
        }

        if (toDay > today) {
            showToast(
                "error",
                "Invalid Date Range",
                "To Date cannot be in the future.",
            );
            return;
        }

        if (eraseAt <= new Date()) {
            showToast(
                "error",
                "Invalid Erase Date",
                "Erase data at must be a future date.",
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

        if (!erpToken) {
            showToast(
                "error",
                "ERP session unavailable",
                "Sign in again before creating a consent request so its result can be saved to ERP.",
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
                        from: fromDay.toISOString(),
                        to: getConsentRangeEnd(toDate, now).toISOString(),
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
            void monitorAndPersistConsent(dispatch, {
                requestId: response.requestId,
                pollId: response.pollId,
                erpToken,
                patientReference: getValue("patientabhaid"),
                abhaNumber: getValue("abhanumber"),
                patientName: [
                    getValue("firstname"),
                    getValue("middlename"),
                    getValue("lastname"),
                ].filter(Boolean).join(" "),
                submittedAt: new Date().toISOString(),
                requestPayload: payload,
            });
            showToast(
                "success",
                "Request Submitted",
                "Consent is sent to the patient. Its decision and artefacts will be saved to ERP.",
            );
            returnToMainScreen();
        } catch (error: any) {
            showToast(
                "error",
                "Consent Request Failed",
                getSafeConsentRequestErrorMessage(error)
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
            {isConsentWaiting ? (
                <View style={styles.fullScreenState}>
                    <Header
                        title="Waiting for Consent"
                        isMenu={false}
                        isSearch={false}
                        isShare={false}
                    />
                    <View style={styles.decisionContent}>
                        <View style={styles.decisionIcon}>
                            <ActivityIndicator
                                size="large"
                                color={ERP_COLOR_CODE.ERP_APP_COLOR}
                            />
                        </View>
                        <Text style={styles.decisionTitle}>
                            Waiting for patient confirmation
                        </Text>
                        <Text style={styles.decisionMessage}>
                            Keep this page open. The consent status will update automatically when the patient approves or rejects the request.
                        </Text>
                        {statusPollError && (
                            <Text style={styles.consentStatusError}>
                                Still waiting; status refresh will retry automatically. {statusPollError}
                            </Text>
                        )}
                        <TouchableOpacity
                            disabled={isPollingStatus}
                            onPress={() => checkConsentStatus()}
                            style={styles.checkStatusButton}
                        >
                            <Text style={styles.checkStatusText}>
                                {isPollingStatus ? "Checking..." : "Check Status Now"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : isConsentDenied ? (
                <View style={styles.fullScreenState}>
                    <Header
                        title="Consent Rejected"
                        isMenu={false}
                        isSearch={false}
                        isShare={false}
                    />
                    <View style={styles.decisionContent}>
                        <View style={[styles.decisionIcon, styles.rejectedIcon]}>
                            <MaterialIcons
                                name="cancel"
                                size={44}
                                color="#B42318"
                            />
                        </View>
                        <Text style={styles.decisionTitle}>
                            Consent request rejected
                        </Text>
                        <Text style={styles.decisionMessage}>
                            The patient declined this request. Returning to the consent form...
                        </Text>
                    </View>
                </View>
            ) : (
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
                    title={isConsentGranted ? "Consent Approved" : "Consent Request"}
                    isMenu={false}
                    isSearch={false}
                    isShare={false}
                />

                {!isConsentGranted && (
                    <>
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
                    disablePastDates={false}
                    onChange={(date: Date) => {
                        if (startOfDay(date) > startOfDay(toDate)) {
                            showToast(
                                "error",
                                "Invalid Date",
                                "From Date cannot be later than To Date.",
                            );
                            return;
                        }
                        setFromDate(date);
                    }}
                />

                <DateSelector
                    label="To Date"
                    value={toDate}
                    disablePastDates={false}
                    onChange={(date: Date) => {
                        if (startOfDay(date) < startOfDay(fromDate)) {
                            showToast(
                                'error',
                                "Invalid Date",
                                "To Date cannot be earlier than From Date."
                            );
                            return;
                        }
                        setToDate(date);
                    }}
                />
                <Text style={styles.dateRangeHint}>
                    This date range selects which records to request. Today's range ends at the current time; "Erase data at" is a separate retention deadline.
                </Text>

                <PermissionCard
                    accessMode={accessMode}
                    onChangeAccessMode={setAccessMode}
                    frequency={frequency}
                    onChangeFrequency={setFrequency}
                    eraseAt={eraseAt}
                    onChangeEraseAt={setEraseAt}
                />
                    </>
                )}
                {isConsentGranted && (
                    <View style={styles.recordsCard}>
                        <View style={styles.approvalBanner}>
                            <MaterialIcons
                                name="verified"
                                size={28}
                                color="#15803D"
                            />
                            <View style={styles.approvalBannerText}>
                                <Text style={styles.recordsTitle}>
                                    Consent approved
                                </Text>
                                <Text style={styles.approvalBannerSubtitle}>
                                    {consentStatus?.consentArtefactIds.length ?? 0} artefact(s) received
                                </Text>
                            </View>
                        </View>
                        <View style={styles.informationBanner}>
                            <MaterialIcons
                                name="info-outline"
                                size={18}
                                color="#175CD3"
                            />
                            <Text style={styles.informationBannerText}>
                                Consent artefacts contain permission details, not health files. Records arrive separately from the HIP.
                            </Text>
                        </View>

                        {!consentStatus?.consentArtefactIds.length && (
                            <Text style={styles.recordsDescription}>
                                No consent artefacts were returned.
                            </Text>
                        )}

                        {(consentStatus?.consentArtefactIds ?? []).map(artefactId => {
                            const transfer = dataTransfers[artefactId];
                            const error = dataTransferErrors[artefactId];
                            const transferFailure =
                                transfer?.status === "FAILED"
                                    ? getSafeConsentRequestErrorMessage(transfer)
                                    : undefined;
                            const isStarting =
                                startingDataFetches.includes(artefactId);
                            const isInProgress =
                                isDataTransferInProgress(artefactId);
                            const transferStatus = isStarting
                                ? "STARTING"
                                : transfer?.status ?? (error ? "FAILED" : "QUEUED");
                            const statusColor =
                                transferStatus === "COMPLETED"
                                    ? "#15803D"
                                    : transferStatus === "FAILED"
                                        ? "#B42318"
                                        : isInProgress
                                            ? "#175CD3"
                                            : "#475467";
                            const statusIcon =
                                transferStatus === "COMPLETED"
                                    ? "check-circle"
                                    : transferStatus === "FAILED"
                                        ? "error-outline"
                                        : isInProgress
                                            ? "autorenew"
                                            : "schedule";
                            const statusBackgroundColor =
                                transferStatus === "COMPLETED"
                                    ? "#ECFDF3"
                                    : transferStatus === "FAILED"
                                            ? "#FEF3F2"
                                            : isInProgress
                                                ? "#EFF8FF"
                                                : "#F2F4F7";

                            return (
                                <View key={artefactId} style={styles.artefactCard}>
                                    <View style={styles.artefactHeader}>
                                        <View style={styles.artefactIcon}>
                                            <MaterialIcons
                                                name="description"
                                                size={22}
                                                color={ERP_COLOR_CODE.ERP_APP_COLOR}
                                            />
                                        </View>
                                        <View style={styles.artefactHeading}>
                                            <Text style={styles.artefactTitle}>
                                                Consent artefact
                                            </Text>
                                            <Text
                                                selectable
                                                style={styles.artefactId}
                                            >
                                                {artefactId}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.statusBadge,
                                                {
                                                    backgroundColor: statusBackgroundColor,
                                                },
                                            ]}
                                        >
                                            <MaterialIcons
                                                name={statusIcon}
                                                size={14}
                                                color={statusColor}
                                            />
                                            <Text
                                                style={[
                                                    styles.statusBadgeText,
                                                    { color: statusColor },
                                                ]}
                                            >
                                                {transferStatus}
                                            </Text>
                                        </View>
                                    </View>

                                    {transfer?.consent && (
                                        <View style={styles.consentScope}>
                                            <Text style={styles.recordsSectionTitle}>
                                                Approved consent details
                                            </Text>
                                            <ConsentDetailRow
                                                label="Consent ID"
                                                value={transfer.consent.consentId}
                                            />
                                            <ConsentDetailRow
                                                label="HIP"
                                                value={transfer.consent.hipId}
                                            />
                                            <ConsentDetailRow
                                                label="HIU"
                                                value={transfer.consent.hiuId}
                                            />
                                            <ConsentDetailRow
                                                label="Health types"
                                                value={transfer.consent.hiTypes.join(", ")}
                                            />
                                            <ConsentDetailRow
                                                label="Date range"
                                                value={`${new Date(transfer.consent.from).toLocaleDateString()} – ${new Date(transfer.consent.to).toLocaleDateString()}`}
                                            />
                                            <ConsentDetailRow
                                                label="Access"
                                                value={transfer.consent.accessMode}
                                            />
                                            {transfer.consent.dataEraseAt && (
                                                <ConsentDetailRow
                                                    label="Erase data at"
                                                    value={new Date(transfer.consent.dataEraseAt).toLocaleString()}
                                                />
                                            )}
                                        </View>
                                    )}

                                    {!transfer?.consent && (
                                        <View style={styles.consentScope}>
                                            <Text style={styles.recordsSectionTitle}>
                                                Requested scope
                                            </Text>
                                            <ConsentDetailRow
                                                label="HIU"
                                                value={selectedHiuService?.name ?? "-"}
                                            />
                                            <ConsentDetailRow
                                                label="Purpose"
                                                value={purpose.text}
                                            />
                                            <ConsentDetailRow
                                                label="Health types"
                                                value={HI_TYPES
                                                    .filter(item => selectedHiTypes.includes(item.id))
                                                    .map(item => item.label)
                                                    .join(", ")}
                                            />
                                            <ConsentDetailRow
                                                label="Date range"
                                                value={`${fromDate.toLocaleDateString()} – ${toDate.toLocaleDateString()}`}
                                            />
                                            <ConsentDetailRow
                                                label="Access"
                                                value={accessMode}
                                            />
                                            <ConsentDetailRow
                                                label="Erase data at"
                                                value={eraseAt.toLocaleDateString()}
                                            />
                                            <Text style={styles.recordsDescription}>
                                                Requested terms; approved artefact details will replace these after retrieval.
                                            </Text>
                                        </View>
                                    )}

                                    {isInProgress && (
                                        <View style={styles.transferProgress}>
                                            <ActivityIndicator
                                                size="small"
                                                color={ERP_COLOR_CODE.ERP_APP_COLOR}
                                            />
                                            <Text style={styles.recordsDescription}>
                                                Fetching records...
                                            </Text>
                                        </View>
                                    )}
                                    {transfer?.status === "COMPLETED" && (
                                        <Text style={styles.recordsSectionTitle}>
                                            {getFhirResources(transfer.records).length} health record(s) received
                                        </Text>
                                    )}
                                    {(error || transferFailure) && (
                                        <Text style={styles.recordsError}>
                                            {error || transferFailure}
                                        </Text>
                                    )}

                                    {(!transfer || transfer.status === "FAILED") && (
                                        <TouchableOpacity
                                            disabled={isStarting}
                                            onPress={() => onFetchApprovedRecords(artefactId)}
                                            style={[
                                                styles.fetchRecordsButton,
                                                isStarting && styles.disabledFetchButton,
                                            ]}
                                        >
                                            <Text style={styles.fetchRecordsButtonText}>
                                                {isStarting
                                                    ? "Starting..."
                                                    : transfer?.status === "FAILED" || error
                                                        ? "Retry Fetch"
                                                        : "Fetch Health Records"}
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    {transfer?.status === "COMPLETED" &&
                                        transfer.records.length === 0 && (
                                            <Text style={styles.recordsDescription}>
                                                No matching health records were received for this consent scope. The consent artefact does not show whether the HIP has uploaded records; confirm linked records with the HIP.
                                            </Text>
                                        )}
                                    {transfer?.status === "COMPLETED" &&
                                        getFhirResources(transfer.records).map(
                                            (resource, index) => (
                                                <View
                                                    key={`${resource.resourceType ?? "record"}-${index}`}
                                                    style={styles.fhirResource}
                                                >
                                                    <Text style={styles.fhirResourceTitle}>
                                                        {getFhirResourceLabel(resource)}
                                                    </Text>
                                                    <Text style={styles.fhirResourceType}>
                                                        {resource.resourceType ?? "FHIR resource"}
                                                        {getFhirResourceDate(resource)
                                                            ? ` · ${getFhirResourceDate(resource)}`
                                                            : ""}
                                                    </Text>
                                                    {getFhirResourceValue(resource) ? (
                                                        <Text style={styles.recordsDescription}>
                                                            {getFhirResourceValue(resource)}
                                                        </Text>
                                                    ) : null}
                                                    {getFhirResourceAttachments(resource).map(
                                                        (attachment, attachmentIndex) => (
                                                            <View
                                                                key={`${attachment.title ?? attachment.contentType ?? "attachment"}-${attachmentIndex}`}
                                                                style={styles.attachmentRow}
                                                            >
                                                                <MaterialIcons
                                                                    name="attach-file"
                                                                    size={17}
                                                                    color="#475467"
                                                                />
                                                                <View style={styles.attachmentDetails}>
                                                                    <Text style={styles.attachmentTitle}>
                                                                        {attachment.title ||
                                                                            attachment.contentType ||
                                                                            "Attached health document"}
                                                                    </Text>
                                                                    <Text style={styles.fhirResourceType}>
                                                                        {attachment.data
                                                                            ? "File content received"
                                                                            : attachment.url
                                                                                ? "File reference received"
                                                                                : "Attachment listed"}
                                                                        {attachment.size
                                                                            ? ` · ${(attachment.size / 1024).toFixed(0)} KB`
                                                                            : ""}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        ),
                                                    )}
                                                </View>
                                            ),
                                        )}
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
            )}
            {!isConsentWaiting && !isConsentDenied && !isConsentGranted && (
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
                                ? getSafeConsentRequestErrorMessage(consentStatus)
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
            )}
        </SafeAreaView>
    );
};

export default ConsentFormScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    fullScreenState: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },

    decisionContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 28,
    },

    decisionTitle: {
        marginTop: 18,
        color: "#202939",
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },

    decisionMessage: {
        marginTop: 10,
        color: "#667085",
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
    },

    decisionIcon: {
        width: 76,
        height: 76,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 38,
        backgroundColor: "#EEF2FF",
    },

    rejectedIcon: {
        backgroundColor: "#FEF3F2",
    },

    transferProgress: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#EFF8FF",
    },

    approvalBanner: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#ECFDF3",
    },

    approvalBannerText: {
        flex: 1,
        marginLeft: 10,
    },

    approvalBannerSubtitle: {
        marginTop: 3,
        color: "#475467",
        fontSize: 12,
    },

    informationBanner: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 12,
        padding: 11,
        borderRadius: 10,
        backgroundColor: "#EFF8FF",
    },

    informationBannerText: {
        flex: 1,
        marginLeft: 8,
        color: "#175CD3",
        fontSize: 12,
        lineHeight: 18,
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
    recordsCard: {
        margin: 14,
        padding: 16,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#E4E7EC",
        elevation: 2,
    },
    recordsTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#202939",
    },
    recordsSectionTitle: {
        marginTop: 12,
        marginBottom: 6,
        fontSize: 14,
        fontWeight: "600",
        color: "#344054",
    },
    recordsDescription: {
        marginTop: 5,
        color: "#667085",
        fontSize: 12,
    },
    consentScope: {
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "#F8FAFC",
    },
    artefactCard: {
        marginTop: 12,
        padding: 14,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#E4E7EC",
        backgroundColor: "#FFFFFF",
    },
    artefactHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    artefactIcon: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        backgroundColor: "#F2F4F7",
    },
    artefactHeading: {
        flex: 1,
        minWidth: 0,
        marginLeft: 10,
    },
    artefactTitle: {
        color: "#344054",
        fontSize: 14,
        fontWeight: "700",
    },
    artefactId: {
        marginTop: 2,
        color: "#475467",
        fontSize: 11,
        lineHeight: 16,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusBadgeText: {
        marginLeft: 4,
        fontSize: 10,
        fontWeight: "700",
    },
    consentDetailRow: {
        paddingVertical: 7,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#EAECF0",
    },
    consentDetailLabel: {
        color: "#667085",
        fontSize: 11,
        fontWeight: "500",
    },
    consentDetailValue: {
        marginTop: 2,
        color: "#344054",
        fontSize: 13,
        fontWeight: "600",
    },
    fetchRecordsButton: {
        marginTop: 8,
        paddingVertical: 9,
        paddingHorizontal: 12,
        alignItems: "center",
        borderRadius: 6,
        backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    },
    disabledFetchButton: {
        opacity: 0.6,
    },
    fetchRecordsButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },
    recordsError: {
        marginTop: 8,
        color: "#B42318",
        fontSize: 12,
    },
    fhirResource: {
        marginTop: 10,
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#D0D5DD",
        borderRadius: 8,
    },
    fhirResourceTitle: {
        color: "#202939",
        fontWeight: "600",
    },
    fhirResourceType: {
        marginTop: 3,
        color: "#667085",
        fontSize: 11,
    },
    attachmentRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        padding: 9,
        borderRadius: 8,
        backgroundColor: "#F8FAFC",
    },
    attachmentDetails: {
        flex: 1,
        marginLeft: 7,
    },
    attachmentTitle: {
        color: "#344054",
        fontSize: 12,
        fontWeight: "600",
    },
    dateRangeHint: {
        marginHorizontal: 16,
        marginTop: 8,
        color: "#667085",
        fontSize: 12,
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