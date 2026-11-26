const SENSITIVE_FIELD =
  /abha|aadhaar|aadhar|token|secret|password|otp|authorization|patient|name|phone|mobile|email|address|dob|birth|gender|reference|care.?context|consent|artefact|request.?id|poll.?id|txn|account|identifier|photo|image|pin|postal|date|display|login|user|clinical|health.?record|resource|bundle|content|fhir/i;

const redactValue = (value: unknown, fieldName = ""): unknown => {
  if (SENSITIVE_FIELD.test(fieldName)) {
    return "[REDACTED]";
  }

  if (typeof value === "string" && fieldName.toLowerCase() === "data") {
    try {
      return redactValue(JSON.parse(value));
    } catch {
      return "[REDACTED]";
    }
  }

  if (Array.isArray(value)) {
    return value.map(item => redactValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        redactValue(nestedValue, key),
      ]),
    );
  }

  return value;
};

const getSafePayload = (body: BodyInit | null | undefined) => {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof body !== "string") {
    return "[NON_JSON_BODY_OMITTED]";
  }

  try {
    return redactValue(JSON.parse(body));
  } catch {
    return "[NON_JSON_BODY_OMITTED]";
  }
};

export const getSafeApiUrl = (url: string) => url.split("?")[0];

export const logAbhaApiRequest = (
  method: string,
  url: string,
  body?: BodyInit | null,
) => {
  console.log("[ABHA API] Request", method, getSafeApiUrl(url), {
    payload: getSafePayload(body),
  });
};

export const logAbhaApiResponse = (
  method: string,
  url: string,
  status: number,
  ok: boolean,
) => {
  console.log("[ABHA API] Response", method, getSafeApiUrl(url), {
    status,
    ok,
  });
};
