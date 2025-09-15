// API Configuration and utilities
import { config } from './config';

const API_BASE_URL = config.api.baseURL;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base API client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific error cases
        if (response.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          throw new ApiError(
            response.status,
            'Authentication required. Please log in again.',
            errorData
          );
        } else if (response.status === 403) {
          // Forbidden - user doesn't have permission
          throw new ApiError(
            response.status,
            'Access denied. You do not have permission to access this resource.',
            errorData
          );
        } else if (response.status === 404) {
          // Not found
          throw new ApiError(
            response.status,
            'Resource not found.',
            errorData
          );
        } else if (response.status >= 500) {
          // Server error
          throw new ApiError(
            response.status,
            'Server error. Please try again later.',
            errorData
          );
        }
        
        throw new ApiError(
          response.status,
          errorData.message || `HTTP error! status: ${response.status}`,
          errorData
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error. Please check your connection.', error);
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${endpoint}${queryString}`);
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload
  async upload<T>(endpoint: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('authToken');
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (error) {
            reject(new ApiError(xhr.status, 'Invalid JSON response'));
          }
        } else {
          reject(new ApiError(xhr.status, xhr.statusText));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new ApiError(0, 'Network error'));
      });

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Auth utilities
export const auth = {
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },
  
  getToken: () => {
    return localStorage.getItem('authToken');
  },
  
  removeToken: () => {
    localStorage.removeItem('authToken');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// API endpoints - Updated to match Laravel backend routes
export const endpoints = {
  // Auth
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/email/verification-notification',
  },
  
  // Users
  users: {
    profile: '/profile',
    updateProfile: '/profile',
    changePassword: '/users/change-password',
    uploadAvatar: '/users/avatar',
  },
  
  // Projects
  projects: {
    list: '/userprojects',
    create: '/userprojects',
    get: (id: string) => `/userprojects/${id}`,
    update: (id: string) => `/userprojects/${id}`,
    delete: (id: string) => `/userprojects/${id}`,
    status: (id: string) => `/userprojects/${id}/status`,
  },
  
  // Service Requests
  serviceRequests: {
    list: '/user_service-requests',
    create: '/user_service-requests',
    get: (id: string) => `/user_service-requests/${id}`,
    update: (id: string) => `/user_service-requests/${id}`,
    delete: (id: string) => `/user_service-requests/${id}`,
    status: (id: string) => `/user_service-requests/${id}/status`,
  },
  
  // Messages
  messages: {
    list: '/usermessages',
    create: '/usermessages',
    get: (id: string) => `/usermessages/${id}`,
    delete: (id: string) => `/usermessages/${id}`,
    markRead: (id: string) => `/usermessages/${id}/read`,
  },
  
  // Blog
  blog: {
    list: '/blog',
    create: '/blog',
    get: (id: string) => `/blog/${id}`,
    update: (id: string) => `/blog/${id}`,
    delete: (id: string) => `/blog/${id}`,
    like: (id: string) => `/blog/${id}/increment-likes`,
    view: (id: string) => `/blog/${id}/increment-views`,
  },
  
  // Admin
  admin: {
    users: '/users',
    user: (id: string) => `/users/${id}`,
    projects: '/admin/projects',
    project: (id: string) => `/admin/projects/${id}`,
    serviceRequests: '/admin/services',
    serviceRequest: (id: string) => `/admin/services/${id}`,
    messages: '/admin/messages',
    message: (id: string) => `/admin/messages/${id}`,
    blog: '/blogs',
    blogPost: (id: string) => `/blogs/${id}`,
    analytics: '/overview',
    team: '/team-members',
    teamMember: (id: string) => `/team-members/${id}`,
  },
  
  // Notifications
  notifications: {
    list: '/notifications',
    create: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    unreadCount: '/notifications/unread-count',
  },
  
  // Contact
  contact: {
    submit: '/contact',
  },
  
  // File upload
  upload: {
    image: '/upload/image',
    document: '/upload/document',
  }
};
