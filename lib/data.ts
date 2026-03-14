// Mock data for the TerraVision platform

export interface Property {
  id: string
  title: string
  description: string
  location: string
  address: string
  price: number
  size: number
  sizeUnit: string
  type: "land" | "waterfront" | "mountain" | "desert" | "urban" | "rural"
  status: "available" | "pending" | "sold" | "For Sale"
  has3D: boolean
  model3DUrl?: string
  generationStatus?: "none" | "pending" | "completed" | "failed"
  images: string[]
  features: string[]
  ownerId: string
  ownerName: string
  createdAt: string
  featured: boolean
  views?: number
}

export interface Professional {
  id: string
  name: string
  email: string
  profession: "architect" | "contractor" | "mason" | "carpenter" | "electrician" | "plumber" | "interior_designer"
  specialty: string
  bio: string
  location: string
  rating: number
  reviewCount: number
  hourlyRate: number
  completedProjects: number
  portfolioUrl?: string
  verified: boolean
  avatar?: string
}

export interface FloorPlan {
  id: string
  title: string
  description: string
  architectId: string
  architectName: string
  price: number
  sqft: number
  bedrooms: number
  bathrooms: number
  style: string
  previewImage: string
  downloads: number
  rating: number
}

// Mock Properties
export const properties: Property[] = [
  {
    id: "prop-1",
    title: "Hillside Estate",
    description: "Stunning hillside property with panoramic views. Perfect for building your dream home with breathtaking sunsets and complete privacy. The land features mature oak trees and a natural spring.",
    location: "Countryside, CA",
    address: "1234 Hillside Drive, Countryside, CA 95123",
    price: 450000,
    size: 2.5,
    sizeUnit: "acres",
    type: "rural",
    status: "available",
    has3D: true,
    model3DUrl: "/models/hillside.glb",
    images: ["/properties/hillside-1.jpg", "/properties/hillside-2.jpg"],
    features: ["Panoramic views", "Natural spring", "Mature trees", "Paved access", "Utilities available"],
    ownerId: "user-1",
    ownerName: "John Smith",
    createdAt: "2026-02-15",
    featured: true,
  },
  {
    id: "prop-2",
    title: "Lakefront Paradise",
    description: "Rare lakefront property with 200 feet of private shoreline. Crystal clear waters and mountain backdrop make this the perfect location for a waterfront retreat.",
    location: "Lake Tahoe, NV",
    address: "5678 Lakeshore Road, Lake Tahoe, NV 89449",
    price: 680000,
    size: 1.8,
    sizeUnit: "acres",
    type: "waterfront",
    status: "available",
    has3D: true,
    model3DUrl: "/models/lakefront.glb",
    images: ["/properties/lakefront-1.jpg"],
    features: ["Private shoreline", "Boat dock permit", "Mountain views", "Year-round access", "Well water"],
    ownerId: "user-2",
    ownerName: "Sarah Johnson",
    createdAt: "2026-02-20",
    featured: true,
  },
  {
    id: "prop-3",
    title: "Mountain View Lot",
    description: "Premium mountain lot in exclusive Aspen area. Ski-in/ski-out potential with stunning views of the Maroon Bells. Pre-approved for construction.",
    location: "Aspen, CO",
    address: "910 Mountain View Lane, Aspen, CO 81611",
    price: 520000,
    size: 3.2,
    sizeUnit: "acres",
    type: "mountain",
    status: "available",
    has3D: true,
    model3DUrl: "/models/mountain.glb",
    images: ["/properties/mountain-1.jpg"],
    features: ["Ski access", "Pre-approved plans", "Underground utilities", "Private road", "Security gate"],
    ownerId: "user-3",
    ownerName: "Michael Chen",
    createdAt: "2026-01-10",
    featured: false,
  },
  {
    id: "prop-4",
    title: "Desert Oasis",
    description: "Expansive desert property perfect for a sustainable off-grid home. Incredible star-gazing, natural rock formations, and complete solitude.",
    location: "Scottsdale, AZ",
    address: "2345 Desert Mesa Road, Scottsdale, AZ 85262",
    price: 320000,
    size: 4.0,
    sizeUnit: "acres",
    type: "desert",
    status: "available",
    has3D: false,
    images: ["/properties/desert-1.jpg"],
    features: ["Solar potential", "Well permit", "No HOA", "Dark sky certified", "Native landscape"],
    ownerId: "user-4",
    ownerName: "Amanda Williams",
    createdAt: "2026-02-01",
    featured: false,
  },
  {
    id: "prop-5",
    title: "Urban Development Plot",
    description: "Prime urban development opportunity in growing tech corridor. Zoned for mixed-use, ideal for commercial/residential project.",
    location: "Austin, TX",
    address: "789 Innovation Blvd, Austin, TX 78701",
    price: 890000,
    size: 0.8,
    sizeUnit: "acres",
    type: "urban",
    status: "available",
    has3D: true,
    model3DUrl: "/models/urban.glb",
    images: ["/properties/urban-1.jpg"],
    features: ["Mixed-use zoning", "Public transit", "All utilities", "Corner lot", "High visibility"],
    ownerId: "user-5",
    ownerName: "David Kim",
    createdAt: "2026-02-25",
    featured: true,
  },
  {
    id: "prop-6",
    title: "Vineyard Estate",
    description: "Premium vineyard property in Napa Valley. Established grape vines and wine production facility included. Turnkey operation.",
    location: "Napa Valley, CA",
    address: "4567 Vineyard Way, Napa, CA 94558",
    price: 2400000,
    size: 15.0,
    sizeUnit: "acres",
    type: "rural",
    status: "pending",
    has3D: true,
    model3DUrl: "/models/vineyard.glb",
    images: ["/properties/vineyard-1.jpg"],
    features: ["Established vines", "Production facility", "Tasting room", "Guest cottage", "Irrigation system"],
    ownerId: "user-6",
    ownerName: "Elizabeth Brown",
    createdAt: "2026-01-20",
    featured: true,
  },
  {
    id: "prop-7",
    title: "Coastal Bluff",
    description: "Dramatic oceanfront property on protected bluff. Watch whales migrate from your future living room. Rare coastal building opportunity.",
    location: "Big Sur, CA",
    address: "1111 Pacific Coast Hwy, Big Sur, CA 93920",
    price: 1850000,
    size: 2.1,
    sizeUnit: "acres",
    type: "waterfront",
    status: "available",
    has3D: true,
    model3DUrl: "/models/coastal.glb",
    images: ["/properties/coastal-1.jpg"],
    features: ["Ocean views", "Protected bluff", "Coastal permits", "Gated access", "Generator included"],
    ownerId: "user-7",
    ownerName: "Robert Taylor",
    createdAt: "2026-03-01",
    featured: false,
  },
  {
    id: "prop-8",
    title: "Forest Retreat",
    description: "Peaceful forest property surrounded by national forest. Perfect for nature lovers seeking privacy and tranquility.",
    location: "Bend, OR",
    address: "3333 Forest Road, Bend, OR 97701",
    price: 275000,
    size: 5.0,
    sizeUnit: "acres",
    type: "rural",
    status: "available",
    has3D: false,
    images: ["/properties/forest-1.jpg"],
    features: ["National forest border", "Creek frontage", "Wildlife corridor", "Timber value", "Hunting rights"],
    ownerId: "user-8",
    ownerName: "Jennifer Davis",
    createdAt: "2026-02-10",
    featured: false,
  },
]

