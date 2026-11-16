import { SecurityAuthority, GuardProfile, Product, Coordinates, NearbyDistressSignal } from '../types';

export const KARACHI_CENTER: Coordinates = {
  lat: 24.8607,
  lng: 67.0011,
  address: 'Karachi, Sindh, Pakistan',
  district: 'Karachi Central',
  landmark: 'Mazar-e-Quaid / Saddar'
};

export const KARACHI_DISTRICTS = [
  'Karachi South (Clifton, DHA, Saddar, Boat Basin)',
  'Karachi East (Gulshan-e-Iqbal, PECHS, Bahadurabad, KDA)',
  'Karachi Central (North Nazimabad, Federal B Area, Nazimabad)',
  'Karachi West (Site, Orangi, Surjani)',
  'Korangi (Korangi Industrial, Landhi, Shah Faisal)',
  'Malir (Model Colony, Malir Cantt, Airport)',
  'Keamari (Harbour, Hawkesbay, Mauripur)'
];

export const SECURITY_AUTHORITIES: SecurityAuthority[] = [
  {
    id: 'sindh-police-madadgar-15',
    name: 'Sindh Police Madadgar 15 Emergency Helpline',
    shortName: 'Madadgar 15',
    category: 'Police',
    emergencyNumber: '15',
    landline: '021-99216141',
    headquarters: 'Central Police Office (CPO), I.I. Chundrigar Road, Karachi',
    coverage: 'All 7 Districts of Karachi (24/7 Rapid Mobile Response Patrols)',
    integrationStatus: 'Active Bridge',
    description: 'The primary government emergency response system in Karachi. Operates high-visibility Eagle Squad motorcycles and Muhafiz mobile vans deployed across every police station jurisdiction.',
    features: [
      'Automated GPS distress telemetry dispatch',
      'Average response ETA 6-12 minutes in urban Karachi',
      'Direct link to local Station House Officer (SHO)',
      'Eagle Squad motorbike rapid interdiction'
    ],
    recommendedFor: 'Immediate physical threat, street harassment, stalker intervention, robbery',
    iconName: 'ShieldAlert'
  },
  {
    id: 'sindh-women-protection-cell',
    name: 'Sindh Police Women & Children Protection Cell (Specialized Desk)',
    shortName: 'Women Protection Cell 1094',
    category: 'Specialized Desk',
    emergencyNumber: '1094',
    landline: '021-99207091',
    headquarters: 'Specialized Women Police Station, South Zone, Clifton / Saddar, Karachi',
    coverage: 'Karachi-wide with female investigating officers and dedicated support units',
    integrationStatus: 'Direct Hotwire',
    description: 'Dedicated law enforcement division staffed entirely by trained female police officers, legal advisors, and crisis counselors. Specialized in violence against women, domestic crises, and public harassment.',
    features: [
      'Staffed 24/7 by female police officers and sub-inspectors',
      'Complete confidentiality and trauma-informed crisis intake',
      'Immediate safe-shelter coordination and legal aid',
      'Direct coordination with DIG South/East/Central Women Desks'
    ],
    recommendedFor: 'Targeted gender harassment, domestic crisis, stalking, workplace intimidation',
    iconName: 'HeartHandshake'
  },
  {
    id: 'cplc-karachi',
    name: 'Citizen-Police Liaison Committee (CPLC) Central Reporting Cell',
    shortName: 'CPLC 1102',
    category: 'Liaison Committee',
    emergencyNumber: '1102',
    landline: '021-35682222',
    headquarters: 'Governor House Complex, Karachi',
    coverage: 'Karachi Division with advanced geospatial crime mapping & neighborhood networks',
    integrationStatus: 'Automated Dispatch',
    description: 'Statutory non-political citizen organization working closely with law enforcement. Maintains Karachi’s most detailed neighborhood surveillance telemetry, telephone tracking, and immediate rescue coordination.',
    features: [
      'Geospatial crime mapping and neighborhood watch network',
      'Immediate coordination with Rangers and Senior Police Leadership',
      '24/7 Emergency operations room at Sindh Governor House',
      'Rapid victim tracing and extortion/harassment tracking'
    ],
    recommendedFor: 'Extortion, suspicious pursuit, high-risk neighborhood security escalation',
    iconName: 'Radio'
  },
  {
    id: 'sindh-safe-cities-authority',
    name: 'Sindh Safe Cities Authority (SSCA) Command & Control',
    shortName: 'Sindh Safe City (SSCA)',
    category: 'Surveillance',
    emergencyNumber: '15 (Ext. SafeCity)',
    landline: '021-99225501',
    headquarters: 'SSCA HQ, Karachi',
    coverage: 'Karachi arterial roads, major intersections, DHA, Clifton, Sharea Faisal',
    integrationStatus: 'Collaborative API',
    description: 'Next-generation smart city video surveillance network integrating thousands of AI-enabled PTZ cameras, facial recognition, and automated number-plate recognition (ANPR) across Karachi.',
    features: [
      'Live automated CCTV camera tracking of distress coordinates',
      'ANPR tracking of fleeing suspect vehicles/motorbikes',
      'Video evidence archiving for prosecution in court',
      'Real-time traffic choke point monitoring'
    ],
    recommendedFor: 'Car-following incidents, hit-and-run, transit corridor safety',
    iconName: 'Eye'
  },
  {
    id: 'rescue-1122-sindh',
    name: 'Emergency Rescue 1122 Sindh Ambulance & Trauma Service',
    shortName: 'Rescue 1122',
    category: 'Paramedic & Rescue',
    emergencyNumber: '1122',
    landline: '021-111111122',
    headquarters: 'Provincial Disaster Management Authority (PDMA), Karachi',
    coverage: 'All Karachi Districts with modern ACLS trauma ambulances',
    integrationStatus: 'Active Bridge',
    description: 'Government free emergency medical and rescue service equipped with state-of-the-art life support ambulances, trained paramedics, and emergency extrication gear.',
    features: [
      'Advanced Cardiac Life Support (ACLS) ambulances',
      'Certified emergency medical technicians and female paramedics',
      'Direct tie-in with JPMC, Civil Hospital & Aga Khan University Hospital',
      'Fast urban dispatch with GPS routing'
    ],
    recommendedFor: 'Physical injury, trauma, panic attack, medical emergency after assault',
    iconName: 'Ambulance'
  }
];

