import { ScrollView, StyleSheet, Text, View } from 'react-native'

import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import TopTabs from "./components/TopTabs";
import RequestsTab from "./RequestsTab";
import ApprovedTab from "./ApprovedTab";
import { ERP_COLOR_CODE } from '../../../utils/constants';
import Header from '../../Components/Header';

export default function ConsentsScreen() {
    const [selectedTab, setSelectedTab] =
        useState<"requests" | "approved">("requests");

    return (

        <SafeAreaView style={[styles.container, {
            backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR
        }]}>


            <ScrollView
                stickyHeaderIndices={[0,1]}
                showsVerticalScrollIndicator={false}
                bounces={false}
                style={{
                    backgroundColor: '#F5F7FA'
                }}
            >
                <Header title="ABHA Details" isMenu={false} isSearch={false} isShare={true} handleShare={() => {

                }} />
                <TopTabs
                    value={selectedTab}
                    onChange={setSelectedTab}
                />

                {selectedTab === "requests" ? (
                    <RequestsTab />
                ) : (
                    <ApprovedTab />
                )}
            </ScrollView>




        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F7FA",

    },
})