import { SafeAreaView, ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Modal } from 'react-native'
import React, { useMemo, useState } from 'react'
import { ERP_COLOR_CODE } from '../../../utils/constants'
import Header from '../../Components/Header'
import MaterialIcons from '@react-native-vector-icons/material-icons'
import { useGenerateLinkTokenMutation } from '../../redux/api/linkAbhaApi'
import { useCreateSessionMutation } from '../../redux/api/sessionApi'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice'
import { setLinkToken, setSelectedXCMID } from '../../redux/slices/abhaSlice'
import { showToast } from '../../utils/toast'
import { NavigationProp, useNavigation } from "@react-navigation/native";
import NoData from '../../../components/no_data/NoData'
import { useLazyGetBridgeServicesQuery } from '../../redux/api/bridgeServicesApi'
import { getErrorMessage } from '../../utils/helpers'

type BridgeService = {
    id?: string | number;
    serviceId?: string | number;
    facilityId?: string | number;
    hipId?: string | number;
    bridgeId?: string | number;
    name?: string;
};

const getBridgeServiceItems = (response: any): BridgeService[] => {
    const candidates = [
        response?.services,
        response?.data?.services,
        response?.data,
        response,
    ];
    return candidates.find(Array.isArray) ?? [];
};

type BridgeServicesNavigation = {
    LinkCareContext: {
        abhaDetail: Array<{ field: string; text: string }>;
    };
};

