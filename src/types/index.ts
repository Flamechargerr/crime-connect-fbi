
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'officer' | 'prosecutor' | 'judge';
  createdAt: Date;
  updatedAt: Date;
}

export interface PoliceOfficer {
  id: number;
  name: string;
  rank: string;
  policeStationId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Criminal {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  biometricData?: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PoliceStation {
  id: number;
  name: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Case {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'closed' | 'pending' | 'archived';
  policeStationId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Evidence {
  id: number;
  description: string;
  storageLocation: string;
  caseId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Witness {
  id: number;
  name: string;
  statement: string;
  description?: string;
  caseId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Court {
  id: number;
  name: string;
  judgeId: number;
  judgeName: string;
  street: string;
  city: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: number;
  reportDetails: string;
  courtId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseCriminalRelation {
  caseId: number;
  criminalId: number;
}

export interface CaseOfficerRelation {
  caseId: number;
  officerId: number;
}

export interface CaseCourtRelation {
  caseId: number;
  courtId: number;
  hearingDate: Date;
}

export interface EvidenceWitnessRelation {
  evidenceId: number;
  witnessId: number;
}

export type CaseWithRelations = Case & {
  criminals?: Criminal[];
  officers?: PoliceOfficer[];
  witnesses?: Witness[];
  evidence?: Evidence[];
  court?: Court;
};

export type DashboardStats = {
  totalCases: number;
  openCases: number;
  closedCases: number;
  totalCriminals: number;
  totalEvidence: number;
  totalWitnesses: number;
  recentCases: Case[];
};
