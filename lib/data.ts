// The "Golden Dataset" for TerraVision V2
// This data is used for local development, fallbacks, and design testing.

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
}

export interface Professional {
  id: string
  name: string
  email: string
  profession: "architect" | "mason" | "carpenter" | "contractor" | "designer" | "electrician" | "plumber" | "interior_designer"
  specialty: string
  bio: string
  rating: number
  reviewCount: number
  location: string
  hourlyRate: number
  portfolioUrl?: string
  avatar?: string
  verified: boolean
  completedProjects: number
}

export interface FloorPlan {
  id: string
  architectId: string
  architectName: string
  title: string
  description: string
  price: number
  sqft: number
  bedrooms: number
  bathrooms: number
  style: string
  image: string
  rating: number
  downloads: number
}

export const properties: Property[] = [
  {
    id: "prop-1",
    title: "Azure Bay Waterfront",
    description: "A breathtaking waterfront parcel with 200ft of private shoreline. Perfect for a modern glass villa. The terrain is flat near the water with a gentle slope towards the access road.",
    location: "Malibu, CA",
    address: "102 Ocean Way, Malibu, CA 90265",
    price: 1250000,
    size: 1.5,
    sizeUnit: "acres",
    type: "waterfront",
    status: "available",
    has3D: true,
    model3DUrl: "/models/modern_house.glb", // High-quality sample
    generationStatus: "completed",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e", "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2"],
    features: ["Private Beach", "Permit Approved", "Deep Water Dock", "Unobstructed Views"],
    ownerId: "owner-1",
    ownerName: "Alexander Vance",
    createdAt: "2026-03-01T10:00:00Z",
    featured: true
  },
  {
    id: "prop-2",
    title: "Summit Peak Estate",
    description: "High-altitude plot with 360-degree views of the Rockies. Ideal for an off-grid luxury retreat. This property features natural spring access and dense pine coverage.",
    location: "Aspen, CO",
    address: "Skyline Ridge Lot 14, Aspen, CO 81611",
    price: 850000,
    size: 4.2,
    sizeUnit: "acres",
    type: "mountain",
    status: "available",
    has3D: false,
    generationStatus: "pending", // Tests the glossy processing overlay
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", "https://images.unsplash.com/photo-1454496522488-7a8e488e8606"],
    features: ["Natural Spring", "Ski-in/Ski-out potential", "Off-grid Ready"],
    ownerId: "owner-2",
    ownerName: "Sierra Heights Dev",
    createdAt: "2026-03-10T14:30:00Z",
    featured: true
  },
  {
    id: "prop-3",
    title: "Mojave Mirror Lot",
    description: "Stunning desert landscape with unique rock formations. Perfect for a minimalist concrete residence that blends with the horizon.",
    location: "Joshua Tree, CA",
    address: "Formation Dr, Joshua Tree, CA 92252",
    price: 320000,
    size: 5.0,
    sizeUnit: "acres",
    type: "desert",
    status: "available",
    has3D: true,
    model3DUrl: "/models/modern_house.glb",
    generationStatus: "completed",
    images: ["https://images.unsplash.com/photo-1502318217862-aa4e294ba657", "https://images.unsplash.com/photo-1509316785289-025f54846b6a"],
    features: ["Rock Formations", "Stellar Stargazing", "Solar Potential"],
    ownerId: "owner-1",
    ownerName: "Alexander Vance",
    createdAt: "2026-02-15T09:00:00Z",
    featured: false
  },
  {
    id: "prop-4",
    title: "Emerald Valley Rural",
    description: "Rich, fertile soil in a quiet valley. Currently operating as a small organic farm. Perfect for those looking to expand agricultural ventures.",
    location: "Portland, OR",
    address: "88 Valley Rd, Hillsboro, OR 97123",
    price: 540000,
    size: 12.0,
    sizeUnit: "acres",
    type: "rural",
    status: "pending",
    has3D: false,
    generationStatus: "none", // Tests the "Generate 3D" CTA
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef", "https://images.unsplash.com/photo-1444858291040-58f756a3bcd6"],
    features: ["Fertile Soil", "Stable Barn", "Well Access", "Fully Fenced"],
    ownerId: "owner-3",
    ownerName: "Green Pastures Ltd",
    createdAt: "2026-03-12T11:20:00Z",
    featured: false
  },
  {
    id: "prop-5",
    title: "Skyline Urban Infill",
    description: "Prime downtown corner lot zoned for mixed-use development. Rare opportunity in a high-density area with heavy foot traffic.",
    location: "Austin, TX",
    address: "402 E 6th St, Austin, TX 78701",
    price: 2100000,
    size: 0.25,
    sizeUnit: "acres",
    type: "urban",
    status: "available",
    has3D: true,
    model3DUrl: "/models/modern_house.glb",
    generationStatus: "completed",
    images: ["https://images.unsplash.com/photo-1477959858617-67f85cf4f1df", "https://images.unsplash.com/photo-1449824913935-59a10b8d2000"],
    features: ["Mixed-use Zoning", "Corner Lot", "Utilities at Site"],
    ownerId: "owner-2",
    ownerName: "Sierra Heights Dev",
    createdAt: "2026-01-20T16:45:00Z",
    featured: false
  }
];