export const CERTIFIED_GUARDS: GuardProfile[] = [
  {
    id: 'guard-01',
    name: 'Capt. (R) Samina Zehra',
    gender: 'Female',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    age: 34,
    rating: 4.98,
    reviewCount: 142,
    completedMissions: 218,
    badgeType: 'Female Tactical Specialist',
    sindhSecurityLicense: 'SND-SEC-2024-8821F',
    weaponLicensed: true,
    weaponType: 'Glock 19 9mm (Licensed Concealed Carry)',
    hourlyRatePKR: 1400,
    languages: ['Urdu', 'English', 'Sindhi'],
    skills: ['Executive Close Protection', 'Unarmed Defense (Krav Maga)', 'Defensive Tactical Driving', 'Emergency First Aid / CPR'],
    vehicleAvailable: true,
    vehicleDetails: 'Toyota Corolla Altis (Tinted, Dashcam front/rear)',
    currentLocation: {
      lat: 24.8138,
      lng: 67.0345,
      address: 'Khayaban-e-Shahbaz, DHA Phase 6, Karachi',
      district: 'Karachi South'
    },
    availability: 'Available Now',
    bio: 'Former Pakistan Air Force security corps officer with 8 years of executive VIP close protection experience. Specialized in discrete female transit protection, late-night corporate commutes, and event security.'
  },
  {
    id: 'guard-02',
    name: 'Inspector (R) Fatima Noor',
    gender: 'Female',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    age: 38,
    rating: 4.95,
    reviewCount: 98,
    completedMissions: 164,
    badgeType: 'Female Tactical Specialist',
    sindhSecurityLicense: 'SND-SEC-2023-4109F',
    weaponLicensed: true,
    weaponType: 'Beretta 92FS 9mm',
    hourlyRatePKR: 1350,
    languages: ['Urdu', 'English', 'Punjabi'],
    skills: ['Close Quarter Protection', 'Anti-Stalking Counter-Surveillance', 'Crisis Negotiation', 'Hospital & Family Escort'],
    vehicleAvailable: false,
    currentLocation: {
      lat: 24.8716,
      lng: 67.0599,
      address: 'Near Tariq Road / PECHS Block 2, Karachi',
      district: 'Karachi East'
    },
    availability: 'Available Now',
    bio: 'Retired Sindh Police Sub-Inspector with exemplary record. Expert in neighborhood risk assessment, discreet chaperone services for students/working women, and family court protection.'
  },
  {
    id: 'guard-03',
    name: 'Tariq Mehmood (Ex-SSG)',
    gender: 'Male',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    age: 41,
    rating: 4.99,
    reviewCount: 310,
    completedMissions: 480,
    badgeType: 'Ex-SSG Elite',
    sindhSecurityLicense: 'SND-SEC-2022-0091M',
    weaponLicensed: true,
    weaponType: 'Sig Sauer P226 + 12-Gauge Tactical',
    hourlyRatePKR: 1600,
    languages: ['Urdu', 'English', 'Pashto'],
    skills: ['High-Threat Convoy Protection', 'Advanced Anti-Ambush Tactics', 'Paramedic Level 2', 'Route Reconnaissance'],
    vehicleAvailable: true,
    vehicleDetails: 'Toyota Fortuner SUV (B6 Armored Level Option)',
    currentLocation: {
      lat: 24.8615,
      lng: 67.0724,
      address: 'Sharea Faisal / KDA Scheme 1, Karachi',
      district: 'Karachi East'
    },
    availability: 'Available Now',
    bio: '12 years in Special Services Group (SSG) Commandos. Extensive experience safeguarding diplomats, female executives, and medical staff on high-risk Karachi inter-city and night assignments.'
  },
  {
    id: 'guard-04',
    name: 'Ayesha Jameel',
    gender: 'Female',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    age: 29,
    rating: 4.92,
    reviewCount: 76,
    completedMissions: 110,
    badgeType: 'Executive Close Protection',
    sindhSecurityLicense: 'SND-SEC-2024-9912F',
    weaponLicensed: false,
    weaponType: 'Non-Lethal Defense (Taser X26P & Pepper Foam)',
    hourlyRatePKR: 1100,
    languages: ['Urdu', 'English'],
    skills: ['Discrete Companion', 'Crowd Management', 'Self-Defense Trainer', 'Travel & Shopping Escort'],
    vehicleAvailable: true,
    vehicleDetails: 'Honda City (Clean, Child-Seat & Safety Glass)',
    currentLocation: {
      lat: 24.9268,
      lng: 67.0348,
      address: 'North Nazimabad Block H, Karachi',
      district: 'Karachi Central'
    },
    availability: 'Available Now',
    bio: 'Certified black belt martial artist and personal protection specialist. Ideal for safe university transit, shopping in crowded bazaars, and safe evening travel across Karachi.'
  },
  {
    id: 'guard-05',
    name: 'Subedar (R) Kamran Malik',
    gender: 'Male',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    age: 44,
    rating: 4.94,
    reviewCount: 184,
    completedMissions: 290,
    badgeType: 'Armed Escort',
    sindhSecurityLicense: 'SND-SEC-2021-7714M',
    weaponLicensed: true,
    weaponType: 'MP5 9mm (Licensed Commercial Security)',
    hourlyRatePKR: 1500,
    languages: ['Urdu', 'English', 'Balochi'],
    skills: ['Armed Perimeter Defense', 'Airport Transit Escort', 'Asset & Cash Protection', 'Night Patrol'],
    vehicleAvailable: true,
    vehicleDetails: 'Toyota Hilux Revo Dual-Cabin Escort Truck',
    currentLocation: {
      lat: 24.8387,
      lng: 67.1172,
      address: 'Korangi Road / Defense View, Karachi',
      district: 'Korangi'
    },
    availability: 'Available Now',
    bio: 'Ex-Sindh Rangers Commando with 15 years urban tactical experience. Verified by Home Department Sindh with spotless record for night escorts and long-distance highway runs.'
  }
];

