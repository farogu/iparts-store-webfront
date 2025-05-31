
import { SHOPIFY_GRAPHQL_URL, SHOPIFY_CONFIG } from '@/config/shopify';
import { ShopifyProduct, ShopifyCart, CartItem } from '@/types/shopify';

class ShopifyAPI {
  private async graphqlRequest(query: string, variables: any = {}) {
    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }

  async getProducts(first = 20, query?: string) {
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

    const data = await this.graphqlRequest(graphqlQuery, { first, query });
    return data.products.edges.map((edge: any) => edge.node) as ShopifyProduct[];
  }

  async getProductByHandle(handle: string) {
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

    const data = await this.graphqlRequest(graphqlQuery, { handle });
    return data.productByHandle as ShopifyProduct;
  }

  async createCart() {
    const graphqlQuery = `
      mutation cartCreate {
        cartCreate {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      image {
                        url
                        altText
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.graphqlRequest(graphqlQuery);
    
    if (data.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${data.cartCreate.userErrors[0].message}`);
    }

    return data.cartCreate.cart as ShopifyCart;
  }

  async addToCart(cartId: string, items: CartItem[]) {
    const graphqlQuery = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      image {
                        url
                        altText
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const lines = items.map(item => ({
      merchandiseId: item.merchandiseId,
      quantity: item.quantity,
    }));

    const data = await this.graphqlRequest(graphqlQuery, { cartId, lines });
    
    if (data.cartLinesAdd.userErrors.length > 0) {
      throw new Error(`Add to cart failed: ${data.cartLinesAdd.userErrors[0].message}`);
    }

    return data.cartLinesAdd.cart as ShopifyCart;
  }

  async getCart(cartId: string) {
    const graphqlQuery = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.graphqlRequest(graphqlQuery, { cartId });
    return data.cart as ShopifyCart;
  }

  async updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>) {
    const graphqlQuery = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      image {
                        url
                        altText
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.graphqlRequest(graphqlQuery, { cartId, lines });
    
    if (data.cartLinesUpdate.userErrors.length > 0) {
      throw new Error(`Cart update failed: ${data.cartLinesUpdate.userErrors[0].message}`);
    }

    return data.cartLinesUpdate.cart as ShopifyCart;
  }
}

export const shopifyApi = new ShopifyAPI();
