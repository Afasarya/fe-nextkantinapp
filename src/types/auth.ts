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
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: string[];
    stand?: Stand;
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
}

export interface RegisterStandDTO extends RegisterStudentDTO {
    stand_name: string;
    stand_slug: string;
    stand_description?: string;
}
