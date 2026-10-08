// Role Enums
export type Role = "ADMIN" | "DRIVER" | "PATIENT";

export type DriverStatus = "AVAILABLE" | "BUSY" | "OFFLINE";

export type AmbulanceType =
  | "BASIC_LIFE_SUPPORT"
  | "ADVANCED_LIFE_SUPPORT"
  | "PATIENT_TRANSPORT"
  | "NEONATAL"
  | "NEONATAL_ICU"
  | "ALS"
  | "BLS";

export type AmbulanceStatus =
  | "AVAILABLE"
  | "DISPATCHED"
  | "ON_TRIP"
  | "BUSY"
  | "MAINTENANCE"
  | "OUT_OF_SERVICE"
  | "OFFLINE";

export type EmergencyPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type EmergencyStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DISPATCHED"
  | "EN_ROUTE"
  | "PATIENT_PICKED_UP"
  | "HOSPITAL_ARRIVAL"
  | "COMPLETED"
  | "CANCELLED";

export type TripStatus =
  | "ASSIGNED"
  | "ACCEPTED"
  | "EN_ROUTE"
  | "EN_ROUTE_PICKUP"
  | "PATIENT_PICKED_UP"
  | "EN_ROUTE_HOSPITAL"
  | "ARRIVED_HOSPITAL"
  | "HOSPITAL_ARRIVAL"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCEEDED"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

// User & Auth
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  avatarUrl?: string | null;
  emergencyContact?: string | null;
  bloodGroup?: string | null;
  medicalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  driver?: DriverProfile | null;
}

export interface DriverProfile {
  id: string;
  userId: string;
  name?: string;
  phone?: string;
  licenseNumber: string;
  status: DriverStatus;
  currentLatitude?: number | null;
  currentLongitude?: number | null;
  ambulanceId?: string | null;
  ambulance?: Ambulance | null;
  totalTrips?: number;
  rating?: number;
}

// Ambulance
export interface Ambulance {
  id: string;
  plateNumber?: string;
  vehicleNumber?: string;
  model?: string;
  type: AmbulanceType | string;
  status: AmbulanceStatus | string;
  baseLatitude?: number;
  baseLongitude?: number;
  latitude?: number;
  longitude?: number;
  equipmentList?: string[];
  driver?: DriverProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

// Hospital
export interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  contactNumber?: string;
  contactPhone?: string;
  phone?: string;
  emergencyAvailable?: boolean;
  emergencyBedsAvailable?: number;
  emergencyBedsTotal?: number;
  hasIcu?: boolean;
  icuBedsAvailable?: number;
  availableIcuBeds?: number;
  totalIcuBeds?: number;
  icuTotal?: number;
  erBedsAvailable?: number;
  availableGeneralBeds?: number;
  totalErBeds?: number;
  totalGeneralBeds?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Emergency Request
export interface Emergency {
  id: string;
  patientId?: string;
  patient?: User;
  patientName?: string;
  patientPhone?: string;
  callerPhone?: string;
  emergencyType?: string;
  priority?: EmergencyPriority | string;
  severityLevel?: EmergencyPriority | string;
  status: EmergencyStatus | string;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  description?: string | null;
  notes?: string | null;
  patientCondition?: string | null;
  destinationHospitalId?: string | null;
  destinationHospital?: Hospital | null;
  trips?: Trip[];
  createdAt: string;
  updatedAt?: string;
}

export type EmergencyRequest = Emergency;

// Trip
export interface Trip {
  id: string;
  emergencyId?: string;
  emergency?: Emergency;
  emergencyRequest?: Emergency;
  ambulanceId: string;
  ambulance?: Ambulance;
  driverId?: string;
  driver?: DriverProfile;
  hospitalId?: string | null;
  hospital?: Hospital | null;
  status: TripStatus | string;
  distanceKm?: number | null;
  baseFare?: number | null;
  distanceFare?: number | null;
  totalFare?: number | null;
  startedAt?: string | null;
  completedAt?: string | null;
  payment?: Payment | null;
  createdAt: string;
  updatedAt?: string;
}

// Payment
export interface Payment {
  id: string;
  tripId: string;
  trip?: Trip;
  userId: string;
  user?: User;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  stripeSessionId?: string | null;
  transactionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  action: string;
  entity?: string;
  entityId?: string | null;
  userId?: string | null;
  user?: User | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt: string;
  actorId?: string | null;
  actorRole?: string;
  actor?: { id: string; name: string; email: string; role: Role } | null;
  resourceType?: string;
  resourceId?: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
}

// Standard API Response envelope
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }> | string[];
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginatedMeta;
}

export interface PaginatedResponse<T> {
  success?: boolean;
  message?: string;
  data: T[];
  meta?: PaginatedMeta;
}

// Nearby Ambulance Query result with ETA
export interface NearbyAmbulance extends Ambulance {
  distanceKm: number;
  estimatedArrivalMinutes: number;
}
