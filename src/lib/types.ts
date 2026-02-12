// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Journal Entry Types
export interface Entry {
  id: string;
  date: string; // ISO string
  title?: string;
  content: string;
  wordCount: number;
  quality: 'short' | 'medium' | 'long'; // Based on word count
  hasMedia?: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Garden/Plant Types
export interface GardenState {
  plantType: string;
  plantName: string;
  entriesCount: number;
  wateringDates: string[]; // ISO strings
  growthStage: number;
  createdAt: string; // ISO string
}

// App State
export interface AppState {
  user: User | null;
  entries: Entry[];
  garden: GardenState | null;
  isAuthenticated: boolean;
  lastSyncTime: string;
}

// Validation/Form Types
export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

export interface EntryFormData {
  title: string;
  content: string;
}
