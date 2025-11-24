<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TeamMember } from '@/types/member';

interface Props {
  members: TeamMember[];
  open: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', memberId: string, description: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedMemberId = ref<string>('');
const goalDescription = ref<string>('');
const errors = ref<{ member?: string; description?: string }>({});

function validateForm(): boolean {
  errors.value = {};
  
  if (!selectedMemberId.value) {
    errors.value.member = 'Please select a team member';
  }
  
  if (!goalDescription.value.trim()) {
    errors.value.description = 'Goal description is required';
  } else if (goalDescription.value.trim().length < 3) {
    errors.value.description = 'Goal must be at least 3 characters';
  } else if (goalDescription.value.length > 200) {
    errors.value.description = 'Goal must be less than 200 characters';
  }
  
  return Object.keys(errors.value).length === 0;
}

function handleSubmit(): void {
  if (!validateForm()) return;
  
  emit('submit', selectedMemberId.value, goalDescription.value.trim());
  resetForm();
}

function handleClose(): void {
  resetForm();
  emit('close');
}

function resetForm(): void {
  selectedMemberId.value = '';
  goalDescription.value = '';
  errors.value = {};
}

const characterCount = computed(() => goalDescription.value.length);
</script>

<template>
  <dialog :class="{ 'modal modal-open': open }" class="modal">
    <div class="modal-box">
      <h3 class="modal-title">Add New Goal</h3>
      
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

        <!-- Goal Description -->
        <div class="form-control">
          <label class="label-text">Goal Description</label>
          <textarea
            v-model="goalDescription"
            class="textarea"
            :class="{ 'textarea-error': errors.description }"
            placeholder="Enter goal description (3-200 characters)"
            rows="4"
          ></textarea>
          <div 
            class="character-counter"
            :class="{
              warning: characterCount > 180,
              error: characterCount > 200
            }"
          >
            {{ characterCount }}/200
          </div>
          <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" @click="handleClose">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Add Goal
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

.select,
.textarea {
  width: 100%;
  background: var(--color-bg-card);
  border: 1.5px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  transition: all var(--transition-base);
}

.select:focus,
.textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
}

.select-error,
.textarea-error {
  border-color: var(--color-error);
  background: #FEF2F2;
}

.error-message {
  color: var(--color-error-dark);
  font-size: 0.75rem;
  margin-top: 0.375rem;
  display: block;
}

.character-counter {
  color: var(--color-text-tertiary);
  font-size: 0.75rem;
  text-align: right;
  margin-top: 0.25rem;
}

.character-counter.warning {
  color: var(--color-warning);
}

.character-counter.error {
  color: var(--color-error);
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

.btn-primary:focus {
  outline: 2px solid var(--color-primary-focus);
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
