# V1 Implementation Tasks - Team Goals & Mood Tracker

**Version**: 1.0.0  
**Created**: 2025-11-23  
**Status**: Ready to Start

---

## Task Overview

Total tasks: **47**  
Estimated time: **7 days**  
Priority levels: 🔴 Critical | 🟡 High | 🟢 Medium | ⚪ Low

---

## Phase 1: Foundation Setup (Day 1)

### 1.1 Project Configuration

- [ ] **T001** 🔴 Verify TypeScript strict mode in `tsconfig.json`
  - Check `strict: true` is enabled
  - Verify `noImplicitAny`, `strictNullChecks` are active
  - Ensure no compilation errors

- [ ] **T002** 🔴 Configure DaisyUI theme
  - Install DaisyUI if not present: `npm install -D daisyui@latest`
  - Add DaisyUI to `tailwind.config.js` plugins
  - Set default theme to "light" in config
  - Verify theme loads in browser

- [ ] **T003** 🟡 Create folder structure
  - Create `src/api/` directory
  - Create `src/components/` directory
  - Create `src/composables/` directory
  - Create `src/types/` directory
  - Create `src/views/` directory

- [ ] **T004** 🟢 Verify build process
  - Run `npm run dev` to start dev server
  - Check console for errors
  - Verify hot reload works

---

### 1.2 TypeScript Type Definitions

- [ ] **T005** 🔴 Create mood types (`src/types/mood.ts`)
  - Define `MoodType` union type
  - Create `MOOD_EMOJI` constant mapping
  - Create `MOOD_LABELS` constant mapping
  - Export all types and constants

- [ ] **T006** 🔴 Create goal types (`src/types/goal.ts`)
  - Define `Goal` interface
  - Define `CreateGoalDto` interface
  - Define `UpdateGoalDto` interface
  - Add JSDoc comments for all interfaces

- [ ] **T007** 🔴 Create member types (`src/types/member.ts`)
  - Define `TeamMember` interface
  - Define `UpdateMoodDto` interface
  - Import and use `Goal` and `MoodType`
  - Add JSDoc comments

- [ ] **T008** 🟡 Create storage types (`src/types/storage.ts`)
  - Define `LocalStorageData` interface
  - Define `STORAGE_KEY` constant
  - Export both

- [ ] **T009** 🟢 Verify all types compile
  - Run TypeScript compiler
  - Check for any type errors
  - Fix any issues

---

### 1.3 Local Storage Service

- [ ] **T010** 🔴 Create storage service (`src/api/storage.ts`)
  - Implement `getStorageData()` function
  - Implement `setStorageData()` function
  - Implement `clearStorageData()` function
  - Implement `initializeStorage()` function
  - Add try-catch error handling for all functions
  - Add TypeScript return types

- [ ] **T011** 🟡 Test storage service
  - Open browser console
  - Test saving data to localStorage
  - Test reading data from localStorage
  - Test clearing data
  - Verify data persists across page refresh

---

## Phase 2: API Layer with Mock Data (Day 2)

### 2.1 Members API

- [ ] **T012** 🔴 Create mock seed data
  - Define `MOCK_MEMBERS` array with 5 members
  - Include varied moods (great, good, neutral, low, stressed, null)
  - Include varied goal counts (0, 1, 2, 3 goals)
  - Mix completed and incomplete goals
  - Use realistic names and descriptions

- [ ] **T013** 🔴 Implement `getMembers()` API function
  - Add network delay simulation (300ms)
  - Initialize localStorage with seed data if empty
  - Read from localStorage
  - Filter to today's goals only
  - Sort members alphabetically by name
  - Return typed `TeamMember[]`

- [ ] **T014** 🔴 Implement `updateMemberMood()` API function
  - Accept `memberId` and `UpdateMoodDto`
  - Add network delay simulation
  - Find member in localStorage
  - Update mood and timestamp
  - Save to localStorage
  - Return updated member
  - Throw error if member not found

- [ ] **T015** 🟡 Test members API
  - Call `getMembers()` and verify data
  - Call `updateMemberMood()` and verify update
  - Test error handling for invalid member ID
  - Verify localStorage persistence

---

### 2.2 Goals API

- [ ] **T016** 🔴 Implement `addGoal()` API function
  - Accept `CreateGoalDto` parameter
  - Add network delay simulation
  - Generate unique goal ID
  - Find member by ID
  - Create new goal object
  - Add to member's goals array
  - Save to localStorage
  - Return new goal

- [ ] **T017** 🔴 Implement `updateGoalStatus()` API function
  - Accept `goalId` and `UpdateGoalDto`
  - Add network delay simulation
  - Find goal across all members
  - Update completed status
  - Save to localStorage
  - Return updated goal
  - Throw error if goal not found

