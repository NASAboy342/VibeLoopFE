export type MoodType = 'great' | 'good' | 'neutral' | 'low' | 'stressed';

export const MOOD_EMOJI: Record<MoodType, string> = {
  great: '😀',
  good: '😊',
  neutral: '😐',
  low: '😞',
  stressed: '😤'
};

export const MOOD_LABELS: Record<MoodType, string> = {
  great: 'Great - Feeling excellent, highly productive',
  good: 'Good - Positive mood, on track',
  neutral: 'Neutral - Okay, neither good nor bad',
  low: 'Low - Struggling, could use support',
  stressed: 'Stressed - Overwhelmed, needs help'
};
