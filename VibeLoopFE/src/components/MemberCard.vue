<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TeamMember } from '@/types/member';
import { MOOD_EMOJI } from '@/types/mood';

interface Props {
  member: TeamMember;
}

interface Emits {
  (e: 'toggle-goal', goalId: string, completed: boolean): void;
  (e: 'delete-goal', goalId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const hoveredGoalId = ref<string | null>(null);

const moodDisplay = computed(() => {
  if (!props.member.mood) {
    return {
      emoji: MOOD_EMOJI.neutral,
      text: 'Set mood',
      opacity: 'opacity-40'
    };
  }
  return {
    emoji: MOOD_EMOJI[props.member.mood],
    text: props.member.mood,
    opacity: 'opacity-100'
  };
});

const completionCount = computed(() => {
  const completed = props.member.goals.filter(g => g.completed).length;
  const total = props.member.goals.length;
  return `${completed}/${total} goals`;
});

function truncateGoal(description: string): string {
  if (description.length <= 80) return description;
  return description.substring(0, 80) + '...';
}

function handleToggleGoal(goalId: string, currentStatus: boolean): void {
  emit('toggle-goal', goalId, !currentStatus);
}

function handleDeleteGoal(goalId: string): void {
  emit('delete-goal', goalId);
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <!-- Member Name & Mood -->
      <h2 class="card-title">
        {{ member.name }}
        <span 
          v-if="member.mood"
          class="mood-badge"
          :class="`mood-${member.mood}`"
          :title="moodDisplay.text"
        >
          {{ moodDisplay.emoji }}
        </span>
        <span 
          v-else
          class="mood-badge mood-neutral opacity-40"
          title="Set mood"
        >
          {{ MOOD_EMOJI.neutral }}
        </span>
      </h2>
      
      <!-- Completion Count -->
      <p class="completion-count">{{ completionCount }}</p>
      
      <!-- Goals List -->
      <div v-if="member.goals.length > 0" class="goals-list">
        <div
          v-for="goal in member.goals"
          :key="goal.id"
          class="goal-item"
          :class="{ completed: goal.completed }"
          @mouseenter="hoveredGoalId = goal.id"
          @mouseleave="hoveredGoalId = null"
        >
          <!-- Checkbox -->
          <input
            type="checkbox"
            :checked="goal.completed"
            class="checkbox"
            @change="handleToggleGoal(goal.id, goal.completed)"
          />
          
          <!-- Goal Text -->
          <span
            class="goal-text"
            :class="{ completed: goal.completed }"
            :title="goal.description"
          >
            {{ truncateGoal(goal.description) }}
          </span>
          
          <!-- Delete Button -->
          <button
            class="delete-btn"
            :class="{ visible: hoveredGoalId === goal.id }"
            @click="handleDeleteGoal(goal.id)"
            aria-label="Delete goal"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="empty-state">
        No goals for today
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.mood-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 1.25rem;
  line-height: 1;
  transition: all var(--transition-fast);
}

.mood-great {
  background: var(--mood-great-bg);
}

.mood-good {
  background: var(--mood-good-bg);
}

.mood-neutral {
  background: var(--mood-neutral-bg);
}

.mood-low {
  background: var(--mood-low-bg);
}

.mood-stressed {
  background: var(--mood-stressed-bg);
}

.completion-count {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.goal-item:hover {
  background-color: var(--color-bg-hover);
}

.goal-item.completed {
  background-color: var(--color-bg-hover);
}

.goal-text {
  flex: 1;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.goal-text.completed {
  color: var(--color-text-tertiary);
  text-decoration: line-through;
}

.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--color-success);
  border-color: var(--color-border-hover);
  cursor: pointer;
}

.delete-btn {
  opacity: 0;
  transition: opacity var(--transition-fast);
  color: var(--color-error);
  background: transparent;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1.125rem;
}

.delete-btn.visible {
  opacity: 1;
}

.delete-btn:hover {
  background-color: var(--color-error-light);
  color: var(--color-error-dark);
}

.empty-state {
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
  font-style: italic;
}
</style>