- [ ] **T018** 🔴 Implement `deleteGoal()` API function
  - Accept `goalId` parameter
  - Add network delay simulation
  - Find and remove goal from member
  - Save to localStorage
  - Return success response
  - Throw error if goal not found

- [ ] **T019** 🟡 Test goals API
  - Test adding a goal
  - Test updating goal status
  - Test deleting a goal
  - Verify localStorage updates
  - Test error handling

---

## Phase 3: Composables (Day 3)

### 3.1 useMembers Composable

- [ ] **T020** 🔴 Create `useMembers` composable (`src/composables/useMembers.ts`)
  - Define reactive `members` ref
  - Define reactive `loading` ref
  - Define reactive `error` ref
  - Implement `fetchMembers()` function
  - Implement `updateMood()` function
  - Implement `startAutoRefresh()` function (30s interval)
  - Add proper TypeScript types
  - Handle errors and set error state

- [ ] **T021** 🟡 Test useMembers composable
  - Import in a test component
  - Call `fetchMembers()` and verify state
  - Call `updateMood()` and verify update
  - Verify auto-refresh works
  - Test error handling

---

### 3.2 useGoals Composable

- [ ] **T022** 🔴 Create `useGoals` composable (`src/composables/useGoals.ts`)
  - Define reactive `loading` ref
  - Define reactive `error` ref
  - Implement `createGoal()` function
  - Implement `toggleGoalComplete()` function
  - Implement `removeGoal()` function
  - Add proper TypeScript types
  - Handle errors appropriately

- [ ] **T023** 🟡 Test useGoals composable
  - Test creating a goal
  - Test toggling goal completion
  - Test removing a goal
  - Verify error handling

---

### 3.3 useStats Composable

- [ ] **T024** 🔴 Create `useStats` composable (`src/composables/useStats.ts`)
  - Accept members array as parameter
  - Create computed `completionPercentage`
  - Create computed `moodBreakdown`
  - Create computed `totalGoals`
  - Create computed `completedGoals`
  - Create computed `stats` object
  - Handle edge case: zero goals (show "No goals yet")
  - Add proper TypeScript interfaces

- [ ] **T025** 🟡 Test useStats composable
  - Test with members having goals
  - Test with zero goals
  - Test with all completed goals
  - Verify calculations are correct

---

## Phase 4: UI Components (Days 4-5)

### 4.1 StatsPanel Component

- [ ] **T026** 🔴 Create `StatsPanel.vue` component
  - Set up `<script setup lang="ts">`
  - Define props interface for `stats`
  - Create template with DaisyUI `stats` component
  - Display completion percentage
  - Display completed/total goals count
  - Display mood breakdown with emoji + count
  - Style with proper spacing

- [ ] **T027** 🟡 Test StatsPanel component
  - Render with mock stats data
  - Verify all metrics display correctly
  - Test with zero goals edge case
  - Verify responsive layout

---

### 4.2 MemberCard Component

- [ ] **T028** 🔴 Create `MemberCard.vue` component structure
  - Set up `<script setup lang="ts">`
  - Define props interface for `member`
  - Define emits interface (`toggle-goal`, `delete-goal`)
  - Create reactive `hoveredGoalId` ref

- [ ] **T029** 🔴 Implement card template
  - Use DaisyUI `card` component
  - Display member name as card title
  - Display mood emoji (handle null mood)
  - Display completion count (X/Y goals)
  - Create goals list section

- [ ] **T030** 🔴 Implement goals list
  - Loop through member goals
  - Display checkbox for each goal (DaisyUI `checkbox`)
  - Apply strikethrough to completed goals
  - Truncate long descriptions (>80 chars)
  - Add title attribute for full text tooltip

- [ ] **T031** 🔴 Implement hover interactions
  - Track hovered goal ID
  - Show delete icon (🗑️) on hover
  - Style delete button with DaisyUI classes
  - Emit `delete-goal` event on click

- [ ] **T032** 🟡 Implement empty states
  - Show "No goals for today" when goals array empty
  - Show "Set mood" with faded emoji when mood is null
  - Style empty states appropriately

- [ ] **T033** 🟡 Test MemberCard component
  - Test with member having goals
  - Test with member having no goals
  - Test with null mood
  - Test checkbox toggle
  - Test delete icon appears on hover
  - Test truncation for long goals

---

### 4.3 AddGoalForm Component

- [ ] **T034** 🔴 Create `AddGoalForm.vue` component structure
  - Set up `<script setup lang="ts">`
  - Define props interface (`members`, `open`)
  - Define emits interface (`close`, `submit`)
  - Create reactive form fields (memberId, description)
  - Create reactive errors object

- [ ] **T035** 🔴 Implement form template
  - Create DaisyUI modal wrapper
  - Add modal title "Add New Goal"
  - Create team member select dropdown
  - Create goal description input field
  - Add character counter (X/200)
  - Add Submit and Cancel buttons

