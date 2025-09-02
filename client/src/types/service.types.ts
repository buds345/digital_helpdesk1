export interface Service {
    id: number;        // must be number to match backend
    name: string;
    description?: string | null;
}
