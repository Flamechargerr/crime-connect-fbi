
import { Database } from '@/integrations/supabase/types';

// Convenient type aliases for Supabase tables
export type DbCase = Database['public']['Tables']['cases']['Row'];
export type DbCriminal = Database['public']['Tables']['criminals']['Row'];
export type DbEvidence = Database['public']['Tables']['evidence']['Row'];
export type DbWitness = Database['public']['Tables']['witnesses']['Row'];
export type DbPoliceStation = Database['public']['Tables']['police_stations']['Row'];
export type DbCaseCriminal = Database['public']['Tables']['case_criminals']['Row'];

// Type for inserting new cases
export type InsertCase = Database['public']['Tables']['cases']['Insert'];

// Type for inserting new criminals
export type InsertCriminal = Database['public']['Tables']['criminals']['Insert'];

// Type for inserting new evidence
export type InsertEvidence = Database['public']['Tables']['evidence']['Insert'];

// Type for inserting new witnesses
export type InsertWitness = Database['public']['Tables']['witnesses']['Insert'];

// Type for case with relationships
export interface CaseWithRelations extends DbCase {
  criminals?: DbCriminal[];
  evidence?: DbEvidence[];
  witnesses?: DbWitness[];
  police_station?: DbPoliceStation;
}
