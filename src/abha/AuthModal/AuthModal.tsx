import { Animated, Image, Modal, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react'
import { ERP_COLOR_CODE } from '../../utils/constants';
import { useBaseLink } from '../../hooks/useBaseLink';
import {
    useNavigation,
} from "@react-navigation/native";
import { styles } from '../../screens/dashboard/list_page/list_page_style';
const AuthModal = ({
    selectedLoginType,
    setSelectedLoginType,
    showLoginSheet,
    setShowLoginSheet,
    confirmation,
    setConfirmation,
    selected,
    bottomSheetType,
    setBottomSheetType,
    setShowInfoModal,
    setSelected, closeSheet,
    sheetTranslateY,
    isForceAuth = false,
    lastUpdate = ''
}: any) => {
    const navigation = useNavigation();

    const loginOptions = [
        'Mobile Number',
        'Aadhaar Number',
        'ABHA Number',
        'ABHA Address'
    ];

    const registerOptions = [
        'Aadhaar Number',
    ];
    const baseLink = useBaseLink();
    const optionList = isForceAuth ? loginOptions : bottomSheetType === 'Login' ? loginOptions : registerOptions;
    const sheetAnim = useRef(new Animated.Value(400)).current;


    const handleContinue = () => {
        if (!selected) return;
        if (selected === "yes") {
            setBottomSheetType('Login')
        } else {
            setBottomSheetType('Register')
        }
        setConfirmation(true)
    };


    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) =>
                gesture.dy > 5,

            onPanResponderMove: (_, gesture) => {
                if (gesture.dy > 0) {
                    sheetAnim.setValue(gesture.dy);
                }
            },

            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy > 120) {
                    closeSheet();
                } else {
                    Animated.spring(sheetAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        }),
    ).current;


    return (
        <Modal
            transparent
            visible={showLoginSheet}
            animationType="none"
        >
            <TouchableOpacity
                activeOpacity={1}
                style={styles.backdrop}
                onPress={closeSheet}
            />

            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    styles.bottomSheet,
                    {
                        transform: [
                            {
                                translateY: sheetTranslateY,
                            },
                        ],
                    },
                    confirmation && bottomSheetType !== 'Login' && {
                        height: '46%'
                    },
                    confirmation && bottomSheetType === 'Login' && {
                        height: '64%'
                    }
                ]}
            >

                <View style={styles.logo}>
                    <Image
                        source={{
                            uri: `${baseLink}fileupload/1/InvoiceByConfig/1/logo.jpg`,
                        }}
                        style={{
                            top: 5,
                            height: 60, width: 80, alignSelf: 'center'
                        }}
                        resizeMode="contain"
                    />
                </View>

                {
                    confirmation ? <>
                        <View style={{ height: 14 }} />
                        <Text style={styles.sheetTitle}>
                            {bottomSheetType === 'Login' ? 'Login To Your ABHA' : 'Create ABHA number using'}
                        </Text>

                        <Text style={{
                            color: 'gray',
                            marginBottom: 12
                        }}>
                            {
                                bottomSheetType === 'Login' ? 'Select a login method to access your ABHA account.' : 'Please choose one of the below option to start with the creation of your ABHA'
                            }
                        </Text>
                        {
                            isForceAuth && <View style={{ marginBottom: 8 }}>
                                <Text>Fetch updated data - last updated : {lastUpdate}</Text>
                            </View>
                        }


                        {optionList.map(item => {
                            const selected =
                                selectedLoginType === item;

                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.optionRow,
                                        selected &&
                                        {
                                            borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                                            backgroundColor: "#f6f1ed",
                                        },
                                    ]}
                                    onPress={() => {
                                        setSelectedLoginType(item)

                                    }}
                                >
                                    <View
                                        style={[
                                            styles.radioOuter,
                                            selected &&
                                            {
                                                borderColor: ERP_COLOR_CODE.ERP_APP_COLOR
                                            },
                                        ]}
                                    >
                                        {selected && (
                                            <View
                                                style={styles.radioInner}
                                            />
                                        )}
                                    </View>

                                    <Text
                                        style={styles.optionText}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity
                            disabled={!selectedLoginType}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR
                                },
                                !selectedLoginType && styles.disabledButton,
                            ]}
                            onPress={() => {
                                if (selectedLoginType === 'Driving Licence') {
                                    setShowLoginSheet(false)
                                    setShowInfoModal(true)
                                    return;
                                }
                                setTimeout(() => {
                                    setShowLoginSheet(false)
                                    navigation.navigate("RegistrationAbha", {
                                        loginType: selectedLoginType,
                                        isFromRegister: bottomSheetType === 'Login' ? false : true
                                    })
                                })
                                setShowLoginSheet(false);
                                setConfirmation(false)
                                setSelected(null)
                            }}
                        >
                            <Text style={styles.buttonText}>
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </> : <>
                        <Text style={styles.title}>
                            Do you already have ABHA?
                        </Text>

                        <Text style={styles.subtitle}>
                            Select one option to continue patient registration
                        </Text>


                        <View style={styles.flowContainer}>

                            <TouchableOpacity
                                style={[
                                    styles.option,
                                    selected === "yes" && {
                                        borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                                        backgroundColor: "#f6f1ed",
                                    },
                                ]}
                                onPress={() => setSelected("yes")}
                            >

                                <View
                                    style={[
                                        styles.radioOuter,
                                        selected === "yes" &&
                                        {
                                            borderColor: ERP_COLOR_CODE.ERP_APP_COLOR
                                        },
                                    ]}
                                >
                                    {selected === "yes" && (
                                        <View
                                            style={styles.radioInner}
                                        />
                                    )}
                                </View>

                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.optionTitle}>
                                        Yes, I have ABHA
                                    </Text>

                                    <Text style={styles.optionDesc}>
                                        Verify existing ABHA and fetch profile
                                    </Text>
                                </View>

                            </TouchableOpacity>


                            {/* Connector */}
                            <View style={styles.connector} />


                            <TouchableOpacity
                                style={[
                                    styles.option,
                                    selected === "no" && {
                                        borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                                        backgroundColor: "#f6f1ed",
                                    }, ,
                                ]}
                                onPress={() => setSelected("no")}
                            >
                                <View
                                    style={[
                                        styles.radioOuter,
                                        selected === "no" &&
                                        {
                                            borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                                        }, ,
                                    ]}
                                >
                                    {selected === "no" && (
                                        <View
                                            style={styles.radioInner}
                                        />
                                    )}
                                </View>

                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.optionTitle}>
                                        No, Create ABHA
                                    </Text>

                                    <Text style={styles.optionDesc}>
                                        Create new ABHA using Aadhaar OTP
                                    </Text>
                                </View>

                            </TouchableOpacity>

                        </View>


                        <TouchableOpacity
                            disabled={!selected}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
                                },
                                !selected && styles.disabledButton,
                            ]}
                            onPress={handleContinue}
                        >
                            <Text style={styles.buttonText}>
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </>
                }
            </Animated.View>
        </Modal>
    )
}

export default AuthModal
