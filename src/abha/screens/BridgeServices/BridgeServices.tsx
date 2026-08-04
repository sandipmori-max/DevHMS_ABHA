import { SafeAreaView, ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { ERP_COLOR_CODE } from '../../../utils/constants'
import Header from '../../Components/Header'
import MaterialIcons from '@react-native-vector-icons/material-icons'
import { useGenerateLinkTokenMutation } from '../../redux/api/linkAbhaApi'
import { useCreateSessionMutation } from '../../redux/api/sessionApi'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice'
import { setSelectedXCMID } from '../../redux/slices/abhaSlice'
import { showToast } from '../../utils/toast'
import { useNavigation } from "@react-navigation/native";
import NoData from '../../../components/no_data/NoData'

const BridgeServices = ({ route }: any) => {
    const navigation = useNavigation();

    const { bridgeServices, abhaDetail } = route.params || {};
    const [selectedBridge, setSelectedBridge] = useState<any>(null);
    const dispatch = useDispatch();
    const [generateLinkToken, { isLoading }] =
        useGenerateLinkTokenMutation();
    const [
        createSession
    ] = useCreateSessionMutation();

    const getValue = (fieldName: any) => {
        if (abhaDetail.length === 0) {
            return;
        }
        const fieldMap = Object.fromEntries(
            abhaDetail.map(item => [item.field, item.text])
        );
        return fieldMap[fieldName];
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
            dispatch(showLoader())
            await createSession()
                .unwrap();

            console.log("getValue(abhanumber)", getValue("abhanumber"))
            const payload = {
                abhaNumber: Number(
                    String(getValue('abhanumber')).replace(/-/g, '')
                ),
                abhaAddress: getValue('preferredabhaaddress'),
                name: `${getValue("firstname")} ${getValue("middlename")} ${getValue("lastname")}`,
                gender: getValue('gender'),
                yearOfBirth: Number(formatDate(getValue("dob")).split("/").pop()),
            };

            console.log(
                '========== GENERATE LINK TOKEN PAYLOAD =========='
            );
            console.log(
                JSON.stringify(payload, null, 2)
            );

            const response = await generateLinkToken(payload).unwrap();

            console.log(
                '========== GENERATE LINK TOKEN RESPONSE =========='
            );
            console.log(
                JSON.stringify(response, null, 2)
            );

            console.log('Link Token =>', response);
            dispatch(hideLoader())
            navigation.navigate("LinkCareContext", {
                abhaDetail: abhaDetail
            })

        } catch (e) {
            dispatch(hideLoader())
            console.log('Link ABHA Error =>', e);
        }
    };


    const renderItem = ({ item }) => {
        const isSelected = selectedBridge?.id === item.id;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    dispatch(setSelectedXCMID(item?.id))
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
                        {item.name}
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
                    isShare={false}
                    handleShare={() => {

                    }} />

                {
                    bridgeServices?.services.length > 0 ? <>
                        <FlatList
                            data={bridgeServices?.services ?? []}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            ListFooterComponent={<View style={{ height: 100 }} />}

                        />
                    </> : <>
                       <View style={{height : Dimensions.get('screen').height - 120}}>
                         <NoData  />
                       </View>
                    </>
                }


            </ScrollView>
            {
                bridgeServices?.services.length > 0 && selectedBridge && <TouchableOpacity
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
})