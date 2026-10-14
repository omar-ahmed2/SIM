export type DashboardNavigationTab =
  | 'dashboard'
  | 'live-monitoring'
  | 'children'
  | 'alerts'
  | 'rooms-and-beds'
  | 'medications'
  | 'reports'
  | 'settings'

export type InfantStatus = 'normal' | 'warning' | 'critical'
export type AlertSeverity = 'critical' | 'warning' | 'advisory'
export type AlertCategory =
  | 'posture_risk'
  | 'apnea_respiratory'
  | 'limb_tremor'
  | 'incubator_canopy'
  | 'temperature'

export type AlertTriageStatus = 'unacknowledged' | 'in_progress' | 'false_alarm' | 'resolved'
export type PostureType = 'Supine (On Back)' | 'Prone (On Stomach)' | 'Left Lateral' | 'Right Lateral'
export type ActivityLevel = 'Calm' | 'Mild Movement' | 'Restless' | 'Crying'

export interface InfantClinicalNote {
  id: string
  author: string
  role?: string
  content: string
  timestamp: string
}

export interface InfantParentsInfo {
  fatherName?: string
  motherName?: string
  primaryPhone?: string
  secondaryPhone?: string
  emergencyContactRelation?: string
  address?: string
  notes?: string
}

export interface WardInfant {
  id: string
  name: string
  mrn: string
  incubatorNumber: string
  gestationalAge: string
  birthWeight: string
  heartRate: number
  spo2: number
  temperature: number
  status: InfantStatus
  admittedAt: string
  notes?: string
  clinicalNotes?: InfantClinicalNote[]
  parentsInfo?: InfantParentsInfo
}

export interface WardAlert {
  id: string
  infantId: string
  infantName: string
  incubatorNumber?: string
  mrn?: string
  title: string
  severity: AlertSeverity
  category: AlertCategory
  description: string
  aiExplanation: string // What the camera AI detected and why it's a concern
  aiConfidence: number // e.g. 96.4
  timestamp: string
  cameraName: string // e.g. "CAM-01 Overhead Thoracic (940nm IR)"
  boundingBoxLabel: string // e.g. "ROI: Thoracic Excursion [Flatline]"
  videoUrl?: string
  videoSnapshotUrl?: string
  isFalsePositive?: boolean
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
  triageStatus: AlertTriageStatus
  vitalsSnapshot?: {
    heartRate: number
    spo2: number
    temperature: number
    respiratoryRate?: number
  }
}

export interface AiVideoSession {
  id: string
  infantId?: string
  infantName: string
  videoName: string
  videoUrl?: string
  posture: PostureType
  activityLevel: ActivityLevel
  confidence: number
  chestMovement: 'Regular' | 'Shallow' | 'Elevated'
  timestamp: string
}

export interface WardActivityLog {
  id: string
  actor: string
  action: string
  targetPatient?: string
  timestamp: string
  type: 'admission' | 'alert_cleared' | 'video_analyzed' | 'vital_update' | 'system' | 'clinical_note' | 'parents_updated'
}

export interface WardDataState {
  infants: WardInfant[]
  alerts: WardAlert[]
  videoSessions: AiVideoSession[]
  activities: WardActivityLog[]
}

export interface ExecutiveStats {
  totalInfants: number
  activeIncubators: number
  activeAlerts: number
  analyzedVideoSessions: number
}
