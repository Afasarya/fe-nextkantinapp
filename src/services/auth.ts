import { api } from './api';
import { LoginDTO, LoginResponse, RegisterStandDTO, RegisterStudentDTO, User } from '@/types/auth';

class AuthService {
    private TOKEN_KEY = 'token';
    private USER_KEY = 'user';

    async login(data: LoginDTO): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('/login', data);
            if (response.data.status === 'success' && response.data.data) {
                localStorage.setItem(this.TOKEN_KEY, response.data.data.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.data.user));
            }
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Terjadi kesalahan saat login');
        }
    }

    async registerStudent(data: RegisterStudentDTO): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('api/register', {
                ...data,
                role: 'student'
            });
            if (response.data.status === 'success' && response.data.data) {
                localStorage.setItem(this.TOKEN_KEY, response.data.data.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.data.user));
            }
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Terjadi kesalahan saat registrasi');
        }
    }

    async registerStand(data: RegisterStandDTO): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('api/register', {
                ...data,
                role: 'stand'
            });
            if (response.data.status === 'success' && response.data.data) {
                localStorage.setItem(this.TOKEN_KEY, response.data.data.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.data.user));
            }
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Terjadi kesalahan saat registrasi');
        }
    }

    async logout(): Promise<void> {
        try {
            await api.post('api/logout');
            this.clearAuth();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Terjadi kesalahan saat logout');
        }
    }

    async getUser(): Promise<User | null> {
        try {
            const response = await api.get('/me');
            if (response.data.status === 'success' && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getUserFromStorage(): User | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    clearAuth(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    hasRole(user: User | null, role: string): boolean {
        if (!user) return false;
        return user.role.toLowerCase() === role.toLowerCase();
    }

    isStandOwner(user: User | null): boolean {
        return this.hasRole(user, 'stand');
    }

    isStudent(user: User | null): boolean {
        return this.hasRole(user, 'student');
    }
}

export const authService = new AuthService();
