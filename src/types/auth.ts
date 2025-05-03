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
    role: 'Student' | 'Stand';
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

export interface RegisterStudentDTO {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: string;
}

export interface RegisterStandDTO {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    stand_name: string;
    stand_slug?: string;
    stand_description?: string;
    role?: string;
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
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}
