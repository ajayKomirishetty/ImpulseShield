import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";
import { router } from "expo-router";
import { useApp } from "@/providers/AppProvider";
import Colors from "@/constants/colors";
import { Image } from "expo-image";

export default function GoalsScreen() {
  const { goals } = useApp();

  const getTimeHorizonLabel = (horizon: string) => {
    switch (horizon) {
      case 'short':
        return '1-3 years';
      case 'medium':
        return '3-10 years';
      case 'long':
        return '10+ years';
      default:
        return '';
    }
  };

  const getTimeHorizonColor = (horizon: string) => {
    switch (horizon) {
      case 'short':
        return Colors.accent;
      case 'medium':
        return Colors.secondary;
      case 'long':
        return Colors.primary;
      default:
        return Colors.textSecondary;
    }
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
          <View>
            <Text style={styles.headerTitle}>Your Goals</Text>
            <Text style={styles.headerSubtitle}>{goals.length} active goals</Text>
          </View>
          <Pressable 
            style={styles.headerIcon}
            onPress={() => router.push('/create-goal')}
          >
            <Plus size={28} color={Colors.surface} />
          </Pressable>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {goals.map((goal, index) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const timeHorizonColor = getTimeHorizonColor(goal.timeHorizon);

          return (
            <View key={goal.id} style={styles.goalContainer}>
              <Pressable style={styles.goalCard}>
                <Image
                  source={{ uri: goal.imageUrl }}
                  style={styles.goalImage}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.85)']}
                  style={styles.goalOverlay}
                >
                  <View style={styles.goalHeader}>
                    <View style={[styles.timeBadge, { backgroundColor: `${timeHorizonColor}20` }]}>
                      <Text style={[styles.timeText, { color: timeHorizonColor }]}>
                        {getTimeHorizonLabel(goal.timeHorizon)}
                      </Text>
                    </View>
                  </View>

                  <View>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalDescription} numberOfLines={2}>
                      {goal.description}
                    </Text>

                    <View style={styles.progressSection}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              width: `${Math.min(progress, 100)}%`,
                              backgroundColor: timeHorizonColor,
                            }
                          ]} 
                        />
                      </View>
                      <View style={styles.amountRow}>
                        <Text style={styles.currentAmount}>
                          ${goal.currentAmount.toLocaleString()}
                        </Text>
                        <Text style={styles.targetAmount}>
                          ${goal.targetAmount.toLocaleString()}
                        </Text>
                      </View>
                      <Text style={styles.progressPercent}>
                        {progress.toFixed(1)}% Complete
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            </View>
          );
        })}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Goal Tips</Text>
          <Text style={styles.infoText}>
            • Short-term goals are invested in safe, liquid assets{'\n'}
            • Medium-term goals balance growth and stability{'\n'}
            • Long-term goals maximize growth potential
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  headerGradient: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.surface,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  headerIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  goalContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  goalCard: {
    height: 360,
    borderRadius: 24,
    overflow: 'hidden' as const,
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  goalImage: {
    width: '100%',
    height: '100%',
    position: 'absolute' as const,
  },
  goalOverlay: {
    flex: 1,
    justifyContent: 'space-between' as const,
    padding: 24,
  },
  goalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
  },
  timeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.surface,
  },
  goalTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.surface,
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    marginBottom: 20,
  },
  progressSection: {
    gap: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  amountRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.surface,
  },
  targetAmount: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600' as const,
  },
  progressPercent: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600' as const,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
