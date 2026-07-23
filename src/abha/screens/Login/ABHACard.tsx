import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
 

const ABHACard = ({abhaData}: any) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {abhaData.fullName.charAt(0)}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{abhaData.fullName}</Text>
          <Text style={styles.subtitle}>ABHA Profile</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{abhaData.status}</Text>
        </View>
      </View>

      {/* ABHA Number */}
      {
        abhaData.healthIdNumber && <View style={styles.numberCard}>
        <Text style={styles.label}>ABHA NUMBER</Text>
        <Text style={styles.abhaNumber}>{abhaData.healthIdNumber}</Text>
      </View>
      }
      

      {/* Info Row */}
      <View style={styles.infoRow}>
        {
            abhaData.abhaAddress &&   <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>ABHA Address</Text>
          <Text style={styles.infoValue}>{abhaData.abhaAddress}</Text>
        </View>
        }
       

        <View style={styles.divider} />
        {
            abhaData.mobile && <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Mobile</Text>
          <Text style={styles.infoValue}>{abhaData.mobile}</Text>
        </View>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14, 
    marginHorizontal: 12,
    marginBottom: 10, 
    borderColor: '#E5E7EB', 
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  statusText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
  },

  numberCard: {
    marginTop: 18,
    backgroundColor: '#F5F9FF',
    borderWidth: 1,
    borderColor: '#D6E4FF',
    borderRadius: 8,
    padding: 10,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
  },

  abhaNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B57D0',
    marginTop: 8,
    letterSpacing: 1,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },

  infoBox: {
    flex: 1,
  },

  divider: {
    width: 1,
    height: 42,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 14,
  },

  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },

  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  authBadge: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#90CAF9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 10,
  },

  authBadgeText: {
    color: '#1565C0',
    fontSize: 12,
    fontWeight: '700',
  },

  footer: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },

  footerText: {
    flex: 1,
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '600',
  },

  qrButton: {
    backgroundColor: '#1565C0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },

  qrButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

export default ABHACard;