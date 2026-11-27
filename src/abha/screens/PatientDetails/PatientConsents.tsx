import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useAppDispatch } from "../../../store/hooks";
import { getERPListDataThunk } from "../../../store/slices/auth/thunk";
import { ERP_COLOR_CODE } from "../../../utils/constants";
import {
  getERPField as getField,
  matchesERPPatient,
  normalizeERPKey,
  parseERPListRows,
  type ERPRecord,
} from "../../utils/erpRecords";
import { getErrorMessage } from "../../utils/helpers";
import { showToast } from "../../utils/toast";
import ConsentCard from "../Consents/components/ConsentCard";
import FilterTabs from "../Consents/components/FilterTabs";
import TopTabs from "../Consents/components/TopTabs";

type ConsentRecord = ERPRecord;
type ConsentSection = "requests" | "approved";

interface PatientConsentsProps {
  patientId?: string;
  abhaDetail: Array<{ field: string; text: string }>;
}

const REQUEST_FILTERS = [
  { id: "all", title: "All" },
  { id: "pending", title: "Pending" },
  { id: "denied", title: "Denied" },
  { id: "expired", title: "Expired" },
];

const APPROVED_FILTERS = [
  { id: "all", title: "All" },
  { id: "granted", title: "Granted" },
  { id: "expired", title: "Expired" },
  { id: "revoked", title: "Revoked" },
];

const normalizeStatus = (value: unknown) =>
  String(value ?? "").trim().toUpperCase();

const displayStatus = (value: unknown) => {
  switch (normalizeStatus(value)) {
    case "PENDING":
    case "REQUESTED":
      return "Pending";
    case "GRANTED":
    case "APPROVED":
      return "Granted";
    case "DENIED":
      return "Denied";
    case "EXPIRED":
      return "Expired";
    case "REVOKED":
      return "Revoked";
    case "FAILED":
      return "Failed";
    default:
      return "Pending";
  }
};

const formatDate = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) {
    return "-";
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString();
};

const dedupeRequests = (rows: ConsentRecord[]) => {
  const latestByRequestId = new Map<string, { row: ConsentRecord; updatedAt: number }>();
  const uniqueRows: ConsentRecord[] = [];

  rows.forEach(row => {
    const requestId = String(getField(row, ["requestid"]) ?? "").trim();
    if (!requestId) {
      uniqueRows.push(row);
      return;
    }

    const updatedAt = Date.parse(String(
      getField(row, ["decisionat"]) ||
      getField(row, ["crcreatedat"]) ||
      getField(row, ["createdat"]) ||
      "",
    )) || 0;
    const previous = latestByRequestId.get(requestId);
    if (!previous || updatedAt >= previous.updatedAt) {
      latestByRequestId.set(requestId, { row, updatedAt });
    }
  });

  const originalOrder = new Map(
    rows.map((row, index) => [
      String(getField(row, ["requestid"]) ?? "").trim() || `row-${index}`,
      index,
    ]),
  );
  const latestRows = [...latestByRequestId.entries()]
    .map(([requestId, value]) => ({
      requestId,
      row: value.row,
      order: originalOrder.get(requestId) ?? Number.MAX_SAFE_INTEGER,
    }))
    .sort((left, right) => left.order - right.order)
    .map(({ row }) => row);

  return [...uniqueRows, ...latestRows];
};

