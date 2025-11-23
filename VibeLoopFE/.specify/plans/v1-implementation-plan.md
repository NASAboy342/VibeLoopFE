# V1 Implementation Plan - Team Goals & Mood Tracker

**Version**: 1.0.0  
**Created**: 2025-11-23  
**Status**: Ready for Implementation

---

## Overview

This plan details the step-by-step implementation of the Team Goals & Mood Tracker v1, using:
- **Mock data** in API calling methods (no real backend calls)
- **Local Storage** for data persistence
- **Vue 3 Composition API** with TypeScript strict mode
- **DaisyUI** components with Tailwind CSS

---

## Phase 1: Foundation Setup (Day 1)

### 1.1 Project Configuration

**Tasks**:
- [ ] Verify TypeScript strict mode is enabled in `tsconfig.json`
- [ ] Install/verify DaisyUI and Tailwind CSS configuration
- [ ] Set DaisyUI theme to "light" in `tailwind.config.js`
- [ ] Create folder structure according to architecture

**File Structure to Create**:
```
src/
  api/
    members.ts
    goals.ts
    storage.ts
  components/
    MemberCard.vue
    AddGoalForm.vue
    UpdateMoodForm.vue
    StatsPanel.vue
  composables/
    useMembers.ts
    useGoals.ts
    useMood.ts
    useStats.ts
  types/
    member.ts
    goal.ts
    mood.ts
    storage.ts
  views/
    Dashboard.vue
```

**Acceptance Criteria**:
- TypeScript strict mode enabled and no errors
- DaisyUI "light" theme active
- All folders created
- Project builds successfully

---

### 1.2 TypeScript Type Definitions

**File**: `src/types/mood.ts`
```typescript
export type MoodType = 'great' | 'good' | 'neutral' | 'low' | 'stressed';

export const MOOD_EMOJI: Record<MoodType, string> = {
  great: '😀',
  good: '😊',
  neutral: '😐',
  low: '😞',
  stressed: '😤'
};

export const MOOD_LABELS: Record<MoodType, string> = {
  great: 'Great - Feeling excellent, highly productive',
  good: 'Good - Positive mood, on track',
  neutral: 'Neutral - Okay, neither good nor bad',
  low: 'Low - Struggling, could use support',
  stressed: 'Stressed - Overwhelmed, needs help'
};
```

**File**: `src/types/goal.ts`
```typescript
export interface Goal {
  id: string;
  memberId: string;
  description: string; // min 3, max 200 chars
  completed: boolean;
  createdAt: string; // ISO 8601
  date: string; // YYYY-MM-DD
}

export interface CreateGoalDto {
  memberId: string;
  description: string;
  date: string;
}

export interface UpdateGoalDto {
  completed: boolean;
}
```

**File**: `src/types/member.ts`
```typescript
import type { Goal } from './goal';
import type { MoodType } from './mood';

export interface TeamMember {
  id: string;
  name: string;
  mood: MoodType | null;
  moodUpdatedAt: string | null; // ISO 8601
  goals: Goal[];
}

export interface UpdateMoodDto {
  mood: MoodType;
  timestamp: string; // ISO 8601
}
```

**File**: `src/types/storage.ts`
```typescript
export interface LocalStorageData {
  members: TeamMember[];
  lastUpdated: string; // ISO 8601
}

export const STORAGE_KEY = 'vibeloop_data';
```

**Acceptance Criteria**:
- All interfaces defined with strict typing
- No `any` types used
- Proper JSDoc comments added
- Types export correctly

---

### 1.3 Local Storage Service

**File**: `src/api/storage.ts`

**Purpose**: Handle all localStorage read/write operations with type safety

**Implementation**:
```typescript
import type { TeamMember } from '@/types/member';
import type { LocalStorageData } from '@/types/storage';
import { STORAGE_KEY } from '@/types/storage';

/**
 * Get all data from localStorage
 */
export function getStorageData(): LocalStorageData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    return JSON.parse(data) as LocalStorageData;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Save all data to localStorage
 */
export function setStorageData(members: TeamMember[]): void {
  try {
    const data: LocalStorageData = {
      members,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

/**
 * Clear all data from localStorage
 */
export function clearStorageData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Initialize localStorage with seed data if empty
 */
export function initializeStorage(seedData: TeamMember[]): void {
  const existing = getStorageData();
  if (!existing) {
    setStorageData(seedData);
  }
}
```

