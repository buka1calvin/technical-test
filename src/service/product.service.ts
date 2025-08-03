import {
  CreateProductData,
  GetProductsParams,
  UpdateProductData,
} from "../types/types";

export const productService = {
  getProducts: async (params: GetProductsParams = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const url = `/api/products/get${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch products");
    }

    return data;
  },
  getSingleProduct: async (prodId: string) => {
    const response = await fetch(`/api/products/${prodId}/get`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch product");
    }

    return data;
  },

  createProduct: async (productData: CreateProductData) => {
    const response = await fetch("/api/products/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create product");
    }

    return data;
  },

  updateProduct: async (id: string, updateData: UpdateProductData) => {
    const response = await fetch(`/api/products/${id}/update`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update product");
    }

    return data;
  },

  deleteProduct: async (id: string) => {
    const response = await fetch(`/api/products/${id}/delete`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete product");
    }

    return data;
  },
};
