export interface Food {
    id: number;
    image: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    is_discount: boolean;
    discount: number | null;
    discount_price: number | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateFoodDTO {
    name: string;
    slug: string;
    description: string;
    price: number;
    is_discount: boolean;
    discount?: number;
    image: File;
}

export interface UpdateFoodDTO {
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    is_discount?: boolean;
    discount?: number;
    image?: File;
}
  