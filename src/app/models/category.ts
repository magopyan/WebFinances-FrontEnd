export interface CategoryType {
    id: number;
    name: string;
    coefficient: number;
}

export interface Category {
    id: number;
    name: string;
    imageUrl: string;
    categoryType: CategoryType;
}

export interface Subcategory {
    id: number;
    name: string;
    imageUrl: string;
    category: Category;
}