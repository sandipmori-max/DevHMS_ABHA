import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  otpTxnId: null,
  loginTxnId: null,
  abhaNumber: null,
  tToken: null,
  rToken: null,
  txnId: null,
  activeUser: null,
  devERPBaseUrl: "",
  abhaDrProfile: "",
  linkToken: "",
  linkTokenExpiresAt: "",
  linkTokenAbhaAddress: "",
  linkTokenAbhaNumber: "",
  linkTokenHipId: "",
  selectedXCMID:"",
};

const abhaSlice = createSlice({
  name: "abha",

  initialState,

  reducers: {
    setOtpTxnId: (
      state,
      action
    ) => {
      state.otpTxnId =
        action.payload;
    },
setSelectedXCMID: (
      state,
      action
    ) => {
      const selectedHipId = String(action.payload ?? "");
      if (
        state.linkToken &&
        state.linkTokenHipId &&
        state.linkTokenHipId !== selectedHipId
      ) {
        state.linkToken = "";
        state.linkTokenExpiresAt = "";
        state.linkTokenAbhaAddress = "";
        state.linkTokenAbhaNumber = "";
        state.linkTokenHipId = "";
      }
      state.selectedXCMID = selectedHipId;
    },
     setActiveUser: (
      state,
      action
    ) => {
      state.activeUser =
        action.payload;
    },

     setActiveLinkToken: (
      state,
      action
    ) => {
      state.linkToken = action.payload.token;
      state.linkTokenExpiresAt = action.payload.expiresAt;
      state.linkTokenAbhaAddress = action.payload.abhaAddress;
      state.linkTokenAbhaNumber = action.payload.abhaNumber;
      state.linkTokenHipId = action.payload.hipId;
    },

    clearLinkToken: (state) => {
      state.linkToken = "";
      state.linkTokenExpiresAt = "";
      state.linkTokenAbhaAddress = "";
      state.linkTokenAbhaNumber = "";
      state.linkTokenHipId = "";
    },

     setAbhaDrProfile: (
      state,
      action
    ) => {
      state.abhaDrProfile =
        action.payload;
    },

    updateAuthToken: (state, action) => {
      const payload =
        typeof action.payload === "string"
          ? JSON.parse(action.payload)
          : action.payload;

      state.activeUser = {
        ...state.activeUser,
        token: payload.token,
        validtill: payload.validTill,
      };
    },
     setDevERPBaseUrl: (
      state,
      action
    ) => {
      state.devERPBaseUrl =
        action.payload;
    },

    setLoginTxnId: (
      state,
      action
    ) => {
      state.loginTxnId =
        action.payload;
    },

    setAbhaNumber: (
      state,
      action
    ) => {
      state.abhaNumber =
        action.payload;
    },

    setTToken: (
      state,
      action
    ) => {
      state.tToken =
        action.payload;
    },
     setRToken: (
      state,
      action
    ) => {
      state.rToken =
        action.payload;
    },

    clearFlow: (state) => {
      Object.assign(
        state,
        initialState
      );
    },

    setTxnId: (
      state,
      action
    ) => {
      state.txnId =
        action.payload;
    },

    clearTxnId: (state) => {
      state.txnId = null;
    },
  },
});

export const {
  setOtpTxnId,
  setLoginTxnId,
  setAbhaNumber,
  setTToken,
  clearFlow,
  setTxnId,
  clearTxnId,
  setActiveUser,
  setDevERPBaseUrl,
  setAbhaDrProfile,
  updateAuthToken,
  setActiveLinkToken,
  clearLinkToken,
  setSelectedXCMID,
  setRToken,
} = abhaSlice.actions;

export default abhaSlice.reducer;