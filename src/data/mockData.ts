import type { Room, MenuItem, StaffTask, AIInsight } from '../types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-101',
    name: 'DELUXE KING',
    category: 'Rooms',
    tagline: 'A quiet retreat designed for tranquil relaxation.',
    description: 'Immerse yourself in sleek modern comfort featuring custom Italian linen, panoramic skyline floor-to-ceiling windows, rain shower spa bathroom, and automated atmosphere controls.',
    pricePerNight: 4500,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
    ],
    sizeSqFt: 420,
    bedType: 'King Bed',
    maxGuests: 2,
    viewType: 'City View',
    rating: 4.9,
    reviewCount: 128,
    floor: 3,
    status: 'OCCUPIED',
    amenities: ['Ultra-fast Wi-Fi', '65" Smart TV', 'Artisan Mini Bar', 'Gourmet Breakfast', 'Climate Control', 'Bowers & Wilkins Sound System', 'Nespresso Bar']
  },
  {
    id: 'room-202',
    name: 'EXECUTIVE SKYLINE SUITE',
    category: 'Suites',
    tagline: 'Elevated space with wrap-around balcony & private lounge.',
    description: 'Designed for discerning travelers who demand space and sophistication. Includes separate living quarters, marble bath, dedicated butler service, and executive lounge privileges.',
    pricePerNight: 8500,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    sizeSqFt: 750,
    bedType: 'Super King Bed',
    maxGuests: 3,
    viewType: 'Panoramic Skyline & Harbor',
    rating: 4.96,
    reviewCount: 94,
    floor: 7,
    status: 'AVAILABLE',
    amenities: ['Private Balcony', '24/7 Butler Access', 'Deep Soaking Tub', 'Walk-in Dressing Room', 'Executive Lounge Access', 'Premium Cocktail Setup', 'Daily Champagne Hour']
  },
  {
    id: 'room-303',
    name: 'PRESIDENTIAL PENTHOUSE',
    category: 'Suites',
    tagline: 'The pinnacle of luxury hospitality and architectural design.',
    description: 'Featuring private rooftop plunge pool, dedicated chef kitchen, dining room for eight, grand piano, and private keycard elevator access.',
    pricePerNight: 24000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
    ],
    sizeSqFt: 1850,
    bedType: 'Custom California King',
    maxGuests: 4,
    viewType: '360° Ocean & City View',
    rating: 5.0,
    reviewCount: 42,
    floor: 12,
    status: 'RESERVED',
    amenities: ['Private Plunge Pool', 'Personal Chauffeur', 'Private Chef Experience', 'Helipad Access', 'Wine Cellar Selection', 'Sauna & Spa Suite']
  },
  {
    id: 'room-404',
    name: 'OCEANFRONT PRIVACY VILLA',
    category: 'Villas',
    tagline: 'Secluded haven surrounded by crystal waters and lush palms.',
    description: 'Direct beach access, expansive teak sun terrace, private infinity pool, outdoor rainfall shower, and custom curated spa treatments delivered in-villa.',
    pricePerNight: 16500,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    sizeSqFt: 1200,
    bedType: 'King Bed + Daybed',
    maxGuests: 4,
    viewType: 'Direct Ocean Front',
    rating: 4.98,
    reviewCount: 76,
    floor: 1,
    status: 'CLEANING',
    amenities: ['Private Infinity Pool', 'Direct Beach Walkway', 'Outdoor Shower', 'Personal Concierge', 'Yacht Charter Booking Service', 'Private BBQ Dining']
  },
  {
    id: 'room-505',
    name: 'GARDEN SANCTUARY VILLA',
    category: 'Villas',
    tagline: 'Tropical serenity with private botanical courtyard.',
    description: 'Nestled within serene botanical gardens, offering total privacy, outdoor terrazzo soaking bath, organic tea ceremony setup, and yoga pavilion access.',
    pricePerNight: 12000,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    ],
    sizeSqFt: 950,
    bedType: 'King Bed',
    maxGuests: 2,
    viewType: 'Private Botanical Gardens',
    rating: 4.92,
    reviewCount: 61,
    floor: 1,
    status: 'MAINTENANCE',
    amenities: ['Private Courtyard', 'Outdoor Terrazzo Bath', 'Daily Yoga Session', 'Organic Herbal Tea Bar', 'Aromatherapy Menu']
  },
  {
    id: 'room-606',
    name: 'ROYAL HERITAGE SUITE',
    category: 'Suites',
    tagline: 'Classic timeless elegance meets contemporary technological luxury.',
    description: 'Custom handcrafted hardwood paneling, warm gold fixtures, state-of-the-art climate acoustics, and curated artwork from international masters.',
    pricePerNight: 9800,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    sizeSqFt: 820,
    bedType: 'Super King Bed',
    maxGuests: 3,
    viewType: 'Historic Courtyard View',
    rating: 4.95,
    reviewCount: 88,
    floor: 4,
    status: 'AVAILABLE',
    amenities: ['Custom Hardwood Finishes', 'Fireplace', 'Soundproof Acoustics', 'Dedicated Work Desk', 'Espresso Tasting Bar', 'Marble Bath']
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'food-1',
    name: 'Truffle Glazed Black Angus Filet',
    category: 'Dinner',
    description: 'Prime beef tenderloin, winter black truffle jus, smoked potato mousseline, baby heirloom carrots.',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    dietary: ['Chef Special', 'Gluten-Free'],
    prepTime: '25 min'
  },
  {
    id: 'food-2',
    name: 'Artisanal Burrata & Heirloom Beetroot',
    category: 'Lunch',
    description: 'Fresh Puglia burrata, roasted golden beets, pistachio dust, aged balsamic drizzle, wild arugula.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=600&q=80',
    dietary: ['Vegetarian', 'Gluten-Free'],
    prepTime: '15 min'
  },
  {
    id: 'food-3',
    name: 'StaySphere Signature Royale Breakfast',
    category: 'Breakfast',
    description: 'Organic poached eggs with caviar, smoked salmon rosettes, brioche toast, seasonal berries, freshly pressed juice.',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
    dietary: ['Chef Special'],
    prepTime: '20 min'
  },
  {
    id: 'food-4',
    name: 'Wild Caught Chilean Sea Bass',
    category: 'Dinner',
    description: 'Pan-seared sea bass, lemongrass saffron broth, baby bok choy, crispy ginger tuile.',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    dietary: ['Gluten-Free', 'Chef Special'],
    prepTime: '30 min'
  },
  {
    id: 'food-5',
    name: 'Vintage Champagne Cocktail - Gold Reserve',
    category: 'Drinks',
    description: 'Dom Pérignon vintage infusion with edible 24k gold leaf, elderflower liqueur, and organic lemon essence.',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    dietary: ['Vegan', 'Chef Special'],
    prepTime: '5 min'
  },
  {
    id: 'food-6',
    name: 'Valrhona Grand Cru Chocolate Sphere',
    category: 'Desserts',
    description: 'Dark chocolate dome melted with warm salted caramel, hazelnut praline core, Tahitian vanilla bean gelato.',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80',
    dietary: ['Vegetarian', 'Chef Special'],
    prepTime: '15 min'
  }
];