// Mock Professionals
export const professionals: Professional[] = [
  {
    id: "prof-1",
    name: "Sarah Chen",
    email: "sarah@chenarchitects.com",
    profession: "architect",
    specialty: "Modern Residential",
    bio: "Award-winning architect specializing in sustainable modern homes. 15 years of experience creating spaces that blend form and function.",
    location: "San Francisco, CA",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 150,
    completedProjects: 89,
    portfolioUrl: "https://chenarchitects.com",
    verified: true,
  },
  {
    id: "prof-2",
    name: "Michael Torres",
    email: "mike@torresconstruction.com",
    profession: "contractor",
    specialty: "Custom Homes",
    bio: "Family-owned construction company building custom homes for over 20 years. We turn architectural visions into reality with quality craftsmanship.",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviewCount: 94,
    hourlyRate: 125,
    completedProjects: 156,
    portfolioUrl: "https://torresconstruction.com",
    verified: true,
  },
  {
    id: "prof-3",
    name: "Emily Watson",
    email: "emily@watsoninteriors.com",
    profession: "interior_designer",
    specialty: "Contemporary Design",
    bio: "Interior designer with a passion for creating warm, inviting spaces. Featured in Architectural Digest and Elle Decor.",
    location: "Seattle, WA",
    rating: 5.0,
    reviewCount: 73,
    hourlyRate: 100,
    completedProjects: 62,
    portfolioUrl: "https://watsoninteriors.com",
    verified: true,
  },
  {
    id: "prof-4",
    name: "David Kim",
    email: "david@smartelectrical.com",
    profession: "electrician",
    specialty: "Smart Home Systems",
    bio: "Licensed master electrician specializing in smart home integration and sustainable energy systems. Tesla certified installer.",
    location: "Austin, TX",
    rating: 4.7,
    reviewCount: 58,
    hourlyRate: 90,
    completedProjects: 104,
    verified: true,
  },
  {
    id: "prof-5",
    name: "James Wilson",
    email: "james@wilsonmasonry.com",
    profession: "mason",
    specialty: "Stone & Brick",
    bio: "Third-generation stone mason with expertise in natural stone, brick, and custom concrete work. Bringing Old World craftsmanship to modern builds.",
    location: "Denver, CO",
    rating: 4.9,
    reviewCount: 45,
    hourlyRate: 85,
    completedProjects: 78,
    verified: true,
  },
  {
    id: "prof-6",
    name: "Maria Garcia",
    email: "maria@garciaarchitecture.com",
    profession: "architect",
    specialty: "Eco-Friendly Homes",
    bio: "LEED-certified architect focused on net-zero and passive house design. Creating homes that are beautiful and sustainable.",
    location: "Portland, OR",
    rating: 4.8,
    reviewCount: 92,
    hourlyRate: 140,
    completedProjects: 67,
    portfolioUrl: "https://garciaarchitecture.com",
    verified: true,
  },
  {
    id: "prof-7",
    name: "Robert Johnson",
    email: "rob@johnsoncarpentry.com",
    profession: "carpenter",
    specialty: "Custom Millwork",
    bio: "Master carpenter specializing in custom cabinetry, built-ins, and architectural millwork. Every piece is handcrafted to perfection.",
    location: "Nashville, TN",
    rating: 4.9,
    reviewCount: 81,
    hourlyRate: 75,
    completedProjects: 134,
    verified: true,
  },
  {
    id: "prof-8",
    name: "Lisa Anderson",
    email: "lisa@andersonplumbing.com",
    profession: "plumber",
    specialty: "Luxury Bathrooms",
    bio: "Master plumber with 18 years of experience in high-end residential. Specialist in custom bathroom installations and spa systems.",
    location: "Miami, FL",
    rating: 4.6,
    reviewCount: 52,
    hourlyRate: 95,
    completedProjects: 89,
    verified: true,
  },
]

