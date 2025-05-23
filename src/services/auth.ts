import api from './api';
import { LoginDTO, LoginResponse, RegisterStandDTO, RegisterStudentDTO, User } from '@/types/auth';

class AuthService {
    private TOKEN_KEY = 'token';
    private USER_KEY = 'user';

    async login(data: LoginDTO): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('/api/login', data);
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
            const response = await api.post<LoginResponse>('/api/register', {
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation
            });
            if (response.data.status === 'success' && response.data.data) {
                // Simpan ke localStorage untuk login otomatis
                localStorage.setItem(this.TOKEN_KEY, response.data.data.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.data.user));
                
                // Log untuk debugging
                console.log('Register Student success, saved auth data:', { 
                    token: response.data.data.token,
                    user: response.data.data.user 
                });
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
            const response = await api.post<LoginResponse>('/api/register', {
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                stand_name: data.stand_name,
                stand_slug: data.stand_slug,
                stand_description: data.stand_description
            });
            if (response.data.status === 'success' && response.data.data) {
                // Simpan ke localStorage untuk login otomatis
                localStorage.setItem(this.TOKEN_KEY, response.data.data.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.data.user));
                
                // Log untuk debugging
                console.log('Register Stand success, saved auth data:', { 
                    token: response.data.data.token,
                    user: response.data.data.user 
                });
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
            await api.post('/logout');
            this.clearAuth();
        } catch {
            this.clearAuth();
            throw new Error('Terjadi kesalahan saat logout');
        }
    }

    async getUser(): Promise<User | null> {
        // Coba ambil dari localStorage terlebih dahulu
        const userFromStorage = this.getUserFromStorage();
        if (userFromStorage) {
            return userFromStorage;
        }
        
        // Jika tidak ada di localStorage, baru panggil API
        // Dan tangani jika API gagal tanpa mengarahkan ke login
        try {
            const token = this.getToken();
            if (!token) return null;
            
            console.log('Fetching user data with token:', token);
            const response = await api.get('/api/me');
            
            if (response.data.status === 'success' && response.data.data) {
                // Simpan user yang baru diambil ke localStorage
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.data));
                return response.data.data;
            }
            return null;
        } catch (error) {
            // Jangan redirect ke login, hanya return null
            console.error('Error fetching user:', error);
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

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    hasRole(user: User | null, role: string): boolean {
        if (!user) return false;
        // Periksa baik roles (array) maupun role (string)
        if (user.roles && user.roles.length > 0) {
            return user.roles.map(r => r.toLowerCase()).includes(role.toLowerCase());
        }
        if (user.role) {
            return user.role.toLowerCase() === role.toLowerCase();
        }
        return false;
    }

    isStandOwner(user: User | null): boolean {
        return this.hasRole(user, 'stand');
    }

    isStudent(user: User | null): boolean {
        return this.hasRole(user, 'student');
    }
}

export const authService = new AuthService();
