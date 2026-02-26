import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, UserCredentials, RegisterData, StoredUser, UserSession } from '@/types';
import { toast } from 'sonner';

// Simple hash function for passwords (NOT for production - use bcrypt in real apps)
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

// Generate session token
const generateToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
  getAllUsers: () => StoredUser[];
  deleteUser: (userId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'firewall-simulator-users';
const SESSION_KEY = 'firewall-simulator-session';
const CURRENT_USER_KEY = 'firewall-simulator-current-user';

// Default admin account
const DEFAULT_ADMIN: StoredUser = {
  id: 'admin-001',
  email: 'admin@training.local',
  name: 'System Administrator',
  role: 'admin',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  passwordHash: hashPassword('admin123'),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize - check for existing session
  useEffect(() => {
    const initAuth = () => {
      try {
        // Initialize default admin if no users exist
        const existingUsers = localStorage.getItem(USERS_KEY);
        if (!existingUsers) {
          localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
        }

        // Check for active session
        const session = localStorage.getItem(SESSION_KEY);
        const currentUser = localStorage.getItem(CURRENT_USER_KEY);

        if (session && currentUser) {
          const parsedSession: UserSession = JSON.parse(session);
          const parsedUser: User = JSON.parse(currentUser);

          // Check if session is still valid (24 hours)
          if (parsedSession.expiresAt > Date.now()) {
            setUser(parsedUser);
          } else {
            // Clear expired session
            localStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(CURRENT_USER_KEY);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const getUsers = useCallback((): StoredUser[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }, []);

  const saveUsers = useCallback((users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, []);

  const createSession = useCallback((userId: string) => {
    const session: UserSession = {
      userId,
      token: generateToken(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, []);

  const login = useCallback(async (credentials: UserCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const users = getUsers();
      const passwordHash = hashPassword(credentials.password);
      
      const foundUser = users.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase() && 
             u.passwordHash === passwordHash
      );

      if (foundUser) {
        // Update last login
        const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
        const updatedUsers = users.map(u => u.id === foundUser.id ? updatedUser : u);
        saveUsers(updatedUsers);

        // Create session
        const { passwordHash: _, ...userWithoutPassword } = updatedUser;
        setUser(userWithoutPassword);
        createSession(foundUser.id);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getUsers, saveUsers, createSession]);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const users = getUsers();
      
      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        toast.error('An account with this email already exists');
        return false;
      }

      // Create new user
      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        email: data.email.toLowerCase(),
        name: data.name,
        role: data.role || 'trainee',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        passwordHash: hashPassword(data.password),
      };

      saveUsers([...users, newUser]);
      
      // Auto-login after registration
      const { passwordHash: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      createSession(newUser.id);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getUsers, saveUsers, createSession]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    toast.success('Logged out successfully');
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (!user) return;

    const users = getUsers();
    const updatedUser = { ...user, ...updates };
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...updates } : u
    );
    
    saveUsers(updatedUsers);
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    toast.success('Profile updated successfully');
  }, [user, getUsers, saveUsers]);

  const changePassword = useCallback((oldPassword: string, newPassword: string): boolean => {
    if (!user) return false;

    const users = getUsers();
    const storedUser = users.find(u => u.id === user.id);
    
    if (!storedUser || storedUser.passwordHash !== hashPassword(oldPassword)) {
      toast.error('Current password is incorrect');
      return false;
    }

    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, passwordHash: hashPassword(newPassword) } : u
    );
    
    saveUsers(updatedUsers);
    toast.success('Password changed successfully');
    return true;
  }, [user, getUsers, saveUsers]);

  const getAllUsers = useCallback((): StoredUser[] => {
    return getUsers();
  }, [getUsers]);

  const deleteUser = useCallback((userId: string): boolean => {
    if (userId === 'admin-001') {
      toast.error('Cannot delete the default admin account');
      return false;
    }

    const users = getUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    toast.success('User deleted successfully');
    return true;
  }, [getUsers, saveUsers]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    getAllUsers,
    deleteUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth(allowedRoles?: string[]) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const hasAccess = isAuthenticated && (
    !allowedRoles || allowedRoles.includes(user?.role || '')
  );

  return { user, isAuthenticated, isLoading, hasAccess };
}
