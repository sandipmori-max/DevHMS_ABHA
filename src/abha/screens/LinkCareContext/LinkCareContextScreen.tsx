import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList,
    Platform,

} from 'react-native';
import { ERP_COLOR_CODE } from '../../../utils/constants';
import { useNavigation } from "@react-navigation/native";
import Header from '../../Components/Header';
import { useLinkCareContextMutation } from '../../redux/api/linkCareContextApi';
import { showToast } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateSessionMutation } from '../../redux/api/sessionApi';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';

const patient = {
    name: 'Sandip Test Test',
    abhaNumber: '91-7461-4088-9874',
    abhaAddress: 'varun2001@sbx',
    dob: '26 Jun 1999',
    gender: 'Male',
    patientId: 'PUID-00011',
};

interface CareContextItem {
    referenceNumber: string;
    display: string;
    hiType: string;
}

const LinkCareContextScreen = ({ route }: any) => {
    const { abhaDetail } = route.params || {};


    const baseURL = useSelector((state: any) => state.auth.user?.companyLink)
    const baseUrl = baseURL.substring(0, baseURL.lastIndexOf("/") + 1);
    const url = new URL(baseUrl).origin;
  const dispatch = useDispatch();

    const [linkCareContext, { isLoading }] =
        useLinkCareContextMutation();
    const [
            createSession
        ] = useCreateSessionMutation();

    const navigation = useNavigation();
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const careContextList = [
        {
            referenceNumber: 'c7e95611-3d63-41bb-bd90-d11d0b1cb0b2',
            display: 'ABC ',
            hiType: 'Prescription',
        },
        {
            referenceNumber: '8dd392ae-f94d-4b47-a08f-bbc07afdaae7',
            display: 'DEF ',
            hiType: 'Prescription',
        },
        {
            referenceNumber: '711bd3a2-7b44-433c-95fe-8b5a67673089',
            display: 'GHI ',
            hiType: 'Prescription',
        },
        {
            referenceNumber: '711bd3a2-7b44-433c-95fe-8b5a67673088',
            display: 'JKL req',
            hiType: 'DiagnosticReport',
        },
    ];


    const getValue = (fieldName: any) => {
        if (abhaDetail.length === 0) {
            return;
        }
        const fieldMap = Object.fromEntries(
            abhaDetail.map(item => [item.field, item.text])
        );
        return fieldMap[fieldName];
    };

    const buildPayload = (
        selectedItems: CareContextItem[],
        patient: {
            abhaNumber: string;
            abhaAddress: string;
            patientId: string;
        },
    ) => {
        const grouped: Record<string, CareContextItem[]> = {};

        // Group by hiType
        selectedItems.forEach(item => {
            if (!grouped[item.hiType]) {
                grouped[item.hiType] = [];
            }

            grouped[item.hiType].push(item);
        });

        return {
            abhaNumber: patient.abhaNumber.replace(/-/g, ''),
            abhaAddress: patient.abhaAddress,

            patient: Object.entries(grouped).map(
                ([hiType, records]) => ({
                    referenceNumber: patient.patientId,
                    display: patient.patientId,

                    careContexts: records.map(record => ({
                        referenceNumber: record.referenceNumber,
                        display: record.display,
                    })),

                    hiType,
                    count: records.length,
                }),
            ),
        };
    };

    const toggleRecord = (id: string) => {
        setSelectedRecords(prev => {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id);
            }

            return [...prev, id];
        });
    };

    const toggleSelection = (item: any) => {
        setSelectedIds(prev => {
            if (prev.includes(item.referenceNumber)) {
                return prev.filter(
                    id => id !== item.referenceNumber,
                );
            }

            return [...prev, item.referenceNumber];
        });
    };




    const onLinkCareContext = async () => {

        if (!selectedIds) {
            showToast('error', 'Care contexts', 'Please select one')
            return;
        }
         dispatch(showLoader())
        const selectedItems = careContextList.filter(item =>
            selectedIds.includes(item.referenceNumber),
        );

        const payload = buildPayload(selectedItems, {
            abhaNumber: getValue("abhanumber"),
            abhaAddress: getValue("preferredabhaaddress"),
            patientId: getValue("patientabhaid"),
        });

        console.log(
            '========== LINK CARE CONTEXT PAYLOAD =========='
        );

        console.log(
            JSON.stringify(payload, null, 2),
        );
        await createSession()
            .unwrap();
        const response = await linkCareContext(payload).unwrap();

        console.log(
            'Link CareContext Response =>',
            response,
        );

         dispatch(hideLoader())
    };

    const formatDate = (date: string) => {
        if (!date) return "-";

        return date.split(" ")[0];
    };
    return (
        <SafeAreaView style={[styles.container, {
            backgroundColor :ERP_COLOR_CODE.ERP_APP_COLOR
        }]}>
            {/* Header */}

            <ScrollView
                stickyHeaderIndices={[0]}
                showsVerticalScrollIndicator={false}
                bounces={false}
                style={{
          backgroundColor: '#F5F7FA'
        }}
                contentContainerStyle={{
                    paddingBottom: 40,
                }}>

                <Header title="Link Care Context"
                    isMenu={false}
                    isSearch={false}
                    isShare={false}
                    handleShare={() => {

                    }} />

                {/* Patient Card */}

                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>
                        👤 Patient Details
                    </Text>

                    <View style={styles.topRow}>

                         

                        <View style={{ flex: 1 }}>

                            <View style={styles.nameRow}>
                                <Text style={styles.name}>
                                    {getValue("firstname")} {getValue("middlename")} {getValue("lastname")}
                                </Text>
                            </View>

                            {/* {detailRow(
                                'ABHA No.',
                                patient.abhaNumber,
                            )} */}

                            {/* {detailRow(
                                'ABHA Ad.',
                                patient.abhaAddress,
                            )} */}

                            {detailRow(
                                'Date of Birth',
                                formatDate(getValue("dob")),
                            )}

                            {detailRow(
                                'Gender',
                                getValue("gender"),
                            )}

                            {detailRow(
                                'Patient ID',
                                getValue("patientabhaid")
                            )}

                        </View>
                    </View>

                </View>

                {/* <View style={styles.card}>

                    <View style={styles.titleRow}>

                        <Text style={styles.sectionTitle}>
                            📑 Select Health Records
                        </Text>

                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>
                                {selectedRecords.length} Selected
                            </Text>
                        </View>

                    </View>

                    <Text style={styles.smallText}>
                        Choose the records that will be linked with
                        patient's ABHA.
                    </Text>

                    <FlatList
                        data={records}
                        scrollEnabled={false}
                        keyExtractor={item => item.id}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 12 }} />
                        )}
                        renderItem={({ item }) => {
                            const checked =
                                selectedRecords.includes(item.id);

                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.recordCard}
                                    onPress={() =>
                                        toggleRecord(item.id)
                                    }>

                                    <View
                                    >

                                        <MaterialIcons
                                            name={checked ? 'check-box' : 'check-box-outline-blank'}
                                            size={20}
                                            color={checked ? 'blue' : '#ccc'}
                                        />



                                    </View>

                                    <View style={styles.fileIcon}>
                                        <Text style={{ fontSize: 16 }}>
                                            📄
                                        </Text>
                                    </View>

                                    <View style={{ flex: 1 }}>

                                        <Text style={styles.recordTitle}>
                                            {item.display}
                                        </Text>

                                        <Text style={styles.reference}>
                                            {item.referenceNumber}
                                        </Text>

                                    </View>

                                    <View style={styles.typeBadge}>
                                        <Text style={styles.typeText}>
                                            {item.hiType}
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            );
                        }}
                    />

                </View> */}

                {/* ===================== Care Context ===================== */}

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialIcons
                            name="medical-services"
                            size={22}
                            color="#5B2EFF"
                        />

                        <Text style={styles.cardTitle}>
                            Care Contexts
                        </Text>
                    </View>

                    <Text style={styles.sectionDescription}>
                        Select one or more records that you want to
                        link with this patient's ABHA.
                    </Text>

                    <FlatList
                        data={careContextList}
                        keyExtractor={(item) => item.referenceNumber}
                        scrollEnabled={false}
                        renderItem={({ item }) => {
                            const selected = selectedIds.includes(
                                item.referenceNumber,
                            );

                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.recordCard}
                                    onPress={() =>
                                        toggleSelection(item)
                                    }>

                                    <View
                                    >

                                        <MaterialIcons
                                            name={selected ? 'check-box' : 'check-box-outline-blank'}
                                            size={20}
                                            color={selected ? 'blue' : '#ccc'}
                                        />



                                    </View>

                                    <View style={styles.fileIcon}>
                                        <Text style={{ fontSize: 16 }}>
                                            📄
                                        </Text>
                                    </View>

                                    <View style={{ flex: 1 }}>

                                        <Text style={styles.recordTitle}>
                                            {item.display}
                                        </Text>

                                        <Text style={styles.reference}>
                                            {item.referenceNumber}
                                        </Text>

                                    </View>

                                    <View style={styles.typeBadge}>
                                        <Text style={styles.typeText}>
                                            {item.hiType}
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>


            </ScrollView>

            <TouchableOpacity
                style={{
                    height: 46,
                    width: '92%',
                    backgroundColor: selectedIds.length === 0 ? '#ccc' : ERP_COLOR_CODE.ERP_APP_COLOR,
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 0,
                    marginLeft: 14,
                    flexDirection: 'row'
                }}
                activeOpacity={0.8}
                disabled={selectedIds.length === 0}
                onPress={onLinkCareContext}
            >
                <MaterialIcons
                    name="link"
                    size={22}
                    color="#FFF"
                />

                <Text style={styles.linkButtonText}>
                    Link Care Context
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const detailRow = (
    title: string,
    value: string,
) => (
    <View style={styles.detailRow}>
        <Text style={styles.label}>
            {title}
        </Text>

        <Text style={styles.value}>
            {value}
        </Text>
    </View>
);

export default LinkCareContextScreen;

const PRIMARY = '#5B2EFF';

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F4F7FC',
    },

    header: {
        height: 60,
        backgroundColor: PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        elevation: 5,
    },

    headerTitle: {
        color: '#FFF',
        fontSize: 21,
        fontWeight: '700',
    },

    headerIcon: {
        color: '#FFF',
        fontSize: 24,
    },

    card: {
        backgroundColor: '#FFF',
        margin: 15,
        borderRadius: 18,
        padding: 10,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: PRIMARY,
        marginBottom: 18,
    },

    topRow: {
        flexDirection: 'row',
    },

    avatar: {
        width: 88,
        height: 88,
        borderRadius: 8,
        marginRight: 15,
    },

    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom : 14
    },

    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#222',
        flex: 1,
    },

    kycBadge: {
        backgroundColor: '#E7F9EC',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 30,
    },

    kycText: {
        color: '#28A745',
        fontWeight: '700',
        fontSize: 13,
    },

    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderColor: '#ECECEC',
    },

    label: {
        color: '#666',
        fontSize: 15,
    },

    value: {
        color: '#222',
        fontWeight: '600',
        fontSize: 15,
        maxWidth: '55%',
        textAlign: 'right',
    },

    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    smallText: {
        color: '#666',
        marginBottom: 18,
        fontSize: 14,
    },

    countBadge: {
        backgroundColor: '#ECE8FF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },

    countText: {
        color: '#5B2EFF',
        fontWeight: '700',
    },

    recordCard: {
        borderRadius: 8,
        padding: 8,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 4
    },

    checkbox: {
        width: 14,
        height: 14,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#BBB',
        justifyContent: 'center',
        alignItems: 'center',
    },

    checkboxSelected: {
        backgroundColor: '#5B2EFF',
        borderColor: '#5B2EFF',
    },

    fileIcon: {
        width: 34,
        height: 34,
        borderRadius: 2,
        backgroundColor: '#F2EEFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 14,
    },

    recordTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#222',
    },

    reference: {
        marginTop: 5,
        color: '#666',
        fontSize: 13,
    },

    typeBadge: {
        backgroundColor: '#EFE9FF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },

    typeText: {
        color: '#5B2EFF',
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 8,
        marginTop: 16,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        marginLeft: 10,
    },

    sectionDescription: {
        color: '#777',
        fontSize: 13,
        marginBottom: 14,
    },

    contextCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E6E6E6',
    },

    contextCardSelected: {
        borderColor: '#5B2EFF',
        backgroundColor: '#F4F0FF',
    },

    contextTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },

    contextRef: {
        color: '#777',
        marginTop: 5,
        fontSize: 12,
    },

    contextType: {
        marginTop: 6,
        alignSelf: 'flex-start',
        backgroundColor: '#EEF4FF',
        color: '#2563EB',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        fontWeight: '600',
        fontSize: 12,
    },

    linkButton: {
        height: 55,
        margin: 16,
        borderRadius: 14,
        backgroundColor: '#5B2EFF',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 4,
    },

    linkButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 17,
        marginLeft: 10,
    },

    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    loadingText: {
        marginTop: 12,
        fontWeight: '600',
        color: '#5B2EFF',
    },
});