import { properties, professionals } from "./data";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
// In "Hybrid" mode, we try real API first, and only mock if it fails or if specifically requested
const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

type RequestOptions = {
  headers?: Record<string, string>;
  body?: any;
  method?: string;
  isMultipart?: boolean;
};

// Simple in-memory mock store
let mockFavorites: string[] = ["prop-1", "prop-3"];

async function mockRequest(path: string, options: RequestOptions = {}) {
  console.log(`[MOCK API FALLBACK] ${options.method || 'GET'} ${path}`, options.body);
  
  await new Promise(resolve => setTimeout(resolve, 300));

  // Analytics Mocks (Backend Missing)
  if (path === '/analytics/overview') {
    return {
      stats: [
        { label: "Market Reach", value: "1,284", change: "+12%", trend: "up" },
        { label: "Saved Items", value: mockFavorites.length.toString(), change: "+3", trend: "up" },
        { label: "3D Projects", value: "4", change: "-5s", trend: "up" },
        { label: "Community Rank", value: "Top 5%", change: "Stable", trend: "up" }
      ]
    };
  }

  // Favorites Mocks (Backend Missing)
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

  if (path.startsWith('/favorites/')) {
    const id = path.split('/')[2];
    mockFavorites = mockFavorites.filter(favId => favId !== id && !favId.endsWith(id));
    return { status: 'deleted' };
  }

  // Messaging Mocks (Backend Missing)
  if (path === '/messages/conversations') {
    return [
      { id: 1, name: "Sarah Chen", role: "Architect", avatar: "SC", lastMessage: "I'd love to discuss the floor plan...", time: "2m ago", unread: 2 },
      { id: 2, name: "Michael Torres", role: "Contractor", avatar: "MT", lastMessage: "The quote is ready.", time: "1h ago", unread: 0 },
    ];
  }

  if (path.startsWith('/messages/conversations/') && path.endsWith('/messages')) {
    return [
      { id: 1, sender: "Sarah Chen", content: "Hi! I saw your Hillside Estate property listing. It looks amazing!", time: "10:30 AM", isOwn: false },
      { id: 2, sender: "You", content: "Thank you! Yes, it has great potential.", time: "10:32 AM", isOwn: true },
    ];
  }

  // Fallback for everything else
  return {};
}

async function request(path: string, options: RequestOptions = {}) {
  // If explicitly in mock mode, skip real API
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
      // If backend returns 404 for unimplemented features, and we are not in strict mode, fallback to mock
      if (response.status === 404 || response.status === 405) {
        return mockRequest(path, options);
      }
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || response.statusText);
    }

    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    // If network error (backend down), fallback to mock for development
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
};
