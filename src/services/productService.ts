
import { ShopifyProduct } from '@/types/shopify';
import { InputValidator } from '@/utils/inputValidator';
import { graphqlClient } from './graphqlClient';

export class ProductService {
  async getProducts(first = 20, query?: string): Promise<ShopifyProduct[]> {
    // Enhanced input validation
    if (!Number.isInteger(first) || first < 1 || first > 250) {
      throw new Error('Invalid product count requested');
    }
    
    if (query && !InputValidator.validateSearchQuery(query)) {
      throw new Error('Invalid search query');
    }
    
    const graphqlQuery = `
      query getProducts($first: Int!, $query: String) {
        products(first: $first, query: $query) {
          edges {
            node {
              id
              title
              description
              handle
              productType
              tags
              images(first: 5) {
                edges {
                  node {
                    id
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                    quantityAvailable
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await graphqlClient.request(graphqlQuery, { first, query }, 'products');
    
    if (!data.products || !data.products.edges) {
      return [];
    }

    return data.products.edges.map((edge: any) => edge.node) as ShopifyProduct[];
  }

  async getProductByHandle(handle: string): Promise<ShopifyProduct> {
    if (!InputValidator.validateProductHandle(handle)) {
      throw new Error('Invalid product handle');
    }

    const graphqlQuery = `
      query getProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          description
          handle
          productType
          tags
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
              }
            }
          }
        }
      }
    `;

    const data = await graphqlClient.request(graphqlQuery, { handle }, 'products');
    
    if (!data.productByHandle) {
      throw new Error(`Producto no encontrado`);
    }

    return data.productByHandle as ShopifyProduct;
  }
}

export const productService = new ProductService();
