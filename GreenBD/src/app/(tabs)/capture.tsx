import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useSubmissionStore } from '@/store/submissionStore';

export default function CaptureScreen() {
  const router = useRouter();
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('auto');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { setDraft } = useSubmissionStore();

  useEffect(() => {
    // Request location permission on mount
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  const openCamera = async () => {
    if (!cameraPermission) {
      return;
    }

    if (!cameraPermission.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert(
          'ক্যামেরা অনুমতি প্রয়োজন',
          'ছবি তুলতে ক্যামেরা অনুমতি দিন',
          [
            { text: 'বাতিল', style: 'cancel' },
            { text: 'সেটিংস খুলুন', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    }

    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
    setIsRecording(false);
  };

  const toggleFlash = () => {
    setFlash((current) => {
      if (current === 'auto') return 'on';
      if (current === 'on') return 'off';
      return 'auto';
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        exif: true,
      });

      if (photo) {
        const location = await Location.getCurrentPositionAsync({});
        
        setDraft({
          mediaUris: [photo.uri],
          mediaType: 'photo',
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
          timestamp: new Date().toISOString(),
        });

        closeCamera();
        router.push('/capture/submit');
      }
    } catch (error) {
      console.error('Photo capture error:', error);
      Alert.alert('ত্রুটি', 'ছবি তুলতে ব্যর্থ হয়েছে');
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsRecording(true);
      
      const video = await cameraRef.current.recordAsync({
        maxDuration: 60,
      });

      if (video) {
        const location = await Location.getCurrentPositionAsync({});
        
        setDraft({
          mediaUris: [video.uri],
          mediaType: 'video',
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
          timestamp: new Date().toISOString(),
        });

        closeCamera();
        router.push('/capture/submit');
      }
    } catch (error) {
      console.error('Video recording error:', error);
      Alert.alert('ত্রুটি', 'ভিডিও রেকর্ড করতে ব্যর্থ হয়েছে');
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleShutterPress = () => {
    if (mediaType === 'photo') {
      capturePhoto();
    } else {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType === 'photo' 
          ? ImagePicker.MediaTypeOptions.Images 
          : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        exif: true,
      });

      if (!result.canceled && result.assets[0]) {
        const location = await Location.getCurrentPositionAsync({});
        
        setDraft({
          mediaUris: [result.assets[0].uri],
          mediaType,
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
          timestamp: new Date().toISOString(),
        });

        closeCamera();
        router.push('/capture/submit');
      }
    } catch (error) {
      console.error('Gallery picker error:', error);
    }
  };

  // This screen just triggers the camera modal
  useEffect(() => {
    openCamera();
  }, []);

  if (!showCamera) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.openButton} onPress={openCamera}>
          <Ionicons name="camera" size={32} color={colors.light.background} />
          <Text style={styles.openButtonText}>ক্যামেরা খুলুন</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Modal visible={showCamera} animationType="slide" statusBarTranslucent>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash}
          mode={mediaType === 'photo' ? 'picture' : 'video'}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.topButton} onPress={closeCamera}>
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.topButton} onPress={toggleFlash}>
              <Ionicons
                name={
                  flash === 'auto'
                    ? 'flash-outline'
                    : flash === 'on'
                    ? 'flash'
                    : 'flash-off'
                }
                size={28}
                color="#fff"
              />
              <Text style={styles.flashText}>
                {flash === 'auto' ? 'Auto' : flash === 'on' ? 'On' : 'Off'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomBar}>
            {/* Media Type Toggle */}
            <View style={styles.mediaTypeToggle}>
              <TouchableOpacity
                style={[
                  styles.mediaTypeButton,
                  mediaType === 'photo' && styles.mediaTypeButtonActive,
                ]}
                onPress={() => {
                  setMediaType('photo');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  style={[
                    styles.mediaTypeText,
                    mediaType === 'photo' && styles.mediaTypeTextActive,
                  ]}
                >
                  ছবি
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.mediaTypeButton,
                  mediaType === 'video' && styles.mediaTypeButtonActive,
                ]}
                onPress={() => {
                  setMediaType('video');
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  style={[
                    styles.mediaTypeText,
                    mediaType === 'video' && styles.mediaTypeTextActive,
                  ]}
                >
                  ভিডিও
                </Text>
              </TouchableOpacity>
            </View>

            {/* Controls Row */}
            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.sideButton} onPress={pickFromGallery}>
                <Ionicons name="images" size={32} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shutterButton,
                  isRecording && styles.shutterButtonRecording,
                ]}
                onPress={handleShutterPress}
              >
                <View
                  style={[
                    styles.shutterInner,
                    isRecording && styles.shutterInnerRecording,
                  ]}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.sideButton} onPress={toggleFacing}>
                <Ionicons name="camera-reverse" size={32} color="#fff" />
              </TouchableOpacity>
            </View>

            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>রেকর্ডিং...</Text>
              </View>
            )}
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  openButtonText: {
    color: colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
  },
  topButton: {
    padding: 8,
    alignItems: 'center',
  },
  flashText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
    gap: 20,
  },
  mediaTypeToggle: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  mediaTypeButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 16,
  },
  mediaTypeButtonActive: {
    backgroundColor: colors.light.primary,
  },
  mediaTypeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  mediaTypeTextActive: {
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sideButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  shutterButtonRecording: {
    borderColor: '#ff3b30',
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light.primary,
  },
  shutterInnerRecording: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#ff3b30',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff3b30',
  },
  recordingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
