export interface CookieResponse {
    key: string;
    value: string | null;
}

export interface CookieMaker {
    key: string;
    value: string;
    maxAge?: number
    expires?: Date
}
