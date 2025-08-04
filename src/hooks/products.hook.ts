import { useState, useEffect, useCallback } from 'react';
import { productService } from '../service/product.service';
import { Product, GetProductsParams, CreateProductData, UpdateProductData } from '../types/types';

export const useProducts = (initialParams: GetProductsParams = {}) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  const fetchProducts = useCallback(async (params: GetProductsParams = {}, page: number = 1, append: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getProducts({ 
        ...initialParams, 
        ...params, 
        page: page
      });
      
      if (append) {
        setAllProducts(prev => [...prev, ...response.products]);
        setDisplayedProducts(prev => [...prev, ...response.products]);
      } else {
        setAllProducts(response.products);
        setDisplayedProducts(response.products);
        setCurrentPage(1);
        setHasLoadedMore(false);
      }
      
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message);
      if (!append) {
        setAllProducts([]);
        setDisplayedProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  const loadMore = useCallback(async () => {
    if (!pagination?.hasNextPage || loading) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setHasLoadedMore(true);
    await fetchProducts({}, nextPage, true);
  }, [pagination, loading, currentPage, fetchProducts]);

  const showPrevious = useCallback(() => {
    if (!hasLoadedMore) return;
    
    const itemsPerPage = pagination?.limit || 9;
    const previousPageEnd = (currentPage - 1) * itemsPerPage;
    
    if (previousPageEnd > 0) {
      setDisplayedProducts(allProducts.slice(0, previousPageEnd));
      setCurrentPage(prev => prev - 1);

      const newPagination = {
        ...pagination,
        hasNextPage: true,
        hasPrevPage: currentPage > 2
      };
      setPagination(newPagination);
    } else {
      const firstPageItems = allProducts.slice(0, itemsPerPage);
      setDisplayedProducts(firstPageItems);
      setCurrentPage(1);
      setHasLoadedMore(false);
      
      const newPagination = {
        ...pagination,
        hasNextPage: allProducts.length > itemsPerPage,
        hasPrevPage: false
      };
      setPagination(newPagination);
    }
  }, [hasLoadedMore, currentPage, pagination, allProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refresh = useCallback(() => {
    setCurrentPage(1);
    setHasLoadedMore(false);
    fetchProducts();
  }, [fetchProducts]);

  return {
    products: displayedProducts,
    loading,
    error,
    pagination,
    refresh,
    fetchProducts,
    loadMore,
    showPrevious,
    hasLoadedMore,
    canShowPrevious: hasLoadedMore && currentPage > 1
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