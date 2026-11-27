export type ERPRecord = Record<string, unknown>;

export const normalizeERPKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

export const getERPField = (record: ERPRecord, names: string[]) => {
  const keys = new Set(names.map(normalizeERPKey));
  return Object.entries(record).find(([key]) => keys.has(normalizeERPKey(key)))?.[1];
};

export const parseERPListRows = (
  raw: unknown,
  pageLabel = "ERP",
): ERPRecord[] => {
  let value = raw;

  for (let depth = 0; depth < 6; depth += 1) {
    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch {
        throw new Error(`The ${pageLabel} list returned invalid JSON.`);
      }
    }

    if (Array.isArray(value)) {
      return value.filter(
        (row): row is ERPRecord =>
          Boolean(row) && typeof row === "object" && !Array.isArray(row),
      );
    }

    if (!value || typeof value !== "object") {
      break;
    }

    const response = value as ERPRecord;
    if (Number(response.success) === 0) {
      throw new Error(
        typeof response.message === "string"
          ? response.message
          : `The ${pageLabel} list could not be loaded.`,
      );
    }

    const numericKeys = Object.keys(response)
      .filter(key => /^\d+$/.test(key))
      .sort((left, right) => Number(left) - Number(right));
    if (numericKeys.length > 0) {
      return numericKeys
        .map(key => response[key])
        .filter(
          (row): row is ERPRecord =>
            Boolean(row) && typeof row === "object" && !Array.isArray(row),
        );
    }

    if (
      Number(response.success) === 1 &&
      Object.prototype.hasOwnProperty.call(response, "data") &&
      (response.data == null || response.data === "")
    ) {
      return [];
    }

    const nested =
      response.data ?? response.d ?? response.list ?? response.records;
    if (nested === undefined) {
      break;
    }
    value = nested;
  }

  throw new Error(`The ${pageLabel} response did not contain a record list.`);
};

export const matchesERPPatient = (
  record: ERPRecord,
  identifiers: {
    address: string;
    abhaNumber: string;
    patientReferences: string[];
  },
) => {
  const recordAddress = String(
    getERPField(record, ["abhaaddress"]) ?? "",
  ).trim();
  const recordNumber = String(getERPField(record, ["abhanumber"]) ?? "")
    .replace(/\D/g, "");
  const recordReference = String(
    getERPField(record, ["patientreference", "patientabhaid"]) ?? "",
  ).trim();
  const patientReferences = identifiers.patientReferences.filter(Boolean);
  let hasMatchingIdentifier = false;

  if (recordAddress) {
    if (
      !identifiers.address ||
      recordAddress.toLowerCase() !== identifiers.address.toLowerCase()
    ) {
      return false;
    }
    hasMatchingIdentifier = true;
  }

  if (recordNumber) {
    if (!identifiers.abhaNumber || recordNumber !== identifiers.abhaNumber) {
      return false;
    }
    hasMatchingIdentifier = true;
  }

  if (recordReference) {
    if (!patientReferences.includes(recordReference)) {
      return false;
    }
    hasMatchingIdentifier = true;
  }

  return hasMatchingIdentifier;
};
