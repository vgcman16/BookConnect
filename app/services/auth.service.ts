import { Observable } from '@nativescript/core/data/observable';
import { ApplicationSettings } from '@nativescript/core';

export interface User {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export class AuthService extends Observable {
    private static instance: AuthService;
    private readonly TOKEN_KEY = 'auth_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly USER_KEY = 'current_user';
    private _currentUser: User | null = null;

    private constructor() {
        super();
        this.loadStoredUser();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    get currentUser(): User | null {
        return this._currentUser;
    }

    set currentUser(value: User | null) {
        if (this._currentUser !== value) {
            this._currentUser = value;
            if (value) {
                ApplicationSettings.setString(this.USER_KEY, JSON.stringify(value));
            } else {
                ApplicationSettings.remove(this.USER_KEY);
            }
            this.notifyPropertyChange('currentUser', value);
        }
    }

    async signUp(email: string, password: string, displayName: string): Promise<User> {
        try {
            // TODO: Implement actual API call
            const mockUser: User = {
                id: Math.random().toString(36).substring(7),
                email,
                displayName
            };

            // Mock successful signup
            const response: AuthResponse = {
                user: mockUser,
                token: 'mock_token',
                refreshToken: 'mock_refresh_token'
            };

            await this.handleAuthSuccess(response);
            return response.user;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    async signIn(email: string, password: string): Promise<User> {
        try {
            // TODO: Implement actual API call
            const mockUser: User = {
                id: Math.random().toString(36).substring(7),
                email,
                displayName: email.split('@')[0]
            };

            // Mock successful login
            const response: AuthResponse = {
                user: mockUser,
                token: 'mock_token',
                refreshToken: 'mock_refresh_token'
            };

            await this.handleAuthSuccess(response);
            return response.user;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    async signInWithGoogle(): Promise<User> {
        try {
            // TODO: Implement Google OAuth
            const mockUser: User = {
                id: Math.random().toString(36).substring(7),
                email: 'google@example.com',
                displayName: 'Google User',
                photoURL: 'https://example.com/photo.jpg'
            };

            const response: AuthResponse = {
                user: mockUser,
                token: 'mock_google_token',
                refreshToken: 'mock_google_refresh_token'
            };

            await this.handleAuthSuccess(response);
            return response.user;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    async signInWithFacebook(): Promise<User> {
        try {
            // TODO: Implement Facebook OAuth
            const mockUser: User = {
                id: Math.random().toString(36).substring(7),
                email: 'facebook@example.com',
                displayName: 'Facebook User',
                photoURL: 'https://example.com/photo.jpg'
            };

            const response: AuthResponse = {
                user: mockUser,
                token: 'mock_facebook_token',
                refreshToken: 'mock_facebook_refresh_token'
            };

            await this.handleAuthSuccess(response);
            return response.user;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    async signOut(): Promise<void> {
        try {
            // TODO: Implement API call to invalidate token
            await this.clearAuthData();
        } catch (error) {
            console.error('Error during sign out:', error);
            // Still clear local auth data even if API call fails
            await this.clearAuthData();
        }
    }

    isAuthenticated(): boolean {
        return !!this.currentUser && !!this.getStoredToken();
    }

    // Private helper methods
    private async handleAuthSuccess(response: AuthResponse): Promise<void> {
        await this.storeTokens(response.token, response.refreshToken);
        this.currentUser = response.user;
    }

    private handleAuthError(error: any): Error {
        console.error('Auth error:', error);
        return new Error(error.message || 'Authentication failed');
    }

    private storeTokens(token: string, refreshToken: string): void {
        ApplicationSettings.setString(this.TOKEN_KEY, token);
        ApplicationSettings.setString(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    private getStoredToken(): string | null {
        return ApplicationSettings.getString(this.TOKEN_KEY);
    }

    private async clearAuthData(): Promise<void> {
        ApplicationSettings.remove(this.TOKEN_KEY);
        ApplicationSettings.remove(this.REFRESH_TOKEN_KEY);
        ApplicationSettings.remove(this.USER_KEY);
        this.currentUser = null;
    }

    private loadStoredUser(): void {
        const storedUser = ApplicationSettings.getString(this.USER_KEY);
        if (storedUser) {
            try {
                this._currentUser = JSON.parse(storedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                this.clearAuthData();
            }
        }
    }
}
