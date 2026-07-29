import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ERP_COLOR_CODE } from "../../../../utils/constants";

export interface FilterItem {
  id: string;
  title: string;
  badge?: number;
}

interface Props {
  data: FilterItem[];
  selected: string;
  onChange: (id: string) => void;
}

export default function FilterTabs({
  data,
  selected,
  onChange,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {data.map(item => {
        const active = selected === item.id;

        return (
          <Pressable
            key={item.id}
            onPress={() => onChange(item.id)}
            style={[
              styles.chip,
              active && styles.activeChip,
              active && {
                backgroundColor : ERP_COLOR_CODE.ERP_APP_COLOR
              }
            ]}
          >
            <Text
              style={[
                styles.text,
                active && styles.activeText,
              ]}
            >
              {item.title}
            </Text>

            {item.badge !== undefined && (
              <View
                style={[
                  styles.badge,
                  active && styles.activeBadge,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    active &&
                      styles.activeBadgeText,
                  ]}
                >
                  {item.badge}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D7DDE5",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    marginRight: 10,
  },

  activeChip: {
    backgroundColor: "#1565C0",
    borderColor: "#1565C0",
  },

  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5F6368",
  },

  activeText: {
    color: "#FFFFFF",
  },

  badge: {
    minWidth: 20,
    height: 20,

    marginLeft: 8,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#E8EEF9",
  },

  activeBadge: {
    backgroundColor: "#FFFFFF",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1565C0",
  },

  activeBadgeText: {
    color: "#1565C0",
  },
});