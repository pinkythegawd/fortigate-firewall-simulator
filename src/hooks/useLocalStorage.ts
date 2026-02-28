import { useState, useEffect, useCallback } from 'react';
import type { BlockPageConfig } from '@/types';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Get stored value or use initial
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [initialValue, key]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Hook for managing saved profiles
export interface SavedProfile {
  id: string;
  name: string;
  createdAt: string;
  config: BlockPageConfig;
}

export function useSavedProfiles() {
  const [profiles, setProfiles] = useLocalStorage<SavedProfile[]>('firewall-simulator-profiles', []);

  const saveProfile = useCallback((name: string, config: BlockPageConfig) => {
    const newProfile: SavedProfile = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      config,
    };
    setProfiles(prev => [...prev, newProfile]);
    return newProfile.id;
  }, [setProfiles]);

  const loadProfile = useCallback((id: string): SavedProfile | undefined => {
    return profiles.find(p => p.id === id);
  }, [profiles]);

  const deleteProfile = useCallback((id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
  }, [setProfiles]);

  const updateProfile = useCallback((id: string, updates: Partial<SavedProfile>) => {
    setProfiles(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  }, [setProfiles]);

  return {
    profiles,
    saveProfile,
    loadProfile,
    deleteProfile,
    updateProfile,
  };
}

// Hook for managing access requests
export interface AccessRequest {
  id: string;
  ticketId: string;
  url: string;
  category: string;
  reason: string;
  requesterName: string;
  requesterEmail: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'denied';
}

export function useAccessRequests() {
  const [requests, setRequests] = useLocalStorage<AccessRequest[]>('firewall-simulator-requests', []);

  const addRequest = useCallback((request: Omit<AccessRequest, 'id' | 'ticketId' | 'timestamp' | 'status'>) => {
    const newRequest: AccessRequest = {
      ...request,
      id: Date.now().toString(),
      ticketId: `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  }, [setRequests]);

  const updateRequestStatus = useCallback((id: string, status: 'pending' | 'approved' | 'denied') => {
    setRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status } : r
    ));
  }, [setRequests]);

  const deleteRequest = useCallback((id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  }, [setRequests]);

  const clearAllRequests = useCallback(() => {
    setRequests([]);
  }, [setRequests]);

  return {
    requests,
    addRequest,
    updateRequestStatus,
    deleteRequest,
    clearAllRequests,
  };
}
