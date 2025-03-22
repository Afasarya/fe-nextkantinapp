import { Food } from './food';

export interface Cart {
    id: number;
    food_id: number;
    user_id: number;
    quantity: number;
    food: Food;
    created_at: string;
    updated_at: string;
}

export interface CreateCartDTO {
    food_id: number;
    quantity: number;
}

export interface UpdateCartDTO {
    quantity: number;
}
