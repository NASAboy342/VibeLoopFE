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
