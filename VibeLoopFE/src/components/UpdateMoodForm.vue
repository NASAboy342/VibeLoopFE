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
      <h3 class="font-bold text-lg mb-4">Update Mood</h3>
      
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
        
        <!-- Mood Selector -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Select Mood</span>
          </label>
          <div class="btn-group btn-group-vertical w-full">
            <button
              v-for="mood in moods"
              :key="mood"
              type="button"
              class="btn btn-outline justify-start"
              :class="{ 'btn-active': selectedMood === mood }"
              @click="selectedMood = mood"
            >
              <span class="text-2xl mr-2">{{ MOOD_EMOJI[mood] }}</span>
              <span class="text-left flex-1">{{ MOOD_LABELS[mood] }}</span>
            </button>
          </div>
          <label v-if="errors.mood" class="label">
            <span class="label-text-alt text-error">{{ errors.mood }}</span>
          </label>
        </div>
        
        <!-- Action Buttons -->
        <div class="modal-action">
          <button type="button" class="btn btn-ghost" @click="handleClose">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Update Mood
          </button>
        </div>
      </form>
    </div>
    
    <!-- Backdrop -->
    <div class="modal-backdrop" @click="handleClose"></div>
  </dialog>
</template>
