import { StyleSheet, Text, View, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import { X, DollarSign } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useApp } from "@/providers/AppProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Goal } from "@/types";
import { Image } from "expo-image";

const UNSPLASH_IMAGES = {
  travel: [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800',
  ],
  home: [
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  ],
  retirement: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  ],
  education: [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
  ],
  other: [
    'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    'https://images.unsplash.com/photo-1501820488136-72669149e0d4?w=800',
  ],
};

export default function CreateGoalScreen() {
  const { addGoal } = useApp();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [targetAmount, setTargetAmount] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Goal['category']>('travel');
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<Goal['timeHorizon']>('medium');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const categories: { value: Goal['category']; label: string; emoji: string }[] = [
    { value: 'travel', label: 'Travel', emoji: '✈️' },
    { value: 'home', label: 'Home', emoji: '🏡' },
    { value: 'retirement', label: 'Retirement', emoji: '🌅' },
    { value: 'education', label: 'Education', emoji: '📚' },
    { value: 'other', label: 'Other', emoji: '🎯' },
  ];

  const timeHorizons: { value: Goal['timeHorizon']; label: string; years: string }[] = [
    { value: 'short', label: 'Short-term', years: '1-3 years' },
    { value: 'medium', label: 'Medium-term', years: '3-10 years' },
    { value: 'long', label: 'Long-term', years: '10+ years' },
  ];

  const handleCreateGoal = () => {
    if (!title.trim() || !targetAmount.trim()) {
      return;
    }

    const amount = parseFloat(targetAmount.replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    const imageUrl = UNSPLASH_IMAGES[selectedCategory][selectedImageIndex];

    addGoal({
      title: title.trim(),
      description: description.trim(),
      targetAmount: amount,
      currentAmount: 0,
      imageUrl,
      timeHorizon: selectedTimeHorizon,
      category: selectedCategory,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <X size={28} color={Colors.surface} />
          </Pressable>
          <Text style={styles.headerTitle}>Create New Goal</Text>
          <View style={styles.placeholder} />
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Goal Title *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g., Dream vacation to Japan"
              placeholderTextColor={Colors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What does this goal mean to you?"
              placeholderTextColor={Colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Target Amount *</Text>
          <View style={[styles.inputContainer, styles.amountContainer]}>
            <DollarSign size={20} color={Colors.textSecondary} style={styles.dollarIcon} />
            <TextInput
              style={[styles.input, styles.amountInput]}
              placeholder="5,000"
              placeholderTextColor={Colors.textTertiary}
              value={targetAmount}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                const formatted = cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                setTargetAmount(formatted);
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <Pressable
                key={cat.value}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.value && styles.categoryButtonActive,
                ]}
                onPress={() => {
                  setSelectedCategory(cat.value);
                  setSelectedImageIndex(0);
                }}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === cat.value && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Time Horizon *</Text>
          <View style={styles.timeHorizonList}>
            {timeHorizons.map((horizon) => (
              <Pressable
                key={horizon.value}
                style={[
                  styles.timeHorizonButton,
                  selectedTimeHorizon === horizon.value && styles.timeHorizonButtonActive,
                ]}
                onPress={() => setSelectedTimeHorizon(horizon.value)}
              >
                <View style={styles.timeHorizonContent}>
                  <Text
                    style={[
                      styles.timeHorizonLabel,
                      selectedTimeHorizon === horizon.value && styles.timeHorizonLabelActive,
                    ]}
                  >
                    {horizon.label}
                  </Text>
                  <Text
                    style={[
                      styles.timeHorizonYears,
                      selectedTimeHorizon === horizon.value && styles.timeHorizonYearsActive,
                    ]}
                  >
                    {horizon.years}
                  </Text>
                </View>
                {selectedTimeHorizon === horizon.value && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Choose Cover Image</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {UNSPLASH_IMAGES[selectedCategory].map((imageUrl, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                style={[
                  styles.imageOption,
                  selectedImageIndex === index && styles.imageOptionActive,
                ]}
              >
                <Image source={{ uri: imageUrl }} style={styles.previewImage} contentFit="cover" />
                {selectedImageIndex === index && (
                  <View style={styles.imageCheckmark}>
                    <Text style={styles.imageCheckmarkText}>✓</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoEmoji}>💡</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Smart Investment Recommendations</Text>
            <Text style={styles.infoText}>
              Based on your time horizon, we&apos;ll recommend the best ETFs to help you reach this goal.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <SafeAreaView edges={['bottom']}>
          <Pressable
            style={[
              styles.createButton,
              (!title.trim() || !targetAmount.trim()) && styles.createButtonDisabled,
            ]}
            onPress={handleCreateGoal}
            disabled={!title.trim() || !targetAmount.trim()}
          >
            <Text style={styles.createButtonText}>Create Goal</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  headerGradient: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.surface,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden' as const,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top' as const,
  },
  amountContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  dollarIcon: {
    marginLeft: 16,
  },
  amountInput: {
    flex: 1,
    paddingLeft: 8,
  },
  categoryGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  categoryButton: {
    width: '30%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  categoryButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  categoryLabelActive: {
    color: Colors.primary,
    fontWeight: '700' as const,
  },
  timeHorizonList: {
    gap: 12,
  },
  timeHorizonButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  timeHorizonButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  timeHorizonContent: {
    flex: 1,
  },
  timeHorizonLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  timeHorizonLabelActive: {
    color: Colors.primary,
  },
  timeHorizonYears: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  timeHorizonYearsActive: {
    color: Colors.primary,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  checkmarkText: {
    fontSize: 16,
    color: Colors.surface,
    fontWeight: '700' as const,
  },
  imageScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  imageOption: {
    width: 120,
    height: 160,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden' as const,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  imageOptionActive: {
    borderColor: Colors.primary,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imageCheckmark: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  imageCheckmarkText: {
    fontSize: 14,
    color: Colors.surface,
    fontWeight: '700' as const,
  },
  infoBox: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: `${Colors.secondary}15`,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row' as const,
    gap: 12,
  },
  infoEmoji: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  createButtonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.surface,
  },
});
