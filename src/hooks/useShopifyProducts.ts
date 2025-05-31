
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { shopifyApi } from '@/services/shopifyApi';
import { ShopifyProduct } from '@/types/shopify';

export const useShopifyProducts = (searchQuery?: string, productType?: string) => {
  const [queryString, setQueryString] = useState<string>('');

  useEffect(() => {
    let query = '';
    
    if (searchQuery) {
      query += `title:*${searchQuery}* OR tag:*${searchQuery}*`;
    }
    
    if (productType && productType !== 'all') {
      if (query) query += ' AND ';
      query += `product_type:${productType}`;
    }

    setQueryString(query);
  }, [searchQuery, productType]);

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['shopify-products', queryString],
    queryFn: () => shopifyApi.getProducts(50, queryString || undefined),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (renamed from cacheTime)
  });

  return {
    products: products || [],
    isLoading,
    error,
    refetch,
  };
};

export const useShopifyProduct = (handle: string) => {
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: () => shopifyApi.getProductByHandle(handle),
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // 10 minutos (renamed from cacheTime)
  });

  return {
    product,
    isLoading,
    error,
  };
};
