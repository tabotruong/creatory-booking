export type UserRole = 'manager' | 'cameraman' | 'content_team' | 'producer'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar: string
}

export type BookingStatus = 'pending' | 'approved' | 'rejected'

export type ContentType = 'Daily content' | 'SPS' | 'Brand'

export type SOWType = 'Photoshoot' | 'Video' | 'Livestream'

export type Platform = 'Facebook' | 'TikTok' | 'YouTube' | 'Shopee'

export interface Booking {
  id: string
  mcName: string
  brandName?: string
  contentName: string
  type: ContentType
  sow: SOWType
  platforms: Platform[]
  date: string // Format: yyyy-MM-dd
  startTime: string // Format: HH:mm
  endTime: string // Format: HH:mm
  cameraCount: number
  micCount: number
  hasTikTokCamera: boolean
  hasActionCam: boolean
  hasGimbal: boolean
  hasHandheldLight: boolean
  location: string
  notes?: string
  status: BookingStatus
  assignedCameramen: string[]
  createdBy: string
  createdByName: string
  isModified: boolean
  createdAt: string
  updatedAt: string
  changedFields?: string[] // Track which fields changed after edit
  checklistNotes?: { [cameramanName: string]: string } // Notes per cameraman
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  bookingId?: string // Link to related booking
}

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export interface ChecklistItem {
  id: string
  name: string
  checked: boolean
}

export interface CameraSettings {
  cardFormat: boolean
  resolution: 'FullHD' | '3K' | '4K'
  fps: 25 | 30 | 50 | 60
  pp: boolean
  recLevel: number
  shutterSpeed: string
  aputure: boolean
  iso: number
  wb: string
}

export interface MicSettings {
  stereoMode: boolean
  gain: number
  recordStatus: boolean
}

export interface EquipmentChecklist {
  items: ChecklistItem[]
  checkedInAt?: string
  checkedOutAt?: string
  notes?: string // Cameraman notes/issues during filming
}

export interface ChecklistSession {
  bookingId: string
  equipment: ChecklistItem[]
  camera: CameraSettings
  mic: MicSettings
  notes?: string
  createdAt: string
  updatedAt: string
}
