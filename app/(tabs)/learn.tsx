import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BookOpen, TrendingUp, Shield, DollarSign, PieChart, Zap } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useState } from "react";

type LessonCategory = 'basics' | 'etfs' | 'risk' | 'all';

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: LessonCategory;
  icon: 'dollar' | 'trending' | 'shield' | 'pie' | 'zap';
  content: string[];
}

const LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'What is Investing?',
    description: 'Learn the basics of growing your wealth',
    category: 'basics',
    icon: 'dollar',
    content: [
      'Investing is putting your money to work to earn more money over time.',
      'Unlike saving, investing involves some risk but offers potential for higher returns.',
      'The key is starting early to benefit from compound growth.',
      'Even small, regular investments can grow significantly over decades.',
    ],
  },
  {
    id: '2',
    title: 'Understanding ETFs',
    description: 'What are ETFs and why they matter',
    category: 'etfs',
    icon: 'pie',
    content: [
      'ETF stands for Exchange-Traded Fund.',
      'It\'s like buying a basket of many different stocks in one purchase.',
      'ETFs provide instant diversification, reducing your risk.',
      'They typically have lower fees than actively managed funds.',
      'Popular ETFs track the S&P 500, total market, or specific sectors.',
    ],
  },
  {
    id: '3',
    title: 'Risk vs. Reward',
    description: 'Understanding investment risk',
    category: 'risk',
    icon: 'shield',
    content: [
      'Higher potential returns usually come with higher risk.',
      'Short-term goals need safer investments (bonds, treasury funds).',
      'Long-term goals can handle more risk (stock index funds).',
      'Diversification spreads risk across many investments.',
      'Never invest money you\'ll need in the next 1-3 years.',
    ],
  },
  {
    id: '4',
    title: 'Time Horizons Matter',
    description: 'Matching investments to your timeline',
    category: 'basics',
    icon: 'trending',
    content: [
      'Short-term (1-3 years): Use safe, liquid investments like SGOV.',
      'Medium-term (3-10 years): Balanced mix like VTI or SCHD.',
      'Long-term (10+ years): Growth-focused like VOO or QQQ.',
      'The longer your timeline, the more market volatility you can handle.',
    ],
  },
  {
    id: '5',
    title: 'The Power of Consistency',
    description: 'Why regular investing wins',
    category: 'basics',
    icon: 'zap',
    content: [
      'Investing $50/week beats trying to time the market.',
      'Dollar-cost averaging means you buy more shares when prices are low.',
      'Consistency builds wealth through compound returns.',
      'Small, regular investments add up faster than you think.',
      'The best time to start was yesterday. The second best time is today.',
    ],
  },
  {
    id: '6',
    title: 'Popular ETF Picks',
    description: 'Common ETFs for different goals',
    category: 'etfs',
    icon: 'pie',
    content: [
      'SGOV: Ultra-safe short-term treasuries for near-term goals.',
      'VTI: Total US stock market - maximum diversification.',
      'VOO: S&P 500 - proven long-term growth.',
      'SCHD: Dividend-focused for income + growth.',
      'QQQ: Tech-heavy Nasdaq for aggressive growth.',
    ],
  },
];

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState<LessonCategory>('all');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const filteredLessons = selectedCategory === 'all' 
    ? LESSONS 
    : LESSONS.filter(l => l.category === selectedCategory);

  const getIcon = (iconName: string) => {
    const iconProps = { size: 24, color: Colors.primary };
    switch (iconName) {
      case 'dollar': return <DollarSign {...iconProps} />;
      case 'trending': return <TrendingUp {...iconProps} />;
      case 'shield': return <Shield {...iconProps} />;
      case 'pie': return <PieChart {...iconProps} />;
      case 'zap': return <Zap {...iconProps} />;
      default: return <BookOpen {...iconProps} />;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Learn to Invest</Text>
            <Text style={styles.headerSubtitle}>Build your financial knowledge</Text>
          </View>
          <View style={styles.headerIcon}>
            <BookOpen size={28} color={Colors.surface} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable 
              style={[styles.filterButton, selectedCategory === 'all' && styles.filterButtonActive]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.filterText, selectedCategory === 'all' && styles.filterTextActive]}>
                All
              </Text>
            </Pressable>
            <Pressable 
              style={[styles.filterButton, selectedCategory === 'basics' && styles.filterButtonActive]}
              onPress={() => setSelectedCategory('basics')}
            >
              <Text style={[styles.filterText, selectedCategory === 'basics' && styles.filterTextActive]}>
                Basics
              </Text>
            </Pressable>
            <Pressable 
              style={[styles.filterButton, selectedCategory === 'etfs' && styles.filterButtonActive]}
              onPress={() => setSelectedCategory('etfs')}
            >
              <Text style={[styles.filterText, selectedCategory === 'etfs' && styles.filterTextActive]}>
                ETFs
              </Text>
            </Pressable>
            <Pressable 
              style={[styles.filterButton, selectedCategory === 'risk' && styles.filterButtonActive]}
              onPress={() => setSelectedCategory('risk')}
            >
              <Text style={[styles.filterText, selectedCategory === 'risk' && styles.filterTextActive]}>
                Risk Management
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        <View style={styles.lessonsList}>
          {filteredLessons.map((lesson) => {
            const isExpanded = expandedLesson === lesson.id;
            
            return (
              <Pressable
                key={lesson.id}
                style={styles.lessonCard}
                onPress={() => setExpandedLesson(isExpanded ? null : lesson.id)}
              >
                <View style={styles.lessonHeader}>
                  <View style={styles.iconContainer}>
                    {getIcon(lesson.icon)}
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonDescription}>{lesson.description}</Text>
                  </View>
                </View>
                
                {isExpanded && (
                  <View style={styles.lessonContent}>
                    {lesson.content.map((point, index) => (
                      <View key={index} style={styles.contentPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.contentText}>{point}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.ctaCard}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaEmoji}>🚀</Text>
            <Text style={styles.ctaTitle}>Ready to Start Investing?</Text>
            <Text style={styles.ctaText}>
              Set up your first goal and start building wealth with smart, automated investing.
            </Text>
          </LinearGradient>
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
    color: 'rgba(255,255,255,0.9)',
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
  filterRow: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.surface,
  },
  lessonsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  lessonCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lessonHeader: {
    flexDirection: 'row' as const,
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: `${Colors.primary}15`,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  lessonInfo: {
    flex: 1,
    justifyContent: 'center' as const,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  lessonContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 12,
  },
  contentPoint: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '700' as const,
  },
  contentText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  ctaCard: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaGradient: {
    padding: 24,
    alignItems: 'center' as const,
  },
  ctaEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.surface,
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  ctaText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center' as const,
    lineHeight: 22,
  },
});
