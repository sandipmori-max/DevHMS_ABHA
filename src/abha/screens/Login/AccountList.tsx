import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';

 

const AccountList = ({accounts, setSelectedAccount, selectedAccount}: any) => {

  const renderItem = ({ item }: any) => {
    const isSelected =
      selectedAccount?.ABHANumber === item.ABHANumber;

    return (
      <Pressable
        onPress={() => setSelectedAccount(item)}
        style={[
          styles.card,
          isSelected && styles.selectedCard,
        ]}
      >
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.abha}>{item.ABHANumber}</Text>
            <Text style={styles.address}>
              {item.preferredAbhaAddress}
            </Text>
            <Text style={styles.meta}>
              {item.gender} • {item.dob}
            </Text>
          </View>

          <View
            style={[
              styles.radioOuter,
              isSelected && styles.radioOuterSelected,
            ]}
          >
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={accounts}
        keyExtractor={item => item.ABHANumber}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {selectedAccount && (
        <View style={styles.selectedBox}>
          <Text style={{ fontWeight: '700', marginBottom: 4 }}>
            Selected Account
          </Text>
          <Text>{selectedAccount.name}</Text>
          <Text>{selectedAccount.ABHANumber}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#D6DCE5',
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  selectedCard: {
    borderColor: '#1565C0',
    backgroundColor: '#EAF2FF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  abha: {
    marginTop: 4,
    fontSize: 14,
    color: '#1565C0',
    fontWeight: '600',
  },
  address: {
    marginTop: 2,
    fontSize: 13,
    color: '#475467',
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: '#667085',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#98A2B3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioOuterSelected: {
    borderColor: '#1565C0',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1565C0',
  },
  selectedBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});

export default AccountList;