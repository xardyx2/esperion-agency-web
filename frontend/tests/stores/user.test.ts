import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '~/stores/user';

// Mock the API composable
vi.mock('~/composables/useApi', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    useAuthApi: () => ({
      getCurrentUser: vi.fn().mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'admin',
        username: 'testuser',
        created_at: '2023-01-01',
        updated_at: '2023-01-01'
      })
    })
  };
});

describe('User Store', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it('should initialize with default values', () => {
    const userStore = useUserStore();
    
    expect(userStore.profile).toBeNull();
    expect(userStore.preferences).toEqual({});
    expect(userStore.isLoading).toBe(false);
  });

  it('should have computed getters', () => {
    const userStore = useUserStore();
    
    expect(userStore.userProfile).toBeNull();
    expect(userStore.userPreferences).toEqual({});
    expect(userStore.isProfileLoading).toBe(false);
  });

  it('should fetch user profile', async () => {
    const userStore = useUserStore();
    
    await userStore.fetchProfile();
    
    expect(userStore.profile).not.toBeNull();
    expect(userStore.profile?.email).toBe('test@example.com');
    expect(userStore.isLoading).toBe(false);
  });

  it('should update user preferences', () => {
    const userStore = useUserStore();
    
    const newPrefs = { theme: 'dark', language: 'en', notifications: true };
    userStore.updatePreferences(newPrefs);
    
    expect(userStore.userPreferences).toEqual(newPrefs);
  });

  it('should partially update preferences', () => {
    const userStore = useUserStore();
    
    // Set initial preferences
    userStore.updatePreferences({ theme: 'light', language: 'en' });
    
    // Update only theme
    userStore.updatePreferences({ theme: 'dark' });
    
    // Both preferences should still exist, with theme updated
    expect(userStore.userPreferences).toEqual({ theme: 'dark', language: 'en' });
  });
});