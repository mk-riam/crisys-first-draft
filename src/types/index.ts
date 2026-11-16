export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  address?: string;
  landmark?: string;
  district?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  notifyOnSOS: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  cnicNumber: string;
  gender: 'female' | 'other';
  isVerified: boolean;
  verificationDate?: string;
  cnicFrontImage?: string;
  cnicBackImage?: string;
  emergencyPin: string; // PIN to stop audio recording & cancel SOS
  emergencyContacts: EmergencyContact[];
  bloodGroup?: string;
  medicalNotes?: string;
}

export interface SOSAlert {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userCnic: string;
  timestamp: number;
  location: Coordinates;
  status: 'active' | 'resolved' | 'dispatched';
  audioRecordingUrl?: string;
  audioDurationSeconds: number;
  dispatchedAuthorities: string[]; // e.g. ['Madadgar 15', 'Sindh Women Protection Cell', 'CPLC']
  responderCount: number;
  notes?: string;
  isCovert: boolean;
}

export interface SecurityAuthority {
  id: string;
  name: string;
  shortName: string;
  category: 'Police' | 'Specialized Desk' | 'Liaison Committee' | 'Surveillance' | 'Paramedic & Rescue';
  emergencyNumber: string;
  landline: string;
  headquarters: string;
  coverage: string;
  integrationStatus: 'Active Bridge' | 'Direct Hotwire' | 'Automated Dispatch' | 'Collaborative API';
  description: string;
  features: string[];
  recommendedFor: string;
  iconName: string;
}

export interface GuardProfile {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  photo: string;
  age: number;
  rating: number;
  reviewCount: number;
  completedMissions: number;
  badgeType: 'Female Tactical Specialist' | 'Ex-SSG Elite' | 'Police Veteran' | 'Executive Close Protection' | 'Armed Escort';
  sindhSecurityLicense: string;
  weaponLicensed: boolean;
  weaponType?: string;
  hourlyRatePKR: number;
  languages: string[];
  skills: string[];
  vehicleAvailable: boolean;
  vehicleDetails?: string;
  currentLocation: Coordinates;
  availability: 'Available Now' | 'On Assignment' | 'Offline';
  bio: string;
}

export interface GuardBooking {
  id: string;
  guardId: string;
  guardName: string;
  guardPhoto: string;
  guardBadge: string;
  userId: string;
  pickupLocation: string;
  pickupCoords: Coordinates;
  destinationLocation?: string;
  durationHours: number;
  startDate: string;
  startTime: string;
  totalPricePKR: number;
  status: 'pending' | 'accepted' | 'en_route' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  panicTriggered?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'Sprays' | 'Alarms & Sirens' | 'Stun & Impact' | 'Covert & Wearables' | 'Home & Vehicle Safety';
  pricePKR: number;
  originalPricePKR?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  features: string[];
  inStock: boolean;
  stockCount: number;
  isLegalInPakistan: boolean;
  legalNotice: string;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotalPKR: number;
  shippingFeePKR: number;
  totalPKR: number;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  district: string;
  courier: 'TCS Express' | 'Leopards Courier' | 'Call Courier Karachi';
  paymentMethod: 'visa' | 'mastercard' | 'cod' | 'jazzcash' | 'easypaisa';
  status: 'processing' | 'dispatched' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  trackingNumber: string;
}

export interface NearbyDistressSignal {
  id: string;
  victimName: string;
  distanceMeters: number;
  direction: string; // e.g. 'North-West (72m away)'
  location: Coordinates;
  timestamp: number;
  urgencyLevel: 'CRITICAL' | 'HIGH';
  status: 'ACTIVE_DISTRESS' | 'RESPONDERS_EN_ROUTE' | 'RESOLVED';
  respondersOnWay: number;
  audioBroadcastActive: boolean;
}