export const professionals: Professional[] = [
  {
    id: "prof-1",
    name: "Sarah Chen",
    email: "sarah.chen@vision.com",
    profession: "architect",
    specialty: "Modern Minimalism",
    bio: "Award-winning architect specialized in glass and steel structures that harmonize with natural landscapes.",
    rating: 4.9,
    reviewCount: 42,
    location: "San Francisco, CA",
    hourlyRate: 185,
    portfolioUrl: "https://portfolio.sarahchen.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    verified: true,
    completedProjects: 28
  },
  {
    id: "prof-2",
    name: "Michael Torres",
    email: "m.torres@build.com",
    profession: "contractor",
    specialty: "High-End Residential",
    bio: "20 years of experience building luxury homes in challenging terrains, from cliffside villas to desert retreats.",
    rating: 4.8,
    reviewCount: 156,
    location: "Los Angeles, CA",
    hourlyRate: 120,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    verified: true,
    completedProjects: 114
  },
  {
    id: "prof-3",
    name: "Emily Watson",
    email: "emily@design.com",
    profession: "designer",
    specialty: "Sustainable Interiors",
    bio: "Focusing on biophilic design and carbon-neutral materials to create living spaces that breathe.",
    rating: 5.0,
    reviewCount: 18,
    location: "Seattle, WA",
    hourlyRate: 95,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    verified: false,
    completedProjects: 9
  }
];

export const floorPlans: FloorPlan[] = [
  {
    id: "plan-1",
    architectId: "prof-1",
    architectName: "Sarah Chen",
    title: "The Glass Pavilion",
    description: "An open-concept 3-bedroom masterpiece with floor-to-ceiling windows and a central courtyard.",
    price: 450,
    sqft: 2800,
    bedrooms: 3,
    bathrooms: 3.5,
    style: "Modern",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    rating: 4.9,
    downloads: 124
  },
  {
    id: "plan-2",
    architectId: "prof-1",
    architectName: "Sarah Chen",
    title: "Desert Mirage",
    description: "Compact but luxurious 2-bedroom design optimized for thermal mass and natural cooling.",
    price: 299,
    sqft: 1600,
    bedrooms: 2,
    bathrooms: 2,
    style: "Minimalist",
    image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
    rating: 4.7,
    downloads: 86
  },
  {
    id: "plan-3",
    architectId: "prof-3",
    architectName: "Emily Watson",
    title: "Eco-Nest",
    description: "A tiny-home concept that maximizes every inch of space while maintaining a high-end feel.",
    price: 150,
    sqft: 650,
    bedrooms: 1,
    bathrooms: 1,
    style: "Sustainable",
    image: "https://images.unsplash.com/photo-1449156003053-930cce580dd0",
    rating: 5.0,
    downloads: 210
  }
];

export function getPropertyById(id: string): Property | undefined {
  return properties.find(p => p.id === id)
}

export function getProfessionalById(id: string): Professional | undefined {
  return professionals.find(p => p.id === id)
}

export function getFloorPlanById(id: string): FloorPlan | undefined {
  return floorPlans.find(p => p.id === id)
}
