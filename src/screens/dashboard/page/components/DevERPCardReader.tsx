
import React, { useState, useEffect, useRef } from "react";

import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  useWindowDimensions,
  NativeModules,
  Animated,
  PanResponder,
} from "react-native";

import { launchImageLibrary } from "react-native-image-picker";
import TextRecognition from "@react-native-ml-kit/text-recognition";

import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";

import MaterialIcons from "@react-native-vector-icons/material-icons";
import useTranslations from "../../../../hooks/useTranslations";
import { ERP_COLOR_CODE } from "../../../../utils/constants";
import RNFS from "react-native-fs";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import { useNavigation } from "@react-navigation/native";
import { downloadAndShare } from "../../../../utils/helpers";
import DynamicJsonView from "./DynamicJsonView";
import { useAppSelector } from "../../../../store/hooks";
import DeviceInfo from "react-native-device-info";

const { DocumentScanner } = NativeModules;

const REDUCTO_URL = "https://platform.reducto.ai";

// IMPORTANT:
// Replace this with your backend proxy implementation.
// Never put a production Reducto API key inside a mobile app.
const REDUCTO_API_KEY = "2c702e638c21fb71f6a05378d82114f8e433903caf91babc8856edc0fe1c4a439799522923cb9f78eaa1afff9447450f";
// --------------------------------------------------
// SCANNER
// --------------------------------------------------

const launchScannerAsync = (options: any) => {
  return new Promise<any>((resolve, reject) => {
    if (!DocumentScanner) {
      reject(new Error("DocumentScanner module not linked"));
      return;
    }

    try {
      DocumentScanner.launchScanner(options, (result: any) => {
        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// --------------------------------------------------
// OCR TYPES
// --------------------------------------------------

type OcrField = {
  key: string;
  normalizedKey: string;
  path: string;
  value: string;
};

// --------------------------------------------------
// UNIVERSAL OCR HELPERS
// --------------------------------------------------

const normalizeKey = (key: string): string => {
  return String(key || "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

const cleanOcrText = (value: any): string => {
  if (value === null || value === undefined) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value)
      .replace(/\s+/g, " ")
      .trim();
  }

  return "";
};

const isMetadataKey = (key: string): boolean => {
  const normalized = normalizeKey(key);

  return [
    "confidence",
    "citations",
    "citation",
    "bbox",
    "boundingbox",
    "coordinates",
    "polygon",
    "page",
    "pageindex",
    "pageid",
    "metadata",
    "extra",
    "rotation",
    "dimensions",
    "width",
    "height",
    "id",
    "type",
    "image",
    "images",
  ].includes(normalized);
};

// --------------------------------------------------
// RECURSIVE OCR EXTRACTION
// Handles:
// 1. Flat objects
// 2. Nested objects
// 3. Arrays
// 4. Arrays inside objects
// 5. Objects inside arrays
// 6. value/text/content wrappers
// --------------------------------------------------

const collectOcrFields = (
  data: any,
  result: OcrField[] = [],
  currentPath = "",
  parentKey = ""
): OcrField[] => {
  console.log("collectOcrFields called with data:", data, "currentPath:", currentPath, "parentKey:", parentKey);
  if (data === null || data === undefined) {
    return result;
  }

  if (typeof data === "string") {
    const trimmed = data.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === "object" && parsed !== null) {
          return collectOcrFields(
            parsed,
            result,
            currentPath,
            parentKey
          );
        }
      } catch {
        // Keep ordinary OCR text as a leaf value.
      }
    }
  }

  // Primitive values
  if (
    typeof data === "string" ||
    typeof data === "number"
  ) {
    const value = cleanOcrText(data);

    if (value) {
      const key =
        parentKey ||
        currentPath.split(".").pop() ||
        "";

      result.push({
        key,
        normalizedKey: normalizeKey(key),
        path: currentPath,
        value,
      });
    }

    return result;
  }

  // Arrays
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      collectOcrFields(
        item,
        result,
        `${currentPath}[${index}]`,
        parentKey
      );
    });

    return result;
  }

  if (typeof data !== "object") {
    return result;
  }

  // Common OCR value wrappers
  const wrapperKeys = [
    "value",
    "text",
    "content",
    "raw_text",
    "extracted_text",
    "formatted_value",
  ];

  const wrapperKey = wrapperKeys.find(
    key =>
      Object.prototype.hasOwnProperty.call(data, key) &&
      data[key] !== null &&
      data[key] !== undefined
  );

  if (wrapperKey) {
    const labelKey = ["key", "label", "field", "type"].find(
      key =>
        typeof data[key] === "string" &&
        cleanOcrText(data[key])
    );
    const semanticKey =
      (labelKey && cleanOcrText(data[labelKey])) ||
      parentKey ||
      currentPath.split(".").pop() ||
      "";

    collectOcrFields(
      data[wrapperKey],
      result,
      `${currentPath}.${wrapperKey}`,
      semanticKey
    );

    // Also inspect other nested properties
    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== wrapperKey &&
        !isMetadataKey(key) &&
        value !== null &&
        typeof value === "object"
      ) {
        collectOcrFields(
          value,
          result,
          `${currentPath}.${key}`,
          key
        );
      }
    });

    return result;
  }

  // Normal objects
  Object.entries(data).forEach(([key, value]) => {
    if (isMetadataKey(key)) return;

    const nextPath = currentPath
      ? `${currentPath}.${key}`
      : key;

    collectOcrFields(
      value,
      result,
      nextPath,
      key
    );
  });

  return result;
};

// --------------------------------------------------
// ALIAS MATCHING
// Exact match gets priority over partial matching.
// --------------------------------------------------

const getAliasScore = (
  field: OcrField,
  aliases: string[]
): number => {
  let bestScore = 0;

  const key = field.normalizedKey;
  const path = normalizeKey(field.path);
  const pathSegments = field.path
    .split(/[.[\]]+/)
    .map(normalizeKey);

  aliases.forEach(alias => {
    const normalizedAlias = normalizeKey(alias);

    if (!normalizedAlias) return;
    if (
      normalizedAlias === "name" &&
      /company|organization|organisation|business|firm|employer|supplier|vendor|corporation|brand/i.test(
        path
      )
    ) {
      return;
    }

    if (key === normalizedAlias) {
      bestScore = Math.max(bestScore, 100);
    } else if (
      key === "name" &&
      pathSegments.includes(normalizedAlias)
    ) {
      bestScore = Math.max(bestScore, 90);
    } else if (path.endsWith(normalizedAlias)) {
      bestScore = Math.max(bestScore, 90);
    } else if (
      normalizedAlias.length >= 5 &&
      key.startsWith(normalizedAlias) &&
      ["name", "id", "no", "number", "address", "phone", "mobile", "email", "url", "website", "1", "2"]
        .includes(key.slice(normalizedAlias.length))
    ) {
      bestScore = Math.max(bestScore, 70);
    }
  });

  return bestScore;
};

