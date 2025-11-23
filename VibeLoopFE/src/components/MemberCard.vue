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
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <!-- Member Name & Mood -->
      <h2 class="card-title">
        {{ member.name }}
        <span :class="moodDisplay.opacity" :title="moodDisplay.text">
          {{ moodDisplay.emoji }}
        </span>
      </h2>
      
      <!-- Completion Count -->
      <p class="text-sm text-gray-500">{{ completionCount }}</p>
      
      <!-- Goals List -->
      <div v-if="member.goals.length > 0" class="space-y-2 mt-4">
        <div
          v-for="goal in member.goals"
          :key="goal.id"
          class="flex items-center gap-2 group"
          @mouseenter="hoveredGoalId = goal.id"
          @mouseleave="hoveredGoalId = null"
        >
          <!-- Checkbox -->
          <input
            type="checkbox"
            :checked="goal.completed"
            class="checkbox checkbox-sm"
            @change="handleToggleGoal(goal.id, goal.completed)"
          />
          
          <!-- Goal Text -->
          <span
            :class="{ 'line-through text-gray-400': goal.completed }"
            class="flex-1"
            :title="goal.description"
          >
            {{ truncateGoal(goal.description) }}
          </span>
          
          <!-- Delete Icon (visible on hover) -->
          <button
            v-if="hoveredGoalId === goal.id"
            class="btn btn-ghost btn-xs text-error"
            @click="handleDeleteGoal(goal.id)"
            aria-label="Delete goal"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center text-gray-400 py-4">
        No goals for today
      </div>
    </div>
  </div>
</template>
