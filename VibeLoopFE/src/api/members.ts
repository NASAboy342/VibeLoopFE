import type { TeamMember } from '@/types/member';
import type { UpdateMoodDto } from '@/types/member';
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