export const SELF_DEFENSE_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Sabre Red Max Strength Pepper Spray (with UV Dye)',
    category: 'Sprays',
    pricePKR: 2850,
    originalPricePKR: 3500,
    rating: 4.95,
    reviewCount: 320,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    description: 'USA-formulated military strength Oleoresin Capsicum (OC) spray. Blinds and incapacitates attackers for up to 45 minutes with indelible UV marking dye for police identification.',
    features: [
      '10-12 feet stream range (wind-resistant)',
      'Invisible UV dye marks attacker for up to 48 hours for police identification',
      'Flip-top safety prevents accidental discharge in handbag',
      'Compact 15ml / 25 bursts capacity'
    ],
    inStock: true,
    stockCount: 48,
    isLegalInPakistan: true,
    legalNotice: '100% Legal for civilian self-defense possession in Pakistan under Sindh Arms / Non-Lethal Defense regulations.',
    isFeatured: true
  },
  {
    id: 'prod-02',
    name: '130dB Ultra-Loud Siren Keychain with Flashing Strobe LED',
    category: 'Alarms & Sirens',
    pricePKR: 1750,
    originalPricePKR: 2200,
    rating: 4.88,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=80',
    description: 'Deafening 130-decibel emergency siren audible up to 600 feet away. Simple pin-pull activation with high-intensity blinding LED strobe to disorient attackers in darkness.',
    features: [
      '130dB sound pressure (comparable to jet engine taking off)',
      'Pin-pull quick deployment (instant activation in struggle)',
      'Built-in 200 Lumen strobe flashlight',
      'Rechargeable Type-C battery (up to 1 year standby)'
    ],
    inStock: true,
    stockCount: 82,
    isLegalInPakistan: true,
    legalNotice: 'Non-lethal acoustic deterrence. Approved for transport on flights, rickshaws, buses, and public venues.',
    isFeatured: true
  },
  {
    id: 'prod-03',
    name: 'Aviation Aluminum Tactical Pen with Tungsten Glass Breaker',
    category: 'Stun & Impact',
    pricePKR: 2100,
    originalPricePKR: 2600,
    rating: 4.82,
    reviewCount: 140,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80',
    description: 'Fully functional luxury writing pen crafted from aircraft-grade anodized aluminum. Features a diamond-hard tungsten carbide strike tip for pressure-point defense and car window breaking.',
    features: [
      'Machined T6061 aviation aluminum alloy body',
      'Tungsten carbide strike crown for vehicle extrication or defense',
      'Smooth writing with replaceable Parker-style ink refills',
      'Discreet pocket clip resembles ordinary executive pen'
    ],
    inStock: true,
    stockCount: 35,
    isLegalInPakistan: true,
    legalNotice: 'Legal everyday carry item. Allowed through university and airport security checks.',
    isFeatured: false
  },
  {
    id: 'prod-04',
    name: 'Smart Covert SOS Bluetooth Ring / Safety Jewelry Pendant',
    category: 'Covert & Wearables',
    pricePKR: 4950,
    originalPricePKR: 6200,
    rating: 4.91,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
    description: 'Waterproof hypoallergenic titanium ring with hidden tactile panic button on inner rim. Triple-click silently sends live GPS coordinates to Tahaffuz Karachi emergency network.',
    features: [
      'Silent covert trigger (no screen illumination or sound)',
      'Instant Tahaffuz 100m SOS broadcast on triple press',
      'IP68 waterproof and sweatproof design',
      '7-day magnetic fast-charge battery'
    ],
    inStock: true,
    stockCount: 19,
    isLegalInPakistan: true,
    legalNotice: 'Encrypted BLE 5.3 telemetry device. No telecom license required.',
    isFeatured: true
  },
  {
    id: 'prod-05',
    name: 'Heavy-Duty Portable Hotel & Hostel Door Stop Alarm (120dB)',
    category: 'Home & Vehicle Safety',
    pricePKR: 1950,
    originalPricePKR: 2400,
    rating: 4.87,
    reviewCount: 167,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop&q=80',
    description: 'Essential for female students living in hostels, university dorms, or single travelers staying in guest houses. Wedges beneath door and sounds 120dB alarm if door is pushed open.',
    features: [
      'Wedge shape physically prevents forced door entry',
      '3 sensitivity levels (High, Medium, Low)',
      'Stainless steel pressure plate with non-skid rubber base',
      'Lightweight 120g portable travel size'
    ],
    inStock: true,
    stockCount: 54,
    isLegalInPakistan: true,
    legalNotice: 'Civilian home security gadget. Permitted everywhere.',
    isFeatured: false
  },
  {
    id: 'prod-06',
    name: 'Compact High-Voltage Stun Baton with Safety Disable Pin',
    category: 'Stun & Impact',
    pricePKR: 3600,
    originalPricePKR: 4400,
    rating: 4.79,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=80',
    description: 'Powerful handheld non-lethal electrical disabler with wrist-strap disable pin (if snatched, unit becomes non-functional). Creates visible high-voltage deterrent spark arc.',
    features: [
      'Wrist lanyard safety pin prevents attacker from turning unit against victim',
      'Bright LED target spotlight',
      'Internal rechargeable lithium battery with wall adapter',
      'Textured anti-slip rubberized grip'
    ],
    inStock: true,
    stockCount: 22,
    isLegalInPakistan: true,
    legalNotice: 'Non-lethal electrical self-defense device for personal safety.',
    isFeatured: true
  }
];

export const SAMPLE_NEARBY_DISTRESS: NearbyDistressSignal = {
  id: 'sos-live-demo-01',
  victimName: 'Mariam K. (Verified CNIC)',
  distanceMeters: 74,
  direction: 'North-West (74m away - near Khayaban-e-Mujahid)',
  location: {
    lat: 24.8162,
    lng: 67.0360,
    address: 'Street 14, Phase 5, DHA, Karachi',
    landmark: 'Near 26th Commercial Street, DHA Phase 5',
    district: 'Karachi South'
  },
  timestamp: Date.now() - 45000,
  urgencyLevel: 'CRITICAL',
  status: 'ACTIVE_DISTRESS',
  respondersOnWay: 3,
  audioBroadcastActive: true
};
