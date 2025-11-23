import type { TeamMember } from './member';

/**
 * Structure for data stored in localStorage
 */
export interface LocalStorageData {
  members: TeamMember[];
  lastUpdated: string; // ISO 8601
}

/**
 * Key used for localStorage storage
 */
export const STORAGE_KEY = 'vibeloop_data';
