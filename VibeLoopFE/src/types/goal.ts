/**
 * Represents a goal with description, completion status, and metadata
 */
export interface Goal {
  id: string;
  memberId: string;
  description: string; // min 3 chars, max 200 chars
  completed: boolean;
  createdAt: string; // ISO 8601
  date: string; // YYYY-MM-DD format (browser local date), only today's goals shown
}

/**
 * DTO for creating a new goal
 */
export interface CreateGoalDto {
  memberId: string;
  description: string;
  date: string; // YYYY-MM-DD
}

/**
 * DTO for updating goal completion status
 */
export interface UpdateGoalDto {
  completed: boolean;
}
