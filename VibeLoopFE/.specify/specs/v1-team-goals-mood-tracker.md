# Team Goals & Mood Tracker - v1 Specification

**Version**: 1.0.0  
**Created**: 2025-11-22  
**Status**: Draft

---

## 1. Problem Statement

Teams need a quick way to track daily goals and monitor team morale in one place. Currently, goals and mood are tracked separately or not at all, making it hard for managers to see who's struggling or needs support.

**Impact**: 
- Poor visibility into team progress and wellbeing
- Delayed support for struggling team members
- Scattered information across multiple tools or not tracked at all

---

## 2. Product Overview

A minimal web application where:

- Team members can see all team goals for the day
- Anyone can log/update their mood
- Goals can be marked complete
- Dashboard shows team completion % and overall mood

**User Personas**:
- Team Member: Views team goals, updates own mood, marks goals complete
- Team Lead/Manager: Monitors team progress and mood to identify support needs

---

## 3. Core Features (MVP Only)

### 3.1 Dashboard Page

**Purpose**: Central view for all team activity and status

**Components**:

1. **Team Member Cards**
   - Display all team members in a grid layout
   - Each card contains:
     - Member name (text, prominent)
     - Current mood emoji (😀 😊 😐 😞 😤)
     - List of today's goals
     - Goal completion count (e.g., "2/3 goals")
     - Checkbox for each goal to mark complete
   
2. **Card Interactions**:
   - Click checkbox → mark goal as complete (visual feedback)
   - Completed goals should have strikethrough styling
   - Mood emoji shows current status (last updated)

**Technical Requirements**:
- Use DaisyUI `card` component for member cards
- Use DaisyUI `checkbox` for goal completion
- Grid layout responsive to card count
- Real-time updates when data changes

---

### 3.2 Add Goal Form

**Purpose**: Add new goals for team members

**UI Elements**:
- Dropdown/select to choose team member (DaisyUI `select`)
- Text input for goal description (DaisyUI `input`)
- Submit button (DaisyUI `btn btn-primary`)
- Cancel button (DaisyUI `btn btn-ghost`)

**Behavior**:
- Form can be inline on dashboard or in a modal (DaisyUI `modal`)
- Goal is added to selected member's card immediately
- Form clears after successful submission
- Empty/invalid inputs show validation error

**Validation**:
- Team member must be selected
- Goal description required (min 3 characters)

**Technical Requirements**:
- Use Vue 3 Composition API with TypeScript
- Create composable `useGoals` for goal management logic
- API endpoint: `POST /api/goals`
- Request body: `{ memberId: string, description: string, date: string }`

---

### 3.3 Update Mood Form

**Purpose**: Allow anyone to update a team member's mood

**UI Elements**:
- Dropdown/select to choose team member (DaisyUI `select`)
- Mood emoji selector (5 options: 😀 😊 😐 😞 😤)
  - Can use DaisyUI `btn-group` with emoji buttons
  - Or custom radio group styled as emoji buttons
- Submit button (DaisyUI `btn btn-primary`)
- Cancel button (DaisyUI `btn btn-ghost`)

**Mood Options**:
- 😀 Great - Feeling excellent, highly productive
- 😊 Good - Positive mood, on track
- 😐 Neutral - Okay, neither good nor bad
- 😞 Low - Struggling, could use support
- 😤 Stressed - Overwhelmed, needs help

**Behavior**:
- Form can be inline on dashboard or in a modal
- Mood updates immediately on member card
- Previous mood is replaced (no history)
- Confirmation message on successful update

**Technical Requirements**:
- Create composable `useMood` for mood management logic
- API endpoint: `PUT /api/members/{memberId}/mood`
- Request body: `{ mood: string, timestamp: string }`

---

### 3.4 Stats Panel

**Purpose**: Provide quick overview of team status

**Metrics Displayed**:

1. **Team Goal Completion %**
   - Formula: (completed goals / total goals) × 100
   - Display: Large number with % sign
   - Example: "67%" in prominent text
   - Use DaisyUI `stat` component

2. **Team Mood Breakdown**
   - Count of each mood type
   - Display: Simple list with emoji + count
   - Example:
     - 😀 Great: 2
     - 😊 Good: 3
     - 😐 Neutral: 1
     - 😞 Low: 1
     - 😤 Stressed: 0

**Visual Design**:
- Stats panel at top or side of dashboard
- Use DaisyUI `stats` component for layout
- Clear visual separation from member cards
- Update in real-time as goals/moods change

**Technical Requirements**:
- Computed properties to calculate stats
- No API calls needed (derive from existing data)

---

## 4. Data Models