const BridgeServices = ({ route }: any) => {
    const navigation = useNavigation<NavigationProp<BridgeServicesNavigation>>();

    const { bridgeServices, abhaDetail } = route.params || {};
    const [services, setServices] = useState<BridgeService[]>(() =>
        getBridgeServiceItems(bridgeServices),
    );
    const [searchText, setSearchText] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [selectedBridge, setSelectedBridge] = useState<BridgeService | null>(null);
    const [isAddHelpVisible, setIsAddHelpVisible] = useState(false);
    const dispatch = useDispatch();
    const [generateLinkToken, { isLoading }] =
        useGenerateLinkTokenMutation();
    const [createSession, { isLoading: isCreatingSession }] =
        useCreateSessionMutation();
    const [
        refreshBridgeServices,
        { isFetching: isFetchingBridgeServices },
    ] = useLazyGetBridgeServicesQuery();
    const isRefreshing = isCreatingSession || isFetchingBridgeServices;
    const filteredServices = useMemo(() => {
        const query = searchText.trim().toLocaleLowerCase();
        if (!query) {
            return services;
        }

        return services.filter(service =>
            [
                service.name,
                service.id,
                service.serviceId,
                service.bridgeId,
                service.facilityId,
                service.hipId,
            ].some(value =>
                String(value ?? "").toLocaleLowerCase().includes(query),
            ),
        );
    }, [searchText, services]);

    const toggleSearch = () => {
        if (isSearchActive) {
            setSearchText("");
            setIsSearchActive(false);
            return;
        }
        setIsSearchActive(true);
    };

    const normalizeFieldName = (fieldName: string) =>
        fieldName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    const getValue = (fieldName: string) => {
        if (!Array.isArray(abhaDetail)) {
            return "";
        }

        const normalizedFieldName = normalizeFieldName(fieldName);
        const field = abhaDetail.find(
            item =>
                typeof item?.field === "string" &&
                normalizeFieldName(item.field) === normalizedFieldName,
        );
        return field?.text === undefined || field?.text === null
            ? ""
            : String(field.text).trim();
    };

    const handleRefreshServices = async () => {
        try {
            await createSession().unwrap();
            const response = await refreshBridgeServices().unwrap();
            const refreshedServices = getBridgeServiceItems(response);
            setServices(refreshedServices);

            if (selectedBridge) {
                const refreshedSelection = refreshedServices.find(
                    service => service.id === selectedBridge.id,
                );
                if (refreshedSelection) {
                    setSelectedBridge(refreshedSelection);
                } else {
                    setSelectedBridge(null);
                    dispatch(setSelectedXCMID(""));
                }
            }

            setIsAddHelpVisible(false);
            showToast(
                "info",
                "Bridge Services Updated",
                refreshedServices.length
                    ? `${refreshedServices.length} registered service(s) available.`
                    : "No registered services found. Complete registration in the ABDM portal, then refresh again.",
            );
        } catch (error) {
            showToast(
                "error",
                "Bridge Services Refresh Failed",
                getErrorMessage(error),
            );
        }
    };
    const formatDate = (date: string) => {
        if (!date) return "-";

        return date.split(" ")[0];
    };
    const handleLinkAbha = async () => {
        try {

            if (!selectedBridge) {
                showToast('error', "Please select service first")
                return;
            }

            const abhaAddress =
                getValue("preferredabhaaddress") || getValue("abhaaddress");
            if (!abhaAddress) {
                console.warn("[ABHA M2] ABHA address missing from profile", {
                    profileFields: Array.isArray(abhaDetail)
                        ? abhaDetail
                            .map(item => item?.field)
                            .filter((field): field is string => typeof field === "string")
                        : [],
                });
                showToast(
                    "error",
                    "ABHA address unavailable",
                    "Reload the ABHA profile and try again.",
                );
                return;
            }

            const genderValue = getValue("gender").toLowerCase();
            const genderCodes: Record<string, "M" | "F" | "O"> = {
                m: "M",
                male: "M",
                f: "F",
                female: "F",
                o: "O",
                other: "O",
            };
            const gender = genderCodes[genderValue];
            if (!gender) {
                showToast(
                    "error",
                    "Patient gender unavailable",
                    "Reload the ABHA profile and try again.",
                );
                return;
            }

            dispatch(showLoader())
            dispatch(setLinkToken(""))
            await createSession().unwrap();

            const payload = {
                abhaNumber: Number(
                    String(getValue('abhanumber')).replace(/-/g, '')
                ),
                abhaAddress,
                name: `${getValue("firstname")} ${getValue("middlename")} ${getValue("lastname")}`,
                gender,
                yearOfBirth: Number(formatDate(getValue("dob")).split("/").pop()),
            };
            const response = await generateLinkToken(payload).unwrap();
            console.log("[ABHA M2] Token retrieval completed", {
                hasLinkToken: Boolean(response.linkToken),
                hasExpiry: Boolean(response.expiresAt),
            });
            dispatch(setLinkToken(response.linkToken));
            dispatch(hideLoader())
            navigation.navigate("LinkCareContext", {
                abhaDetail: abhaDetail
            })

        } catch (error) {
            console.error("[ABHA M2] Token retrieval failed", {
                name: error instanceof Error ? error.name : "UnknownError",
            });
            dispatch(hideLoader())
        }
    };


    const renderItem = ({ item }: { item: BridgeService }) => {
        const isSelected = selectedBridge?.id === item.id;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    const selectedHipId =
                        item?.serviceId ??
                        item?.facilityId ??
                        item?.hipId ??
                        item?.id;
                    const hipId =
                        selectedHipId === undefined || selectedHipId === null
                            ? ""
                            : String(selectedHipId).trim();

                    if (!hipId) {
                        showToast(
                            'error',
                            'HIP service ID unavailable',
                            'Select a service that has an ABDM HIP service ID before generating a token.',
                        )
                        return;
                    }

                    dispatch(setSelectedXCMID(hipId))
                    setSelectedBridge(item)
                }}
                style={[styles.card, isSelected && {
                    borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                    borderWidth: 2
                },]}
            >
                <View style={[styles.iconContainer,

                ]}>
                    <MaterialIcons
                        name="local-hospital"
                        size={28}
                        color={ERP_COLOR_CODE.ERP_APP_COLOR}
                    />
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>
                        {item.name || "Unnamed service"}
                    </Text>

                </View>

                <MaterialIcons
                    name="chevron-right"
                    size={26}
                    color="#9E9E9E"
                />
            </TouchableOpacity>
        )
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
                <Header title="Bridge Services"
                    isMenu={false}
                    isSearch={true}
                    search={searchText}
                    setSearch={setSearchText}
                    seachActive={isSearchActive}
                    handleSearch={toggleSearch}
                    isAdd={true}
                    handleAdd={() => setIsAddHelpVisible(true)}
                    isShare={false}
                    handleShare={() => {

                    }} />

                {
                    services.length > 0 ? <>
                        {filteredServices.length > 0 ? (
                            <FlatList
                                data={filteredServices}
                                keyExtractor={(item, index) =>
                                    String(item.id ?? item.serviceId ?? index)
                                }
                                renderItem={renderItem}
                                ListFooterComponent={<View style={{ height: 100 }} />}
                            />
                        ) : (
                            <View style={styles.emptySearchResults}>
                                <Text style={styles.emptySearchText}>
                                    No Bridge Services match "{searchText.trim()}".
                                </Text>
                            </View>
                        )}
                    </> : <>
                       <View style={{height : Dimensions.get('screen').height - 120}}>
                         <NoData  />
                       </View>
                    </>
                }
            </ScrollView>
            {
                services.length > 0 && selectedBridge && <TouchableOpacity
                    onPress={() => {
                        handleLinkAbha()
                    }}
                    style={{
                        height: 46,
                        width: '92%',
                        backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                        borderRadius: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 10,
                        marginLeft: 14
                    }}>
                    <Text style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: '600'
                    }}>Generate Token</Text>
                </TouchableOpacity>
            }

            <Modal
                visible={isAddHelpVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsAddHelpVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Add Bridge Service</Text>
                        <Text style={styles.modalDescription}>
                            New ABDM Bridge/HIP/HIU services must be registered and approved in the ABDM portal. This app cannot create an ABDM service directly.
                        </Text>
                        <Text style={styles.modalStep}>
                            1. Complete service registration and approval in the ABDM portal.
                        </Text>
                        <Text style={styles.modalStep}>
                            2. Configure the service callback URL there and make sure it points to your public HTTPS server.
                        </Text>
                        <Text style={styles.modalStep}>
                            3. Return here and refresh the list. The service will appear once ABDM makes it available.
                        </Text>
                        <TouchableOpacity
                            accessibilityRole="button"
                            disabled={isRefreshing}
                            onPress={handleRefreshServices}
                            style={[
                                styles.refreshButton,
                                isRefreshing && styles.disabledButton,
                            ]}
                        >
                            <MaterialIcons
                                name="refresh"
                                size={20}
                                color="#FFFFFF"
                            />
                            <Text style={styles.refreshButtonText}>
                                {isRefreshing ? "Refreshing..." : "Refresh Services"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessibilityRole="button"
                            onPress={() => setIsAddHelpVisible(false)}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default BridgeServices

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F7FA",

    },
    selectedCard: {
        borderWidth: 2,
        borderColor: "#1565C0",
        backgroundColor: "#EAF4FF",
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
        borderRadius: 8,
    },

    leftContainer: {
        flexDirection: "row",
        flex: 1,
    },

    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 12,
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    content: {
        flex: 1,
    },

    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#212121",
    },

    subtitle: {
        marginTop: 4,
        fontSize: 13,
        color: "#616161",
    },

    badgeRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },

    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 6,
    },

    badgeText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: "600",
        color: "#424242",
    },
    emptySearchResults: {
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 36,
    },
    emptySearchText: {
        color: "#616161",
        fontSize: 14,
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 20,
    },
    modalCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        color: "#212121",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 10,
    },
    modalDescription: {
        color: "#424242",
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 14,
    },
    modalStep: {
        color: "#424242",
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    refreshButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
        borderRadius: 6,
        padding: 12,
        marginTop: 12,
    },
    refreshButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 8,
    },
    disabledButton: {
        opacity: 0.6,
    },
    cancelButton: {
        alignItems: "center",
        padding: 12,
        marginTop: 4,
    },
    cancelButtonText: {
        color: "#616161",
        fontSize: 15,
        fontWeight: "600",
    },
})