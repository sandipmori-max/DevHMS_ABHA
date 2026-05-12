import { StyleSheet } from "react-native";
import { ERP_COLOR_CODE } from "../../utils/constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    overflow: "hidden",
  },

  topGlow: {
    position: "absolute",
    top: -120,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: "rgba(37,99,235,0.10)",
  },

  bottomGlow: {
    position: "absolute",
    bottom: -140,
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: "rgba(59,130,246,0.08)",
  },

  gif: {
    width: 260,
    height: 260,
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    letterSpacing: -0.6,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 34,
    paddingHorizontal: 14,
  },

  button: {
    backgroundColor: "#111827",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 999,
    minWidth: 170,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});