### 4.1 Team Member

```typescript
interface TeamMember {
  id: string;
  name: string;
  mood: MoodType | null;
  moodUpdatedAt: string | null;
  goals: Goal[];
}
```

### 4.2 Goal

```typescript
interface Goal {
  id: string;
  memberId: string;
  description: string;
  completed: boolean;
  createdAt: string;
  date: string; // YYYY-MM-DD format for the day
}
```

### 4.3 Mood Type

```typescript
type MoodType = 'great' | 'good' | 'neutral' | 'low' | 'stressed';

// Emoji mapping
const MOOD_EMOJI: Record<MoodType, string> = {
  great: '😀',
  good: '😊',
  neutral: '😐',
  low: '😞',
  stressed: '😤'
};
```

---

## 5. API Endpoints

### 5.1 Get Team Members

```
GET /api/members
```

**Response**:
```typescript
{
  members: TeamMember[]
}
```

**Mock Data Allowed**: Yes, return hardcoded list of 5-7 team members

---

### 5.2 Add Goal

```
POST /api/goals
```

**Request**:
```typescript
{
  memberId: string;
  description: string;
  date: string; // YYYY-MM-DD
}
```

**Response**:
```typescript
{
  goal: Goal
}
```

**Mock Data Allowed**: Yes, return goal with generated ID

---

### 5.3 Update Goal Status

```
PATCH /api/goals/{goalId}
```

**Request**:
```typescript
{
  completed: boolean;
}
```

**Response**:
```typescript
{
  goal: Goal
}
```

**Mock Data Allowed**: Yes, return updated goal

---

### 5.4 Delete Goal

```
DELETE /api/goals/{goalId}
```

**Response**:
```typescript
{
  success: boolean;
}
```

**Mock Data Allowed**: Yes, return success

---

### 5.5 Update Member Mood

```
PUT /api/members/{memberId}/mood
```

**Request**:
```typescript
{
  mood: MoodType;
  timestamp: string; // ISO 8601 format
}
```

**Response**:
```typescript
{
  member: TeamMember
}
```

**Mock Data Allowed**: Yes, return updated member

---

## 6. User Flows

### 6.1 View Team Status (Primary Flow)

1. User opens application
2. Dashboard loads and displays all team member cards
3. User sees at a glance:
   - Each member's current mood
   - Their goals for the day
   - Completion status
4. Stats panel shows overall team metrics

**Success Criteria**: All data visible within 2 seconds

---

### 6.2 Add a Goal

1. User clicks "Add Goal" button
2. Modal/form appears
3. User selects team member from dropdown
4. User types goal description
5. User clicks "Submit"
6. Goal appears immediately on selected member's card
7. Form closes/clears

**Success Criteria**: Goal visible on card immediately after submission

---

### 6.3 Mark Goal Complete

1. User finds goal on member card
2. User clicks checkbox next to goal
3. Goal shows strikethrough styling
4. Completion count updates (e.g., 2/3 → 3/3)
5. Team completion % updates in stats panel

**Success Criteria**: Visual feedback is immediate, stats update automatically

---

### 6.4 Update Mood

1. User clicks "Update Mood" button
2. Modal/form appears
3. User selects team member from dropdown
4. User clicks mood emoji button
5. User clicks "Submit"
6. Mood emoji updates on member's card
7. Team mood breakdown updates in stats panel

**Success Criteria**: Mood change visible immediately on dashboard

---

## 7. UI/UX Requirements

### 7.1 Layout

- **Desktop only**: Minimum width 1024px
- **Grid layout**: 3-4 member cards per row
- **Stats panel**: Fixed at top or side
- **Forms**: Modal overlays (DaisyUI modal) or inline expansion

### 7.2 Visual Design

- Use DaisyUI default theme (or choose one theme)
- Consistent spacing using Tailwind utilities
- Card-based design for member information
- Large, readable text for names and stats
- Clear visual hierarchy

### 7.3 Interaction Patterns

- Hover effects on interactive elements (DaisyUI provides this)
- Loading states for async operations
- Success/error feedback with DaisyUI `alert` component
- Smooth transitions for state changes

### 7.4 Accessibility

- Semantic HTML elements
- Proper heading hierarchy
- Keyboard navigation support (DaisyUI handles most of this)
- Sufficient color contrast

---

## 8. Technical Architecture

### 8.1 Frontend Structure

