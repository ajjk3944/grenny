import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import { Video } from 'expo-av';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { colors } from '@/constants/colors';
import { useSubmissionStore } from '@/store/submissionStore';
import { useAuthStore } from '@/store/authStore';
import { useLangStore } from '@/store/langStore';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'tree_planting', label: 'গাছ লাগানো', icon: 'leaf' },
  { id: 'cleaning', label: 'পরিষ্কার-পরিচ্ছন্নতা', icon: 'brush' },
  { id: 'river_cleanup', label: 'নদী পরিষ্কার', icon: 'water' },
  { id: 'waste_management', label: 'বর্জ্য ব্যবস্থাপনা', icon: 'trash' },
  { id: 'awareness', label: 'সচেতনতা কার্যক্রম', icon: 'megaphone' },
  { id: 'ngo_activity', label: 'এনজিও কার্যক্রম', icon: 'people' },
  { id: 'wildlife_care', label: 'বন্যপ্রাণী সেবা', icon: 'paw' },
  { id: 'other', label: 'অন্যান্য', icon: 'add-circle' },
];

export default function SubmitScreen() {
  const router = useRouter();
  const { draft, setDraft, clearDraft, submit, checkSubmissionLimits } = useSubmissionStore();
  const { user } = useAuthStore();
  const { t } = useLangStore();

  const [selectedCategory, setSelectedCategory] = useState(draft?.category || '');
  const [summary, setSummary] = useState(draft?.summary || '');
  const [additionalMedia, setAdditionalMedia] = useState<string[]>([]);
  const [groupMembers, setGroupMembers] = useState<string[]>(draft?.groupMembers || []);
  const [showGroupSection, setShowGroupSection] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!draft) {
      router.back();
    }
  }, [draft]);

  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) {
      setSummary((prev) => prev + ' ' + transcript);
    }
  });

  useSpeechRecognitionEvent('end', () => {
    setIsRecording(false);
  });

  const handleRetake = () => {
    Alert.alert('আবার তুলুন', 'আপনি কি নিশ্চিত?', [
      { text: 'বাতিল', style: 'cancel' },
      {
        text: 'হ্যাঁ',
        onPress: () => {
          clearDraft();
          router.back();
        },
      },
    ]);
  };

  const compressImage = async (uri: string): Promise<string> => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1920 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (error) {
      console.error('Compression error:', error);
      return uri;
    }
  };

  const addMorePhotos = async () => {
    if (draft?.mediaType === 'video') {
      Alert.alert('ত্রুটি', 'ভিডিও জমা দেওয়ার সময় অতিরিক্ত ছবি যোগ করা যাবে না');
      return;
    }

    if (additionalMedia.length + 1 >= 5) {
      Alert.alert('সীমা', 'সর্বোচ্চ ৫টি ছবি যোগ করা যাবে');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsCompressing(true);
        const compressed = await Promise.all(
          result.assets.map((asset) => compressImage(asset.uri))
        );
        setAdditionalMedia([...additionalMedia, ...compressed].slice(0, 4));
        setIsCompressing(false);
      }
    } catch (error) {
      console.error('Add photos error:', error);
      setIsCompressing(false);
    }
  };

  const removeMedia = (index: number) => {
    setAdditionalMedia(additionalMedia.filter((_, i) => i !== index));
  };

  const startVoiceInput = async () => {
    try {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        Alert.alert('অনুমতি প্রয়োজন', 'ভয়েস ইনপুটের জন্য মাইক্রোফোন অনুমতি দিন');
        return;
      }

      setIsRecording(true);
      await ExpoSpeechRecognitionModule.start({
        lang: 'bn-BD',
        interimResults: true,
        maxAlternatives: 1,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Voice input error:', error);
      setIsRecording(false);
      Alert.alert('ত্রুটি', 'ভয়েস ইনপুট শুরু করতে ব্যর্থ হয়েছে');
    }
  };

  const stopVoiceInput = async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
      setIsRecording(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Stop voice error:', error);
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('ত্রুটি', 'লগইন করুন');
      return;
    }

    // Check limits
    const limitCheck = checkSubmissionLimits();
    if (!limitCheck.canSubmit) {
      if (limitCheck.cooldownSeconds) {
        const minutes = Math.floor(limitCheck.cooldownSeconds / 60);
        const seconds = limitCheck.cooldownSeconds % 60;
        Alert.alert(
          'অপেক্ষা করুন',
          `পরবর্তী জমা দিতে ${minutes}:${seconds.toString().padStart(2, '0')} মিনিট অপেক্ষা করুন`
        );
      } else {
        Alert.alert('সীমা', limitCheck.message);
      }
      return;
    }

    // Update draft with all data
    setDraft({
      category: selectedCategory,
      summary: summary.trim(),
      mediaUris: [draft!.mediaUris[0], ...additionalMedia],
      groupMembers,
    });

    setIsSubmitting(true);

    // Compress main image if photo
    if (draft?.mediaType === 'photo') {
      setIsCompressing(true);
      const compressed = await compressImage(draft.mediaUris[0]);
      setDraft({ mediaUris: [compressed, ...additionalMedia] });
      setIsCompressing(false);
    }

    const result = await submit(user.id);

    setIsSubmitting(false);

    if (result.success) {
      router.replace('/capture/success');
    } else {
      Alert.alert('ত্রুটি', result.message || 'জমা দিতে ব্যর্থ হয়েছে');
    }
  };

  const isValid =
    selectedCategory &&
    summary.trim().length >= 10 &&
    draft?.location;

  if (!draft) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Preview Section */}
        <View style={styles.previewSection}>
          {draft.mediaType === 'photo' ? (
            <Image source={{ uri: draft.mediaUris[0] }} style={styles.preview} />
          ) : (
            <Video
              source={{ uri: draft.mediaUris[0] }}
              style={styles.preview}
              useNativeControls
              resizeMode="cover"
            />
          )}
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
            <Ionicons name="camera-reverse" size={20} color="#fff" />
            <Text style={styles.retakeText}>আবার তুলুন</Text>
          </TouchableOpacity>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ক্যাটাগরি নির্বাচন করুন</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipSelected,
                ]}
                onPress={() => {
                  setSelectedCategory(category.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons
                  name={category.icon as any}
                  size={20}
                  color={
                    selectedCategory === category.id
                      ? colors.light.background
                      : colors.light.primary
                  }
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextSelected,
                  ]}
                >
                  {category.label}
                </Text>
                {selectedCategory === category.id && (
                  <Ionicons name="checkmark-circle" size={18} color={colors.light.background} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Summary Input */}
        <View style={styles.section}>
          <View style={styles.summaryHeader}>
            <Text style={styles.sectionTitle}>সারসংক্ষেপ লিখুন</Text>
            <Text style={styles.charCount}>{summary.length}/500</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="আপনার কার্যক্রম সম্পর্কে বিস্তারিত লিখুন..."
              placeholderTextColor={colors.light.textSecondary}
              value={summary}
              onChangeText={(text) => setSummary(text.slice(0, 500))}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.micButton, isRecording && styles.micButtonActive]}
              onPress={isRecording ? stopVoiceInput : startVoiceInput}
            >
              <Ionicons
                name={isRecording ? 'stop-circle' : 'mic'}
                size={24}
                color={isRecording ? '#ff3b30' : colors.light.primary}
              />
            </TouchableOpacity>
          </View>
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.soundWave}>
                <View style={[styles.bar, styles.bar1]} />
                <View style={[styles.bar, styles.bar2]} />
                <View style={[styles.bar, styles.bar3]} />
                <View style={[styles.bar, styles.bar4]} />
              </View>
              <Text style={styles.recordingText}>শুনছি...</Text>
            </View>
          )}
        </View>

        {/* Additional Media */}
        {draft.mediaType === 'photo' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>আরও ছবি যোগ করুন</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mediaContainer}
            >
              {additionalMedia.map((uri, index) => (
                <View key={index} style={styles.mediaThumbnail}>
                  <Image source={{ uri }} style={styles.thumbnailImage} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeMedia(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              ))}
              {additionalMedia.length < 4 && (
                <TouchableOpacity style={styles.addMediaButton} onPress={addMorePhotos}>
                  <Ionicons name="add" size={32} color={colors.light.primary} />
                </TouchableOpacity>
              )}
            </ScrollView>
            {isCompressing && (
              <View style={styles.compressingIndicator}>
                <ActivityIndicator size="small" color={colors.light.primary} />
                <Text style={styles.compressingText}>সংকুচন করা হচ্ছে...</Text>
              </View>
            )}
          </View>
        )}

        {/* Group Activity */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => setShowGroupSection(!showGroupSection)}
          >
            <Text style={styles.sectionTitle}>গ্রুপ সদস্য যোগ করুন (ঐচ্ছিক)</Text>
            <Ionicons
              name={showGroupSection ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={colors.light.text}
            />
          </TouchableOpacity>
          {showGroupSection && (
            <View style={styles.groupSection}>
              <Text style={styles.groupHint}>
                গ্রুপ কার্যক্রমের সদস্যরাও পয়েন্ট পাবেন
              </Text>
              {/* TODO: Implement user search and selection */}
              <Text style={styles.comingSoon}>শীঘ্রই আসছে</Text>
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid || isSubmitting || isCompressing}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.light.background} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>জমা দিন</Text>
              <Ionicons name="checkmark-circle" size={24} color={colors.light.background} />
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.disclaimer}>AI যাচাই করা হবে</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  previewSection: {
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: width * 0.75,
    backgroundColor: '#000',
  },
  retakeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  retakeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 12,
  },
  categoriesContainer: {
    gap: 8,
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.light.primary,
    backgroundColor: colors.light.background,
    gap: 6,
  },
  categoryChipSelected: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.light.primary,
  },
  categoryTextSelected: {
    color: colors.light.background,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  charCount: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: colors.light.text,
    minHeight: 100,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.light.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  micButtonActive: {
    backgroundColor: '#ffe5e5',
    borderColor: '#ff3b30',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  soundWave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bar: {
    width: 3,
    backgroundColor: '#ff3b30',
    borderRadius: 2,
  },
  bar1: { height: 12 },
  bar2: { height: 20 },
  bar3: { height: 16 },
  bar4: { height: 10 },
  recordingText: {
    fontSize: 14,
    color: '#ff3b30',
    fontWeight: '500',
  },
  mediaContainer: {
    gap: 12,
    paddingRight: 16,
  },
  mediaThumbnail: {
    position: 'relative',
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.light.background,
    borderRadius: 12,
  },
  addMediaButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.light.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compressingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  compressingText: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupSection: {
    marginTop: 12,
  },
  groupHint: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginBottom: 8,
  },
  comingSoon: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  submitButton: {
    backgroundColor: colors.light.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.light.border,
  },
  submitButtonText: {
    color: colors.light.background,
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
