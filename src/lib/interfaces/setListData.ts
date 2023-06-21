export interface SetsResponse {
    data: Data[];
    meta: Meta;
}

export interface Data {
    id: number;
    user_id: number;
    list_meta_id?: number;
    name: string;
    slug: string;
    visibility: number;
    status: number;
    crated_at: Date;
    updated_at: Date;
    user: User;
    word_count: number;
}

export interface User {
    id: number;
    username: string;
    created_at: Date;
    updated_at: Date;
}

export interface Meta {
    id: number;
    query: string;
    order_by: string;
    order: string;
    page: number;
    per_page: number;
    count: number;
}