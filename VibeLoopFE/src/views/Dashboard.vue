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
  <div class="dashboard">
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">Team Goals & Mood Tracker</h1>
        <p class="dashboard-subtitle">Track your team's progress and well-being</p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="error-alert">
        <span class="error-icon">⚠️</span>
        <span class="error-text">{{ errorMessage }}</span>
        <button class="btn-close" @click="dismissError">✕</button>
      </div>

      <!-- Action Buttons -->
      <div class="dashboard-actions">
        <button class="btn btn-primary" @click="showAddGoalModal = true">
          <span>➕</span>
          <span>Add Goal</span>
        </button>
        <button class="btn btn-secondary" @click="showUpdateMoodModal = true">
          <span>😊</span>
          <span>Update Mood</span>
        </button>
      </div>

      <!-- Stats Panel -->
      <StatsPanel :stats="stats" />

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <!-- Members Grid -->
      <div v-else-if="members.length > 0" class="members-grid">
        <MemberCard
          v-for="member in members"
          :key="member.id"
          :member="member"
          @toggle-goal="handleToggleGoal"
          @delete-goal="handleDeleteGoal"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-state-icon">📊</div>
        <h2 class="empty-state-title">No team members yet</h2>
        <p class="empty-state-text">Start by adding goals and tracking moods</p>
      </div>

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
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  color: var(--color-text-primary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.dashboard-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-base);
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #0E7490 100%);
  color: var(--color-text-inverse);
  box-shadow: 0 2px 4px rgba(8, 145, 178, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #0E7490 0%, #155E75 100%);
  box-shadow: 0 4px 8px rgba(8, 145, 178, 0.3);
  transform: translateY(-1px);
}

.btn-secondary {
  background: linear-gradient(135deg, var(--color-secondary) 0%, #4F46E5 100%);
  color: var(--color-text-inverse);
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #4F46E5 0%, #4338CA 100%);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
  transform: translateY(-1px);
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-alert {
  background: linear-gradient(135deg, var(--color-error-light) 0%, #FECACA 100%);
  border-left: 4px solid var(--color-error-dark);
  color: #7F1D1D;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-icon {
  font-size: 1.25rem;
}

.error-text {
  flex: 1;
  font-weight: 500;
}

.btn-close {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.btn-close:hover {
  opacity: 1;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(to bottom, var(--color-bg-hover), #F1F5F9);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-border-hover);
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state-title {
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-state-text {
  color: var(--color-text-tertiary);
  font-size: 1rem;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem 0.5rem;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
  }
  
  .members-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .dashboard-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
