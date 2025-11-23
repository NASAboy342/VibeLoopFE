<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useMembers } from '@/composables/useMembers';
import { useGoals } from '@/composables/useGoals';
import { useStats } from '@/composables/useStats';
import type { MoodType } from '@/types/mood';
import type { UpdateMoodDto } from '@/types/member';

import StatsPanel from '@/components/StatsPanel.vue';
import MemberCard from '@/components/MemberCard.vue';
import AddGoalForm from '@/components/AddGoalForm.vue';
import UpdateMoodForm from '@/components/UpdateMoodForm.vue';

const { members, loading, fetchMembers, updateMood, startAutoRefresh } = useMembers();
const { createGoal, toggleGoalComplete, removeGoal } = useGoals();
const { stats } = useStats(members);

const showAddGoalModal = ref(false);
const showUpdateMoodModal = ref(false);
const errorMessage = ref<string | null>(null);

let stopAutoRefresh: (() => void) | undefined;

onMounted(async () => {
  await fetchMembers();
  stopAutoRefresh = startAutoRefresh();
});

onUnmounted(() => {
  if (stopAutoRefresh) stopAutoRefresh();
});

async function handleAddGoal(memberId: string, description: string): Promise<void> {
  try {
    errorMessage.value = null;
    const today = new Date().toISOString().split('T')[0];
    await createGoal({ memberId, description, date: today });
    showAddGoalModal.value = false;
    await fetchMembers(); // Refresh data
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to add goal';
  }
}

async function handleUpdateMood(memberId: string, mood: MoodType): Promise<void> {
  try {
    errorMessage.value = null;
    const dto: UpdateMoodDto = {
      mood,
      timestamp: new Date().toISOString()
    };
    await updateMood(memberId, dto);
    showUpdateMoodModal.value = false;
    await fetchMembers(); // Refresh data
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to update mood';
  }
}

async function handleToggleGoal(goalId: string, completed: boolean): Promise<void> {
  try {
    errorMessage.value = null;
    await toggleGoalComplete(goalId, completed);
    await fetchMembers(); // Refresh data
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to update goal';
  }
}

async function handleDeleteGoal(goalId: string): Promise<void> {
  try {
    errorMessage.value = null;
    await removeGoal(goalId);
    await fetchMembers(); // Refresh data
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Failed to delete goal';
  }
}

function dismissError(): void {
  errorMessage.value = null;
}
</script>

<template>
  <div class="container mx-auto p-6 min-w-[1024px]">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Team Goals & Mood Tracker</h1>
      
      <div class="flex gap-2">
        <button class="btn btn-primary" @click="showAddGoalModal = true">
          + Add Goal
        </button>
        <button class="btn btn-secondary" @click="showUpdateMoodModal = true">
          Update Mood
        </button>
      </div>
    </div>
    
    <!-- Error Alert -->
    <div v-if="errorMessage" class="alert alert-error mb-6">
      <span>{{ errorMessage }}</span>
      <button class="btn btn-sm btn-ghost" @click="dismissError">✕</button>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    
    <!-- Main Content -->
    <template v-else>
      <!-- Stats Panel -->
      <StatsPanel :stats="stats" />
      
      <!-- Member Cards Grid -->
      <div v-if="members.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MemberCard
          v-for="member in members"
          :key="member.id"
          :member="member"
          @toggle-goal="handleToggleGoal"
          @delete-goal="handleDeleteGoal"
        />
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <p class="text-2xl text-gray-400">No team members yet</p>
      </div>
    </template>
    
    <!-- Modals -->
    <AddGoalForm
      :members="members"
      :open="showAddGoalModal"
      @close="showAddGoalModal = false"
      @submit="handleAddGoal"
    />
    
    <UpdateMoodForm
      :members="members"
      :open="showUpdateMoodModal"
      @close="showUpdateMoodModal = false"
      @submit="handleUpdateMood"
    />
  </div>
</template>
