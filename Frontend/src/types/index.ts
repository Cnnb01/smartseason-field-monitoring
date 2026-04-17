export type Role = 'ADMIN' | 'AGENT'
export type FieldStage = 'PLANTED' | 'GROWING' | 'REEADY' |'HARVESTED'
export type FieldStatus = 'ACTIVE' | 'AT RISK' | 'COMPLETED'

export interface User {
  id: string,
  usename: string,
  role: Role
}

export interface FieldUpdate {
  id: number;
  agent_name: string;
  stage_at_update: FieldStage;
  notes: string;
  timestamp: string;
}

export interface Field {
  id: string,
  name: string,
  crop_type: string,
  current_stage: FieldStage,
  status: FieldStatus,
  planting_date: Date,
  assigned_agent: number | null;
  assigned_agent_name: string;
  updates: FieldUpdate[];
}