const findField = (
  fields: OcrField[],
  aliases: string[],
  used: Set<number>
): string => {
  let bestIndex = -1;
  let bestScore = 0;

  fields.forEach((field, index) => {
    if (used.has(index)) return;

    const score = getAliasScore(field, aliases);

    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  if (bestIndex === -1) return "";

  used.add(bestIndex);

  return fields[bestIndex].value;
};

const findAllFields = (
  fields: OcrField[],
  aliases: string[]
): string[] => {
  const matches = fields
    .map((field, index) => ({
      value: field.value,
      score: getAliasScore(field, aliases),
      index,
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return uniqueValues(matches.map(item => item.value));
};

const uniqueValues = (values: string[]): string[] => {
  const seen = new Set<string>();

  return values
    .map(value => cleanOcrText(value))
    .filter(value => {
      const normalized = value.toLocaleLowerCase();
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
};

const uniquePhones = (values: string[]): string[] => {
  const seen = new Set<string>();

  return values
    .map(value => cleanOcrText(value))
    .filter(value => {
      const normalized = value.replace(/\D/g, "");
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
};

const splitPhoneCandidate = (value: string): string[] => {
  const normalized = value.replace(/[^\d+]/g, "");
  const digits = normalized.replace(/\D/g, "");

  if (digits.length < 7) return [];
  if (digits.length <= 15) return [normalized];

  const chunkCount = Math.ceil(digits.length / 15);
  const chunkSize = Math.ceil(digits.length / chunkCount);
  const chunks: string[] = [];

  for (let index = 0; index < digits.length; index += chunkSize) {
    chunks.push(digits.slice(index, index + chunkSize));
  }

  if (chunks.some(chunk => chunk.length < 7 || chunk.length > 15)) {
    return [];
  }

  return chunks.map(chunk => `${normalized.startsWith("+") ? "+" : ""}${chunk}`);
};

// --------------------------------------------------
// EMAIL EXTRACTION
// --------------------------------------------------

const extractEmails = (fields: OcrField[]): string[] => {

  const emailAliases = [
    // General Email
    "email",
    "emailid",
    "email_id",
    "emailaddress",
    "email_address",
    "emailaddr",
    "email_addr",
    "mail",
    "mailid",
    "mail_id",
    "mailaddress",
    "mail_address",
    "mailaddr",
    "mail_addr",
    "e_mail",
    "e_mail_id",
    "e_mail_address",
    "emailvalue",
    "email_value",
    "emailtext",
    "email_text",
    "emailcontact",
    "email_contact",
    "contactemail",
    "contact_email",
    "contactmail",
    "contact_mail",

    // Multiple Emails
    "email1",
    "email2",
    "email3",
    "email4",
    "emailid1",
    "emailid2",
    "emailid3",
    "emailid4",
    "emailaddress1",
    "emailaddress2",
    "emailaddress3",
    "emailaddress4",
    "mail1",
    "mail2",
    "mail3",
    "mailid1",
    "mailid2",
    "mailaddress1",
    "mailaddress2",
    "emailaddressprimary",
    "emailaddresssecondary",
    "emailaddresses",
    "email_addresses",
    "emails",
    "all_emails",
    "allemails",
    "multipleemails",
    "multiple_emails",
    "emaillist",
    "email_list",
    "contactemails",
    "contact_emails",
    "contactmails",
    "contact_mails",

    // Primary / Secondary / Alternate
    "primaryemail",
    "primary_email",
    "primaryemailid",
    "primary_email_id",
    "primaryemailaddress",
    "primary_email_address",
    "secondaryemail",
    "secondary_email",
    "secondaryemailid",
    "secondary_email_id",
    "secondaryemailaddress",
    "secondary_email_address",
    "alternateemail",
    "alternate_email",
    "alternateemailid",
    "alternate_email_id",
    "alternateemailaddress",
    "alternate_email_address",
    "alternativeemail",
    "alternative_email",
    "additionalemail",
    "additional_email",
    "additionalemailid",
    "additional_email_id",
    "otheremail",
    "other_email",
    "otheremailid",
    "other_email_id",
    "backupemail",
    "backup_email",
    "backupemailaddress",
    "backup_email_address",

    // Personal Email
    "personalemail",
    "personal_email",
    "personalemailid",
    "personal_email_id",
    "personalemailaddress",
    "personal_email_address",
    "privateemail",
    "private_email",
    "homeemail",
    "home_email",
    "individualemail",
    "individual_email",
    "useremail",
    "user_email",
    "useremailid",
    "user_email_id",
    "useremailaddress",
    "user_email_address",
    "personemail",
    "person_email",
    "personemailid",
    "person_email_id",

    // Business / Company Email
    "businessemail",
    "business_email",
    "businessemailid",
    "business_email_id",
    "businessemailaddress",
    "business_email_address",
    "companyemail",
    "company_email",
    "companyemailid",
    "company_email_id",
    "companyemailaddress",
    "company_email_address",
    "corporateemail",
    "corporate_email",
    "corporateemailid",
    "corporate_email_id",
    "officialemail",
    "official_email",
    "officialemailid",
    "official_email_id",
    "officialemailaddress",
    "official_email_address",
    "organizationemail",
    "organization_email",
    "organisationemail",
    "organisation_email",
    "firmemail",
    "firm_email",
    "enterpriseemail",
    "enterprise_email",
    "workemail",
    "work_email",
    "workemailid",
    "work_email_id",
    "workemailaddress",
    "work_email_address",
    "professionalemail",
    "professional_email",
    "officeemail",
    "office_email",
    "officeemailid",
    "office_email_id",
    "officeemailaddress",
    "office_email_address",

    // Department Emails
    "infoemail",
    "info_email",
    "info",
    "contact",
    "contactus",
    "contact_us",
    "supportemail",
    "support_email",
    "support",
    "helpemail",
    "help_email",
    "helpdeskemail",
    "helpdesk_email",
    "salesemail",
    "sales_email",
    "marketingemail",
    "marketing_email",
    "hr_email",
    "hremail",
    "financeemail",
    "finance_email",
    "accountsemail",
    "accounts_email",
    "billingemail",
    "billing_email",
    "adminemail",
    "admin_email",
    "receptionemail",
    "reception_email",
    "serviceemail",
    "service_email",
    "enquiryemail",
    "enquiry_email",
    "inquiryemail",
    "inquiry_email",
    "bookingemail",
    "booking_email",
    "careemail",
    "care_email",
    "customercareemail",
    "customer_care_email",
    "feedbackemail",
    "feedback_email",
    "complaintemail",
    "complaint_email",
    "press_email",
    "pressemail",
    "mediaemail",
    "media_email",

    // Role-Based Emails
    "ceoemail",
    "ceo_email",
    "directoremail",
    "director_email",
    "manageremail",
    "manager_email",
    "owneremail",
    "owner_email",
    "founderemail",
    "founder_email",
    "partneremail",
    "partner_email",
    "employeeemail",
    "employee_email",
    "staffemail",
    "staff_email",
    "teamemail",
    "team_email",
    "representativeemail",
    "representative_email",
    "salespersonemail",
    "salesperson_email",
    "consultantemail",
    "consultant_email",
    "agentemail",
    "agent_email",
    "executiveemail",
    "executive_email",

    // Contact / Communication
    "primarycontactemail",
    "primary_contact_email",
    "secondarycontactemail",
    "secondary_contact_email",
    "contactpersonemail",
    "contact_person_email",
    "contactpersonmail",
    "contact_person_mail",
    "communicationemail",
    "communication_email",
    "correspondenceemail",
    "correspondence_email",
    "registeredemail",
    "registered_email",
    "registeredemailid",
    "registered_email_id",
    "registrationemail",
    "registration_email",
    "notificationemail",
    "notification_email",
    "replyemail",
    "reply_email",
    "replytoemail",
    "reply_to_email",

    // Website / Domain Related
    "websiteemail",
    "website_email",
    "webemail",
    "web_email",
    "domainemail",
    "domain_email",
    "emaildomain",
    "email_domain",
    "webmasteremail",
    "webmaster_email",
    "hostmasteremail",
    "hostmaster_email",

    // Business Card / OCR
    "cardemail",
    "card_email",
    "businesscardemail",
    "business_card_email",
    "visitingcardemail",
    "visiting_card_email",
    "printedemail",
    "printed_email",
    "cardholderemail",
    "cardholder_email",
    "emailoncard",
    "email_on_card",
    "emaildetails",
    "email_details",
    "emailinformation",
    "email_information",
    "emailidvalue",
    "email_id_value",
    "mailvalue",
    "mail_value",
    "emailfield",
    "email_field",
    "contactdetails_email",
    "contact_details_email"
  ];


  const keyedValues = findAllFields(
    fields,
    emailAliases
  );

  const allValues = [
    ...keyedValues,
    ...fields.map(field => field.value),
  ];

  const emails: string[] = [];

  allValues.forEach(value => {
    const matches = value.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
    );

    if (matches) {
      emails.push(...matches);
    }
  });

  return uniqueValues(emails);
};

// --------------------------------------------------
// PHONE EXTRACTION
// --------------------------------------------------

const extractPhones = (fields: OcrField[]): string[] => {

  const phoneAliases = [
    // General Phone
    "phone",
    "phone_number",
    "phonenumber",
    "phoneno",
    "phone_no",
    "phone_no1",
    "phone_no2",
    "phoneno1",
    "phoneno2",
    "phone1",
    "phone2",
    "phone3",
    "phone4",
    "phonenumber1",
    "phonenumber2",
    "phonenumber3",
    "phonenumber4",
    "telephone",
    "telephone_number",
    "telephonenumber",
    "telephoneno",
    "telephoneno1",
    "telephoneno2",
    "telephone1",
    "telephone2",
    "tel",
    "telno",
    "tel_no",
    "telnumber",
    "contactnumber",
    "contact_number",
    "contactnumbers",
    "contact_numbers",
    "contactno",
    "contact_no",
    "contactno1",
    "contactno2",
    "contactphone",
    "contact_phone",
    "contactmobile",
    "contact_mobile",

    // Mobile
    "mobile",
    "mobile_number",
    "mobilenumber",
    "mobileno",
    "mobile_no",
    "mobileno1",
    "mobileno2",
    "mobile_no1",
    "mobile_no2",
    "mobile1",
    "mobile2",
    "mobile3",
    "mobile4",
    "mobilenumber1",
    "mobilenumber2",
    "mobilenumber3",
    "mobilenumber4",
    "mobilenumbers",
    "mobile_numbers",
    "mobilenos",
    "mobilephone",
    "mobile_phone",
    "cell",
    "cellphone",
    "cell_phone",
    "cellnumber",
    "cell_number",
    "cellno",
    "cell_no",
    "cellular",
    "cellularnumber",
    "cellular_number",

    // Primary / Secondary / Alternate
    "primaryphone",
    "primary_phone",
    "primaryphonenumber",
    "primary_phone_number",
    "primarymobile",
    "primary_mobile",
    "primarymobileno",
    "primary_mobile_no",
    "secondaryphone",
    "secondary_phone",
    "secondaryphonenumber",
    "secondary_phone_number",
    "secondarymobile",
    "secondary_mobile",
    "secondarymobileno",
    "secondary_mobile_no",
    "alternatephone",
    "alternate_phone",
    "alternatephonenumber",
    "alternate_phone_number",
    "alternatemobile",
    "alternate_mobile",
    "alternatemobileno",
    "alternate_mobile_no",
    "additionalphone",
    "additional_phone",
    "additionalmobile",
    "additional_mobile",
    "otherphone",
    "other_phone",
    "othermobile",
    "other_mobile",
    "backupphone",
    "backup_phone",
    "backupmobile",
    "backup_mobile",

    // Business / Office
    "businessphone",
    "business_phone",
    "businessnumber",
    "business_number",
    "businessmobile",
    "business_mobile",
    "officephone",
    "office_phone",
    "officenumber",
    "office_number",
    "officemobile",
    "office_mobile",
    "workphone",
    "work_phone",
    "worknumber",
    "work_number",
    "workmobile",
    "work_mobile",
    "companyphone",
    "company_phone",
    "companymobile",
    "company_mobile",
    "corporatephone",
    "corporate_phone",
    "corporatemobile",
    "corporate_mobile",
    "firmphone",
    "firm_phone",
    "organizationphone",
    "organisationphone",
    "departmentphone",
    "department_phone",
    "receptionphone",
    "reception_phone",
    "helplinenumber",
    "helpline_number",
    "customer_care",
    "customercare",
    "supportnumber",
    "support_number",
    "supportphone",
    "support_phone",

    // Personal
    "personalphone",
    "personal_phone",
    "personalnumber",
    "personal_number",
    "personalmobile",
    "personal_mobile",
    "homephone",
    "home_phone",
    "homenumber",
    "home_number",
    "residentialphone",
    "residential_phone",
    "privatephone",
    "private_phone",
    "familyphone",
    "family_phone",
    "emergencyphone",
    "emergency_phone",
    "emergencycontactnumber",
    "emergency_contact_number",

    // WhatsApp
    "whatsapp",
    "whatsappnumber",
    "whatsapp_number",
    "whatsappphone",
    "whatsapp_phone",
    "whatsappmobile",
    "whatsapp_mobile",
    "whatsappno",
    "whatsapp_no",
    "whatsappcontact",
    "whatsapp_contact",
    "wa",
    "wanumber",
    "wa_number",
    "businesswhatsapp",
    "business_whatsapp",

    // Fax / Other Communication
    "fax",
    "faxnumber",
    "fax_number",
    "faxno",
    "fax_no",
    "facsimile",
    "facsimilenumber",
    "facsimile_number",
    "telex",
    "voip",
    "voipnumber",
    "voip_number",
    "extension",
    "extensionnumber",
    "extension_number",
    "directline",
    "direct_line",
    "directphone",
    "direct_phone",
    "hotline",
    "hotlinenumber",
    "hotline_number",

    // Indian Phone Variations
    "mobilenumberindia",
    "indianmobile",
    "indian_mobile",
    "indianmobileno",
    "indian_mobile_no",
    "contactmobileno",
    "contact_mobile_no",
    "primarycontactnumber",
    "primary_contact_number",
    "secondarycontactnumber",
    "secondary_contact_number",
    "registeredmobile",
    "registered_mobile",
    "registeredmobileno",
    "registered_mobile_no",
    "alternatecontactnumber",
    "alternate_contact_number",
    "contacttelephone",
    "contact_telephone",
    "mobilecontact",
    "mobile_contact",
    "phonecontact",
    "phone_contact",

    // International
    "internationalphone",
    "international_phone",
    "internationalnumber",
    "international_number",
    "countrycode",
    "country_code",
    "dialcode",
    "dial_code",
    "callingcode",
    "calling_code",
    "isdcode",
    "isd_code",
    "isd",
    "phonecountrycode",
    "phone_country_code",
    "mobilecountrycode",
    "mobile_country_code",
    "telephonecountrycode",
    "telephone_country_code",
    "phonenumberinternational",
    "internationalphonenumber",

    // Lists / Multiple Numbers
    "phonenumbers",
    "phone_numbers",
    "mobilenumbers",
    "mobile_numbers",
    "telephonenumbers",
    "telephone_numbers",
    "contactnumbers",
    "contact_numbers",
    "contactphones",
    "contact_phones",
    "contactmobiles",
    "contact_mobiles",
    "allphones",
    "all_phones",
    "allmobiles",
    "all_mobiles",
    "multiplephones",
    "multiple_phones",
    "multiplemobiles",
    "multiple_mobiles",
    "phone_list",
    "phonelist",
    "mobilelist",
    "mobile_list",
    "contactlist",
    "contact_list",

    // OCR / Business Card
    "cardphone",
    "card_phone",
    "cardmobile",
    "card_mobile",
    "businesscardphone",
    "business_card_phone",
    "businesscardmobile",
    "business_card_mobile",
    "printedphone",
    "printed_phone",
    "printedmobile",
    "printed_mobile",
    "contactdetailsphone",
    "contact_details_phone",
    "contactdetailsmobile",
    "contact_details_mobile",
    "phonevalue",
    "mobilevalue",
    "telephonevalue",
    "contactvalue"
  ];


  const keyedValues = fields
    .map((field, index) => ({
      field,
      index,
      score: getAliasScore(field, phoneAliases),
    }))
    .filter(({ field, score }) =>
      score > 0 ||
      (
        field.normalizedKey === "number" &&
        /contact|phone|mobile|telephone/i.test(
          normalizeKey(field.path)
        )
      )
    )
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ field }) => field.value);

  const phones: string[] = [];

  const addPhone = (value: string) => {
    if (/@|www\.|https?:\/\//i.test(value)) return;

    const matches = value.match(
      /(?:\+?\d[\d\s().-]{5,}\d)/g
    );

    if (!matches) return;

    matches.forEach(match => {
      phones.push(...splitPhoneCandidate(match));
    });
  };

  const valuesToScan = keyedValues.length
    ? keyedValues
    : fields.map(field => field.value);
  valuesToScan.forEach(addPhone);

  return uniquePhones(phones);
};

// --------------------------------------------------
// WEBSITE EXTRACTION
// --------------------------------------------------

const extractWebsite = (fields: OcrField[]): string => {

  const websiteAliases = [
    // General Website
    "website",
    "webaddress",
    "web_address",
    "websiteurl",
    "website_url",
    "url",
    "weburl",
    "web_url",
    "webpage",
    "web_page",
    "websitelink",
    "website_link",
    "websitelinks",
    "site",
    "siteurl",
    "site_url",
    "sitelink",
    "site_link",
    "internetaddress",
    "internet_address",
    "interneturl",
    "internet_url",
    "onlineaddress",
    "online_address",
    "onlineurl",
    "online_url",

    // Homepage
    "homepage",
    "home_page",
    "homepagelink",
    "homepage_link",
    "homepageurl",
    "homepage_url",
    "homepagelinkurl",
    "mainwebsite",
    "main_website",
    "mainurl",
    "main_url",
    "primarywebsite",
    "primary_website",
    "primaryurl",
    "primary_url",
    "personalwebsite",
    "personal_website",
    "personalurl",
    "personal_url",

    // Company / Business
    "companywebsite",
    "company_website",
    "companyurl",
    "company_url",
    "companyweb",
    "businesswebsite",
    "business_website",
    "businessurl",
    "business_url",
    "businessweb",
    "officialwebsite",
    "official_website",
    "officialurl",
    "official_url",
    "corporatewebsite",
    "corporate_website",
    "corporateurl",
    "corporate_url",
    "organizationwebsite",
    "organization_website",
    "organisationwebsite",
    "organisation_website",
    "organizationurl",
    "organisationurl",
    "firmwebsite",
    "firm_website",
    "firmurl",
    "brandwebsite",
    "brand_website",
    "brandurl",
    "brand_url",
    "enterprisewebsite",
    "enterprise_website",
    "employerwebsite",
    "employer_website",

    // Domain
    "domain",
    "domainname",
    "domain_name",
    "domainurl",
    "domain_url",
    "webdomain",
    "web_domain",
    "internetdomain",
    "internet_domain",
    "websiteaddress",
    "website_address",
    "registeredomain",
    "rootdomain",
    "root_domain",
    "subdomain",
    "sub_domain",
    "hostname",
    "host_name",

    // Portfolio / Professional
    "portfolio",
    "portfolio_url",
    "portfoliourl",
    "portfolio_website",
    "portfoliowebsite",
    "portfoliolink",
    "portfolio_link",
    "profilewebsite",
    "profile_website",
    "profileurl",
    "profile_url",
    "professionalwebsite",
    "professional_website",
    "personalportfolio",
    "personal_portfolio",
    "workportfolio",
    "work_portfolio",
    "projectwebsite",
    "project_website",

    // Social / Online Presence
    "linkedinwebsite",
    "linkedinurl",
    "linkedin_url",
    "facebookwebsite",
    "facebookurl",
    "facebook_url",
    "instagramwebsite",
    "instagramurl",
    "instagram_url",
    "twitterwebsite",
    "twitterurl",
    "twitter_url",
    "xurl",
    "youtubewebsite",
    "youtubeurl",
    "youtube_url",
    "socialwebsite",
    "social_website",
    "socialurl",
    "social_url",
    "sociallink",
    "social_link",
    "onlinepresence",
    "online_presence",
    "digitalpresence",
    "digital_presence",

    // E-commerce / Other
    "storewebsite",
    "store_website",
    "storeurl",
    "store_url",
    "shopwebsite",
    "shop_website",
    "shopurl",
    "shop_url",
    "ecommercewebsite",
    "ecommerce_website",
    "marketplaceurl",
    "marketplace_url",
    "productwebsite",
    "product_website",
    "servicewebsite",
    "service_website",
    "landingpage",
    "landing_page",
    "landingpageurl",
    "landing_page_url",
    "websitelocation",
    "websitedomain",
    "websitedomainname",
    "externalwebsite",
    "external_website",
    "externallink",
    "external_link",
    "referenceurl",
    "reference_url",
    "link",
    "links",
    "websiteinfo",
    "website_information",
    "websitedetails",
    "website_details",
    "websitevalue",
    "website_value"
  ];


  const candidates = [
    ...findAllFields(fields, websiteAliases),
    ...fields.map(field => field.value),
  ];

  for (const candidate of candidates) {
    if (/@|example\.com/i.test(candidate)) continue;

    if (
      /^(web address here|website here|not available|n\/a)$/i.test(
        candidate.trim()
      )
    ) {
      continue;
    }

    const match = candidate.match(
      /(?:https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/[^\s]*)?/i
    );

    if (!match) continue;

    const website = match[0]
      .replace(/[.,;]+$/, "")
      .trim();

    if (
      /^(gmail|yahoo|hotmail|outlook|rediffmail|icloud|protonmail|zoho|aol|msn)\./i.test(
        website
      )
    ) {
      continue;
    }

    return website;
  }

  return "";
};

// --------------------------------------------------
// ADDRESS EXTRACTION
// --------------------------------------------------

const extractAddress = (fields: OcrField[]): string => {

  const fullAddressAliases = [
    // General Address
    "fulladdress",
    "completeaddress",
    "formattedaddress",
    "address",
    "addressdetails",
    "addressdetail",
    "fulladdr",
    "completeaddr",
    "mailingaddress",
    "contactaddress",
    "physicaladdress",
    "postaladdress",
    "locationaddress",
    "permanentaddress",
    "currentaddress",
    "presentaddress",
    "residentialaddress",
    "communicationaddress",
    "correspondenceaddress",
    "localaddress",
    "primaryaddress",
    "secondaryaddress",
    "alternateaddress",
    "otheraddress",
    "mainaddress",
    "homeaddress",
    "workaddress",
    "streetaddress",
    "landaddress",
    "siteaddress",

    // Business / Company
    "businessaddress",
    "officeaddress",
    "companyaddress",
    "organizationaddress",
    "organisationaddress",
    "corporateaddress",
    "registeredaddress",
    "headofficeaddress",
    "branchaddress",
    "branchofficeaddress",
    "businesslocation",
    "companylocation",
    "officelocation",
    "organizationlocation",
    "organisationlocation",
    "corporatelocation",
    "registeredofficeaddress",
    "principalofficeaddress",
    "principalbusinessaddress",
    "businessregisteredaddress",
    "companyregisteredaddress",
    "firmaddress",
    "firmofficeaddress",
    "enterpriseaddress",
    "workplaceaddress",
    "factoryaddress",
    "warehouseaddress",
    "godownaddress",
    "shopaddress",
    "storeaddress",
    "showroomaddress",
    "headquarteraddress",
    "headquartersaddress",
    "hqaddress",

    // Billing / Shipping
    "billingaddress",
    "billaddress",
    "invoiceaddress",
    "invoicingaddress",
    "shippingaddress",
    "shipaddress",
    "deliveryaddress",
    "dispatchaddress",
    "dispatchlocation",
    "destinationaddress",
    "senderaddress",
    "receiveraddress",
    "recipientaddress",
    "consigneeaddress",
    "consignoraddress",
    "vendoraddress",
    "supplieraddress",
    "customeraddress",
    "clientaddress",
    "buyeraddress",
    "selleraddress",
    "purchaseraddress",
    "paymentaddress",
    "transactionaddress",

    // Address Components / Variations
    "addressline",
    "addressline1",
    "addressline2",
    "addressline3",
    "addressline4",
    "addresslineone",
    "addresslinetwo",
    "addresslinethree",
    "addresslinefour",
    "address1",
    "address2",
    "address3",
    "address4",
    "addr1",
    "addr2",
    "addr3",
    "addr4",
    "addrline1",
    "addrline2",
    "addrline3",
    "addrline",
    "street",
    "streetname",
    "streetdetails",
    "buildingaddress",
    "buildingname",
    "buildingnumber",
    "housenumber",
    "houseaddress",
    "flataddress",
    "apartmentaddress",
    "unitaddress",
    "flooraddress",
    "plotaddress",
    "plotnumber",
    "landmarkaddress",
    "nearbyaddress",

    // Geographic / Location
    "location",
    "locationdetails",
    "full_location",
    "geolocation",
    "geographicaddress",
    "geographicaladdress",
    "placeaddress",
    "place",
    "cityaddress",
    "districtaddress",
    "stateaddress",
    "countryaddress",
    "regionaddress",
    "areaaddress",
    "localityaddress",
    "suburbaddress",
    "villageaddress",
    "townaddress",
    "pincodeaddress",
    "zipcodeaddress",
    "postalcodeaddress",
    "mapaddress",
    "googlemapaddress",
    "coordinatesaddress",

    // Tax / Legal / Official
    "gstaddress",
    "gstregisteredaddress",
    "gstregistrationaddress",
    "taxaddress",
    "taxpayeraddress",
    "legaladdress",
    "officialaddress",
    "statutoryaddress",
    "licenceaddress",
    "licenseaddress",
    "registrationaddress",
    "incorporationaddress",
    "registeredplaceaddress",
    "placeofbusiness",
    "principalplaceofbusiness",
    "additionalplaceofbusiness",
    "businessplaceaddress",
    "communicationlocation",
    "registeredlocation",
    "legalentityaddress",

    // Contact / Personal
    "contactdetailsaddress",
    "personaddress",
    "individualaddress",
    "applicantaddress",
    "employeeaddress",
    "employeraddress",
    "directoraddress",
    "owneraddress",
    "proprietoraddress",
    "partneraddress",
    "authorizedpersonaddress",
    "correspondenceaddr",
    "residenceaddress",
    "livingaddress",
    "nativeaddress",
    "familyaddress",

    // International / Other
    "mailaddr",
    "postaladdr",
    "physicaladdr",
    "businessaddr",
    "officeaddr",
    "companyaddr",
    "homeaddr",
    "workaddr",
    "shippingaddr",
    "billingaddr",
    "deliveryaddr",
    "registeredaddr",
    "permanentaddr",
    "currentaddr",
    "presentaddr",
    "fulladdressdetails",
    "completeaddressdetails",
    "formattedaddr",
    "fullpostaladdress",
    "fullphysicaladdress",
    "fullbusinessaddress",
    "fullcompanyaddress",
    "fullcontactaddress",
    "fullregisteredaddress",
    "fullmailingaddress",
    "fullresidentialaddress",
    "fullcommunicationaddress",
    "officeaddressdetails",
    "companyaddressdetails",
    "businessaddressdetails",
    "registeredaddressdetails",
    "addressinfo",
    "addressinformation",
    "addressvalue",
    "address_text",
    "full_address",
    "complete_address",
    "business_address",
    "company_address",
    "office_address",
    "registered_address",
    "postal_address",
    "physical_address",
    "mailing_address",
    "billing_address",
    "shipping_address",
    "delivery_address"
  ];


  const fullAddress = findAllFields(
    fields,
    fullAddressAliases
  );

  const complete = fullAddress.find(
    value => value.includes(",") || value.length > 25
  );

  if (complete) return complete;


  const addressAliases = [
    // Street
    "street",
    "streetname",
    "streetaddress",
    "streetno",
    "streetnumber",
    "streetdetails",
    "street1",
    "street2",
    "road",
    "roadname",
    "roadnumber",
    "roadaddress",
    "roadno",
    "crossroad",
    "mainroad",
    "subroad",
    "lane",
    "lanename",
    "lanenumber",
    "bylane",
    "byroad",
    "highway",
    "avenue",
    "avenueaddress",
    "boulevard",
    "drive",
    "path",
    "route",

    // Address Lines
    "addressline",
    "addressline1",
    "addressline2",
    "addressline3",
    "addressline4",
    "address1",
    "address2",
    "address3",
    "address4",
    "addr",
    "addr1",
    "addr2",
    "addr3",
    "addrline",
    "addrline1",
    "addrline2",
    "addressdetail",
    "addressdetails",
    "addresspart",
    "addressinfo",
    "addresscomponent",

    // Locality / Area
    "locality",
    "sublocality",
    "sublocalitylevel1",
    "sublocalitylevel2",
    "sublocalitylevel3",
    "area",
    "areaname",
    "areadetails",
    "neighborhood",
    "neighbourhood",
    "suburb",
    "localarea",
    "residentialarea",
    "commercialarea",
    "industrialarea",
    "zone",
    "zonename",
    "region",
    "regionname",
    "localregion",
    "community",
    "colony",
    "colonyname",
    "mohalla",
    "mohallaname",
    "pada",
    "faliya",
    "faliyaname",
    "localityname",
    "vistar",
    "areaaddress",

    // Landmark
    "landmark",
    "landmarks",
    "landmarkname",
    "nearbylandmark",
    "nearestlandmark",
    "locationlandmark",
    "referencepoint",
    "nearby",
    "near",
    "opposite",
    "behind",
    "beside",
    "adjacentto",
    "nearlocation",

    // District / City / Town / Village
    "district",
    "districtname",
    "districtcode",
    "city",
    "cityname",
    "citycode",
    "town",
    "townname",
    "village",
    "villagename",
    "villagenumber",
    "municipality",
    "municipalarea",
    "municipalcorporation",
    "corporation",
    "taluka",
    "taluk",
    "tehsil",
    "subdistrict",
    "subdistrictname",
    "mandal",
    "blockname",
    "panchayat",
    "gram",
    "gramname",
    "gramapanchayat",
    "nagarpalika",
    "nagarnigam",
    "ward",
    "wardnumber",
    "wardname",

    // State / Province / Country
    "state",
    "statename",
    "statecode",
    "province",
    "provincename",
    "regionstate",
    "country",
    "countryname",
    "countrycode",
    "countryregion",
    "nation",
    "nationality",
    "territory",
    "territoryname",
    "unionterritory",
    "unionterritoryname",

    // Postal / ZIP / PIN
    "postalcode",
    "postal",
    "postcode",
    "zipcode",
    "zip",
    "zip_code",
    "zip_code_value",
    "pincode",
    "pin",
    "pin_code",
    "pinno",
    "pinnumber",
    "postalnumber",
    "postalzone",
    "postalarea",
    "zipcodevalue",
    "postalcodevalue",
    "postofficecode",
    "postoffice",
    "postofficename",
    "deliverypostcode",

    // Flat / House / Apartment
    "flat",
    "flatno",
    "flatnumber",
    "flatname",
    "flataddress",
    "houseno",
    "housenumber",
    "housename",
    "house",
    "houseaddress",
    "home",
    "homeaddress",
    "doorno",
    "doornumber",
    "door",
    "doorname",
    "apartment",
    "apartmentno",
    "apartmentnumber",
    "apartmentname",
    "unit",
    "unitno",
    "unitnumber",
    "room",
    "roomno",
    "roomnumber",
    "residence",
    "residencenumber",
    "premises",
    "premisesnumber",

    // Building / Society / Complex
    "building",
    "buildingname",
    "buildingno",
    "buildingnumber",
    "buildingaddress",
    "block",
    "blockno",
    "blocknumber",
    "blockname",
    "wing",
    "wingname",
    "wingnumber",
    "tower",
    "towername",
    "towernumber",
    "floor",
    "floorno",
    "floornumber",
    "society",
    "societyname",
    "societyaddress",
    "housingcomplex",
    "housingcolony",
    "residentialcomplex",
    "residentialsociety",
    "complex",
    "complexname",
    "complexaddress",
    "projectname",
    "projectaddress",
    "phase",
    "phasename",
    "sector",
    "sectorname",
    "sectornumber",
    "plot",
    "plotno",
    "plotnumber",
    "plotname",
    "survey",
    "surveynumber",
    "gatnumber",
    "khasranumber",

    // Indian Address Specific
    "post",
    "postname",
    "postofficeaddress",
    "talukname",
    "tehsilname",
    "districtaddress",
    "cityaddress",
    "stateaddress",
    "countryaddress",
    "gramaddress",
    "villageaddress",
    "panchayatname",
    "policestation",
    "policestationname",
    "chowk",
    "chowkname",
    "circle",
    "circlename",
    "cross",
    "mainstreet",
    "falia",
    "marg",
    "margname",
    "nagar",
    "nagarname",
    "societyno",
    "householdnumber",

    // Common Variations
    "location",
    "locationname",
    "locationdetails",
    "place",
    "placename",
    "placeofresidence",
    "residentiallocation",
    "geolocation",
    "geographicalarea",
    "addresslocation",
    "contactlocation",
    "presentlocation",
    "currentlocation",
    "permanentlocation",
    "deliverylocation",
    "mailinglocation",
    "physicaladdress",
    "fulladdress",
    "completeaddress",
    "formattedaddress"
  ];


  const addressParts = findAllFields(
    fields,
    addressAliases
  );

  const result = uniqueValues(addressParts);

  if (result.length) {
    return result.join(", ");
  }

  return fullAddress[0] || "";
};

// --------------------------------------------------
// MAIN REDUCTO MAPPER
// --------------------------------------------------

const mapReductoDataToForm = (response: any) => {
  const ocrData =
    response?.result ??
    response?.data ??
    response;

  const fields = collectOcrFields(ocrData);

  const used = new Set<number>();


  const name = findField(
    fields,
    [
      // General Name
      "name",
      "fullname",
      "full_name",
      "personname",
      "person_name",
      "displayname",
      "display_name",
      "givenname",
      "given_name",
      "firstname",
      "first_name",
      "middlename",
      "middle_name",
      "lastname",
      "last_name",
      "surname",
      "familyname",
      "family_name",
      "preferredname",
      "preferred_name",
      "legalname",
      "legal_name",
      "officialname",
      "complete_name",
      "completefullname",
      "individualname",
      "individual_name",

      // Contact Person
      "contactname",
      "contact_name",
      "contactperson",
      "contact_person",
      "primarycontact",
      "primary_contact",
      "maincontact",
      "main_contact",
      "secondarycontact",
      "secondary_contact",
      "alternatecontact",
      "alternate_contact",
      "emergencycontact",
      "emergency_contact",
      "pointofcontact",
      "poc",
      "contactpersonname",
      "contactfullname",
      "contactfullname",
      "contactfirstname",
      "contactlastname",

      // Company / Business People
      "ownername",
      "owner_name",
      "businessowner",
      "business_owner",
      "companyowner",
      "company_owner",
      "proprietorname",
      "proprietor_name",
      "foundername",
      "founder_name",
      "cofoundername",
      "co_founder_name",
      "partnername",
      "partner_name",
      "directorname",
      "director_name",
      "managingdirectор",
      "managingdirector",
      "ceoname",
      "ceo_name",
      "presidentname",
      "president_name",
      "chairmanname",
      "chairman_name",
      "chairpersonname",
      "authorizedperson",
      "authorized_person",
      "authorizedsignatory",
      "authorized_signatory",
      "signatoryname",
      "signatory_name",

      // Employee / Staff
      "employeename",
      "employee_name",
      "staffname",
      "staff_name",
      "workername",
      "worker_name",
      "teamname",
      "team_member_name",
      "teammembername",
      "membername",
      "member_name",
      "personnelname",
      "personnel_name",
      "employeefullname",
      "stafffullname",
      "employeefirstname",
      "employeelastname",
      "hrcontactname",
      "hrpersonname",

      // Customer / Client
      "customername",
      "customer_name",
      "clientname",
      "client_name",
      "username",
      "user_name",
      "useridname",
      "userfullname",
      "accountname",
      "account_name",
      "accountowner",
      "account_owner",
      "subscribername",
      "subscriber_name",
      "memberfullname",
      "customerfullname",
      "clientfullname",
      "buyername",
      "buyer_name",
      "sellername",
      "seller_name",
      "vendorname",
      "vendor_name",
      "suppliername",
      "supplier_name",

      // Professional / Job Roles
      "representativename",
      "representative_name",
      "salesperson",
      "salespersonname",
      "salesperson_name",
      "salesrep",
      "salesrepresentative",
      "sales_representative",
      "agentname",
      "agent_name",
      "consultantname",
      "consultant_name",
      "advisorname",
      "advisor_name",
      "managername",
      "manager_name",
      "executivename",
      "executive_name",
      "officername",
      "officer_name",
      "professionalname",
      "professional_name",
      "candidate_name",
      "candidatename",
      "applicantname",
      "applicant_name",
      "recruitername",
      "recruiter_name",
      "interviewername",
      "interviewer_name",

      // Identity / Profile
      "profilename",
      "profile_name",
      "person",
      "fullnamevalue",
      "namevalue",
      "nametext",
      "personfullname",
      "individualfullname",
      "publicname",
      "nickname",
      "nick_name",
      "aliasname",
      "alias_name",
      "knownas",
      "calledname",
      "honorificname",
      "titleandname",
      "salutationname",
      "prefixname",

      // Business Card Specific
      "cardholdername",
      "cardholder_name",
      "cardname",
      "businesscardname",
      "business_card_name",
      "visitingcardname",
      "visiting_card_name",
      "printedname",
      "printed_name",
      "signature_name",
      "signature",
      "cardtextname",
      "contactcardname",

      // Additional Variations
      "firstnameandlastname",
      "firstandlastname",
      "firstmiddlelastname",
      "first_name_last_name",
      "fullnameenglish",
      "nameenglish",
      "englishname",
      "native_name",
      "indianname",
      "personaldetailsname",
      "applicantfullname",
      "primaryname",
      "secondaryname",
      "othername",
      "alternate_name",
      "alternatefullname",
      "legalfullname",
      "registeredname",
      "registrationname",
      "passportname",
      "identityname",
      "idname",
      "title",
      "contact",
      "persondetails",
      "name"
    ],
    used
  );



  const designation = findField(
    fields,
    [
      // General Designation
      "designation",
      "jobtitle",
      "job_title",
      "jobtitleorprofession",
      "job_title_or_profession",
      "jobrole",
      "job_role",
      "role",
      "position",
      "positiontitle",
      "position_title",
      "currentposition",
      "current_position",
      "currentdesignation",
      "current_designation",
      "currentrole",
      "current_role",
      "officialtitle",
      "official_title",
      "professionaltitle",
      "professional_title",
      "employeetitle",
      "employee_title",
      "worktitle",
      "work_title",
      "occupation",
      "profession",
      "professionalrole",
      "professional_role",
      "businessrole",
      "business_role",
      "careerrole",
      "careerposition",
      "staffdesignation",
      "employeedesignation",
      "persondesignation",

      // Executive / C-Level
      "ceo",
      "ceoname",
      "ceotitle",
      "chiefexecutiveofficer",
      "chief_executive_officer",
      "cto",
      "chieftechnologyofficer",
      "chief_technology_officer",
      "cfo",
      "chieffinancialofficer",
      "chief_financial_officer",
      "coo",
      "chiefoperatingofficer",
      "chief_operating_officer",
      "cmo",
      "chiefmarketingofficer",
      "chief_marketing_officer",
      "cio",
      "chiefinformationofficer",
      "chief_information_officer",
      "cso",
      "chiefstrategyofficer",
      "chiefstrategy_officer",
      "chro",
      "chiefhumanresourcesofficer",
      "chiefhumanresources_officer",
      "chiefpeopleofficer",
      "chiefproductofficer",
      "chieftechnologyexecutive",
      "managingdirector",
      "managing_director",
      "executivedirector",
      "executive_director",
      "jointmanagingdirector",
      "joint_managing_director",
      "president",
      "vicepresident",
      "vice_president",
      "svp",
      "evp",
      "avp",
      "md",
      "director",
      "boarddirector",
      "board_director",
      "chairman",
      "chairperson",
      "vicechairman",
      "vice_chairman",

      // Management
      "manager",
      "generalmanager",
      "general_manager",
      "senior manager",
      "seniormanager",
      "assistantmanager",
      "assistant_manager",
      "deputymanager",
      "deputy_manager",
      "branchmanager",
      "branch_manager",
      "areamanager",
      "area_manager",
      "regionalmanager",
      "regional_manager",
      "projectmanager",
      "project_manager",
      "productmanager",
      "product_manager",
      "operationsmanager",
      "operations_manager",
      "businessmanager",
      "business_manager",
      "officemanager",
      "office_manager",
      "salesmanager",
      "sales_manager",
      "marketingmanager",
      "marketing_manager",
      "hrmanager",
      "hr_manager",
      "teamlead",
      "team_lead",
      "teamleader",
      "team_leader",
      "supervisor",
      "administrator",
      "admin",
      "head",
      "departmenthead",
      "department_head",
      "headofdepartment",
      "head_of_department",
      "headofoperations",
      "headofsales",
      "headofmarketing",
      "headofhr",
      "headoffinance",

      // Founder / Ownership
      "founder",
      "cofounder",
      "co_founder",
      "owner",
      "businessowner",
      "business_owner",
      "companyowner",
      "company_owner",
      "proprietor",
      "soleproprietor",
      "partner",
      "managingpartner",
      "managing_partner",
      "seniorpartner",
      "senior_partner",
      "foundingpartner",
      "founding_partner",
      "coowner",
      "co_owner",
      "principal",
      "businessprincipal",
      "promoter",
      "co_promoter",

      // Technical / IT
      "engineer",
      "softwareengineer",
      "software_engineer",
      "seniorengineer",
      "senior_engineer",
      "developer",
      "softwaredeveloper",
      "software_developer",
      "webdeveloper",
      "web_developer",
      "frontenddeveloper",
      "backenddeveloper",
      "fullstackdeveloper",
      "mobiledeveloper",
      "appdeveloper",
      "technicallead",
      "technical_lead",
      "techlead",
      "tech_lead",
      "architect",
      "softwarearchitect",
      "software_architect",
      "solutionarchitect",
      "solution_architect",
      "systemarchitect",
      "system_architect",
      "technicalarchitect",
      "technical_architect",
      "itmanager",
      "it_manager",
      "ithead",
      "it_head",
      "systemadministrator",
      "system_administrator",
      "networkengineer",
      "network_engineer",
      "databasadministrator",
      "databaseadministrator",
      "dataengineer",
      "data_engineer",
      "dataanalyst",
      "data_analyst",
      "businessanalyst",
      "business_analyst",
      "softwareconsultant",
      "technicalconsultant",

      // Sales / Marketing
      "salesexecutive",
      "sales_executive",
      "salesofficer",
      "sales_officer",
      "salesrepresentative",
      "sales_representative",
      "salesrep",
      "businessdevelopmentexecutive",
      "business_development_executive",
      "businessdevelopmentmanager",
      "business_development_manager",
      "bde",
      "bdm",
      "marketingexecutive",
      "marketing_executive",
      "marketingofficer",
      "marketing_officer",
      "digitalmarketingmanager",
      "digital_marketing_manager",
      "digitalmarketingexecutive",
      "digital_marketing_executive",
      "brandmanager",
      "brand_manager",
      "accountmanager",
      "account_manager",
      "keyaccountmanager",
      "key_account_manager",
      "relationshipmanager",
      "relationship_manager",
      "publicrelationsmanager",
      "public_relations_manager",

      // Finance / Accounts
      "accountant",
      "senioraccountant",
      "senior_accountant",
      "chiefaccountant",
      "chief_accountant",
      "financeofficer",
      "finance_officer",
      "financeexecutive",
      "finance_executive",
      "financecontroller",
      "finance_controller",
      "financialanalyst",
      "financial_analyst",
      "auditor",
      "internalauditor",
      "internalauditor",
      "taxconsultant",
      "tax_consultant",
      "charteredaccountant",
      "chartered_accountant",
      "ca",
      "cpa",
      "costaccountant",
      "cost_accountant",
      "accountsmanager",
      "accounts_manager",
      "accountshead",
      "accounts_head",

      // HR / Administration
      "hr",
      "hrhead",
      "hr_head",
      "hrofficer",
      "hr_officer",
      "hrexecutive",
      "hr_executive",
      "humanresourcemanager",
      "human_resource_manager",
      "recruiter",
      "talentacquisitionmanager",
      "talent_acquisition_manager",
      "hrbusinesspartner",
      "hr_business_partner",
      "administrativeofficer",
      "administrative_officer",
      "adminmanager",
      "admin_manager",
      "officeadministrator",
      "office_administrator",

      // Consultant / Advisor
      "consultant",
      "seniorconsultant",
      "senior_consultant",
      "managementconsultant",
      "management_consultant",
      "businessconsultant",
      "business_consultant",
      "technicalconsultant",
      "technical_consultant",
      "advisor",
      "adviser",
      "businessadvisor",
      "business_advisor",
      "financialadvisor",
      "financial_advisor",
      "legaladvisor",
      "legal_advisor",
      "strategyadvisor",
      "strategy_advisor",
      "expert",
      "specialist",
      "subjectmatterexpert",
      "subject_matter_expert",

      // Medical / Healthcare
      "doctor",
      "physician",
      "surgeon",
      "dentist",
      "medicalofficer",
      "medical_officer",
      "medicaldirector",
      "medical_director",
      "nurse",
      "nursingofficer",
      "nursing_officer",
      "pharmacist",
      "therapist",
      "physiotherapist",
      "healthcareprofessional",
      "healthcare_professional",
      "medicalconsultant",
      "medical_consultant",

      // Education
      "teacher",
      "professor",
      "assistantprofessor",
      "associateprofessor",
      "lecturer",
      "principal",
      "viceprincipal",
      "vice_principal",
      "dean",
      "hod",
      "headofdepartment",
      "academiccoordinator",
      "academic_coordinator",
      "trainer",
      "instructor",
      "educator",

      // Design / Creative
      "designer",
      "graphicdesigner",
      "graphic_designer",
      "uiuxdesigner",
      "ui_ux_designer",
      "uidesigner",
      "uxdesigner",
      "creative_director",
      "creativedirector",
      "artdirector",
      "art_director",
      "contentwriter",
      "content_writer",
      "copywriter",
      "photographer",
      "videographer",

      // Legal / Government
      "lawyer",
      "advocate",
      "attorney",
      "legalofficer",
      "legal_officer",
      "legalmanager",
      "legal_manager",
      "solicitor",
      "magistrate",
      "judge",
      "governmentofficer",
      "government_officer",
      "publicofficer",
      "public_officer",
      "civilservant",
      "civil_servant",

      // Indian Common Titles
      "proprietor",
      "director",
      "managingdirector",
      "partner",
      "workingpartner",
      "working_partner",
      "authorizedsignatory",
      "authorized_signatory",
      "signatory",
      "companysecretary",
      "company_secretary",
      "cs",
      "advocate",
      "charteredaccountant",
      "ca",
      "consultingengineer",
      "retired",
      "selfemployed",
      "self_employed",
      "freelancer",
      "entrepreneur",
      "businessman",
      "businesswoman",
      "trader",
      "dealer",
      "contractor",
      "manufacturer",
      "distributor",
      "supplier",

      // Other Variations
      "job",
      "jobposition",
      "job_position",
      "workrole",
      "work_role",
      "designationtitle",
      "title",
      "professional",
      "career",
      "careerdesignation",
      "employeerole",
      "employee_role",
      "staffrole",
      "staff_role",
      "teamrole",
      "team_role",
      "departmentrole",
      "department_role",
      "businessdesignation",
      "professionaldesignation",
      "positionname",
      "position_name",
      "role_name",
      "rolename",
      "rank",
      "grade",
      "level"
    ],
    used
  );



  const company = findField(
    fields,
    [
      // General Company
      "company",
      "companyname",
      "company_name",
      "companytitle",
      "company_title",
      "companyfullname",
      "companydisplayname",
      "companylegalname",
      "companyregisteredname",
      "companydetails",
      "companyinfo",
      "companyinformation",
      "companyprofile",
      "companyidentity",

      // Organization
      "organization",
      "organizationname",
      "organization_name",
      "organisation",
      "organisationname",
      "organisation_name",
      "organizationtitle",
      "organisationtitle",
      "organizationdetails",
      "organisationdetails",
      "organizationinfo",
      "organisationinfo",
      "organizationfullname",
      "organisationfullname",
      "orgname",
      "org_name",
      "org",
      "entityname",
      "entity_name",
      "legalentityname",
      "legal_entity_name",

      // Business
      "business",
      "businessname",
      "business_name",
      "businessfullname",
      "businessdisplayname",
      "businesslegalname",
      "businessregisteredname",
      "businessdetails",
      "businessinfo",
      "businessprofile",
      "businessidentity",
      "businessentity",
      "business_entity",
      "businessunit",
      "business_unit",
      "businessgroup",
      "business_group",
      "businessestablishment",
      "establishmentname",
      "establishment_name",
      "tradeestablishment",

      // Corporate
      "corporatename",
      "corporate_name",
      "corporate",
      "corporatetitle",
      "corporateidentity",
      "corporatedetails",
      "corporateinfo",
      "corporateentity",
      "corporate_entity",
      "corporategroup",
      "corporation",
      "corporationname",
      "corporation_name",
      "corpname",
      "corp_name",

      // Legal / Registered
      "legalname",
      "legal_name",
      "registeredname",
      "registered_name",
      "registrationname",
      "registration_name",
      "officialname",
      "official_name",
      "statutoryname",
      "statutory_name",
      "entitylegalname",
      "registeredentityname",
      "legalbusinessname",
      "legal_business_name",
      "legalcompanyname",
      "legal_company_name",
      "incorporatedname",
      "incorporated_name",
      "incorporationname",
      "incorporation_name",
      "registeredcompany",
      "registered_company",
      "registeredbusiness",
      "registered_business",

      // Trade / Trading
      "tradename",
      "trade_name",
      "tradingname",
      "trading_name",
      "tradingas",
      "doingbusinessas",
      "dba",
      "brandname",
      "brand_name",
      "brand",
      "brandtitle",
      "brandidentity",
      "commercialname",
      "commercial_name",
      "marketname",
      "market_name",
      "productbrand",
      "businessbrand",

      // Firm / Enterprise
      "firm",
      "firmname",
      "firm_name",
      "firmtitle",
      "firmdetails",
      "firmprofile",
      "enterprise",
      "enterprisename",
      "enterprise_name",
      "enterprisegroup",
      "enterprise_group",
      "companygroup",
      "company_group",
      "groupname",
      "group_name",
      "holdingcompany",
      "holding_company",
      "parentcompany",
      "parent_company",
      "subsidiaryname",
      "subsidiary_name",
      "startupname",
      "startup_name",
      "venture_name",
      "venturename",

      // Employer / Work
      "employer",
      "employername",
      "employer_name",
      "workplace",
      "workplacename",
      "workplace_name",
      "workcompany",
      "work_company",
      "officecompany",
      "office_company",
      "organizationemployer",
      "companyemployer",
      "employmentcompany",
      "employment_company",

      // Vendor / Supplier / Distributor
      "vendor",
      "vendorname",
      "vendor_name",
      "supplier",
      "suppliername",
      "supplier_name",
      "distributor",
      "distributorname",
      "distributor_name",
      "manufacturer",
      "manufacturername",
      "manufacturer_name",
      "producername",
      "producer_name",
      "dealername",
      "dealer_name",
      "retailername",
      "retailer_name",
      "wholesalername",
      "wholesaler_name",
      "tradername",
      "trader_name",
      "merchantname",
      "merchant_name",
      "partnercompany",
      "partner_company",
      "clientcompany",
      "client_company",
      "customercompany",
      "customer_company",

      // Institution / Agency
      "institution",
      "institutionname",
      "institution_name",
      "agency",
      "agencyname",
      "agency_name",
      "association",
      "associationname",
      "association_name",
      "foundation",
      "foundationname",
      "foundation_name",
      "trustname",
      "trust_name",
      "schoolname",
      "school_name",
      "collegename",
      "college_name",
      "universityname",
      "university_name",
      "hospitalname",
      "hospital_name",
      "organizationtype",
      "institutiontitle",

      // Professional / Business Card
      "businesscardcompany",
      "business_card_company",
      "cardcompany",
      "card_company",
      "visitingcardcompany",
      "visiting_card_company",
      "companyoncard",
      "businesscardname",
      "cardbusinessname",
      "professionalcompany",
      "professional_company",
      "associatedcompany",
      "associated_company",
      "currentcompany",
      "current_company",
      "previouscompany",
      "previous_company",
      "affiliatedcompany",
      "affiliated_company",

      // Indian Business Variations
      "proprietorshipname",
      "proprietorship_name",
      "proprietorship",
      "partnershipname",
      "partnership_name",
      "llpname",
      "llp_name",
      "pvtltdname",
      "pvt_ltd_name",
      "privatelimitedname",
      "private_limited_name",
      "limitedcompanyname",
      "limited_company_name",
      "publiclimitedname",
      "public_limited_name",
      "opcname",
      "opc_name",
      "msmen ame",
      "gstlegalname",
      "gst_legal_name",
      "gsttradename",
      "gst_trade_name",
      "gstregisteredname",
      "gst_registered_name",
      "cincompanyname",
      "registeredfirmname",

      // Other Common Variations
      "organizationtitle",
      "companylabel",
      "companyvalue",
      "businessvalue",
      "entity",
      "companyentity",
      "businessentityname",
      "nameofcompany",
      "nameofbusiness",
      "nameoforganization",
      "nameoforganisation",
      "nameofemployer",
      "nameofenterprise",
      "nameofcorporation",
      "nameofinstitution",
      "companyheading",
      "businessheading",
      "organizationheading",
      "companytext",
      "businesscardtext",
      "companycardtext"
    ],
    used
  );


  const emails = extractEmails(fields);
  const phones = extractPhones(fields);

  const email1 = emails[0] || "";
  const email2 = emails[1] || "";

  const phone1 = phones[0] || "";
  const phone2 = phones[1] || "";

  const website = extractWebsite(fields);
  const address = extractAddress(fields);


  const description = findField(
    fields,
    [
      // General Description
      "description",
      "details",
      "detail",
      "about",
      "aboutus",
      "aboutme",
      "about_us",
      "about_me",
      "information",
      "info",
      "overview",
      "summary",
      "introduction",
      "intro",
      "content",
      "text",
      "descriptiontext",
      "descriptiondetails",
      "shortdescription",
      "longdescription",
      "fulldescription",
      "briefdescription",
      "detailed_description",
      "generaldescription",
      "profiledescription",

      // Company / Business
      "companydescription",
      "businessdescription",
      "organizationdescription",
      "organisationdescription",
      "corporatedescription",
      "firmdescription",
      "companyoverview",
      "businessoverview",
      "organizationoverview",
      "organisationoverview",
      "corporateoverview",
      "firmoverview",
      "companyprofile",
      "businessprofile",
      "organizationprofile",
      "organisationprofile",
      "corporateprofile",
      "companydetails",
      "businessdetails",
      "organizationdetails",
      "organisationdetails",
      "companyinformation",
      "businessinformation",
      "companyintro",
      "businessintro",
      "companyintroduction",
      "businessintroduction",
      "companybackground",
      "businessbackground",
      "companyhistory",
      "businesshistory",
      "companyabout",
      "businessabout",

      // About / Identity
      "aboutcompany",
      "aboutbusiness",
      "aboutorganization",
      "aboutorganisation",
      "aboutbrand",
      "aboutservice",
      "aboutproduct",
      "whoarewe",
      "whoweare",
      "whowearesection",
      "whowearetext",
      "whatwedo",
      "whatwedotext",
      "whatweoffer",
      "whatweoffersections",
      "whychooseus",
      "whyus",
      "ourstory",
      "ourcompany",
      "ourbusiness",
      "ourorganization",
      "ourorganisation",
      "ourbrand",
      "ourprofile",
      "ourbackground",
      "ourhistory",

      // Professional / Personal
      "bio",
      "biography",
      "profile",
      "profilebio",
      "professionalbio",
      "professionalbiography",
      "professionaldescription",
      "professionalsummary",
      "professionaldetails",
      "personaldetails",
      "personaldescription",
      "personalsummary",
      "userbio",
      "userdescription",
      "memberbio",
      "employeebio",
      "founderbio",
      "directorprofile",
      "ceoprofile",
      "executiveprofile",
      "consultantprofile",
      "expertprofile",
      "authorbio",
      "aboutperson",
      "careerprofile",
      "careerobjective",
      "careeroverview",
      "worksummary",
      "experienceoverview",

      // Services / Products
      "services",
      "service",
      "servicedescription",
      "servicedetails",
      "serviceoverview",
      "servicessummary",
      "ourservices",
      "servicesoffered",
      "serviceofferings",
      "product",
      "products",
      "productdescription",
      "productdetails",
      "productoverview",
      "productsummary",
      "ourproducts",
      "productoffering",
      "productofferings",
      "offerings",
      "solutions",
      "solutiondescription",
      "solutiondetails",
      "businesssolutions",
      "servicesandproducts",
      "productsandservices",
      "whatweprovide",
      "whatweoffer",
      "ourwork",
      "workdescription",
      "workdetails",
      "specialization",
      "specializations",
      "expertise",
      "coreexpertise",
      "corecompetencies",
      "capabilities",
      "keycapabilities",

      // Mission / Vision / Values
      "mission",
      "ourmission",
      "missionstatement",
      "missiondescription",
      "vision",
      "ourvision",
      "visionstatement",
      "visiondescription",
      "values",
      "ourvalues",
      "corevalues",
      "companyvalues",
      "businessvalues",
      "philosophy",
      "businessphilosophy",
      "companyphilosophy",
      "purpose",
      "ourpurpose",
      "companypurpose",
      "businesspurpose",
      "objectives",
      "goals",
      "companygoals",
      "businessgoals",

      // Tagline / Marketing
      "tagline",
      "slogan",
      "motto",
      "headline",
      "subheadline",
      "subtitle",
      "title",
      "catchline",
      "catchphrase",
      "brandstatement",
      "brandmessage",
      "branddescription",
      "brandoverview",
      "brandstory",
      "marketingdescription",
      "marketingtext",
      "promotionaltext",
      "promotionaldescription",
      "advertisementtext",
      "advertisingdescription",
      "keymessage",
      "uniquevalueproposition",
      "valueproposition",
      "usp",
      "elevatorpitch",

      // Portfolio / Projects
      "portfolio",
      "portfoliodescription",
      "portfoliooverview",
      "projectdescription",
      "projectdetails",
      "projectoverview",
      "projectsummary",
      "workportfolio",
      "pastwork",
      "achievements",
      "accomplishments",
      "milestones",
      "successstory",
      "successstories",
      "casestudy",
      "casestudies",
      "references",
      "credentials",

      // Industry / Professional Details
      "industrydescription",
      "industryoverview",
      "industryexperience",
      "domainexpertise",
      "technicalexpertise",
      "businessdomain",
      "businessactivities",
      "natureofbusiness",
      "businessnature",
      "primaryactivities",
      "corebusiness",
      "businessmodel",
      "operationaloverview",
      "companyactivities",
      "professionalexpertise",
      "areofexpertise",
      "fieldofexpertise",
      "speciality",
      "specialties",

      // Additional Common Variations
      "descriptions",
      "aboutsection",
      "abouttext",
      "overviewtext",
      "summarytext",
      "infotext",
      "profiletext",
      "biotext",
      "introtext",
      "introductiontext",
      "companytext",
      "businesstext",
      "serviceintro",
      "productintro",
      "additionalinformation",
      "additionaldetails",
      "otherdetails",
      "remarks",
      "notes",
      "comment",
      "comments",
      "disclaimer",
      "cardtext",
      "businesscarddescription",
      "companycarddescription",
      "shortbio",
      "longbio",
      "briefbio",
      "extendedbio",
      "shortoverview",
      "longoverview",
      "extendeddescription",
      "detailedoverview",
      "fullprofile",
      "profileoverview",
      "profileinformation",
      "organizationbio",
      "organisationbio",
      "corporatebio",
      "businessbio",
      "companybio"
    ],
    used
  );


  const mappedResult = {
    name,
    designation,
    mobileno: phone1,
    mobileno2: phone2,
    emailid: email1,
    emailid2: email2,
    company,
    address,
    website,
    description,
    cardtext: "-",

  };

  return mappedResult;
};

const formFieldAliases: Record<string, string[]> = {
  name: [
    "name",
    "fullname",
    "personname",
    "contactname",
    "contactperson",
    "cardholdername",
    "primarycontactname",
  ],
  designation: [
    "designation",
    "jobtitle",
    "jobrole",
    "position",
    "profession",
    "occupation",
  ],
  company: [
    "company",
    "companyname",
    "organization",
    "organizationname",
    "businessname",
    "firmname",
  ],
  address: [
    "address",
    "fulladdress",
    "businessaddress",
    "officeaddress",
    "companyaddress",
  ],
  website: [
    "website",
    "webaddress",
    "websiteurl",
    "url",
    "homepage",
    "companywebsite",
  ],
  description: [
    "description",
    "companydescription",
    "businessdescription",
    "about",
    "aboutus",
    "services",
    "overview",
  ],
  emailid: [
    "email",
    "emailid",
    "emailaddress",
    "email1",
    "emailid1",
    "emailaddress1",
    "primaryemail",
    "workemail",
    "businessemail",
    "officialemail",
  ],
  emailid2: [
    "email2",
    "emailid2",
    "emailaddress2",
    "secondaryemail",
    "alternateemail",
    "personalemail",
  ],
  mobileno: [
    "mobile",
    "mobileno",
    "mobileno1",
    "mobilenumber",
    "mobilenumber1",
    "phone",
    "phone1",
    "phoneno",
    "phoneno1",
    "phonenumber",
    "phonenumber1",
    "telephonenumber",
    "telephone",
    "telephoneno",
    "officephone",
    "businessphone",
    "primaryphone",
    "workphone",
  ],
  mobileno2: [
    "mobile2",
    "mobileno2",
    "mobilenumber2",
    "phone2",
    "phoneno2",
    "phonenumber2",
    "telephoneno2",
    "telephonenumber2",
    "secondaryphone",
    "alternatephone",
    "personalphone",
  ],
};

const nonEmptyOcrValues = (
  values: Record<string, any>
): Record<string, any> =>
  Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    )
  );

const bindOcrValuesToControls = (
  values: Record<string, string>,
  controls: any[]
): Record<string, string> => {
  if (!Array.isArray(controls) || controls.length === 0) {
    return values;
  }

  const result = { ...values };
  const assignedControlFields = new Set<string>();

  Object.entries(formFieldAliases).forEach(([valueKey, aliases]) => {
    const value = values[valueKey];
    if (!value) return;

    const normalizedAliases = new Set(
      aliases.map(alias => normalizeKey(alias))
    );
    const control = controls.find(candidate => {
      const field = String(candidate?.field || "");
      const title = String(candidate?.fieldtitle || "");
      const normalizedField = normalizeKey(field);
      const normalizedTitle = normalizeKey(title);

      return (
        field &&
        !assignedControlFields.has(field) &&
        (
          normalizedAliases.has(normalizedField) ||
          normalizedAliases.has(normalizedTitle)
        )
      );
    });

    if (!control?.field) return;

    result[control.field] = value;
    assignedControlFields.add(control.field);

    if (control.field !== valueKey) {
      delete result[valueKey];
    }
  });

  if (values.name && result.name) {
    const findControl = (aliases: string[]) =>
      controls.find(candidate =>
        [candidate?.field, candidate?.fieldtitle]
          .filter(Boolean)
          .some(value =>
            aliases.includes(normalizeKey(String(value)))
          )
      );
    const firstNameControl = findControl(["firstname", "givenname"]);
    const lastNameControl = findControl([
      "lastname",
      "familyname",
      "surname",
    ]);

    if (firstNameControl?.field && lastNameControl?.field) {
      const nameParts = values.name.trim().split(/\s+/);
      const middleNameControl = findControl(["middlename"]);

      result[firstNameControl.field] = nameParts[0] || "";
      if (middleNameControl?.field && nameParts.length > 2) {
        result[middleNameControl.field] = nameParts
          .slice(1, -1)
          .join(" ");
      }
      result[lastNameControl.field] =
        nameParts.length > 1
          ? middleNameControl?.field && nameParts.length > 2
            ? nameParts[nameParts.length - 1]
            : nameParts.slice(1).join(" ")
          : "";
      delete result.name;
    }
  }

  return result;
};

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

const DevBusinessCardView = ({
  setValue,
  controls,
  item,
  baseLink,
  infoData,
  isFromInvoiceReader = false,
  setFormValues
}: any) => {
  const navigation = useNavigation();

  console.log("BusinessCardView isFromInvoiceReader:", isFromInvoiceReader);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [base64, setBase64] = useState<string | false>(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [showPicker, setShowPicker] = useState(false);
  const [scanLoader, setScanLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingLarge, setLoadingLarge] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const { t } = useTranslations();
  const { height, width } = useWindowDimensions();

  const isIpad =
    (Platform.OS === "ios" && Platform.isPad) ||
    DeviceInfo.isTablet() ||
    Platform.isTV;

  const isLandscape = width > height;
  const theme = useAppSelector(state => state?.theme.mode);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const lastScale = useRef<any>(1);
  const lastTranslate = useRef({ x: 0, y: 0 });

  // --------------------------------------------------
  // IMAGE URI
  // --------------------------------------------------

  const getImageUri = (type: "small" | "large") => {
    const base =
      imageUri ||
      `${baseLink}fileupload/1/${infoData?.tableName}/${infoData?.id}/${item?.text}`;

    return `${base}?cb=${cacheBuster}`;
  };

  // --------------------------------------------------
  // ZOOM
  // --------------------------------------------------

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (evt, gesture) => {
        if (gesture.numberActiveTouches === 1) {
          translateX.setValue(
            lastTranslate.current.x + gesture.dx
          );

          translateY.setValue(
            lastTranslate.current.y + gesture.dy
          );
        } else if (gesture.numberActiveTouches === 2) {
          const touches = evt.nativeEvent.touches;

          const dx = touches[0].pageX - touches[1].pageX;
          const dy = touches[0].pageY - touches[1].pageY;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (!lastScale.currentDistance) {
            lastScale.currentDistance = distance;
          }

          const scaleFactor =
            distance / lastScale.currentDistance;

          scale.setValue(
            Math.max(
              1,
              Math.min(
                3,
                lastScale.current * scaleFactor
              )
            )
          );
        }
      },

      onPanResponderRelease: (_, gesture) => {
        lastTranslate.current.x += gesture.dx;
        lastTranslate.current.y += gesture.dy;

        lastScale.current = scale.__getValue();
        lastScale.currentDistance = undefined;
      },
    })
  ).current;

  const zoomIn = () => {
    scale.setValue(
      Math.min(3, scale.__getValue() + 0.2)
    );

    lastScale.current = scale.__getValue();
  };

  const zoomOut = () => {
    scale.setValue(
      Math.max(1, scale.__getValue() - 0.2)
    );

    lastScale.current = scale.__getValue();
  };

  const resetZoom = () => {
    scale.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);

    lastTranslate.current = { x: 0, y: 0 };
    lastScale.current = 1;
  };

  // --------------------------------------------------
  // PERMISSION
  // --------------------------------------------------

  const checkPermission = async (
    type: "camera" | "gallery"
  ) => {
    if (type === "gallery") return true;

    let permission: any;

    if (Platform.OS === "ios") {
      permission =
        type === "camera"
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else if (type === "camera") {
      permission = PERMISSIONS.ANDROID.CAMERA;
    }

    if (!permission) return false;

    const result = await check(permission);

    switch (result) {
      case RESULTS.GRANTED:
        return true;

      case RESULTS.DENIED: {
        const req = await request(permission);

        if (req === RESULTS.GRANTED) return true;

        Alert.alert(
          "Permission Required",
          `Please allow ${type} access to continue.`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Go to Settings",
              onPress: () => openSettings(),
            },
          ]
        );

        return false;
      }

      case RESULTS.BLOCKED:
        Alert.alert(
          "Permission Blocked",
          `Please enable ${type} access from Settings.`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Go to Settings",
              onPress: () => openSettings(),
            },
          ]
        );

        return false;

      case RESULTS.UNAVAILABLE:
        Alert.alert(
          "Feature Unavailable",
          `${type} permission is not available on this device.`
        );

        return false;

      default:
        return false;
    }
  };

  // --------------------------------------------------
  // CAMERA
  // --------------------------------------------------

  const pickFromCamera = async () => {
    const granted = await checkPermission("camera");

    if (!granted) return;

    setShowPicker(false);

    setTimeout(() => {
      navigation.navigate(
        "FaceCameraScreen" as never,
        {
          onCapture: async (photoPath: string) => {
            setTimeout(async () => {
              try {
                if (!photoPath) return;

                const originalUri =
                  photoPath.startsWith("file://")
                    ? photoPath
                    : `file://${photoPath}`;

                let resizedImage: any;

                try {
                  resizedImage =
                    await ImageResizer.createResizedImage(
                      originalUri,
                      800,
                      800,
                      "JPEG",
                      70,
                      0
                    );
                } catch (error) {
                  resizedImage =
                    await ImageResizer.createResizedImage(
                      originalUri,
                      600,
                      600,
                      "JPEG",
                      50,
                      0
                    );
                }

                const finalBase64 = await RNFS.readFile(
                  resizedImage.uri.replace("file://", ""),
                  "base64"
                );

                setCacheBuster(Date.now());

                setBase64(
                  `${item?.field}.jpeg;data:image/jpeg;base64,${finalBase64}`
                );

                setImageUri(resizedImage.uri);
              } catch (error) {
                console.log("Image Process Error:", error);
                setImageUri("");
              }
            }, 300);
          },

          isFromDashboard: false,
          isBackActive: true,
          isFromAttendance: false,
        } as never
      );
    }, 400);
  };

  // --------------------------------------------------
  // GALLERY
  // --------------------------------------------------

  const pickFromGallery = async () => {
    const granted = await checkPermission("gallery");

    if (!granted) return;

    setShowPicker(false);

    setTimeout(async () => {
      try {
        const res = await launchImageLibrary({
          mediaType: "photo",
          quality: 0.5,
          includeBase64: true,
        });

        if (res.didCancel) return;

        if (res.assets && res.assets.length > 0) {
          const asset = res.assets[0];

          if (!asset.uri) return;

          let uri = asset.uri;

          if (
            Platform.OS === "android" &&
            !uri.startsWith("file://")
          ) {
            uri = `file://${uri}`;
          }

          setCacheBuster(Date.now());

          setBase64(
            `${item?.field}.jpeg;data:${asset.type};base64,${asset.base64}`
          );

          setImageUri(uri);
        }
      } catch (error) {
        console.log("Gallery Error:", error);
      }
    }, 400);
  };

  // --------------------------------------------------
  // NORMAL BUSINESS CARD OCR
  // --------------------------------------------------

  const parseCard = (text: string): any => {
    let cleanText = text
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[|]/g, "I")
      .replace(/\s*@\s*/g, "@")
      .replace(/\s*\.\s*/g, ".")
      .replace(/\s{2,}/g, " ")
      .trim();

    const lines = cleanText
      .split(/\n|\\n/)
      .map(line => line.trim())
      .filter(Boolean);

    const result: any = {
      name: "",
      designation: "",
      company: "",
      emailid: "",
      emailid2: "",
      mobileno: "",
      mobileno2: "",
      website: "",
      address: "",
      description: "",
      [item?.field]: base64,
      cardtext: cleanText,
    };

    // Emails
    const emailRegex =
      /\b[A-Za-z0-9._%+-]+ *@ *[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

    const emails = uniqueValues([
      ...cleanText.matchAll(emailRegex),
    ].map(e => e[0].replace(/\s+/g, "")));

    result.emailid = emails[0] || "";
    result.emailid2 = emails[1] || "";

    // Phones
    const phoneRegex = /(\+?\d[\d\s().-]{7,}\d)/g;

    const phones = [
      ...cleanText.matchAll(phoneRegex),
    ]
      .flatMap(p => splitPhoneCandidate(p[0]));

    const normalizedPhones = uniquePhones(phones);

    result.mobileno = normalizedPhones[0] || "";
    result.mobileno2 = normalizedPhones[1] || "";

    // Website
    const webRegex =
      /\b((https?:\/\/|www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:[\/\w.-]*)?\b/g;

    const invalidDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "rediffmail.com",
      "icloud.com",
      "protonmail.com",
      "zoho.com",
      "mail.com",
      "yandex.com",
      "aol.com",
      "msn.com",
    ];

    let websites = [
      ...cleanText.matchAll(webRegex),
    ]
      .map(w =>
        w[0]
          .replace(/[-–—;,]+$/g, "")
          .replace(
            /\s+(pvt|ltd|private|limited|company|solutions?|technologies|systems?).*/i,
            ""
          )
          .replace(/^https?:\/\//i, "")
          .replace(/^\/+|\/+$/g, "")
          .trim()
      )
      .filter(
        w =>
          (w.startsWith("www.") ||
            w.startsWith("http") ||
            w.startsWith("https")) &&
          /\.[a-z]{2,}$/i.test(w) &&
          !invalidDomains.some(domain =>
            w.toLowerCase().includes(domain)
          )
      );

    if (!websites.length && result.emailid) {
      const domain = result.emailid
        .split("@")[1]
        ?.toLowerCase();

      if (
        domain &&
        domain.includes(".") &&
        !invalidDomains.includes(domain)
      ) {
        websites.push(`www.${domain}`);
      }
    }

    websites = [...new Set(websites)];

    result.website = websites[0] || "";

    // Keywords
    const jobKeywords =
      /(engineer|developer|manager|director|designer|consultant|executive|officer|lead|analyst|specialist|founder|owner|ceo|cto|cfo|coo|president|partner|architect|product|project|marketing|sales|business|finance|hr|trainer|supervisor|administrator|head|chairman|chairperson|chief|vice\s*president|vp|team\s*lead|technical\s*lead|intern|apprentice|coordinator|support|technician|operator|advisor|representative|agent|principal|managing\s*director|associate|assistant\s*manager|accountant|auditor|recruiter|researcher|strategist|planner|senior|junior)/i;

    const companyKeywords =
      /(pvt|ltd|private|limited|inc|llp|corp|corporation|company|solutions?|system|systems?|technologies|technology|software|consultancy|consulting|industries|industry|group|enterprise|enterprises|services|service|agency|studio|infra|builders?|automation|manufacturing|consultants?|communications?|exports?|traders?|trade|marketing|networks?|digital|ventures?|logistics|construction|developers?|foods?|pharma|labs?|retail|education|academy|school|institute|college|foundation|trust|hospital|clinic|healthcare|finance|capital|bank|investment|motors?|auto|plastics?|chemicals?|electronics?|fashion|hardware|steel|cement|machinery|textiles?|interiors?|printing|media|events?|travels?|hospitality|telecom|robotics?|research)/i;

    // Company
    const companyCandidates = lines.map(
      (line, index) => {
        let score = 0;

        if (companyKeywords.test(line)) score += 3;
        if (line === line.toUpperCase()) score += 2;

        if (!/@|\d/.test(line) && line.length < 45) {
          score += 1;
        }

        if (index < 5) score += 1;

        return { text: line, score };
      }
    );

    const bestCompany = companyCandidates.sort(
      (a, b) => b.score - a.score
    )[0];

    if (bestCompany?.score > 2) {
      result.company = bestCompany.text;
    }

    // Name
    const nameCandidates = lines.map(
      (line, index) => {
        let score = 0;

        if (/^[A-Z][A-Za-z.' -]+$/.test(line)) {
          score += 2;
        }

        if (
          line.split(" ").length >= 2 &&
          line.split(" ").length <= 4
        ) {
          score += 2;
        }

        if (!/@|\d|www/.test(line)) score += 2;
        if (index <= 4) score += 1;
        if (jobKeywords.test(line)) score -= 2;
        if (companyKeywords.test(line)) score -= 1;

        return { text: line, score };
      }
    );

    const bestName = nameCandidates.sort(
      (a, b) => b.score - a.score
    )[0];

    if (
      bestName?.score > 3 &&
      bestName.text !== result.company
    ) {
      result.name = bestName.text;
    }

    // Designation
    const designationCandidates = lines.map(
      (line, index) => {
        let score = 0;

        if (jobKeywords.test(line)) score += 3;
        if (/^[A-Z]/.test(line)) score += 1;
        if (line.split(" ").length < 6) score += 1;
        if (index < 6) score += 1;
        if (/@|www|,|\.com/.test(line)) score -= 1;

        return { text: line, score };
      }
    );

    const bestDesignation = designationCandidates.sort(
      (a, b) => b.score - a.score
    )[0];

    if (bestDesignation?.score > 3) {
      result.designation = bestDesignation.text;
    }

    // Address
    const addressKeywords =
      /(street|road|st\.|rd\.|ave|avenue|sector|block|area|society|city|district|village|plot|no\.|building|bldg|floor|lane|cross|main|pin|zip|pincode|india|gujarat|maharashtra|delhi|bangalore|bengaluru|hyderabad|pune|chennai|kolkata|noida|gurgaon|jaipur|ahmedabad|surat|vadodara|mumbai|thane|coimbatore|kochi|trivandrum|indore|bhopal|patna|ranchi|nagpur|lucknow|kanpur|chandigarh|mysore|vizag|goa|odisha|uttar\s*pradesh|madhya\s*pradesh|west\s*bengal|tamil\s*nadu|karnataka|kerala|andhra\s*pradesh|telangana|address|landmark|behind|near|beside|opposite|post|po\s*box|zip\s*code|state|country|flat|apt|apartment|tower|complex|colony|enclave|vihar|nagar)/i;

    const addrStart = lines.findIndex(line => {
      if (/M\.?No\.?/i.test(line)) return false;
      if (/(@|www|mob|phone|tel|mail)/i.test(line)) {
        return false;
      }

      return addressKeywords.test(line);
    });

    if (addrStart !== -1) {
      const addrLines: string[] = [];

      for (let i = addrStart; i < lines.length; i++) {
        if (/(@|www|mob|phone|tel|mail)/i.test(lines[i])) {
          break;
        }

        addrLines.push(lines[i]);
      }

      result.address = addrLines
        .join(", ")
        .replace(/\s{2,}/g, " ")
        .replace(/[,;]+$/g, "")
        .trim();
    } else {
      const tail = lines
        .slice(-5)
        .filter(
          line => !/@|www|mob|phone|tel/.test(line)
        );

      if (tail.length >= 2) {
        result.address = tail
          .join(", ")
          .replace(/\s{2,}/g, " ")
          .replace(/[,;]+$/g, "")
          .trim();
      }
    }

    const descriptionLine = lines.find(line =>
      /^(about(?:\s+us)?|description|services?|overview|what\s+we\s+do)\s*[:\-]\s*\S+/i.test(
        line
      )
    );
    if (descriptionLine) {
      result.description = descriptionLine
        .replace(
          /^(about(?:\s+us)?|description|services?|overview|what\s+we\s+do)\s*[:\-]\s*/i,
          ""
        )
        .trim();
    }

    // Cleanup
    for (const key of Object.keys(result)) {
      if (typeof result[key] === "string") {
        result[key] = result[key]
          .replace(/\s{2,}/g, " ")
          .replace(/[,;]+$/, "")
          .trim();
      }
    }

    setValue(
      nonEmptyOcrValues(
        bindOcrValuesToControls(result, controls)
      )
    );

    return result;
  };

  // --------------------------------------------------
  // REDUCTO UPLOAD
  // --------------------------------------------------

  const uploadReductoFile = async (fileUri: string) => {
    if (!REDUCTO_API_KEY) {
      throw new Error(
        "Reducto API key is not configured. Use a backend proxy instead of exposing the key in the mobile app."
      );
    }

    const cleanUri = fileUri.split("?")[0];
    const extension = cleanUri.split(".").pop()?.toLowerCase();

    const isPdf = extension === "pdf";
    const mimeType = isPdf
      ? "application/pdf"
      : "image/jpeg";

    const fileName = `invoice-${Date.now()}.${isPdf ? "pdf" : "jpg"}`;

    const formData = new FormData();

    formData.append("file", {
      uri: fileUri,
      type: mimeType,
      name: fileName,
    } as any);

    const response = await fetch(
      `${REDUCTO_URL}/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${REDUCTO_API_KEY}`,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    const text = await response.text();

    console.log(
      "REDUCTO UPLOAD STATUS:",
      response.status
    );

    if (!response.ok) {
      throw new Error(
        `Reducto upload error ${response.status}: ${text}`
      );
    }

    const data = JSON.parse(text);

    if (!data.file_id) {
      throw new Error(
        "Reducto upload response does not contain file_id"
      );
    }

    return data.file_id as string;
  };

  // --------------------------------------------------
  // REDUCTO EXTRACT
  // --------------------------------------------------

  const extractReductoInvoice = async (
    fileId: string
  ) => {
    if (!REDUCTO_API_KEY) {
      throw new Error(
        "Reducto API key is not configured."
      );
    }

    const response = await fetch(
      `${REDUCTO_URL}/extract`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${REDUCTO_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          input: fileId,
          instructions: {
            schema: {
              type: "object",
            },
          },
          settings: {
            include_images: true,
            optimize_for_latency: true,
            citations: {
              enabled: true,
              numerical_confidence: false,
            },
          },
        }),
      }
    );

    const text = await response.text();

    console.log(
      "REDUCTO EXTRACT STATUS:",
      response.status
    );

    if (!response.ok) {
      throw new Error(
        `Reducto extract error ${response.status}: ${text}`
      );
    }

    return JSON.parse(text);
  };

  // --------------------------------------------------
  // PROCESS REDUCTO
  // --------------------------------------------------

  const processReductoInvoice = async (
    fileUri: string
  ) => {
    const fileId = await uploadReductoFile(fileUri);
    return extractReductoInvoice(fileId);
  };

  // --------------------------------------------------
  // IMAGE URI EFFECT
  // --------------------------------------------------

  useEffect(() => {
    const recognizeImage = async () => {
      if (!imageUri) return;

      // Invoice Reader uses Reducto OCR.
      if (isFromInvoiceReader) return;

      setLoading(true);

      try {
        const result = await TextRecognition.recognize(
          imageUri
        );

        const joined = result.blocks
          .map(block => block.text)
          .join("\n");

        parseCard(joined);
      } catch (error) {
        console.log(
          "Business Card OCR Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    recognizeImage();
  }, [imageUri, isFromInvoiceReader]);

  // --------------------------------------------------
  // HANDLE SCAN
  // --------------------------------------------------

  const handleScan = async () => {
    setInvoiceData(null);
    setValue(null);
    setBase64('');
    setImageUri(null);

    try {
      setScanLoader(true);

      const scanResult = await launchScannerAsync({
        quality: 0.8,
        includeExif: true,
        includeBase64: true,
        includeLocationExif: false,
      });

      if (scanResult?.didCancel) {
        return;
      }

      if (scanResult?.error) {
        Alert.alert(
          "Error",
          scanResult?.errorMessage || "Scan failed"
        );

        return;
      }

      if (scanResult?.images?.length > 0) {
        const processed = scanResult.images.map(
          (img: any) => ({
            ...img,
            base64: img.base64 || null,
          })
        );

        const scannedImageUri = processed[0]?.uri;

        if (!scannedImageUri) {
          throw new Error(
            "Scanned image URI not found"
          );
        }

        setCacheBuster(Date.now());

        if (isFromInvoiceReader) {
          // ------------------------------------------
          // INVOICE READER - REDUCTO OCR
          // ------------------------------------------

          const extractedData =
            await processReductoInvoice(
              scannedImageUri
            );

          // Preserve original OCR JSON.
          setInvoiceData(extractedData);

          // Display scanned image.
          setImageUri(scannedImageUri);
          if (Platform.OS === "android") {
            const base64Data = await RNFS.readFile(
              scannedImageUri,
              "base64"
            );

            setBase64(
              `${item?.field}.jpeg; data:image/jpeg;base64,${base64Data}`
            );
          } else {
            setBase64(
              `${item?.field}.jpeg; data:image/jpeg;base64,${processed[0]?.base64}`
            );
          }

          setImageUri(scannedImageUri);
          setValue(null);
          // Map all available OCR values.
          let mappedResult = nonEmptyOcrValues(
            bindOcrValuesToControls(
              mapReductoDataToForm(extractedData),
              controls
            )
          );
          const hasMappedValues = Object.entries(mappedResult).some(
            ([key, value]) =>
              key !== "cardtext" &&
              typeof value === "string" &&
              value.trim() !== "" &&
              value !== "-"
          );

          if (hasMappedValues) {

            mappedResult = {
              ...mappedResult,
              [item.field]: base64,
            };

            setValue(mappedResult);
            console.log(
              "Mapped OCR Values:",
              mappedResult
            );
          } else {
            Alert.alert(
              "No details found",
              "The scan did not return recognizable contact details. Please try a clearer image."
            );
          }
        }
        else {
          // ------------------------------------------
          // NORMAL BUSINESS CARD SCANNER
          // ------------------------------------------

          if (Platform.OS === "android") {
            const base64Data = await RNFS.readFile(
              scannedImageUri,
              "base64"
            );

            setBase64(
              `${item?.field}.jpeg; data:image/jpeg;base64,${base64Data}`
            );
          } else {
            setBase64(
              `${item?.field}.jpeg; data:image/jpeg;base64,${processed[0]?.base64}`
            );
          }

          setImageUri(scannedImageUri);
        }
      }
    } catch (error: any) {
      console.error(
        "INVOICE SCAN ERROR:",
        error
      );

      Alert.alert(
        "Error",
        error?.message || "Something went wrong"
      );
    } finally {
      setScanLoader(false);
      setShowPicker(false);
    }
  };

  // --------------------------------------------------
  // CLOSE FULLSCREEN
  // --------------------------------------------------

  const closeImageModal = () => {
    resetZoom();
    setModalVisible(false);
  };

  // --------------------------------------------------
  // JSX
  // --------------------------------------------------

  return (
    <View>
      <Text style={styles.title}>
        {item?.fieldtitle}
      </Text>

      <View style={styles.cardContainer}>
        <View
          style={[
            styles.card,
            {
              borderColor: ERP_COLOR_CODE.ERP_APP_COLOR,
            },
          ]}
        >
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator
                size="large"
                color={ERP_COLOR_CODE.ERP_APP_COLOR}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  if (imageUri) {
                    setModalVisible(true);
                    return;
                  }

                  setShowPicker(true);
                }}
              >
                <Image
                  source={{
                    uri: imageUri
                      ? imageUri
                      : getImageUri("small"),
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {!imageUri && (
                <TouchableOpacity
                  onPress={() => setShowPicker(true)}
                >
                  <View
                    style={[
                      styles.overlay,
                      {
                        backgroundColor: "#f8f9ff",
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="document-scanner"
                      size={28}
                      color="gray"
                    />

                    <Text style={styles.overlayText}>
                      Scan attachment
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={[
              styles.editIcon,
              {
                backgroundColor: "gray",
              },
            ]}
          >
            <MaterialIcons
              name="edit"
              size={16}
              color="#fff"
            />
          </TouchableOpacity> */}

          <View
            style={[
              styles.shareIcon,
              {
                backgroundColor: "gray",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                downloadAndShare(
                  getImageUri("large"),
                  "image/jpeg"
                );
              }}
            >
              <MaterialIcons
                name="share"
                size={16}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* REDUCTO OCR JSON */}
      {invoiceData && isFromInvoiceReader && (
        <View style={{ flex: 1 }}>
          <DynamicJsonView
            title="OCR Json"
            data={invoiceData}
          />
        </View>
      )}

      {/* PICKER MODAL */}
      <Modal
        supportedOrientations={[
          "portrait",
          "landscape",
        ]}
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!scanLoader) {
            setShowPicker(false);
          }
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (!scanLoader) {
              setShowPicker(false);
            }
          }}
        >
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.bottomSheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {scanLoader
                ? "Scanning...."
                : isFromInvoiceReader
                  ? "Upload attachment"
                  : t("title.title10")}
            </Text>

            {!scanLoader && (
              <TouchableOpacity
                onPress={() => setShowPicker(false)}
                style={styles.closeIcon}
              >
                <MaterialIcons
                  name="close"
                  size={22}
                  color="#333"
                />
              </TouchableOpacity>
            )}
          </View>

          {scanLoader ? (
            <ActivityIndicator
              size="large"
              color="black"
            />
          ) : (
            <View style={styles.optionRow}>
            
               <TouchableOpacity
                style={styles.optionCard}
                onPress={handleScan}
              >
                <MaterialIcons
                  name="document-scanner"
                  size={40}
                  color={
                    theme === "dark"
                      ? "white"
                      : "gray"
                  }
                />

                <Text style={styles.optionText}>
                  Doc scan
                </Text>
              </TouchableOpacity>
           
             

              {!isFromInvoiceReader && (
                <>
                  <TouchableOpacity
                    style={styles.optionCard}
                    onPress={pickFromCamera}
                  >
                    <MaterialIcons
                      name="photo-camera"
                      size={40}
                      color={
                        theme === "dark"
                          ? "white"
                          : "gray"
                      }
                    />

                    <Text style={styles.optionText}>
                      {t("title.title11")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionCard}
                    onPress={pickFromGallery}
                  >
                    <MaterialIcons
                      name="photo-library"
                      size={40}
                      color={
                        theme === "dark"
                          ? "white"
                          : "gray"
                      }
                    />

                    <Text style={styles.optionText}>
                      {t("title.title12")}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </Modal>

      {/* FULLSCREEN IMAGE MODAL */}
      {modalVisible && (
        <Modal
          supportedOrientations={[
            "portrait",
            "landscape",
          ]}
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={closeImageModal}
        >
          <View
            style={[
              styles.fullscreenModalOverlay,
              (isIpad || isLandscape) && {
                alignContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={[
                styles.fullscreenModalContent,
                {
                  width:
                    isIpad || isLandscape
                      ? "50%"
                      : "100%",
                },
              ]}
            >
              <TouchableOpacity
                style={styles.closeBtnShare}
                onPress={() => {
                  downloadAndShare(
                    getImageUri("large"),
                    "image/jpeg"
                  );
                }}
              >
                <MaterialIcons
                  name="share"
                  size={30}
                  color={
                    theme === "dark"
                      ? "white"
                      : ERP_COLOR_CODE.ERP_WHITE
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={closeImageModal}
              >
                <MaterialIcons
                  name="close"
                  size={30}
                  color={
                    theme === "dark"
                      ? "white"
                      : ERP_COLOR_CODE.ERP_WHITE
                  }
                />
              </TouchableOpacity>

              {loadingLarge && (
                <ActivityIndicator
                  style={StyleSheet.absoluteFill}
                  size="large"
                  color={ERP_COLOR_CODE.ERP_WHITE}
                />
              )}

              <Animated.View
                style={{
                  width: "100%",
                  height: "100%",
                  transform: [
                    { scale },
                    { translateX },
                    { translateY },
                  ],
                }}
                {...panResponder.panHandlers}
              >
                <Image
                  source={{
                    uri: getImageUri("large"),
                  }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"
                  onLoadStart={() =>
                    setLoadingLarge(true)
                  }
                  onLoadEnd={() =>
                    setLoadingLarge(false)
                  }
                />
              </Animated.View>

              <View style={styles.zoomControls}>
                <TouchableOpacity
                  style={styles.zoomBtn}
                  onPress={zoomIn}
                >
                  <MaterialIcons
                    name="zoom-in"
                    size={28}
                    color="#000"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.zoomBtn}
                  onPress={zoomOut}
                >
                  <MaterialIcons
                    name="zoom-out"
                    size={28}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
  },

  fullscreenModalContent: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  closeBtnShare: {
    position: "absolute",
    top: 80,
    right: 80,
    zIndex: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  fullscreenImage: {
    width: "100%",
    height: "100%",
  },

  fullscreenModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  zoomBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f8f9ff",
    borderWidth: 2,
    borderStyle: "dashed",
  },

  zoomControls: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    gap: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  overlayText: {
    color: "gray",
    fontSize: 13,
    marginTop: 4,
  },

  shareIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 6,
    elevation: 3,
  },

  editIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 6,
    elevation: 3,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },

  imageThumb: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    height: 180,
    borderRadius: 12,
    alignSelf: "center",
    marginVertical: 2,
  },

  editIconContainer: {
    position: "absolute",
    right: -10,
    top: "4%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
  },

  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
    alignItems: "center",
  },

  sheetHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },

  closeIcon: {
    padding: 6,
    borderRadius: 30,
    backgroundColor: "#f2f2f2",
  },

  optionRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  optionCard: {
    width: "30%",
    height: 110,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  optionText: {
    marginTop: 10,
    color: "#333",
  },

  closeBtn: {
    position: "absolute",
    top: 80,
    right: 20,
    zIndex: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});

export default DevBusinessCardView;
