// Types for the FBI CrimeConnect system

export const CaseStatus = {
  OPEN: 'open',
  CLOSED: 'closed',
  PENDING: 'pending',
  ARCHIVED: 'archived'
};

export const CriminalStatus = {
  ACTIVE: 'active',
  ARRESTED: 'arrested',
  DECEASED: 'deceased',
  UNKNOWN: 'unknown'
};

export const EvidenceType = {
  PHYSICAL: 'physical',
  DIGITAL: 'digital',
  TESTIMONY: 'testimony',
  DOCUMENT: 'document',
  PHOTO: 'photo',
  VIDEO: 'video'
};

export const PriorityLevel = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Mock data structures
export const mockDashboardData = {
  totalCases: 256,
  openCases: 87,
  closedCases: 169,
  totalCriminals: 324,
  totalEvidence: 512,
  totalWitnesses: 189,
  recentCases: [
    {
      id: 1,
      title: 'Armed Robbery - Downtown Bank',
      status: 'open',
      description: 'Armed robbery at First National Bank on Main Street',
      policeStationId: 1,
      createdAt: new Date('2023-05-15'),
      updatedAt: new Date('2023-05-18')
    },
    {
      id: 2,
      title: 'Vehicle Theft - Highland Park',
      status: 'pending',
      description: 'Luxury vehicle stolen from Highland Park residential area',
      policeStationId: 2,
      createdAt: new Date('2023-06-02'),
      updatedAt: new Date('2023-06-05')
    },
    {
      id: 3,
      title: 'Residential Burglary - Westside',
      status: 'closed',
      description: 'Break-in and theft at residential property in Westside neighborhood',
      policeStationId: 1,
      createdAt: new Date('2023-04-10'),
      updatedAt: new Date('2023-04-29')
    },
    {
      id: 4,
      title: 'Assault - Downtown Bar',
      status: 'open',
      description: 'Physical assault reported outside The Blue Note Bar',
      policeStationId: 3,
      createdAt: new Date('2023-06-10'),
      updatedAt: new Date('2023-06-10')
    }
  ]
};

export const mockCriminals = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    alias: 'The Ghost',
    dateOfBirth: '1985-03-15',
    status: 'active',
    priority: 'high',
    description: 'Suspected of multiple armed robberies across the city',
    lastKnownLocation: 'Downtown District',
    charges: ['Armed Robbery', 'Assault', 'Weapons Violation']
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    alias: 'Red Queen',
    dateOfBirth: '1990-07-22',
    status: 'arrested',
    priority: 'medium',
    description: 'Cybercrime specialist, involved in identity theft ring',
    lastKnownLocation: 'Federal Detention Center',
    charges: ['Identity Theft', 'Computer Fraud', 'Money Laundering']
  }
];

export const mockEvidence = [
  {
    id: 1,
    caseId: 1,
    type: 'physical',
    description: 'Security camera footage from bank lobby',
    collectedBy: 'Agent Johnson',
    collectedDate: '2023-05-15',
    status: 'analyzed',
    location: 'Evidence Locker B-47'
  },
  {
    id: 2,
    caseId: 1,
    type: 'physical',
    description: 'Fingerprints from getaway vehicle',
    collectedBy: 'Forensics Team Alpha',
    collectedDate: '2023-05-16',
    status: 'pending',
    location: 'Forensics Lab'
  }
];

export const mockOfficers = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Johnson',
    badge: 'FBI-7734',
    rank: 'Special Agent',
    department: 'Criminal Investigation',
    clearanceLevel: 'SECRET',
    activeCases: 12,
    email: 'sarah.johnson@fbi.gov',
    phone: '(555) 123-4567'
  },
  {
    id: 2,
    firstName: 'Michael',
    lastName: 'Chen',
    badge: 'FBI-8845',
    rank: 'Senior Agent',
    department: 'Cybercrime',
    clearanceLevel: 'TOP SECRET',
    activeCases: 8,
    email: 'michael.chen@fbi.gov',
    phone: '(555) 234-5678'
  }
];