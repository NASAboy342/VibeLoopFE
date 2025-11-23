<script setup lang="ts">
import type { TeamStats } from '@/composables/useStats';
import { MOOD_EMOJI } from '@/types/mood';

interface Props {
  stats: TeamStats;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="stats stats-horizontal shadow w-full mb-6">
    <!-- Goal Completion Stat -->
    <div class="stat">
      <div class="stat-title">Team Goal Completion</div>
      <div class="stat-value text-primary">{{ props.stats.completionPercentage }}</div>
      <div class="stat-desc">
        {{ props.stats.completedGoals }} of {{ props.stats.totalGoals }} goals completed
      </div>
    </div>
    
    <!-- Mood Breakdown Stat -->
    <div class="stat">
      <div class="stat-title">Team Mood</div>
      <div class="stat-desc mt-2 space-y-1">
        <div>{{ MOOD_EMOJI.great }} Great: {{ props.stats.moodBreakdown.great }}</div>
        <div>{{ MOOD_EMOJI.good }} Good: {{ props.stats.moodBreakdown.good }}</div>
        <div>{{ MOOD_EMOJI.neutral }} Neutral: {{ props.stats.moodBreakdown.neutral }}</div>
        <div>{{ MOOD_EMOJI.low }} Low: {{ props.stats.moodBreakdown.low }}</div>
        <div>{{ MOOD_EMOJI.stressed }} Stressed: {{ props.stats.moodBreakdown.stressed }}</div>
      </div>
    </div>
  </div>
</template>