const PatientConsents: React.FC<PatientConsentsProps> = ({
  patientId,
  abhaDetail,
}) => {
  const dispatch = useAppDispatch();
  const [section, setSection] = useState<ConsentSection>("requests");
  const [requestFilter, setRequestFilter] = useState("all");
  const [approvedFilter, setApprovedFilter] = useState("all");
  const [requests, setRequests] = useState<ConsentRecord[]>([]);
  const [artefacts, setArtefacts] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProfileValue = useCallback((fieldName: string) => {
    const normalized = normalizeERPKey(fieldName);
    return (
      abhaDetail.find(item => normalizeERPKey(item.field) === normalized)?.text ??
      ""
    ).trim();
  }, [abhaDetail]);

  const address =
    getProfileValue("preferredabhaaddress") ||
    getProfileValue("abhaaddress");
  const abhaNumber = getProfileValue("abhanumber").replace(/\D/g, "");
  const patientReferences = [
    String(patientId ?? "").trim(),
    getProfileValue("patientabhaid"),
  ];

  const loadConsents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [requestResponse, artefactResponse] = await Promise.all([
        dispatch(getERPListDataThunk({
          page: "ConsentRequest",
          fromDate: "",
          toDate: "",
          param: "",
          branch: "",
        })).unwrap(),
        dispatch(getERPListDataThunk({
          page: "ConsentArtefact",
          fromDate: "",
          toDate: "",
          param: "",
          branch: "",
        })).unwrap(),
      ]);

      const requestRows = dedupeRequests(
        parseERPListRows(requestResponse, "consent").filter(row =>
          matchesERPPatient(row, { address, abhaNumber, patientReferences }),
        ),
      );
      const artefactRows = parseERPListRows(artefactResponse, "consent").filter(row =>
        matchesERPPatient(row, { address, abhaNumber, patientReferences }),
      );
      setRequests(requestRows);
      setArtefacts(artefactRows);
    } catch (loadError) {
      const message = getErrorMessage(loadError);
      setError(message);
      showToast("error", "Consent List Failed", message);
    } finally {
      setIsLoading(false);
    }
  }, [abhaNumber, address, dispatch, patientReferences.join("|")]);

  useEffect(() => {
    void loadConsents();
  }, [loadConsents]);

  const requestRecords = useMemo(() => {
    if (requestFilter === "all") {
      return requests;
    }
    return requests.filter(row => {
      const status = displayStatus(getField(row, ["status"])).toLowerCase();
      return status === requestFilter;
    });
  }, [requestFilter, requests]);

  const approvedRecords = useMemo(() => {
    const requestById = new Map(
      requests.map(request => [
        String(getField(request, ["requestid"]) ?? ""),
        request,
      ]),
    );
    const joined = artefacts.map(artefact => {
      const requestId = String(getField(artefact, ["requestid"]) ?? "");
      return {
        artefact,
        request: requestById.get(requestId),
      };
    });

    return joined.filter(({ artefact }) =>
      approvedFilter === "all" ||
      displayStatus(getField(artefact, ["status"])).toLowerCase() ===
        approvedFilter,
    );
  }, [approvedFilter, artefacts, requests]);

  const renderRecord = (
    record: ConsentRecord,
    request?: ConsentRecord,
    isRequest = true,
  ) => {
    const parent = request ?? record;
    const hiuId = String(getField(parent, ["hiuid"]) ?? "").trim();
    const serviceName = String(getField(parent, ["hiuname", "servicename"]) ?? "").trim();
    const purpose = String(
      getField(parent, ["purposetext", "purpose", "purposecode"]) ?? "",
    ).trim();
    const status = displayStatus(getField(record, ["status"]));
    const artefactIds = getField(record, ["consentartefactids"]);
    let firstArtefactId = "";
    if (typeof artefactIds === "string") {
      firstArtefactId = artefactIds.trim();
      try {
        const parsedIds: unknown = JSON.parse(artefactIds);
        if (Array.isArray(parsedIds)) {
          firstArtefactId = String(parsedIds.find(Boolean) ?? "");
        }
      } catch {
        firstArtefactId = artefactIds.trim();
      }
    }
    const id = String(
      getField(record, ["consentartefactid"]) ||
      firstArtefactId ||
      getField(record, ["consentrequestid", "requestid", "crid", "caid"]) ||
      "",
    );

    return (
      <ConsentCard
        key={`${isRequest ? "request" : "artefact"}-${id}`}
        hospitalName={serviceName || (hiuId ? `HIU ${hiuId}` : "Health service")}
        requester={String(
          getField(parent, ["patientname", "abhaaddress"]) ?? "Patient",
        )}
        purpose={purpose || "Consent for health information"}
        requestDate={formatDate(
          getField(parent, ["crcreatedat", "createdat", "cacreatedat", "receivedat"]),
        )}
        expiryDate={formatDate(getField(parent, ["dateto", "dataeraseat"]))}
        expiryLabel="Data range through"
        requesterLabel="Patient"
        status={status}
        referenceId={id}
        isRequest={isRequest}
      />
    );
  };

  const visibleRecords = section === "requests" ? requestRecords : approvedRecords;

  return (
    <View style={{ paddingTop: 12, paddingBottom: 24 }}>
      <TopTabs value={section} onChange={setSection} />
      <FilterTabs
        data={section === "requests" ? REQUEST_FILTERS : APPROVED_FILTERS}
        selected={section === "requests" ? requestFilter : approvedFilter}
        onChange={section === "requests" ? setRequestFilter : setApprovedFilter}
      />

      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => void loadConsents()}
          disabled={isLoading}
          style={{
            alignSelf: "flex-end",
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
          }}
        >
          <MaterialIcons
            name="refresh"
            size={18}
            color={ERP_COLOR_CODE.ERP_APP_COLOR}
          />
          <Text style={{ color: ERP_COLOR_CODE.ERP_APP_COLOR, marginLeft: 4 }}>
            Refresh
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator
          color={ERP_COLOR_CODE.ERP_APP_COLOR}
          style={{ marginVertical: 36 }}
        />
      ) : error && requests.length === 0 && artefacts.length === 0 ? (
        <View style={{ alignItems: "center", padding: 24 }}>
          <Text style={{ color: "#667085", textAlign: "center" }}>{error}</Text>
          <TouchableOpacity
            onPress={() => void loadConsents()}
            style={{ padding: 12 }}
          >
            <Text style={{ color: ERP_COLOR_CODE.ERP_APP_COLOR, fontWeight: "700" }}>
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      ) : visibleRecords.length === 0 ? (
        <Text style={{ color: "#667085", textAlign: "center", padding: 28 }}>
          No consent {section === "requests" ? "requests" : "artefacts"} found for this patient.
        </Text>
      ) : section === "requests" ? (
        requestRecords.map(record => renderRecord(record))
      ) : (
        approvedRecords.map(({ artefact, request }) =>
          renderRecord(artefact, request, false),
        )
      )}
    </View>
  );
};

export default PatientConsents;
