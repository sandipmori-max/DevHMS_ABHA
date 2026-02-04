import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';

const { height } = Dimensions.get('window');
const MODAL_HEIGHT = height * 0.8;

const ImageBottomSheetModal = ({
  visible,
  onClose,
  imageUrl,
}) => {
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: MODAL_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            { transform: [{ translateY }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>

            <Text style={styles.title}>Photo</Text>
            <View style={{ width: 24 }} />
            <TouchableOpacity
              style={{
                height: 34, width: 34,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ImageBottomSheetModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    height: MODAL_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    height: 56,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  closeIcon: {
    fontSize: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageWrapper: {
    height: '88%',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
