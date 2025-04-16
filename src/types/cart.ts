import { Food } from './food';

export interface Cart {
    id: number;
    food_id: number;
    user_id: number;
    quantity: number;
    price: number;
    food: Food;
    created_at: string;
    updated_at: string;
}

export interface CreateCartDTO {
    food_id: number;
    quantity: number;
    price: number;
}

export interface UpdateCartDTO {
    quantity: number;
}
