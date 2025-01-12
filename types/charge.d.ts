export interface Charge {
    id: string;
    user_id: string;
    amount: number;
    title: string;
    date: Date;
    discount: number;
}