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
  function startAutoRefresh(): () => void {
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
