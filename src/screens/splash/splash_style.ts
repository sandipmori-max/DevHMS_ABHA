import { Dimensions, StyleSheet } from "react-native";
import { ERP_COLOR_CODE } from "../../utils/constants";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 30,
  },
  logoWrapper: {
    // backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderRadius: 24,
    marginBottom: 30,
  },
  poweredBy: {
  position: "absolute",
  bottom: 30,
  alignSelf: "center",
  fontSize: 12,
  letterSpacing: 1,
},

helloTitle: {
  fontSize: 18,
  marginTop: 10,
  textAlign: "center",
},

title: {
  fontSize: 22,
  fontWeight: "bold",
  textAlign: "center",
  marginTop: 5,
},

subtitle: {
  fontSize: 14,
  textAlign: "center",
  marginTop: 5,
},
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 100,
  },
  helloTitle: {
    color: ERP_COLOR_CODE.ERP_555,
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    color: ERP_COLOR_CODE.ERP_BLACK,
    fontSize: 18,
    // fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Handlee-Regular",
    paddingHorizontal: 12
  },
  subtitle: {
    color: ERP_COLOR_CODE.ERP_BLACK,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
   container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },

  topSection: {
    alignItems: "center",
    marginTop: 40,
  },

  logo: {
    width: 120,
    height: 120,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#003366",
    marginTop: 20,
  },

  subtitle: {
    marginTop: 10,
    color: "#64748B",
    fontSize: 16,
  },

  loaderSection: {
    alignItems: "center",
  },

  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: "#475569",
  },

  bottomSection: {
    alignItems: "center",
  },

  powered: {
    fontSize: 13,
    color: "#94A3B8",
  },

  abdm: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "600",
    color: "#1565C0",
  },
});
