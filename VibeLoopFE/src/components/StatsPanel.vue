<script setup lang="ts">
import type { TeamStats } from '@/composables/useStats';
import { MOOD_EMOJI } from '@/types/mood';

interface Props {
  stats: TeamStats;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="stats-container">
    <!-- Goal Completion Stat -->
    <div class="stat-card">
      <div class="stat-title">Team Goal Completion</div>
      <div class="stat-value">{{ props.stats.completionPercentage }}</div>
      <div class="stat-desc">
        {{ props.stats.completedGoals }} of {{ props.stats.totalGoals }} goals completed
      </div>
    </div>
    
    <!-- Mood Breakdown Stat -->
    <div class="stat-card">
      <div class="stat-title">Team Mood</div>
      <div class="mood-breakdown">
        <div class="mood-item mood-great">
          <span class="mood-emoji">{{ MOOD_EMOJI.great }}</span>
          <span class="mood-label">Great</span>
          <span class="mood-count">{{ props.stats.moodBreakdown.great }}</span>
        </div>
        <div class="mood-item mood-good">
          <span class="mood-emoji">{{ MOOD_EMOJI.good }}</span>
          <span class="mood-label">Good</span>
          <span class="mood-count">{{ props.stats.moodBreakdown.good }}</span>
        </div>
        <div class="mood-item mood-neutral">
          <span class="mood-emoji">{{ MOOD_EMOJI.neutral }}</span>
          <span class="mood-label">Neutral</span>
          <span class="mood-count">{{ props.stats.moodBreakdown.neutral }}</span>
        </div>
        <div class="mood-item mood-low">
          <span class="mood-emoji">{{ MOOD_EMOJI.low }}</span>
          <span class="mood-label">Low</span>
          <span class="mood-count">{{ props.stats.moodBreakdown.low }}</span>
        </div>
        <div class="mood-item mood-stressed">
          <span class="mood-emoji">{{ MOOD_EMOJI.stressed }}</span>
          <span class="mood-label">Stressed</span>
          <span class="mood-count">{{ props.stats.moodBreakdown.stressed }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
}

.stat-title {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.stat-value {
  color: var(--color-primary);
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-desc {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.mood-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.mood-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-size: 0.875rem;
}

.mood-item:hover {
  transform: translateX(4px);
}

.mood-great {
  background: var(--mood-great-bg);
  color: var(--mood-great-text);
}

.mood-good {
  background: var(--mood-good-bg);
  color: var(--mood-good-text);
}

.mood-neutral {
  background: var(--mood-neutral-bg);
  color: var(--mood-neutral-text);
}

.mood-low {
  background: var(--mood-low-bg);
  color: var(--mood-low-text);
}

.mood-stressed {
  background: var(--mood-stressed-bg);
  color: var(--mood-stressed-text);
}

.mood-emoji {
  font-size: 1.25rem;
  line-height: 1;
}

.mood-label {
  flex: 1;
  font-weight: 500;
}

.mood-count {
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-sm);
}
</style>
