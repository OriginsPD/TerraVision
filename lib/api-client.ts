import { properties, professionals } from "./data";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

type RequestOptions = {
  headers?: Record<string, string>;
  body?: any;
  method?: string;
  isMultipart?: boolean;
};

// Simple in-memory mock store for favorites during session
let mockFavorites: string[] = ["prop-1", "prop-3"];

async function mockRequest(path: string, options: RequestOptions = {}) {
  console.log(`[MOCK API] ${options.method || 'GET'} ${path}`, options.body);
  
  await new Promise(resolve => setTimeout(resolve, 500));

  // Auth Mocks
  if (path === '/auth/login') return { access_token: 'mock-jwt-token', token_type: 'bearer' };
  if (path === '/auth/register') return { id: 1, email: options.body?.email, full_name: options.body?.full_name, role: options.body?.role };

  // Favorites Mocks
  if (path === '/favorites' || path === '/favorites/') {
    if (options.method === 'POST') {
      const id = options.body?.property_id;
      if (id && !mockFavorites.includes(id)) mockFavorites.push(id);
      return { status: 'success' };
    }
    // Return full property objects for favorites
    return properties.filter(p => mockFavorites.includes(p.id)).map(p => ({
      id: parseInt(p.id.split('-')[1]) || Math.floor(Math.random() * 1000),
      property_id: p.id,
      title: p.title,
      location: p.location,
      price: p.price,
      image_url: p.images[0]
    }));
  }

  if (path.startsWith('/favorites/')) {
    const id = path.split('/')[2];
    mockFavorites = mockFavorites.filter(favId => favId !== id && !favId.endsWith(id));
    return { status: 'deleted' };
  }

  // Properties Mocks
  if (path === '/properties/' || path === '/properties') {
    return properties.map(p => ({
      id: parseInt(p.id.split('-')[1]) || Math.floor(Math.random() * 1000),
      owner_id: 1,
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

  if (path.startsWith('/properties/')) {
    const id = path.split('/')[2];
    const p = properties.find(prop => prop.id === `prop-${id}` || prop.id === id) || properties[0];
    return {
      id: parseInt(id) || 1,
      owner_id: 1,
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
    };
  }

  // Professionals Mocks
  if (path === '/professionals/' || path === '/professionals') {
    return professionals.map(p => ({
      id: parseInt(p.id.split('-')[1]) || Math.floor(Math.random() * 1000),
      user_id: 1,
      profession: p.profession,
      bio: p.bio,
      portfolio_url: p.portfolioUrl,
      hourly_rate: p.hourlyRate,
      user: { id: 1, email: p.email, full_name: p.name, role: 'professional', is_active: true }
    }));
  }

  // Messaging Mocks
  if (path === '/messages/conversations') {
    return [
      { id: 1, name: "Sarah Chen", role: "Architect", avatar: "SC", lastMessage: "I'd love to discuss the floor plan...", time: "2m ago", unread: 2 },
      { id: 2, name: "Michael Torres", role: "Contractor", avatar: "MT", lastMessage: "The quote is ready.", time: "1h ago", unread: 0 },
      { id: 3, name: "Emily Watson", role: "Designer", avatar: "EW", lastMessage: "Great! I'll send concepts.", time: "3h ago", unread: 1 },
    ];
  }

  if (path.startsWith('/messages/conversations/') && path.endsWith('/messages')) {
    return [
      { id: 1, sender: "Sarah Chen", content: "Hi! I saw your Hillside Estate property listing. It looks amazing!", time: "10:30 AM", isOwn: false },
      { id: 2, sender: "You", content: "Thank you! Yes, it has great potential.", time: "10:32 AM", isOwn: true },
      { id: 3, sender: "Sarah Chen", content: "I'd love to discuss the floor plan for your property.", time: "10:40 AM", isOwn: false },
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