- [ ] **T036** 🔴 Implement form validation
  - Validate member is selected
  - Validate description length (min 3, max 200)
  - Display inline error messages (red text)
  - Prevent submission with invalid data

- [ ] **T037** 🟡 Implement form behavior
  - Handle form submit event
  - Emit submit event with data
  - Handle cancel/close
  - Reset form on submit
  - Reset form on cancel

- [ ] **T038** 🟡 Test AddGoalForm component
  - Test modal opens/closes
  - Test form validation
  - Test character counter
  - Test submit emits correct data
  - Test form resets after submit

---

### 4.4 UpdateMoodForm Component

- [ ] **T039** 🔴 Create `UpdateMoodForm.vue` component structure
  - Set up `<script setup lang="ts">`
  - Define props interface (`members`, `open`)
  - Define emits interface (`close`, `submit`)
  - Create reactive form fields (memberId, mood)
  - Create reactive errors object

- [ ] **T040** 🔴 Implement form template
  - Create DaisyUI modal wrapper
  - Add modal title "Update Mood"
  - Create team member select dropdown
  - Create mood selector with emoji buttons (DaisyUI `btn-group`)
  - Display all 5 mood options with labels
  - Add Submit and Cancel buttons

- [ ] **T041** 🔴 Implement form validation
  - Validate member is selected
  - Validate mood is selected
  - Display inline error messages

- [ ] **T042** 🟡 Implement form behavior
  - Handle mood button clicks
  - Show active state for selected mood
  - Handle form submit
  - Emit submit event with data
  - Handle cancel/close
  - Reset form

- [ ] **T043** 🟡 Test UpdateMoodForm component
  - Test modal opens/closes
  - Test mood selection
  - Test form validation
  - Test submit emits correct data
  - Test form resets

---

## Phase 5: Dashboard Integration (Day 6)

### 5.1 Dashboard View

- [ ] **T044** 🔴 Create `Dashboard.vue` view
  - Set up `<script setup lang="ts">`
  - Import all composables (useMembers, useGoals, useStats)
  - Import all components (StatsPanel, MemberCard, forms)
  - Initialize composables
  - Create reactive modal state refs
  - Create reactive error message ref
  - Implement onMounted hook to fetch data
  - Implement onUnmounted hook to cleanup auto-refresh
  - Implement all event handlers:
    - `handleAddGoal()`
    - `handleUpdateMood()`
    - `handleToggleGoal()`
    - `handleDeleteGoal()`
  - Add error handling with try-catch
  - Refresh data after mutations

- [ ] **T045** 🔴 Implement Dashboard template
  - Create header with title and action buttons
  - Add error alert (DaisyUI `alert`)
  - Add loading spinner state
  - Render StatsPanel component
  - Create member cards grid (3-4 per row)
  - Render MemberCard components
  - Add empty state ("No team members yet")
  - Render AddGoalForm modal
  - Render UpdateMoodForm modal

- [ ] **T046** 🟡 Style Dashboard layout
  - Set container max-width and padding
  - Configure grid layout (responsive)
  - Set minimum width (1024px)
  - Add proper spacing between sections
  - Apply DaisyUI theme classes

---

## Phase 6: App Integration & Testing (Day 7)

### 6.1 App Integration

- [ ] **T047** 🔴 Update `App.vue`
  - Import Dashboard view
  - Render Dashboard component
  - Set data-theme="light"
  - Add global styles (min-height, background)
  - Verify no console errors

---

## Manual Testing Checklist

### Dashboard Load
- [ ] Dashboard loads without errors
- [ ] Stats panel displays at top with correct data
- [ ] Member cards display in grid layout
- [ ] Members sorted alphabetically
- [ ] Mock data loads correctly
- [ ] Loading spinner shows during initial load

### Add Goal Flow
- [ ] Click "Add Goal" button opens modal
- [ ] Modal backdrop closes modal when clicked
- [ ] Team member dropdown populated
- [ ] Can select team member
- [ ] Can type goal description
- [ ] Character counter updates (0/200)
- [ ] Empty member validation shows error
- [ ] Empty description validation shows error
- [ ] <3 chars validation shows error
- [ ] >200 chars validation shows error
- [ ] Submit button adds goal
- [ ] Goal appears on member card immediately
- [ ] Modal closes after submit
- [ ] Form resets after submit
- [ ] Stats panel updates with new goal
- [ ] Cancel button closes modal without saving

### Mark Goal Complete Flow
- [ ] Click checkbox marks goal as complete
- [ ] Goal shows strikethrough styling
- [ ] Checkbox shows checked state
- [ ] Completion count updates (e.g., 1/3 → 2/3)
- [ ] Stats panel percentage updates
- [ ] Change happens immediately (no delay)
- [ ] Can uncheck to mark incomplete
- [ ] Data persists in localStorage

