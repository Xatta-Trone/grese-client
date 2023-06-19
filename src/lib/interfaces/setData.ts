export enum LearningState {
    UNKOWN = 1,
    LEARNING,
    MASTERED,
}

// export interface
export interface SingleSetResponse {
    list_meta: ListMeta;
    meta: Meta;
    words: Word[];
}

export interface ListMeta {
    id: number;
    user_id: number;
    list_meta_id: number;
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
    name: string;
    email: string;
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
    list_id: number;
}

export interface Word {
    id: number;
    word: string;
    word_data: WordData;
    is_reviewed: number;
    created_at: Date;
    updated_at: Date;
}

export interface WordData {
    word: string;
    partsOfSpeeches: PartsOfSpeech[];
}

export interface PartsOfSpeech {
    partsOfSpeech: string;
    definitions: string[];
    examples: string[];
    synonyms_gre: string[];
    synonyms_normal: string[];
}