export const INITIAL_STAFF_TASKS: StaffTask[] = [
  {
    id: 'task-101',
    type: 'Housekeeping',
    roomNumber: '304',
    title: 'Checkout Deep Clean & Linen Refresh',
    description: 'Guest checkout completed at 11:00 AM. Requires sanitization, bath amenities restock, and champagne bucket setup.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedStaff: 'Elena Rostova (Staff #14)',
    createdAt: '11:05 AM',
    scheduledTime: '11:30 AM'
  },
  {
    id: 'task-102',
    type: 'Maintenance',
    roomNumber: '207',
    title: 'Climate Control Thermostat Calibration',
    description: 'Guest reported AC cooling temperature fluctuating by 2°C. Inspect secondary sensor unit.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedStaff: 'Marcus Vance (Staff #12)',
    createdAt: '10:42 AM',
    scheduledTime: '11:00 AM'
  },
  {
    id: 'task-103',
    type: 'Restaurant',
    roomNumber: '101',
    title: 'In-Room Dining: Signature Royale Breakfast',
    description: 'Deliver to Room 101 with warm server trolley. Special note: extra berry bowl & sparkling water.',
    priority: 'MEDIUM',
    status: 'PENDING',
    assignedStaff: 'Jean-Pierre (Dining Lead)',
    createdAt: '11:15 AM',
    scheduledTime: '11:45 AM'
  },
  {
    id: 'task-104',
    type: 'Housekeeping',
    roomNumber: '505',
    title: 'Botanical Villa Courtyard Touchup',
    description: 'Standard evening turndown service, organic lavender oil diffuser setup.',
    priority: 'LOW',
    status: 'PENDING',
    assignedStaff: 'Sara Kumar (Staff #08)',
    createdAt: '09:30 AM',
    scheduledTime: '04:00 PM'
  },
  {
    id: 'task-105',
    type: 'Maintenance',
    roomNumber: 'Penthouse 1201',
    title: 'Private Plunge Pool Water Chemistry Verification',
    description: 'Routine pH check and automated filter cycle inspection.',
    priority: 'LOW',
    status: 'COMPLETED',
    assignedStaff: 'David Miller (Tech Lead)',
    createdAt: '08:00 AM',
    scheduledTime: '08:30 AM'
  }
];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'FORECAST',
    title: 'WEEKEND OCCUPANCY SURGE DETECTED',
    description: 'Occupancy is expected to reach 94.5% over the upcoming weekend based on search volume & luxury travel booking patterns.',
    confidence: 89,
    metric: '+12.1% vs last week',
    actionText: 'View Forecast Details',
    category: 'Revenue & Occupancy'
  },
  {
    id: 'insight-2',
    type: 'DEMAND',
    title: 'HIGH SUITE DEMAND SIGNAL',
    description: 'Executive & Presidential Suites are experiencing 3x higher inquiries. Consider adjusting dynamic weekend rate by +8%.',
    confidence: 94,
    metric: '3.2x Inquiry Velocity',
    actionText: 'Optimize Dynamic Pricing',
    category: 'Yield Management'
  },
  {
    id: 'insight-3',
    type: 'SERVICE',
    title: 'DINING PREFERENCE PREDICTION',
    description: '78% of checked-in guests have expressed interest in roof dining. Staff allocation recommended for terrace lounge.',
    confidence: 85,
    metric: 'Terrace Peak @ 8:00 PM',
    actionText: 'Prepare Staff Shifts',
    category: 'Operations'
  }
];

export const MOCK_REVENUE_DATA = [
  { month: 'Mon', revenue: 420000, occupancy: 76 },
  { month: 'Tue', revenue: 450000, occupancy: 78 },
  { month: 'Wed', revenue: 480000, occupancy: 82 },
  { month: 'Thu', revenue: 510000, occupancy: 85 },
  { month: 'Fri', revenue: 640000, occupancy: 92 },
  { month: 'Sat', revenue: 710000, occupancy: 96 },
  { month: 'Sun', revenue: 680000, occupancy: 90 },
];