**Acceptance Criteria**:
- All functions properly typed
- Error handling in place
- Works with localStorage API
- Exports all needed functions

---

## Phase 2: API Layer with Mock Data (Day 2)

### 2.1 Members API

**File**: `src/api/members.ts`

**Purpose**: Mock API for member operations, using localStorage as backend

**Implementation**:
```typescript
import type { TeamMember } from '@/types/member';
import type { UpdateMoodDto } from '@/types/member';
import type { MoodType } from '@/types/mood';
import { getStorageData, setStorageData, initializeStorage } from './storage';

/**
 * Mock seed data for initial load
 */
const MOCK_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    mood: 'great',
    moodUpdatedAt: new Date().toISOString(),
    goals: [
      {
        id: 'g1',
        memberId: '1',
        description: 'Complete API design document',
        completed: false,
        createdAt: '2025-11-23T09:00:00Z',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'g2',
        memberId: '1',
        description: 'Review pull requests',
        completed: true,
        createdAt: '2025-11-23T09:15:00Z',
        date: new Date().toISOString().split('T')[0]
      }
    ]
  },
  {
    id: '2',
    name: 'Bob Smith',
    mood: 'neutral',
    moodUpdatedAt: new Date().toISOString(),
    goals: [
      {
        id: 'g3',
        memberId: '2',
        description: 'Fix authentication bug',
        completed: false,
        createdAt: '2025-11-23T09:30:00Z',
        date: new Date().toISOString().split('T')[0]
      }
    ]
  },
  {
    id: '3',
    name: 'Carol Davis',
    mood: null,
    moodUpdatedAt: null,
    goals: []
  },
  {
    id: '4',
    name: 'David Wilson',
    mood: 'stressed',
    moodUpdatedAt: new Date().toISOString(),
    goals: [
      {
        id: 'g4',
        memberId: '4',
        description: 'Deploy to production',
        completed: false,
        createdAt: '2025-11-23T10:00:00Z',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'g5',
        memberId: '4',
        description: 'Database migration',
        completed: false,
        createdAt: '2025-11-23T10:15:00Z',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'g6',
        memberId: '4',
        description: 'Update monitoring alerts',
        completed: false,
        createdAt: '2025-11-23T10:30:00Z',
        date: new Date().toISOString().split('T')[0]
      }
    ]
  },
  {
    id: '5',
    name: 'Emma Thompson',
    mood: 'good',
    moodUpdatedAt: new Date().toISOString(),
    goals: [
      {
        id: 'g7',
        memberId: '5',
        description: 'Write unit tests',
        completed: true,
        createdAt: '2025-11-23T11:00:00Z',
        date: new Date().toISOString().split('T')[0]
      }
    ]
  }
];

/**
 * Simulate network delay (mock API behavior)
 */
const delay = (ms: number = 300): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * GET /api/members
 * Fetch all team members with their goals
 */
export async function getMembers(): Promise<TeamMember[]> {
  await delay();
  
  // Initialize storage with mock data if empty
  initializeStorage(MOCK_MEMBERS);
  
  const data = getStorageData();
  if (!data) return MOCK_MEMBERS;
  
  // Filter to only show today's goals
  const today = new Date().toISOString().split('T')[0];
  const membersWithTodayGoals = data.members.map(member => ({
    ...member,
    goals: member.goals.filter(goal => goal.date === today)
  }));
  
  // Sort alphabetically by name
  return membersWithTodayGoals.sort((a, b) => 
    a.name.localeCompare(b.name)
  );
}

/**
 * PUT /api/members/{memberId}/mood
 * Update a team member's mood
 */
export async function updateMemberMood(
  memberId: string, 
  dto: UpdateMoodDto
): Promise<TeamMember> {
  await delay();
  
  const data = getStorageData();
  if (!data) throw new Error('No data found');
  
  const memberIndex = data.members.findIndex(m => m.id === memberId);
  if (memberIndex === -1) {
    throw new Error(`Member with id ${memberId} not found`);
  }
  
  // Update mood
  data.members[memberIndex].mood = dto.mood;
  data.members[memberIndex].moodUpdatedAt = dto.timestamp;
  
  // Save to storage
  setStorageData(data.members);
  
  return data.members[memberIndex];
}
```

