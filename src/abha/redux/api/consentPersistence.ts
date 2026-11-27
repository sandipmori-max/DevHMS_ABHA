import type { AppDispatch } from "../../../store/store";
import {
  consentDataApi,
  consentRequestApi,
  ConsentRequestPayload,
  ConsentRequestStatusResult,
} from "./consentRequestApi";
import { getSavePagePayload, savePageApi } from "./savePageApi";
import { showToast } from "../../utils/toast";
import { getErrorMessage } from "../../utils/helpers";

const CONSENT_POLL_INTERVAL_MS = 5_000;
const CONSENT_POLL_LIFETIME_MS = 24 * 60 * 60 * 1_000;
const ARTEFACT_DETAILS_TIMEOUT_MS = 90_000;

export interface ConsentPersistenceContext {
  requestId: string;
  pollId: string;
  erpToken: string;
  patientReference: string;
  abhaNumber: string;
  patientName: string;
  submittedAt: string;
  requestPayload: ConsentRequestPayload;
}

const wait = (milliseconds: number) =>
  new Promise<void>(resolve => setTimeout(resolve, milliseconds));

const unwrapAndReset = async <Result,>(
  request: {
    unwrap: () => Promise<Result>;
    reset: () => void;
  },
) => {
  try {
    return await request.unwrap();
  } finally {
    request.reset();
  }
};

const assertPageSaveSucceeded = (
  response: { success?: number; message?: string },
  page: string,
) => {
  if (
    response.success !== undefined &&
    Number(response.success) !== 1
  ) {
    throw new Error(
      response.message || `The ${page} page record could not be saved.`,
    );
  }
};

const savePageRecord = async (
  dispatch: AppDispatch,
  erpToken: string,
  page: "ConsentRequest" | "ConsentArtefact",
  record: Record<string, unknown>,
) => {
  const response = await unwrapAndReset(
    dispatch(savePageApi.endpoints.savePage.initiate(
      getSavePagePayload(erpToken, page, JSON.stringify(record)),
    )),
  );
  assertPageSaveSucceeded(response, page);
};

const makeConsentRequestRecord = (
  context: ConsentPersistenceContext,
  result: ConsentRequestStatusResult,
) => {
  const consent = context.requestPayload.consent;
  return {
    crid: "",
    requestid: context.requestId,
    consentrequestid: result.consentRequestId ?? "",
    patientreference: context.patientReference,
    abhanumber: context.abhaNumber,
    abhaaddress: consent.patient.id,
    hiuid: consent.hiu.id,
    hipid: consent.hip?.id ?? "",
    status: ["PENDING", "REQUESTED"].includes(result.status)
      ? "REQUESTED"
      : result.status,
    purposecode: consent.purpose.code,
    purposetext: consent.purpose.text,
    hitypes: JSON.stringify(consent.hiTypes),
    accessmode: consent.permission.accessMode,
    datefrom: consent.permission.dateRange.from,
    dateto: consent.permission.dateRange.to,
    dataeraseat: consent.permission.dataEraseAt,
    frequencyunit: consent.permission.frequency.unit,
    frequencyvalue: consent.permission.frequency.value,
    frequencyrepeats: consent.permission.frequency.repeats,
    consentartefactids: JSON.stringify(result.consentArtefactIds),
    crcreatedat: context.submittedAt,
    decisionat: ["PENDING", "REQUESTED"].includes(result.status)
      ? ""
      : new Date().toISOString(),
    errormessage: result.error ?? "",
  };
};

