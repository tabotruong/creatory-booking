import { User, Booking, ChecklistItem, CameraSettings, MicSettings } from './types'

export const MC_LIST = ['Misthy', 'Nam Phương', 'Brand'] as const

export const CAMERAMEN_LIST = ['Đạt', 'Giang', 'Huy', 'Hiệu', 'Thức', 'Hùng', 'Tabo'] as const

export const PLATFORMS_LIST = ['Facebook', 'TikTok', 'YouTube', 'Shopee'] as const

export const CONTENT_TYPES = ['Daily content', 'SPS', 'Brand'] as const

export const SOW_TYPES = ['Photoshoot', 'Video', 'Livestream'] as const

export const DEMO_USERS: User[] = [
  { id: '1', email: 'manager@creatory.vn', name: 'Minh Quản Lý', role: 'manager', avatar: '👨‍💼' },
  { id: '2', email: 'dat@creatory.vn', name: 'Đạt', role: 'cameraman', avatar: '🎥' },
  { id: '3', email: 'giang@creatory.vn', name: 'Giang', role: 'cameraman', avatar: '🎥' },
  { id: '4', email: 'huy@creatory.vn', name: 'Huy', role: 'cameraman', avatar: '🎥' },
  { id: '5', email: 'hieu@creatory.vn', name: 'Hiệu', role: 'cameraman', avatar: '🎥' },
  { id: '6', email: 'thuc@creatory.vn', name: 'Thức', role: 'cameraman', avatar: '🎥' },
  { id: '7', email: 'hung@creatory.vn', name: 'Hùng', role: 'cameraman', avatar: '🎥' },
  { id: '8', email: 'tabo@creatory.vn', name: 'Tabo', role: 'cameraman', avatar: '🎥' },
  { id: '9', email: 'content1@creatory.vn', name: 'Trần Thị A', role: 'content_team', avatar: '👩‍💻' },
  { id: '10', email: 'content2@creatory.vn', name: 'Nguyễn Văn B', role: 'content_team', avatar: '👨‍💻' },
]

export const EQUIPMENT_LIST: string[] = [
  'Tripod Ulanzi (đèn cầm tay)',
  'Tripod DJI Pocket 3',
  'Pin FZ100',
  'Pin DJI Pocket 3',
  'Thẻ nhớ SD',
  'Thẻ nhớ MicroSD',
  'Đèn M40',
  'Đèn 200X',
  'Đèn 300C',
  'Softbox',
  'Chinaball',
  'Chân đèn',
  'Chân máy',
  'Smallrig',
  'Pin dự phòng',
]

export const DEFAULT_EQUIPMENT_CHECKLIST = (): ChecklistItem[] =>
  EQUIPMENT_LIST.map((name, index) => ({
    id: `equip-${index}`,
    name,
    checked: false,
  }))

export const DEFAULT_CAMERA_SETTINGS = (): CameraSettings => ({
  cardFormat: false,
  resolution: '4K',
  fps: 30,
  pp: false,
  recLevel: 50,
  shutterSpeed: '1/50',
  aputure: false,
  iso: 800,
  wb: '5600K',
})

export const DEFAULT_MIC_SETTINGS = (): MicSettings => ({
  stereoMode: false,
  gain: 50,
  recordStatus: false,
})

export const ROLE_LABELS: Record<User['role'], string> = {
  manager: 'Quản lý',
  cameraman: 'Cameraman',
  content_team: 'Content Team',
}

export const STATUS_LABELS: Record<Booking['status'], string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
}

export const PLATFORM_ICONS: Record<string, string> = {
  Facebook: '📘',
  TikTok: '🎵',
  YouTube: '📺',
  Shopee: '🛒',
}
