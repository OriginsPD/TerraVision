import { properties, professionals } from "./data";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

type RequestOptions = {
  headers?: Record<string, string>;
  body?: any;
  method?: string;
  isMultipart?: boolean;
};

async function mockRequest(path: string, options: RequestOptions = {}) {
  console.log(`[MOCK API] ${options.method || 'GET'} ${path}`, options.body);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Auth Mocks
  if (path === '/auth/login') {
    return { access_token: 'mock-jwt-token', token_type: 'bearer' };
  }
  if (path === '/auth/register') {
    return { id: 1, email: options.body?.email, full_name: options.body?.full_name, role: options.body?.role };
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
      user: {
        id: 1,
        email: p.email,
        full_name: p.name,
        role: 'professional',
        is_active: true
      }
    }));
  }

  return {};
}

async function request(path: string, options: RequestOptions = {}) {
  if (IS_MOCK) {
    return mockRequest(path, options);
  }

  const url = `${BASE_URL}${path}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body = options.body;
  if (body && !options.isMultipart) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(errorData.detail || response.statusText);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const apiClient = {
  get: (path: string, options: Omit<RequestOptions, 'method'> = {}) =>
    request(path, { ...options, method: 'GET' }),
  post: (path: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request(path, { ...options, method: 'POST', body }),
  put: (path: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request(path, { ...options, method: 'PUT', body }),
  patch: (path: string, body: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    request(path, { ...options, method: 'PATCH', body }),
  delete: (path: string, options: Omit<RequestOptions, 'method'> = {}) =>
    request(path, { ...options, method: 'DELETE' }),
};
