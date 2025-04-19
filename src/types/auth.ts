export interface Stand {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'student' | 'stand';
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterStudentDTO extends LoginDTO {
    name: string;
    nim: string;
}

export interface RegisterStandDTO extends LoginDTO {
    name: string;
    description: string;
}

export interface LoginResponse {
    status: string;
    data?: {
        token: string;
        user: User;
    };
    message?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}
