export interface NotificationsResponse {
    data: NotificationData[];
    meta: NotificationMeta;
}

export interface NotificationData {
    id: string;
    content: string;
    url: string;
    user_id: number;
    created_at: Date;
    read_at?: Date;
}

export interface NotificationMeta {
    id: number;
    query: string;
    order_by: string;
    order_dir: string;
    page: number;
    per_page: number;
    filter: string;
    user_id: number;
    count: number;
}
