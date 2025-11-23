import type { Goal } from './goal';
import type { MoodType } from './mood';

/**
 * Represents a team member with mood and goals
 */
export interface TeamMember {
  id: string;
  name: string;
  mood: MoodType | null;
  moodUpdatedAt: string | null; // ISO 8601
  goals: Goal[];
}

/**
 * DTO for updating a team member's mood
 */
export interface UpdateMoodDto {
  mood: MoodType;
  timestamp: string; // ISO 8601
}
