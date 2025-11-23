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
      <h3 class="font-bold text-lg mb-4">Add New Goal</h3>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Team Member Select -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Team Member</span>
          </label>
          <select
            v-model="selectedMemberId"
            class="select select-bordered w-full"
            :class="{ 'select-error': errors.member }"
          >
            <option value="" disabled>Select a team member</option>
            <option v-for="member in members" :key="member.id" :value="member.id">
              {{ member.name }}
            </option>
          </select>
          <label v-if="errors.member" class="label">
            <span class="label-text-alt text-error">{{ errors.member }}</span>
          </label>
        </div>
        
        <!-- Goal Description Input -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Goal Description</span>
            <span class="label-text-alt">{{ characterCount }}/200</span>
          </label>
          <input
            v-model="goalDescription"
            type="text"
            placeholder="Enter goal description"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.description }"
            maxlength="200"
          />
          <label v-if="errors.description" class="label">
            <span class="label-text-alt text-error">{{ errors.description }}</span>
          </label>
        </div>
        
        <!-- Action Buttons -->
        <div class="modal-action">
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