const saveGrantedArtefact = async (
  dispatch: AppDispatch,
  context: ConsentPersistenceContext,
  result: ConsentRequestStatusResult,
  consentArtefactId: string,
) => {
  const started = await unwrapAndReset(
    dispatch(consentDataApi.endpoints.startConsentDataFetch.initiate({
      pollId: context.pollId,
      consentArtefactId,
    })),
  );
  let transfer = started;
  const deadline = Date.now() + ARTEFACT_DETAILS_TIMEOUT_MS;

  while (!transfer.consent && Date.now() < deadline) {
    if (["FAILED", "REVOKED"].includes(transfer.status)) {
      throw new Error(
        transfer.error || `Consent artefact ${consentArtefactId} could not be retrieved.`,
      );
    }

    await wait(3_000);
    transfer = await unwrapAndReset(
      dispatch(consentDataApi.endpoints.pollConsentDataFetch.initiate({
        pollId: context.pollId,
        consentArtefactId,
      })),
    );
  }

  if (!transfer.consent) {
    throw new Error(
      `Timed out retrieving permission details for artefact ${consentArtefactId}.`,
    );
  }

  const details = transfer.consent;
  const consent = context.requestPayload.consent;
  const createdAt = new Date().toISOString();
  await savePageRecord(dispatch, context.erpToken, "ConsentArtefact", {
    crid: "",
    requestid: context.requestId,
    consentrequestid: result.consentRequestId ?? "",
    patientreference: context.patientReference,
    abhanumber: context.abhaNumber,
    abhaaddress: details.patientId || consent.patient.id,
    hiuid: details.hiuId || consent.hiu.id,
    hipid: details.hipId || consent.hip?.id || "",
    status: "GRANTED",
    purposecode: consent.purpose.code,
    purposetext: consent.purpose.text,
    hitypes: JSON.stringify(details.hiTypes.length > 0
      ? details.hiTypes
      : consent.hiTypes),
    accessmode: details.accessMode,
    datefrom: details.from,
    dateto: details.to,
    dataeraseat: details.dataEraseAt ?? consent.permission.dataEraseAt ?? "",
    frequencyunit: consent.permission.frequency.unit,
    frequencyvalue: consent.permission.frequency.value,
    frequencyrepeats: consent.permission.frequency.repeats,
    cacreatedat: createdAt,
    decisionat: createdAt,
    consentartefactids: JSON.stringify([details.consentId || consentArtefactId]),
    errormessage: "",
  });
};

export const monitorAndPersistConsent = async (
  dispatch: AppDispatch,
  context: ConsentPersistenceContext,
) => {
  const deadline = Date.now() + CONSENT_POLL_LIFETIME_MS;
  let result: ConsentRequestStatusResult | undefined;

  try {
    await savePageRecord(
      dispatch,
      context.erpToken,
      "ConsentRequest",
      makeConsentRequestRecord(context, {
        status: "PENDING",
        consentArtefactIds: [],
      }),
    );
  } catch (error) {
    console.error("[ABHA consent] Pending request could not be saved", {
      requestId: context.requestId,
      name: error instanceof Error ? error.name : "UnknownError",
    });
  }

  while (Date.now() < deadline) {
    try {
      const current = await unwrapAndReset(
        dispatch(consentRequestApi.endpoints.pollConsentRequestStatus.initiate(
          context.pollId,
        )),
      );
      if (
        !["PENDING", "REQUESTED"].includes(current.status)
      ) {
        result = current;
        break;
      }
    } catch (error) {
      console.warn("[ABHA consent] Background status poll failed", {
        name: error instanceof Error ? error.name : "UnknownError",
      });
    }

    await wait(CONSENT_POLL_INTERVAL_MS);
  }

  if (!result) {
    showToast(
      "error",
      "Consent status still pending",
      "The app could not confirm the decision yet. Check consent status again later.",
    );
    return;
  }

  const saveErrors: string[] = [];
  try {
    await savePageRecord(
      dispatch,
      context.erpToken,
      "ConsentRequest",
      makeConsentRequestRecord(context, result),
    );
  } catch (error) {
    saveErrors.push(`ConsentRequest: ${getErrorMessage(error)}`);
  }

  if (result.status === "GRANTED") {
    for (const artefactId of result.consentArtefactIds) {
      try {
        await saveGrantedArtefact(dispatch, context, result, artefactId);
      } catch (error) {
        saveErrors.push(`ConsentArtefact: ${getErrorMessage(error)}`);
      }
    }
  }

  if (saveErrors.length > 0) {
    console.error("[ABHA consent] ERP consent persistence failed", {
      requestId: context.requestId,
      failureCount: saveErrors.length,
    });
    showToast(
      "error",
      "Consent saved with errors",
      `${result.status} received, but ${saveErrors.length} ERP record(s) could not be saved. ${saveErrors[0]}`,
    );
    return;
  }

  showToast(
    "success",
    result.status === "GRANTED" ? "Consent approved" : "Consent updated",
    result.status === "GRANTED"
      ? `${result.consentArtefactIds.length} consent artefact(s) saved to ERP.`
      : `Consent status ${result.status.toLowerCase()} saved to ERP.`,
  );
};
