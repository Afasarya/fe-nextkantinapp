export interface Order {
    id: number;
    user_id: number;
    food_id: number;
    quantity: number;
    total_price: number;
    status: 'pending' | 'order' | 'success';
    created_at: string;
    updated_at: string;
    formatted_date: string;
    food: {
        id: number;
        name: string;
        stand: {
            id: number;
            name: string;
        };
    };
    user: {
        id: number;
        name: string;
    };
}

export interface UpdateOrderDTO {
    status: Order['status'];
} 