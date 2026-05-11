import {
  StyleSheet,
} from "react-native";
import { ERP_COLOR_CODE } from "../../../../utils/constants";

export const styles = StyleSheet.create({
  recordCard: {
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderRadius: 4,
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 12,
    borderWidth: 0.5,
    width: "100%",
  },
  recordAvatar: { width: 46, height: 46, borderRadius: 25 },
  recordName: { fontSize: 14 },
  recordDateTime: {
    fontWeight: "600",
    fontSize: 14,
    color: ERP_COLOR_CODE.ERP_BLACK,
  },
  recordPunchTime: { fontSize: 14, color: ERP_COLOR_CODE.ERP_333 },
  statusBadgeRed: {
    color: ERP_COLOR_CODE.ERP_ERROR,
    fontSize: 12,
    fontWeight: "bold",
  },
  statusBadgeBlue: {
    color: "#a6bfc9ff",
    fontSize: 12,
    fontWeight: "bold",
  },
  statusBadgeGrey: {
    backgroundColor: "#dad1d1",
    color: ERP_COLOR_CODE.ERP_BLACK,
    fontWeight: "bold",
  },
});