// Mock Floor Plans
export const floorPlans: FloorPlan[] = [
  {
    id: "plan-1",
    title: "Modern Minimalist",
    description: "Open concept single-story home with floor-to-ceiling windows and seamless indoor-outdoor living.",
    architectId: "prof-1",
    architectName: "Sarah Chen",
    price: 2500,
    sqft: 2400,
    bedrooms: 3,
    bathrooms: 2.5,
    style: "Modern",
    previewImage: "/plans/modern-minimalist.jpg",
    downloads: 156,
    rating: 4.8,
  },
  {
    id: "plan-2",
    title: "Mountain Retreat",
    description: "A-frame inspired design perfect for mountain properties. Dramatic vaulted ceilings and cozy loft spaces.",
    architectId: "prof-6",
    architectName: "Maria Garcia",
    price: 1800,
    sqft: 1800,
    bedrooms: 2,
    bathrooms: 2,
    style: "Rustic Modern",
    previewImage: "/plans/mountain-retreat.jpg",
    downloads: 89,
    rating: 4.9,
  },
  {
    id: "plan-3",
    title: "Coastal Contemporary",
    description: "Light-filled beach house design with wraparound deck and hurricane-resistant construction.",
    architectId: "prof-1",
    architectName: "Sarah Chen",
    price: 3200,
    sqft: 3100,
    bedrooms: 4,
    bathrooms: 3.5,
    style: "Contemporary",
    previewImage: "/plans/coastal-contemporary.jpg",
    downloads: 67,
    rating: 4.7,
  },
  {
    id: "plan-4",
    title: "Desert Modern",
    description: "Sustainable desert home with passive cooling, solar orientation, and natural material palette.",
    architectId: "prof-6",
    architectName: "Maria Garcia",
    price: 2200,
    sqft: 2200,
    bedrooms: 3,
    bathrooms: 2,
    style: "Desert Modern",
    previewImage: "/plans/desert-modern.jpg",
    downloads: 45,
    rating: 4.9,
  },
  {
    id: "plan-5",
    title: "Farmhouse Classic",
    description: "Updated farmhouse design with wrap-around porch, modern kitchen, and classic charm.",
    architectId: "prof-1",
    architectName: "Sarah Chen",
    price: 1950,
    sqft: 2800,
    bedrooms: 4,
    bathrooms: 2.5,
    style: "Farmhouse",
    previewImage: "/plans/farmhouse-classic.jpg",
    downloads: 234,
    rating: 4.6,
  },
  {
    id: "plan-6",
    title: "Urban Compact",
    description: "Efficient urban home design maximizing space on narrow lots. Perfect for infill development.",
    architectId: "prof-6",
    architectName: "Maria Garcia",
    price: 1500,
    sqft: 1400,
    bedrooms: 2,
    bathrooms: 1.5,
    style: "Modern",
    previewImage: "/plans/urban-compact.jpg",
    downloads: 112,
    rating: 4.5,
  },
]

// Helper functions
export function getPropertyById(id: string): Property | undefined {
  return properties.find(p => p.id === id)
}

export function getProfessionalById(id: string): Professional | undefined {
  return professionals.find(p => p.id === id)
}

export function getFloorPlanById(id: string): FloorPlan | undefined {
  return floorPlans.find(p => p.id === id)
}

export function getFeaturedProperties(): Property[] {
  return properties.filter(p => p.featured)
}

export function getPropertiesByType(type: Property["type"]): Property[] {
  return properties.filter(p => p.type === type)
}

export function getProfessionalsByProfession(profession: Professional["profession"]): Professional[] {
  return professionals.filter(p => p.profession === profession)
}