```
src/
  api/
    members.ts        # Member-related API calls
    goals.ts          # Goal-related API calls
  components/
    MemberCard.vue    # Individual member display
    AddGoalForm.vue   # Goal creation form
    UpdateMoodForm.vue # Mood update form
    StatsPanel.vue    # Team statistics display
  composables/
    useMembers.ts     # Member state and operations
    useGoals.ts       # Goal state and operations
    useMood.ts        # Mood state and operations
    useStats.ts       # Stats calculation logic
  types/
    member.ts         # TypeScript interfaces
    goal.ts
    mood.ts
  views/
    Dashboard.vue     # Main dashboard page
  App.vue
  main.ts
```

### 8.2 State Management

- Use Vue 3 reactivity with composables
- No Pinia needed for v1 (simple enough with composables)
- Composables handle:
  - Data fetching
  - Local state
  - Mutations
  - Computed values

### 8.3 API Integration

- Create API service functions in `src/api/`
- Use `fetch` or `axios` for HTTP requests
- Mock data allowed in API functions for development
- Example mock structure:

```typescript
// src/api/members.ts
export async function getMembers(): Promise<TeamMember[]> {
  // Mock data for development
  return [
    {
      id: '1',
      name: 'Alice Johnson',
      mood: 'great',
      moodUpdatedAt: new Date().toISOString(),
      goals: [
        { id: 'g1', memberId: '1', description: 'Complete API design', completed: false, createdAt: '2025-11-22T09:00:00Z', date: '2025-11-22' }
      ]
    },
    // ... more mock members
  ];
  
  // Real API call (commented out for now)
  // const response = await fetch('/api/members');
  // return response.json();
}
```

---

## 9. OUT of Scope (Do NOT Build)

The following features are explicitly excluded from v1:

### Authentication & Users
- ❌ User authentication/login
- ❌ User registration
- ❌ Session management
- ❌ Password reset
- ❌ User roles/permissions

### Historical Data
- ❌ Multi-day goal history
- ❌ Mood history or trends
- ❌ Goal completion analytics over time
- ❌ Historical comparison views

### Advanced Features
- ❌ Detailed mood analytics or charts
- ❌ Email notifications
- ❌ Push notifications
- ❌ Admin controls for team management
- ❌ Goal editing (only add/complete/delete)
- ❌ Recurring goals
- ❌ Goal categories or tags
- ❌ Goal priorities
- ❌ Goal assignments
- ❌ Comments on goals
- ❌ File attachments

### UI/UX Enhancements
- ❌ Responsive mobile design (desktop only)
- ❌ Dark mode
- ❌ Theme customization
- ❌ Profile pages
- ❌ Customizable dashboard layouts
- ❌ Drag and drop functionality

### Integrations
- ❌ Calendar integration
- ❌ Slack/Teams integration
- ❌ Export to CSV/PDF
- ❌ Third-party APIs

---

## 10. Success Metrics

**Completion Criteria for v1**:

1. ✅ Dashboard displays all team members with cards
2. ✅ Each card shows name, mood, goals, and completion count
3. ✅ Users can add new goals for any team member
4. ✅ Users can mark goals as complete via checkbox
5. ✅ Users can update mood for any team member
6. ✅ Stats panel shows team completion % and mood breakdown
7. ✅ All interactions provide immediate visual feedback
8. ✅ Code follows constitution principles (Vue 3 Composition API, TypeScript strict, DaisyUI)
9. ✅ No testing code (as per constitution)
10. ✅ Mock data works in API layer

**Performance Targets**:
- Initial page load: < 2 seconds
- Action feedback: < 200ms
- Data refresh: < 1 second

---

## 11. Implementation Notes

### Phase 1: Setup & Structure
1. Set up TypeScript interfaces in `src/types/`
2. Create API functions with mock data
3. Build composables for state management

### Phase 2: Core Components
1. Build `MemberCard` component
2. Build `StatsPanel` component
3. Build `AddGoalForm` component
4. Build `UpdateMoodForm` component

### Phase 3: Integration
1. Build `Dashboard` view
2. Wire up all components
3. Test all user flows
4. Polish UI/UX

### Development Guidelines
- Follow constitution: Vue 3 Composition API, TypeScript strict mode
- Use DaisyUI components exclusively for UI
- Keep components under 200 lines
- Extract logic to composables
- No testing code required
- Mock data is acceptable in API layer

---

## 12. Future Considerations (Post-v1)

*Not to be implemented now, but documented for future reference:*

- Multi-day goal tracking and history
- Mood trends and analytics
- User authentication
- Mobile responsive design
- Goal categories and filtering
- Team management features
- Notification system
- Data export capabilities

---

**Next Steps**: 
1. Review and approve this specification
2. Set up project structure according to constitution
3. Begin Phase 1 implementation
4. Iterate on feedback

---

*This specification adheres to the VibeLoop Frontend Constitution v1.0.0*
