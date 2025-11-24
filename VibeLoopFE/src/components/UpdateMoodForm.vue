<script setup lang="ts">
import { ref } from 'vue';
import type { TeamMember } from '@/types/member';
import type { MoodType } from '@/types/mood';
import { MOOD_EMOJI, MOOD_LABELS } from '@/types/mood';

interface Props {
  members: TeamMember[];
  open: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', memberId: string, mood: MoodType): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedMemberId = ref<string>('');
const selectedMood = ref<MoodType | null>(null);
const errors = ref<{ member?: string; mood?: string }>({});

const moods: MoodType[] = ['great', 'good', 'neutral', 'low', 'stressed'];

function validateForm(): boolean {
  errors.value = {};
  
  if (!selectedMemberId.value) {
    errors.value.member = 'Please select a team member';
  }
  
  if (!selectedMood.value) {
    errors.value.mood = 'Please select a mood';
  }
  
  return Object.keys(errors.value).length === 0;
}

function handleSubmit(): void {
  if (!validateForm() || !selectedMood.value) return;
  
  emit('submit', selectedMemberId.value, selectedMood.value);
  resetForm();
}

function handleClose(): void {
  resetForm();
  emit('close');
}

function resetForm(): void {
  selectedMemberId.value = '';
  selectedMood.value = null;
  errors.value = {};
}
</script>

<template>
  <dialog :class="{ 'modal modal-open': open }" class="modal">
    <div class="modal-box">
      <h3 class="modal-title">Update Mood</h3>
      
      <form @submit.prevent="handleSubmit">
        <!-- Team Member Select -->
        <div class="form-control">
          <label class="label-text">Team Member</label>
          <select
            v-model="selectedMemberId"
            class="select"
            :class="{ 'select-error': errors.member }"
          >
            <option value="" disabled>Select a team member</option>
            <option v-for="member in members" :key="member.id" :value="member.id">
              {{ member.name }}
            </option>
          </select>
          <span v-if="errors.member" class="error-message">{{ errors.member }}</span>
        </div>

        <!-- Mood Selector -->
        <div class="form-control">
          <label class="label-text">Select Mood</label>
          <div class="mood-selector">
            <button
              v-for="mood in moods"
              :key="mood"
              type="button"
              class="mood-button"
              :class="[mood, { selected: selectedMood === mood }]"
              @click="selectedMood = mood"
            >
              <span class="mood-emoji">{{ MOOD_EMOJI[mood] }}</span>
              <span class="mood-label">{{ MOOD_LABELS[mood] }}</span>
            </button>
          </div>
          <span v-if="errors.mood" class="error-message">{{ errors.mood }}</span>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" @click="handleClose">
            Cancel
          </button>
          <button type="submit" class="btn btn-secondary">
            Update Mood
          </button>
        </div>
      </form>
    </div>
    
    <!-- Backdrop -->
    <div class="modal-backdrop" @click="handleClose"></div>
  </dialog>
</template>

<style scoped>
.modal {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
}

.modal-box {
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border);
  padding: 2rem;
  max-width: 500px;
}

.modal-title {
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.form-control {
  margin-bottom: 1.25rem;
}

.label-text {
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: block;
}

.select {
  width: 100%;
  background: var(--color-bg-card);
  border: 1.5px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  transition: all var(--transition-base);
}

.select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
}

.select-error {
  border-color: var(--color-error);
  background: #FEF2F2;
}

.error-message {
  color: var(--color-error-dark);
  font-size: 0.75rem;
  margin-top: 0.375rem;
  display: block;
}

.mood-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.mood-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: 0.875rem;
  font-weight: 500;
}

.mood-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.mood-button.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.15);
}

.mood-button.great {
  background: var(--mood-great-bg);
  color: var(--mood-great-text);
}

.mood-button.good {
  background: var(--mood-good-bg);
  color: var(--mood-good-text);
}

.mood-button.neutral {
  background: var(--mood-neutral-bg);
  color: var(--mood-neutral-text);
}

.mood-button.low {
  background: var(--mood-low-bg);
  color: var(--mood-low-text);
}

.mood-button.stressed {
  background: var(--mood-stressed-bg);
  color: var(--mood-stressed-text);
}

.mood-emoji {
  font-size: 2rem;
  line-height: 1;
}

.mood-label {
  font-weight: 500;
  text-transform: capitalize;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-base);
  border: none;
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

.btn-secondary:focus {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.btn-ghost:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-hover);
  color: var(--color-text-primary);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
