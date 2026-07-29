import React, { useState } from "react";
import { FlatList } from "react-native";

import FilterTabs from "./components/FilterTabs";
import ConsentCard from "./components/ConsentCard";

const filters = [
  {
    id: "granted",
    title: "Granted",
  },
  {
    id: "expired",
    title: "Expired",
  },
  {
    id: "revoked",
    title: "Revoked",
  },
];

const dummyData = [
  {
    id: "1",
    hospitalName: "Apollo Hospital",
    requester: "Dr. Rajesh Sharma",
    purpose: "Medical Records Access",
    requestDate: "20 Jul 2026",
    expiryDate: "20 Aug 2026",
    status: "Granted",
  },
  {
    id: "2",
    hospitalName: "Civil Hospital",
    requester: "Dr. Amit Patel",
    purpose: "Lab Reports",
    requestDate: "18 Jul 2026",
    expiryDate: "18 Aug 2026",
    status: "Granted",
  },
  {
    id: "3",
    hospitalName: "Sterling Hospital",
    requester: "Dr. Neha Shah",
    purpose: "Prescription History",
    requestDate: "15 Jul 2026",
    expiryDate: "15 Aug 2026",
    status: "Granted",
  },
];

export default function ApprovedTab() {
  const [selected, setSelected] =
    useState("granted");

  return (
    <FlatList
      data={dummyData}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      ListHeaderComponent={
        <FilterTabs
          data={filters}
          selected={selected}
          onChange={setSelected}
        />
      }
      renderItem={({ item }) => (
        <ConsentCard
          hospitalName={item.hospitalName}
          requester={item.requester}
          purpose={item.purpose}
          requestDate={item.requestDate}
          expiryDate={item.expiryDate}
          status={
            item.status as
              | "Granted"
              | "Expired"
              | "Revoked"
          }
          isRequest={false}
          onView={() =>
            console.log("View Details")
          }
        />
      )}
    />
  );
}