**Acceptance Criteria**:
- Returns properly typed data
- Uses localStorage for persistence
- Simulates API delay
- Filters to today's goals only
- Sorts members alphabetically
- Handles errors gracefully

---

### 2.2 Goals API

**File**: `src/api/goals.ts`

**Purpose**: Mock API for goal operations, using localStorage as backend

**Implementation**:
```typescript
import type { Goal, CreateGoalDto, UpdateGoalDto } from '@/types/goal';
import { getStorageData, setStorageData } from './storage';

/**
 * Simulate network delay
 */
const delay = (ms: number = 300): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return `g${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * POST /api/goals
 * Create a new goal for a team member
 */
export async function addGoal(dto: CreateGoalDto): Promise<Goal> {
  await delay();
  
  const data = getStorageData();
  if (!data) throw new Error('No data found');
  
  // Validate member exists
  const memberIndex = data.members.findIndex(m => m.id === dto.memberId);
  if (memberIndex === -1) {
    throw new Error(`Member with id ${dto.memberId} not found`);
  }
  
  // Create new goal
  const newGoal: Goal = {
    id: generateId(),
    memberId: dto.memberId,
    description: dto.description,
    completed: false,
    createdAt: new Date().toISOString(),
    date: dto.date
  };
  
  // Add to member's goals
  data.members[memberIndex].goals.push(newGoal);
  
  // Save to storage
  setStorageData(data.members);
  
  return newGoal;
}

/**
 * PATCH /api/goals/{goalId}
 * Update goal completion status
 */
export async function updateGoalStatus(
  goalId: string, 
  dto: UpdateGoalDto
): Promise<Goal> {
  await delay();
  
  const data = getStorageData();
  if (!data) throw new Error('No data found');
  
  // Find goal across all members
  let foundGoal: Goal | null = null;
  let memberIndex = -1;
  let goalIndex = -1;
  
  for (let i = 0; i < data.members.length; i++) {
    const gIndex = data.members[i].goals.findIndex(g => g.id === goalId);
    if (gIndex !== -1) {
      memberIndex = i;
      goalIndex = gIndex;
      foundGoal = data.members[i].goals[gIndex];
      break;
    }
  }
  
  if (!foundGoal) {
    throw new Error(`Goal with id ${goalId} not found`);
  }
  
  // Update goal
  data.members[memberIndex].goals[goalIndex].completed = dto.completed;
  
  // Save to storage
  setStorageData(data.members);
  
  return data.members[memberIndex].goals[goalIndex];
}

/**
 * DELETE /api/goals/{goalId}
 * Delete a goal
 */
export async function deleteGoal(goalId: string): Promise<{ success: boolean }> {
  await delay();
  
  const data = getStorageData();
  if (!data) throw new Error('No data found');
  
  // Find and remove goal
  let removed = false;
  
  for (let i = 0; i < data.members.length; i++) {
    const goalIndex = data.members[i].goals.findIndex(g => g.id === goalId);
    if (goalIndex !== -1) {
      data.members[i].goals.splice(goalIndex, 1);
      removed = true;
      break;
    }
  }
  
  if (!removed) {
    throw new Error(`Goal with id ${goalId} not found`);
  }
  
  // Save to storage
  setStorageData(data.members);
  
  return { success: true };
}
```

**Acceptance Criteria**:
- CRUD operations for goals
- Validates data before operations
- Persists to localStorage
- Generates unique IDs
- Handles errors properly

---

## Phase 3: Composables (Day 3)

### 3.1 useMembers Composable

**File**: `src/composables/useMembers.ts`

**Purpose**: Manage team member state and operations

**Implementation**:
```typescript
import { ref, type Ref } from 'vue';
import type { TeamMember } from '@/types/member';
import type { UpdateMoodDto } from '@/types/member';
import { getMembers, updateMemberMood } from '@/api/members';

export function useMembers() {
  const members: Ref<TeamMember[]> = ref([]);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  
  /**
   * Fetch all team members
   */
  async function fetchMembers(): Promise<void> {
    loading.value = true;
    error.value = null;
    
    try {
      members.value = await getMembers();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch members';
      console.error('Error fetching members:', err);
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Update a member's mood
   */
  async function updateMood(memberId: string, dto: UpdateMoodDto): Promise<void> {
    error.value = null;
    
    try {
      const updatedMember = await updateMemberMood(memberId, dto);
      
      // Update local state
      const index = members.value.findIndex(m => m.id === memberId);
      if (index !== -1) {
        members.value[index] = updatedMember;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update mood';
      console.error('Error updating mood:', err);
      throw err; // Re-throw to handle in component
    }
  }
  
  /**
   * Start auto-refresh polling (every 30 seconds)
   */
  function startAutoRefresh(): void {
    const intervalId = setInterval(() => {
      fetchMembers();
    }, 30000); // 30 seconds
    
    // Return cleanup function
    return () => clearInterval(intervalId);
  }
  
  return {
    members,
    loading,
    error,
    fetchMembers,
    updateMood,
    startAutoRefresh
  };
}
```

**Acceptance Criteria**:
- Manages member state reactively
- Handles loading and error states
- Auto-refresh functionality
- Proper TypeScript typing

---

### 3.2 useGoals Composable

**File**: `src/composables/useGoals.ts`

**Implementation**:
```typescript
import { ref, type Ref } from 'vue';
import type { Goal, CreateGoalDto, UpdateGoalDto } from '@/types/goal';
import { addGoal, updateGoalStatus, deleteGoal } from '@/api/goals';

export function useGoals() {
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  
  /**
   * Add a new goal
   */
  async function createGoal(dto: CreateGoalDto): Promise<Goal> {
    loading.value = true;
    error.value = null;
    
    try {
      const newGoal = await addGoal(dto);
      return newGoal;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add goal';
      console.error('Error adding goal:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Toggle goal completion status
   */
  async function toggleGoalComplete(goalId: string, completed: boolean): Promise<Goal> {
    error.value = null;
    
    try {
      const dto: UpdateGoalDto = { completed };
      const updatedGoal = await updateGoalStatus(goalId, dto);
      return updatedGoal;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update goal';
      console.error('Error updating goal:', err);
      throw err;
    }
  }
  
  /**
   * Delete a goal
   */
  async function removeGoal(goalId: string): Promise<void> {
    error.value = null;
    
    try {
      await deleteGoal(goalId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete goal';
      console.error('Error deleting goal:', err);
      throw err;
    }
  }
  
  return {
    loading,
    error,
    createGoal,
    toggleGoalComplete,
    removeGoal
  };
}
```

**Acceptance Criteria**:
- All goal operations wrapped
- Error handling in place
- Returns proper types
- Async operations handled

---

### 3.3 useStats Composable

**File**: `src/composables/useStats.ts`

**Implementation**:
```typescript
import { computed, type ComputedRef } from 'vue';
import type { TeamMember } from '@/types/member';
import type { MoodType } from '@/types/mood';

export interface MoodCount {
  great: number;
  good: number;
  neutral: number;
  low: number;
  stressed: number;
}

export interface TeamStats {
  completionPercentage: string;
  moodBreakdown: MoodCount;
  totalGoals: number;
  completedGoals: number;
}

export function useStats(members: ComputedRef<TeamMember[]> | TeamMember[]) {
  /**
   * Calculate team goal completion percentage
   */
  const completionPercentage = computed<string>(() => {
    const memberList = Array.isArray(members) ? members : members.value;
    
    let total = 0;
    let completed = 0;
    
    memberList.forEach(member => {
      member.goals.forEach(goal => {
        total++;
        if (goal.completed) completed++;
      });
    });
    
    if (total === 0) return 'No goals yet';
    
    const percentage = Math.round((completed / total) * 100);
    return `${percentage}%`;
  });
  
  /**
   * Count team members by mood
   */
  const moodBreakdown = computed<MoodCount>(() => {
    const memberList = Array.isArray(members) ? members : members.value;
    
    const counts: MoodCount = {
      great: 0,
      good: 0,
      neutral: 0,
      low: 0,
      stressed: 0
    };
    
    memberList.forEach(member => {
      if (member.mood) {
        counts[member.mood]++;
      }
    });
    
    return counts;
  });
  
  /**
   * Total goals count
   */
  const totalGoals = computed<number>(() => {
    const memberList = Array.isArray(members) ? members : members.value;
    return memberList.reduce((sum, member) => sum + member.goals.length, 0);
  });
  
  /**
   * Completed goals count
   */
  const completedGoals = computed<number>(() => {
    const memberList = Array.isArray(members) ? members : members.value;
    return memberList.reduce((sum, member) => {
      return sum + member.goals.filter(g => g.completed).length;
    }, 0);
  });
  
  /**
   * Combined stats object
   */
  const stats = computed<TeamStats>(() => ({
    completionPercentage: completionPercentage.value,
    moodBreakdown: moodBreakdown.value,
    totalGoals: totalGoals.value,
    completedGoals: completedGoals.value
  }));
  
  return {
    completionPercentage,
    moodBreakdown,
    totalGoals,
    completedGoals,
    stats
  };
}
```

**Acceptance Criteria**:
- Calculated stats are reactive
- Handles zero goals case
- Proper percentage calculation
- All mood types counted

---

## Phase 4: UI Components (Days 4-5)

### 4.1 StatsPanel Component

**File**: `src/components/StatsPanel.vue`

**Implementation**:
```vue
<script setup lang="ts">
import { computed } from 'vue';
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
```

**Acceptance Criteria**:
- Uses DaisyUI `stats` component
- Displays all required metrics
- Responsive layout
- Proper TypeScript props

---

### 4.2 MemberCard Component

**File**: `src/components/MemberCard.vue`

**Implementation** (150+ lines, key structure):
```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TeamMember } from '@/types/member';
import type { Goal } from '@/types/goal';
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
```

**Acceptance Criteria**:
- Displays all member info
- Shows mood with proper styling
- Goals with checkboxes
- Delete icon on hover
- Empty state handled
- Truncates long goals with tooltip

---

### 4.3 AddGoalForm Component

**File**: `src/components/AddGoalForm.vue`

**Implementation**:
```vue
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

const props = defineProps<Props>();
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
```

**Acceptance Criteria**:
- Modal opens/closes properly
- Form validation works
- Character counter
- Error messages inline
- Clears on submit/cancel

---

### 4.4 UpdateMoodForm Component

**File**: `src/components/UpdateMoodForm.vue`

**Implementation**: Similar structure to AddGoalForm, with mood emoji buttons

```vue
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

const props = defineProps<Props>();
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
```

**Acceptance Criteria**:
- Mood emoji buttons work
- Validation in place
- Modal behavior correct
- Visual feedback for selection

---

## Phase 5: Dashboard Integration (Day 6)

### 5.1 Dashboard View

**File**: `src/views/Dashboard.vue`

**Implementation**:
```vue
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

const { members, loading, error, fetchMembers, updateMood, startAutoRefresh } = useMembers();
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
```

**Acceptance Criteria**:
- All components integrated
- Data flows correctly
- Modals open/close properly
- Error handling displays
- Auto-refresh works
- Loading states shown

---

## Phase 6: App Integration & Testing (Day 7)

### 6.1 App.vue Setup

**File**: `src/App.vue`

```vue
<script setup lang="ts">
import Dashboard from './views/Dashboard.vue';
</script>

<template>
  <div id="app" data-theme="light">
    <Dashboard />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background-color: var(--fallback-b1, oklch(var(--b1)));
}
</style>
```

---

### 6.2 Manual Testing Checklist

**Dashboard Load**:
- [ ] Dashboard loads without errors
- [ ] Stats panel displays at top
- [ ] Member cards display in grid (3-4 per row)
- [ ] Members sorted alphabetically
- [ ] Mock data loads from localStorage

**Add Goal**:
- [ ] Click "Add Goal" opens modal
- [ ] Can select team member
- [ ] Can type goal description
- [ ] Character counter works (0/200)
- [ ] Validation errors show for empty fields
- [ ] Validation errors show for <3 characters
- [ ] Validation errors show for >200 characters
- [ ] Submit adds goal to member card
- [ ] Goal appears immediately
- [ ] Modal closes after submit
- [ ] Stats panel updates

**Mark Goal Complete**:
- [ ] Click checkbox marks goal complete
- [ ] Goal shows strikethrough
- [ ] Completion count updates (e.g., 1/3 → 2/3)
- [ ] Stats panel percentage updates
- [ ] No confirmation needed
- [ ] Change is immediate

**Delete Goal**:
- [ ] Hover over goal shows trash icon
- [ ] Click trash icon removes goal
- [ ] Goal removed immediately
- [ ] Completion count updates
- [ ] Stats panel updates
- [ ] No confirmation needed

**Update Mood**:
- [ ] Click "Update Mood" opens modal
- [ ] Can select team member
- [ ] Can select mood emoji
- [ ] Mood buttons show visual selection
- [ ] Submit updates mood on card
- [ ] Mood emoji displays correctly
- [ ] Stats panel mood breakdown updates
- [ ] Modal closes after submit

**Empty States**:
- [ ] Member with no goals shows "No goals for today"
- [ ] Null mood shows "Set mood" with faded emoji
- [ ] Zero goals shows "No goals yet" in stats

**Error Handling**:
- [ ] Form validation errors display inline (red text)
- [ ] API errors show toast/alert notification
- [ ] Error can be dismissed

**Auto-Refresh**:
- [ ] Data refreshes every 30 seconds
- [ ] No visual disruption during refresh

**Data Persistence**:
- [ ] Add goal persists in localStorage
- [ ] Update mood persists in localStorage
- [ ] Delete goal persists in localStorage
- [ ] Mark complete persists in localStorage
- [ ] Refresh page loads persisted data

---

## Implementation Timeline

| Phase | Tasks | Duration | Dependencies |
|-------|-------|----------|--------------|
| Phase 1 | Foundation Setup | 1 day | None |
| Phase 2 | API Layer with Mock Data | 1 day | Phase 1 |
| Phase 3 | Composables | 1 day | Phase 2 |
| Phase 4 | UI Components | 2 days | Phase 3 |
| Phase 5 | Dashboard Integration | 1 day | Phase 4 |
| Phase 6 | App Integration & Testing | 1 day | Phase 5 |
| **Total** | | **7 days** | |

---

## Key Technical Decisions

### 1. Local Storage Structure
```typescript
{
  "vibeloop_data": {
    "members": TeamMember[],
    "lastUpdated": "2025-11-23T10:00:00Z"
  }
}
```

### 2. Today's Goals Filtering
- Always filter to show only goals where `goal.date === today`
- Use browser's local date: `new Date().toISOString().split('T')[0]`
- No carryover of yesterday's incomplete goals

### 3. Auto-Refresh Strategy
- Poll every 30 seconds using `setInterval`
- Fetch data from localStorage (already up-to-date)
- No backend polling needed since using localStorage

### 4. Error Handling Strategy
- Form validation: inline red text below fields
- API errors: DaisyUI alert toast at top of page
- Console.error for debugging
- Re-throw errors from composables to handle in components

### 5. State Management Pattern
- Composables manage state (no Pinia needed)
- Dashboard orchestrates all operations
- Components emit events, Dashboard handles logic
- Refresh data after mutations

---

## Success Criteria

### Phase Completion Checklist
- [ ] All TypeScript files compile without errors
- [ ] All components render without console errors
- [ ] All user flows work as specified
- [ ] Data persists in localStorage
- [ ] Auto-refresh works
- [ ] Code follows constitution (Vue 3 Composition API, TypeScript strict, DaisyUI)
- [ ] No testing code included
- [ ] Components under 200 lines
- [ ] Mock data works in API layer

### Ready for Demo When:
1. Dashboard loads and displays all mock data
2. Can add goals and see them immediately
3. Can mark goals complete with visual feedback
4. Can delete goals with hover interaction
5. Can update moods and see changes
6. Stats panel updates correctly
7. All empty states display properly
8. Data persists across page refreshes
9. No errors in browser console
10. Code is readable and maintainable

---

## Next Steps

1. **Review this plan** with team/stakeholders
2. **Start Phase 1**: Set up project foundation
3. **Daily progress check**: Complete one phase per day
4. **Test incrementally**: Test each component as built
5. **Demo on Day 7**: Show working v1 application

---

*This implementation plan follows the VibeLoop Frontend Constitution v1.0.0 and v1 Specification*
