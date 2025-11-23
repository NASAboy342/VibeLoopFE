import { computed, type Ref } from 'vue';
import type { TeamMember } from '@/types/member';

export interface MoodCount {
  great: number;
  good: number;
  neutral: number;
  low: number;
  stressed: number;
}

export interface TeamStats {
  completionPercentage: string;
  moodBreakdown: MoodCount;
  totalGoals: number;
  completedGoals: number;
}

export function useStats(members: Ref<TeamMember[]>) {
  /**
   * Calculate team goal completion percentage
   */
  const completionPercentage = computed<string>(() => {
    let total = 0;
    let completed = 0;
    
    members.value.forEach(member => {
      member.goals.forEach(goal => {
        total++;
        if (goal.completed) completed++;
      });
    });
    
    if (total === 0) return 'No goals yet';
    
    const percentage = Math.round((completed / total) * 100);
    return `${percentage}%`;
  });
  
  /**
   * Count team members by mood
   */
  const moodBreakdown = computed<MoodCount>(() => {
    const counts: MoodCount = {
      great: 0,
      good: 0,
      neutral: 0,
      low: 0,
      stressed: 0
    };
    
    members.value.forEach(member => {
      if (member.mood) {
        counts[member.mood]++;
      }
    });
    
    return counts;
  });
  
  /**
   * Total goals count
   */
  const totalGoals = computed<number>(() => {
    return members.value.reduce((sum, member) => sum + member.goals.length, 0);
  });
  
  /**
   * Completed goals count
   */
  const completedGoals = computed<number>(() => {
    return members.value.reduce((sum, member) => {
      return sum + member.goals.filter(g => g.completed).length;
    }, 0);
  });
  
  /**
   * Combined stats object
   */
  const stats = computed<TeamStats>(() => ({
    completionPercentage: completionPercentage.value,
    moodBreakdown: moodBreakdown.value,
    totalGoals: totalGoals.value,
    completedGoals: completedGoals.value
  }));
  
  return {
    completionPercentage,
    moodBreakdown,
    totalGoals,
    completedGoals,
    stats
  };
}
