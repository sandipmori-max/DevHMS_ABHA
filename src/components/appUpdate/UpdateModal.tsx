import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import { styles } from './style';

const UpdateModal = ({ visible, forceUpdate, storeUrl, onSkip }: any) => {
  const {t} = useTranslation()
  const scale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
          <Text style={styles.title}>{t('test13')}</Text>

          <Text style={styles.desc}>
            {t('test14')}
          </Text>

          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => Linking.openURL(storeUrl)}
          >
            <Text style={styles.updateText}>{t('test15')}</Text>
          </TouchableOpacity>

          {!forceUpdate && (
            <TouchableOpacity onPress={onSkip}>
              <Text style={styles.skipText}>{t('test16')}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default UpdateModal;
