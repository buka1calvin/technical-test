import { useState, useEffect, useCallback } from 'react';
import { productService } from '../service/product.service';
import { Product, GetProductsParams, CreateProductData, UpdateProductData } from '../types/types';

export const useProducts = (initialParams: GetProductsParams = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchProducts = useCallback(async (params: GetProductsParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getProducts({ ...initialParams, ...params });
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    refresh,
    fetchProducts
  };
};

export const useProduct = (productId: string | null) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await productService.getSingleProduct(productId);
        setProduct(response.product);
      } catch (err: any) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error
  };
};

export const useProductActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(async (data: CreateProductData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.createProduct(data);
      return response.product;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: UpdateProductData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.updateProduct(id, data);
      return response.product;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.deleteProduct(id);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

    const reorderProducts = useCallback(async (productIds: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.reorderProducts(productIds);
      return response.products;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createProduct,
    updateProduct,
    reorderProducts,
    deleteProduct,
    loading,
    error
  };
};