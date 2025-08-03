export type User={
    id:string,
    email:string,
    createdAt:string
}

// ============= PRODUCT TYPES =============

export type Product = {
  _id: string;
  name: string;
  amount: number;
  comment: string;
  userId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductData = {
  name: string;
  amount: number;
  comment?: string;
};

export type UpdateProductData = {
  name?: string;
  amount?: number;
  comment?: string;
  position?: number;
};

export type GetProductsParams = {
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'name' | 'amount' | 'createdAt' | 'position';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

export type ProductsResponse = {
  success: boolean;
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
};

export type SingleProductResponse = {
  success: boolean;
  product: Product;
  message: string;
};

export type DeleteProductResponse = {
  success: boolean;
  deletedProduct: {
    id: string;
    name: string;
    amount: number;
    position: number;
  };
  stats: {
    remainingProducts: number;
    totalValue: number;
  };
  message: string;
};

export type ProductStats = {
  totalProducts: number;
  totalValue: number;
  averageValue: number;
};

export type BulkDeleteResult = {
  deleted: number;
  errors: string[];
};


export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
};

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};


export type SortOrder = 'asc' | 'desc';

export type ProductSortBy = 'name' | 'amount' | 'createdAt' | 'position';

export type AmountRange = {
  min?: number;
  max?: number;
};