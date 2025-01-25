export interface Client {
    id: string;
    name: string;
    plan: string;
    created_at: string;
    email: string;
    children?: Child[];
}

export interface Child {
    id: string;
    name: string;
    skill_group: string;
    last_obtained_skill: string;
}