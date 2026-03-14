import { properties, professionals } from "./data";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

type RequestOptions = {
  headers?: Record<string, string>;
  body?: any;
  method?: string;
  isMultipart?: boolean;
};

// Simple in-memory mock store
let mockFavorites: string[] = ["prop-1", "prop-3"];
let currentMockRole: "buyer" | "owner" | "professional" = "owner"; // Default for dev

async function mockRequest(path: string, options: RequestOptions = {}) {
  console.log(`[MOCK API] ${options.method || 'GET'} ${path}`, options.body);
  
  await new Promise(resolve => setTimeout(resolve, 500));

  // User Mocks
  if (path === '/users/me') {
    return {
      id: 1,
      email: "john.doe@terravision.com",
      full_name: "John Doe",
      role: currentMockRole,
      is_active: true
    };
  }

  if (path === '/auth/login') return { access_token: 'mock-jwt-token', token_type: 'bearer' };
  
  // Favorites Mocks
  if (path === '/favorites' || path === '/favorites/') {
    if (options.method === 'POST') {
      const id = options.body?.property_id;
      if (id && !mockFavorites.includes(id)) mockFavorites.push(id);
      return { status: 'success' };
    }
    return properties.filter(p => mockFavorites.includes(p.id)).map(p => ({
      id: parseInt(p.id.split('-')[1]) || Math.floor(Math.random() * 1000),
      property_id: p.id,
      title: p.title,
      location: p.location,
      price: p.price,
      image_url: p.images[0]
    }));
  }

  // Analytics Mocks
  if (path === '/analytics/overview') {
    if (currentMockRole === 'owner') {
      return {
        stats: [
          { label: "Property Views", value: "1,284", change: "+12%", trend: "up" },
          { label: "Active Inquiries", value: "14", change: "+3", trend: "up" },
          { label: "Avg. Time to 3D", value: "42s", change: "-5s", trend: "up" },
          { label: "Total Revenue", value: "$450k", change: "+$120k", trend: "up" }
        ],
        chartData: [
          { name: "Mon", value: 400 }, { name: "Tue", value: 300 }, { name: "Wed", value: 600 },
          { name: "Thu", value: 800 }, { name: "Fri", value: 500 }, { name: "Sat", value: 900 }, { name: "Sun", value: 1000 }
        ]
      };
    }
    if (currentMockRole === 'professional') {
      return {
        stats: [
          { label: "Profile Reach", value: "856", change: "+18%", trend: "up" },
          { label: "New Bookings", value: "5", change: "+2", trend: "up" },
          { label: "Active Projects", value: "3", change: "Stable", trend: "neutral" },
          { label: "Total Earned", value: "$12.5k", change: "+$2.1k", trend: "up" }
        ]
      };
    }
    return {
      stats: [
        { label: "Properties Saved", value: "12", change: "+2", trend: "up" },
        { label: "Architects Hired", value: "1", change: "New", trend: "up" },
        { label: "Floor Plans", value: "3", change: "+1", trend: "up" },
        { label: "Virtual Tours", value: "45", change: "+12", trend: "up" }
      ]
    };
  }

  // Rest of mocks... (Properties, Professionals, Messages)
  if (path === '/properties/' || path === '/properties') {
    return properties.map(p => ({
      id: parseInt(p.id.split('-')[1]) || Math.floor(Math.random() * 1000),
      owner_id: 1, title: p.title, description: p.description, location: p.location, price: p.price,
      land_size: p.size, image_url: p.images[0], is_model_generated: p.has3D,
      model_3d_url: p.model3DUrl, created_at: p.createdAt,
      images: p.images.map((url, i) => ({ id: i, url, image_type: 'other' }))
    }));
  }

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
  const response = await fetch(url, { method: options.method || 'GET', headers, body });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(errorData.detail || response.statusText);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const apiClient = {
  get: (path: string, options: Omit<RequestOptions, 'method'> = {}) => request(path, { ...options, method: 'GET' }),
  post: (path: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => request(path, { ...options, method: 'POST', body }),
  put: (path: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => request(path, { ...options, method: 'PUT', body }),
  patch: (path: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path: string, options: Omit<RequestOptions, 'method'> = {}) => request(path, { ...options, method: 'DELETE' }),
};
