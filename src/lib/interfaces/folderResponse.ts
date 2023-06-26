export interface SingleFolderResponse {
    folder: Folder;
    lists: List[];
    meta: Meta;
}

export interface Folder {
    id: number;
    user_id: number;
    list_meta_id?: number;
    name: string;
    slug: string;
    visibility: number;
    status: number;
    crated_at: Date;
    updated_at: Date;
    user: FolderUser;
    lists_count: number;
}

export interface FolderUser {
    id: number;
    name: string;
    username: string;
    created_at: Date;
    updated_at: Date;
}

export interface List {
    id: number;
    user_id: number;
    list_meta_id?: number;
    name: string;
    slug: string;
    visibility: number;
    status: number;
    crated_at: Date;
    updated_at: Date;
    user: ListUser;
    word_count: number;
}

export interface ListUser {
    id: number;
    username: string;
    created_at: Date;
    updated_at: Date;
}

export interface Meta {
    id: number;
    query: string;
    order_by: string;
    page: number;
    per_page: number;
    total: number;
    folder_id: number;
}