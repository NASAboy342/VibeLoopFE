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
