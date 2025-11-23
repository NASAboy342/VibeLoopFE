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
