// FBI CrimeConnect Types
export type CorkboardItemType = 'photo' | 'note' | 'document' | 'wanted' | 'evidence' | 'location' | 'clue' | 'question';

export interface CorkboardItemData {
  id: string;
  type: CorkboardItemType;
  content: string;
  image?: string;
  position: { x: number; y: number };
  size?: { w: number; h: number };
  metadata?: Record<string, any> & {
    location?: string;
    date?: string;
    importance?: 'high' | 'medium' | 'low';
    status?: string;
    coords?: { lat: number; lon: number };
  };
}

export interface ConnectionData {
  start: string;
  end: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted' | 'zigzag';
  color?: string;
}

export interface Case {
  id: number;
  title: string;
  status: 'open' | 'closed' | 'pending' | 'archived';
  description: string;
  policeStationId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalCases: number;
  openCases: number;
  closedCases: number;
  totalCriminals: number;
  totalEvidence: number;
  totalWitnesses: number;
  recentCases: Case[];
}

export interface CorkboardState {
  id: string;
  name: string;
  items: CorkboardItemData[];
  connections: ConnectionData[];
  background: string;
  updated_at?: string;
}
