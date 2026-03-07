import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { User } from '~/types/api';

// Mock the API composable
vi.mock('~/composables/useApi', () => ({
  useAuthApi: () => ({
    login: vi.fn().mockResolvedValue({
      token: 'mock-token',
      user: {
        id: '1',
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'admin',
        username: 'testuser',
        created_at: '2023-01-01',
        updated_at: '2023-01-01'
      } as User,
    }),
    register: vi.fn().mockResolvedValue({
      token: 'mock-register-token',
      user: {
        id: '2',
        email: 'newuser@example.com',
        full_name: 'New User',
        role: 'editor',
        username: 'newuser',
        created_at: '2023-01-01',
        updated_at: '2023-01-01'
      } as User,
    }),
    logout: vi.fn().mockResolvedValue({}),
    refreshToken: vi.fn().mockResolvedValue({
      token: 'refreshed-token',
      user: {
        id: '1',
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'admin',
        username: 'testuser',
        created_at: '2023-01-01',
        updated_at: '2023-01-01'
      } as User,
    }),
    getCurrentUser: vi.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'admin',
      username: 'testuser',
      created_at: '2023-01-01',
        updated_at: '2023-01-01'
    } as User),
  }),
}));

// Mock useCookie
const mockCookieValue = vi.fn();
const mockCookie = vi.fn().mockReturnValue({ 
  value: mockCookieValue 
});

vi.mock('#app', async () => {
  const actual = await vi.importActual<typeof import('#app')>('#app');
  return {
    ...actual,
    useCookie: mockCookie,
  };
});

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset cookie mock
    mockCookieValue.mockReset();
    
    // Create a fresh Pinia instance
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it('should initialize with default values', () => {
    const authStore = useAuthStore();
    
    expect(authStore.token).toBeNull();
    expect(authStore.refreshToken).toBeNull();
    expect(authStore.user).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBeNull();
  });

  it('should have computed getters', () => {
    const authStore = useAuthStore();
    
    expect(authStore.isLoggedIn).toBe(false);
    expect(authStore.currentUser).toBeNull();
    expect(authStore.authToken).toBeNull();
    expect(authStore.isAuthenticating).toBe(false);
  });

  it('should login successfuly and update state', async () => {
    const authStore = useAuthStore();
    
    // Perform login
    await authStore.login('test@example.com', 'password');
    
    // Verify state updated correctly
    expect(authStore.token).toBe('mock-token');
    expect(authStore.user).not.toBeNull();
    expect(authStore.user?.email).toBe('test@example.com');
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBeNull();
  });

  it('should handle login error', async () => {
    const { useAuthApi } = await import('~/composables/useApi');
    (useAuthApi() as any).login.mockRejectedValue(new Error('Invalid credentials'));
    
    const authStore = useAuthStore();
    
    // Expect login to throw error
    await expect(authStore.login('test@example.com', 'invalid')).rejects.toThrow('Invalid credentials');
    
    // Verify state reflects error
    expect(authStore.error).toBe('Invalid credentials');
    expect(authStore.isLoading).toBe(false);
  });

  it('should register user successfully', async () => {
    const authStore = useAuthStore();
    
    const userData = {
      email: 'new@example.com',
      password: 'password',
      full_name: 'New User',
      username: 'newuser',
    };
    
    await authStore.register(userData);
    
    // Verify state updated correctly
    expect(authStore.token).toBe('mock-register-token');
    expect(authStore.user).not.toBeNull();
    expect(authStore.user?.email).toBe('new@example.com');
    expect(authStore.isAuthenticated).toBe(true);
  });

  it('should logout user', async () => {
    const authStore = useAuthStore();
    
    // First, login
    await authStore.login('test@example.com', 'password');
    expect(authStore.isAuthenticated).toBe(true);
    
    // Then logout
    await authStore.logout();
    
    // Verify state cleared
    expect(authStore.token).toBeNull();
    expect(authStore.refreshToken).toBeNull();
    expect(authStore.user).toBeNull();
    expect(authStore.isAuthenticated).toBe(false);
  });

  it('should fetch current user', async () => {
    const authStore = useAuthStore();
    
    // Set token (required for fetching user)
    authStore.token = 'some-token';
    
    await authStore.fetchCurrentUser();
    
    expect(authStore.user).not.toBeNull();
    expect(authStore.user?.email).toBe('test@example.com');
  });

  it('should clear error', () => {
    const authStore = useAuthStore();
    
    authStore.error = 'Some error';
    expect(authStore.error).toBe('Some error');
    
    authStore.clearError();
    expect(authStore.error).toBeNull();
  });

  it('should refresh token', async () => {
    const authStore = useAuthStore();
    
    await authStore.refreshToken();
    
    expect(authStore.token).toBe('refreshed-token');
  });
});