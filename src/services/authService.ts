import { UserProfile } from '../types';
import { LocalStorageService } from './storageService';

// Authentication service abstraction supporting Email/Password, Google OAuth simulation, and Local Persistence
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

type AuthCallback = (user: UserProfile | null) => void;

class AuthService {
  private listeners: AuthCallback[] = [];
  private currentUser: UserProfile | null = null;

  constructor() {
    this.currentUser = LocalStorageService.getUser();
  }

  onAuthStateChanged(callback: AuthCallback): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify() {
    LocalStorageService.setUser(this.currentUser);
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  async loginWithEmail(email: string, _password: string): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 400));
    const name = email.split('@')[0] || 'User';
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    const user: UserProfile = {
      uid: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: capitalizedName,
      email: email.toLowerCase(),
      currency: 'THB',
      language: 'en',
      monthlyIncomeTarget: 80000,
      monthlySavingsTarget: 25000,
      darkMode: false,
      createdAt: new Date().toISOString()
    };
    this.currentUser = user;
    this.notify();
    return user;
  }

  async registerWithEmail(name: string, email: string, _password: string): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 450));
    const user: UserProfile = {
      uid: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      currency: 'THB',
      language: 'en',
      monthlyIncomeTarget: 70000,
      monthlySavingsTarget: 20000,
      darkMode: false,
      createdAt: new Date().toISOString()
    };
    this.currentUser = user;
    this.notify();
    return user;
  }

  async loginWithGoogle(): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 500));
    const user: UserProfile = {
      uid: 'google_user_87214',
      name: 'Google User',
      email: 'user.google@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      currency: 'THB',
      language: 'en',
      monthlyIncomeTarget: 85000,
      monthlySavingsTarget: 30000,
      darkMode: false,
      createdAt: new Date().toISOString()
    };
    this.currentUser = user;
    this.notify();
    return user;
  }

  async sendPasswordResetEmail(email: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 400));
    console.log(`Password reset instructions sent to ${email}`);
    return true;
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.currentUser) throw new Error('Not logged in');
    this.currentUser = {
      ...this.currentUser,
      ...updates
    };
    this.notify();
    return this.currentUser;
  }

  async logout(): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    this.currentUser = null;
    this.notify();
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }
}

export const authService = new AuthService();
