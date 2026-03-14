import { properties, professionals, floorPlans } from "./data";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

type RequestOptions = {
  headers?: Record<string, string>;
  body?: any;
  method?: string;
  isMultipart?: boolean;
};

// State for Mock Mode
let mockFavorites: string[] = ["prop-1", "prop-3"];
// Roles for testing: "buyer" | "owner" | "professional"
let currentMockRole: "buyer" | "owner" | "professional" = "owner"; 

async function mockRequest(path: string, options: RequestOptions = {}) {
  console.log(`[STATED MOCK API] ${options.method || 'GET'} ${path}`, options.body);
  
  await new Promise(resolve => setTimeout(resolve, 400));

  // 1. Auth/User Mocks
  if (path === '/auth/login') return { access_token: 'mock-jwt-token', token_type: 'bearer' };
  
  if (path === '/auth/me') {
    return {
      id: 1,
      email: `${currentMockRole}@test.com`,
      full_name: currentMockRole === 'owner' ? "Alexander Vance" : currentMockRole === 'professional' ? "Sarah Chen" : "John Doe",
      role: currentMockRole,
      is_active: true
    };
  }

  // 2. Analytics Mocks (Role-Aware)
  if (path === '/analytics/overview') {
    if (currentMockRole === 'owner') {
      return {
        stats: [
          { label: "Total Views", value: "1,284", change: "+12%", trend: "up" },
          { label: "Active Listings", value: "3", change: "+1", trend: "up" },
          { label: "Inquiries", value: "14", change: "+3", trend: "up" },
          { label: "Revenue", value: "$450k", change: "+$120k", trend: "up" }
        ]
      };
    } else if (currentMockRole === 'professional') {
      return {
        stats: [
          { label: "Profile Reach", value: "856", icon: "users", change: "+18%", trend: "up" },
          { label: "New Bookings", value: "5", icon: "sparkles", change: "+2", trend: "up" },
          { label: "Avg. Rating", value: "4.9", icon: "star", change: "Stable", trend: "neutral" },
          { label: "Total Earned", value: "$12.5k", icon: "zap", change: "+$2.1k", trend: "up" }
        ]
      };
    } else {
      return {
        stats: [
          { label: "Properties Saved", value: mockFavorites.length.toString(), change: "+2", trend: "up" },
          { label: "My Library", value: "3", change: "+1", trend: "up" },
          { label: "Active Chats", value: "5", change: "Stable", trend: "neutral" },
          { label: "Architects Hired", value: "1", change: "New", trend: "up" }
        ]
      };
    }
  }

  // 3. Properties Mocks
  if (path === '/properties/' || path === '/properties') {
    return properties.map(p => ({
      id: parseInt(p.id.split('-')[1]) || 1,
      owner_id: p.ownerId === 'owner-1' ? 1 : 2,
      title: p.title,
      description: p.description,
      location: p.location,
      price: p.price,
      land_size: p.size,
      image_url: p.images[0],
      is_model_generated: p.has3D,
      model_3d_url: p.model3DUrl,
      created_at: p.createdAt,
      images: p.images.map((url, i) => ({ id: i, url, image_type: 'other' }))
    }));
  }

  // 4. Professionals Mocks
  if (path === '/professionals/' || path === '/professionals') {
    return professionals.map(p => ({
      id: parseInt(p.id.split('-')[1]) || 1,
      user_id: 1,
      profession: p.profession,
      bio: p.bio,
      portfolio_url: p.portfolioUrl,
      hourly_rate: p.hourlyRate,
      user: { id: 1, email: p.email, full_name: p.name, role: 'professional', is_active: true }
    }));
  }

  // 5. Floor Plans Mocks
  if (path === '/floor-plans/' || path === '/floor-plans') {
    return floorPlans.map(p => ({
      ...p,
      image_url: p.image,
      file_url: "#"
    }));
  }

  // 6. Favorites Mocks
  if (path === '/favorites' || path === '/favorites/') {
    if (options.method === 'POST') {
      const id = options.body?.property_id;
      if (id && !mockFavorites.includes(id)) mockFavorites.push(id);
      return { status: 'success' };
    }
    return properties.filter(p => mockFavorites.includes(p.id)).map(p => ({
      id: parseInt(p.id.split('-')[1]) || 1,
      property_id: p.id,
      title: p.title,
      location: p.location,
      price: p.price,
      image_url: p.images[0]
    }));
  }

  // 7. Messaging Mocks
  if (path === '/messages/conversations') {
    return [
      { id: 1, name: "Sarah Chen", role: "Architect", avatar: "SC", lastMessage: "I'd love to discuss the floor plan...", time: "2m ago", unread: 2 },
      { id: 2, name: "Michael Torres", role: "Contractor", avatar: "MT", lastMessage: "The quote is ready.", time: "1h ago", unread: 0 },
    ];
  }

  return {};
}

async function request(path: string, options: RequestOptions = {}) {
  if (IS_MOCK) return mockRequest(path, options);

  const url = `${BASE_URL}${path}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let body = options.body;
  if (body && !options.isMultipart) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, { method: options.method || 'GET', headers, body });
    if (!response.ok) {
      if (response.status === 404 || response.status === 405) return mockRequest(path, options);
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || response.statusText);
    }
    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    console.error(`API Error on ${path}:`, error);
    return mockRequest(path, options);
  }
}

export const apiClient = {
  get: (path: string, options: Omit<RequestOptions, 'method'> = {}) => request(path, { ...options, method: 'GET' }),
  post: (path: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => request(path, { ...options, method: 'POST', body }),
  put: (path: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => request(path, { ...options, method: 'PUT', body }),
  patch: (path: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path: string, options: Omit<RequestOptions, 'method'> = {}) => request(path, { ...options, method: 'DELETE' }),
  // Dev tool helper to switch roles in mock mode
  setMockRole: (role: "buyer" | "owner" | "professional") => { currentMockRole = role; }
};
