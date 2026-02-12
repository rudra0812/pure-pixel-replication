import { User, Entry, GardenState, AppState } from './types';

const STORAGE_VERSION = '1.0';
const STORAGE_PREFIX = 'fine-flow:';

// Storage keys
const KEYS = {
  USER: `${STORAGE_PREFIX}user`,
  ENTRIES: `${STORAGE_PREFIX}entries`,
  GARDEN: `${STORAGE_PREFIX}garden`,
  VERSION: `${STORAGE_PREFIX}version`,
  LAST_SYNC: `${STORAGE_PREFIX}lastSync`,
};

/**
 * Storage service for managing app data with localStorage
 * Handles serialization, versioning, and error recovery
 */
class StorageService {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  private checkAvailability(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      console.warn('[Storage] localStorage not available, using in-memory fallback');
      return false;
    }
  }

  /**
   * Save user profile
   */
  saveUser(user: User): void {
    try {
      this.setItem(KEYS.USER, JSON.stringify(user));
      console.log('[Storage] User saved');
    } catch (error) {
      console.error('[Storage] Failed to save user:', error);
    }
  }

  /**
   * Get user profile
   */
  getUser(): User | null {
    try {
      const data = this.getItem(KEYS.USER);
      if (!data) return null;
      return JSON.parse(data) as User;
    } catch (error) {
      console.error('[Storage] Failed to get user:', error);
      return null;
    }
  }

  /**
   * Clear user profile
   */
  clearUser(): void {
    try {
      this.removeItem(KEYS.USER);
      console.log('[Storage] User cleared');
    } catch (error) {
      console.error('[Storage] Failed to clear user:', error);
    }
  }

  /**
   * Save all journal entries
   */
  saveEntries(entries: Entry[]): void {
    try {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const data = JSON.stringify(entries);
      
      if (data.length > maxSize) {
        console.warn('[Storage] Data exceeds 10MB limit, some entries may be lost');
      }
      
      this.setItem(KEYS.ENTRIES, data);
      console.log(`[Storage] ${entries.length} entries saved`);
    } catch (error) {
      console.error('[Storage] Failed to save entries:', error);
    }
  }

  /**
   * Get all journal entries
   */
  getEntries(): Entry[] {
    try {
      const data = this.getItem(KEYS.ENTRIES);
      if (!data) return [];
      
      const entries = JSON.parse(data) as Entry[];
      // Ensure entries are sorted by date (newest first)
      return entries.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('[Storage] Failed to get entries:', error);
      return [];
    }
  }

  /**
   * Add single entry
   */
  addEntry(entry: Entry): Entry {
    const entries = this.getEntries();
    entries.unshift(entry);
    this.saveEntries(entries);
    return entry;
  }

  /**
   * Update single entry
   */
  updateEntry(id: string, updates: Partial<Entry>): Entry | null {
    const entries = this.getEntries();
    const index = entries.findIndex(e => e.id === id);
    
    if (index === -1) return null;
    
    entries[index] = { ...entries[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveEntries(entries);
    return entries[index];
  }

  /**
   * Delete single entry
   */
  deleteEntry(id: string): boolean {
    const entries = this.getEntries();
    const filtered = entries.filter(e => e.id !== id);
    
    if (filtered.length === entries.length) return false;
    
    this.saveEntries(filtered);
    return true;
  }

  /**
   * Save garden state
   */
  saveGarden(garden: GardenState): void {
    try {
      this.setItem(KEYS.GARDEN, JSON.stringify(garden));
      console.log('[Storage] Garden state saved');
    } catch (error) {
      console.error('[Storage] Failed to save garden:', error);
    }
  }

  /**
   * Get garden state
   */
  getGarden(): GardenState | null {
    try {
      const data = this.getItem(KEYS.GARDEN);
      if (!data) return null;
      return JSON.parse(data) as GardenState;
    } catch (error) {
      console.error('[Storage] Failed to get garden:', error);
      return null;
    }
  }

  /**
   * Clear all data (logout)
   */
  clearAll(): void {
    try {
      this.removeItem(KEYS.USER);
      this.removeItem(KEYS.ENTRIES);
      this.removeItem(KEYS.GARDEN);
      this.removeItem(KEYS.LAST_SYNC);
      console.log('[Storage] All data cleared');
    } catch (error) {
      console.error('[Storage] Failed to clear all data:', error);
    }
  }

  /**
   * Get entire app state
   */
  getAppState(): Partial<AppState> {
    return {
      user: this.getUser(),
      entries: this.getEntries(),
      garden: this.getGarden(),
      isAuthenticated: this.getUser() !== null,
      lastSyncTime: this.getItem(KEYS.LAST_SYNC) || new Date().toISOString(),
    };
  }

  /**
   * Update last sync time
   */
  updateSyncTime(): void {
    try {
      this.setItem(KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('[Storage] Failed to update sync time:', error);
    }
  }

  /**
   * Check storage quota
   */
  checkQuota(): { used: number; percentage: number } {
    if (!this.isAvailable) return { used: 0, percentage: 0 };

    try {
      const data = JSON.stringify(this.getAppState());
      const used = new Blob([data]).size;
      const percentage = (used / (10 * 1024 * 1024)) * 100;
      
      console.log(`[Storage] Using ${(used / 1024).toFixed(2)}KB of 10MB (${percentage.toFixed(1)}%)`);
      
      return { used, percentage };
    } catch (error) {
      console.error('[Storage] Failed to check quota:', error);
      return { used: 0, percentage: 0 };
    }
  }

  // Private helpers
  private setItem(key: string, value: string): void {
    if (this.isAvailable) {
      localStorage.setItem(key, value);
    }
  }

  private getItem(key: string): string | null {
    if (this.isAvailable) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private removeItem(key: string): void {
    if (this.isAvailable) {
      localStorage.removeItem(key);
    }
  }
}

// Export singleton instance
export const storage = new StorageService();