### Delete Goal Flow
- [ ] Hover over goal shows trash icon
- [ ] Trash icon hidden when not hovering
- [ ] Click trash icon removes goal
- [ ] Goal removed immediately (no confirmation)
- [ ] Completion count updates
- [ ] Stats panel updates
- [ ] Data persists in localStorage

### Update Mood Flow
- [ ] Click "Update Mood" button opens modal
- [ ] Modal backdrop closes modal when clicked
- [ ] Team member dropdown populated
- [ ] Can select team member
- [ ] All 5 mood options display with emoji + label
- [ ] Can select a mood (button shows active state)
- [ ] Empty member validation shows error
- [ ] Empty mood validation shows error
- [ ] Submit button updates mood
- [ ] Mood emoji updates on member card
- [ ] Modal closes after submit
- [ ] Form resets after submit
- [ ] Stats panel mood breakdown updates
- [ ] Cancel button closes modal without saving

### Empty States
- [ ] Member with no goals shows "No goals for today"
- [ ] Member with null mood shows "Set mood" with faded emoji
- [ ] Zero total goals shows "No goals yet" in stats panel
- [ ] Empty dashboard shows "No team members yet" (if all deleted)

### Error Handling
- [ ] Form validation errors show inline in red
- [ ] API errors show alert at top of page
- [ ] Error alert can be dismissed
- [ ] Console shows error details for debugging
- [ ] App doesn't crash on errors

### Auto-Refresh
- [ ] Data refreshes every 30 seconds automatically
- [ ] No visual disruption during refresh
- [ ] Changes persist across refreshes
- [ ] Auto-refresh stops when component unmounts

### Data Persistence
- [ ] Add goal persists after page refresh
- [ ] Update mood persists after page refresh
- [ ] Delete goal persists after page refresh
- [ ] Mark complete persists after page refresh
- [ ] localStorage contains correct data structure
- [ ] Can clear localStorage and seed data reloads

### Responsive Grid
- [ ] Grid shows 4 cards on extra large screens (xl)
- [ ] Grid shows 3 cards on large screens (lg)
- [ ] Grid shows 2 cards on medium screens (md)
- [ ] Grid shows 1 card on small screens (sm)
- [ ] Minimum width 1024px enforced

### UI/UX Polish
- [ ] Hover effects work on interactive elements
- [ ] Buttons have proper cursor pointer
- [ ] Text is readable with good contrast
- [ ] Spacing is consistent throughout
- [ ] DaisyUI "light" theme applied correctly
- [ ] No layout shift during loading
- [ ] Smooth transitions on state changes

---

## Definition of Done

### Code Quality
- [ ] All TypeScript strict mode enabled with no errors
- [ ] No `any` types used
- [ ] All components under 200 lines
- [ ] All composables properly structured
- [ ] All functions have proper return types
- [ ] Code follows Vue 3 Composition API patterns
- [ ] No console warnings or errors
- [ ] Proper error handling throughout

### Functionality
- [ ] All 47 tasks completed
- [ ] All user flows work as specified
- [ ] All manual tests pass
- [ ] Data persists in localStorage
- [ ] Auto-refresh works correctly
- [ ] Empty states handled properly

### Constitution Compliance
- [ ] Vue 3 Composition API used exclusively
- [ ] TypeScript strict mode enabled
- [ ] DaisyUI components used for all UI
- [ ] No testing code included
- [ ] Mock data in API layer
- [ ] Composables for reusable logic
- [ ] Readable and maintainable code

### Documentation
- [ ] Code has JSDoc comments where needed
- [ ] Complex logic is commented
- [ ] README updated (if applicable)
- [ ] Known issues documented

---

## Task Priority Legend

- 🔴 **Critical**: Must complete before moving to next task
- 🟡 **High**: Should complete but can parallelize
- 🟢 **Medium**: Can defer slightly if needed
- ⚪ **Low**: Nice to have, can be last

---

## Progress Tracking

**Day 1**: Tasks T001-T011 (11 tasks)  
**Day 2**: Tasks T012-T019 (8 tasks)  
**Day 3**: Tasks T020-T025 (6 tasks)  
**Day 4**: Tasks T026-T033 (8 tasks)  
**Day 5**: Tasks T034-T043 (10 tasks)  
**Day 6**: Tasks T044-T046 (3 tasks)  
**Day 7**: Task T047 + Manual Testing (1 task + testing)

**Total**: 47 tasks + comprehensive manual testing

---

## Notes

- Tasks are designed to be completed sequentially within each phase
- Some tasks within a phase can be parallelized (e.g., multiple type files)
- Each task should take 15-60 minutes to complete
- Test after completing each major component
- Commit code after completing each phase
- Take breaks between phases to review and refactor

---

*This task list follows the VibeLoop Frontend Constitution v1.0.0 and V1 Implementation Plan*
