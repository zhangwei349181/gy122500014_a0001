export interface Category {
    category_id: number;
    category_name: string;
    category_description: string;
    meta_keywords: string;
    status: number;
    parent_id: number;
    sort_order: number;
    created_at: string;
    updated_at: string;
    platform_id: number;
    product_count: number;
    children: Category[];
}

export interface CategoriesModule {
    default: Category[];
}

// 用于类型断言
export type CategoriesModuleImport = {
    default: Category[];
} 