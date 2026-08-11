import React, { useState } from "react";
import { FlatList } from "react-native";

import FilterTabs from "./components/FilterTabs";
import ConsentCard from "./components/ConsentCard";

const filters = [
  {
    id: "all",
    title: "All",
  },
  {
    id: "pending",
    title: "Pending",
    badge: 8,
  },
  {
    id: "denied",
    title: "Denied",
  },
  {
    id: "expired",
    title: "Expired",
  },
];

const dummyData = [
  {
    id: "1",
    hospitalName: "Apollo Hospital",
    requester: "Dr. Rajesh Sharma",
    purpose: "Medical Records Access",
    requestDate: "29 Jul 2026",
    expiryDate: "05 Aug 2026",
    status: "Pending",
  },
  {
    id: "2",
    hospitalName: "Civil Hospital",
    requester: "Dr. Amit Patel",
    purpose: "Treatment History",
    requestDate: "28 Jul 2026",
    expiryDate: "04 Aug 2026",
    status: "Pending",
  },
  {
    id: "3",
    hospitalName: "Sterling Hospital",
    requester: "Dr. Neha Shah",
    purpose: "Diagnostic Reports",
    requestDate: "27 Jul 2026",
    expiryDate: "03 Aug 2026",
    status: "Pending",
  },
];

export default function RequestsTab() {
  const [selected, setSelected] = useState("pending");

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
          status={item.status as "Pending"}
          isRequest
          onApprove={() => console.log("Approved")}
          onReject={() => console.log("Denied")}
        />
      )}
    />
  );
}