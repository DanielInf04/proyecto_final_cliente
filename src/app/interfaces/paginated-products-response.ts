import { IProduct } from "./iproduct";

export interface PaginatedProductsResponse {
    current_page: number;
    data: IProduct[];
    last_page: number;
    per_page: number;
    total: number;
}