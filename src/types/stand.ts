export interface Stand {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateStandDTO {
  user_id: number;
  name: string;
  slug: string;
  description: string;
}

export interface UpdateStandDTO {
  user_id?: number;
  name?: string;
  slug?: string;
  description?: string;
}
