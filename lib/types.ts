export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'operator' | 'manager'
  avatar?: string
}

export interface Shipment {
  id: string
  origin: string
  destination: string
  status: 'in-transit' | 'delivered' | 'pending' | 'delayed'
  progress: number
  eta: string
  weight: string
  createdAt: string
  riskScore?: number
  lastUpdate?: string
  route: RoutePoint[]
}

export interface RoutePoint {
  city: string
  status: 'completed' | 'current' | 'upcoming'
  timestamp?: string
}

export interface Alert {
  id: string
  message: string
  type: 'warning' | 'error' | 'success'
  timestamp: string
  shipmentId?: string
  severity?: 'high' | 'medium' | 'low'
  alertType?: 'weather' | 'traffic' | 'optimization' | 'system'
  status?: 'active' | 'resolved'
}

export interface DashboardStats {
  totalShipments: number
  activeShipments: number
  deliveredToday: number
  systemHealth: number
  revenue?: number
  efficiency?: number
}

export interface AnalyticsData {
  date: string
  deliveries: number
  revenue: number
  efficiency: number
}

// Role-based access
export type DashboardRole = 'admin' | 'user'

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  revenueGrowth: number
  totalShipments: number
  shipmentsGrowth: number
  systemUptime: number
  pendingApprovals: number
  alertsToday: number
  resolvedToday: number
  avgDeliveryTime: number
  customerSatisfaction: number
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'admin' | 'operator' | 'manager'
  department: string
  joinedDate: string
  avatar?: string
  activeShipments: number
  totalShipmentsHandled: number
  performanceScore: number
  lastLogin: string
}

export interface UserDashboardStats {
  myActiveShipments: number
  myDeliveredThisMonth: number
  myPendingActions: number
  myAlerts: number
  onTimeDeliveryRate: number
  avgHandlingTime: number
}

export interface TrackingEvent {
  id: string
  shipmentId: string
  event: string
  location: string
  timestamp: string
  status: 'completed' | 'current' | 'upcoming'
  icon: 'truck' | 'warehouse' | 'plane' | 'ship' | 'check'
}

export interface FlipCardData {
  id: string
  frontTitle: string
  frontValue: string | number
  frontSubtitle?: string
  frontIcon?: string
  frontColor?: string
  backTitle: string
  backContent: string
  backStats?: { label: string; value: string }[]
  backAction?: { label: string; href: string }
}

