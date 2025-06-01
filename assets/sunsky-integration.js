
/**
 * Integración principal con la API de Sunsky
 * Maneja la sincronización de productos y compatibilidad de modelos
 */

class SunskyAPI {
  constructor() {
    this.baseURL = 'https://api.sunsky-online.com/v1';
    this.apiKey = this.getApiKey();
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutos
  }

  getApiKey() {
    // La API key se configura en las settings del tema
    return window.sunskySettings?.apiKey || '';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
    
    // Verificar cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      if (!response.ok) {
        throw new Error(`Sunsky API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Guardar en cache
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Error en Sunsky API:', error);
      throw error;
    }
  }

  async getProducts(category = '', search = '') {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    return this.request(`/products?${params.toString()}`);
  }

  async getProductByLG(lgCode) {
    return this.request(`/products/${lgCode}`);
  }

  async getCategories() {
    return this.request('/categories');
  }

  async getStock(skus) {
    return this.request('/stock', {
      method: 'POST',
      body: { skus: Array.isArray(skus) ? skus : [skus] }
    });
  }

  async getCompatibility(productSku, iphoneModel) {
    return this.request(`/compatibility/${productSku}/${iphoneModel}`);
  }
}

class SunskyApp {
  constructor() {
    this.api = new SunskyAPI();
    this.currentModel = '';
    this.currentCategory = '';
    this.products = [];
    this.init();
  }

  init() {
    console.log('Inicializando Sunsky App...');
    this.setupEventListeners();
    this.loadInitialData();
  }

  setupEventListeners() {
    // Model selector
    document.addEventListener('click', (e) => {
      if (e.target.matches('.model-selector-item')) {
        this.handleModelSelect(e.target.dataset.model);
      }
    });

    // Category filter
    document.addEventListener('change', (e) => {
      if (e.target.matches('.category-filter')) {
        this.handleCategoryChange(e.target.value);
      }
    });

    // Search
    document.addEventListener('input', (e) => {
      if (e.target.matches('.sunsky-search')) {
        this.debounce(() => this.handleSearch(e.target.value), 500)();
      }
    });

    // Add to cart with stock check
    document.addEventListener('click', (e) => {
      if (e.target.matches('.sunsky-add-to-cart')) {
        this.handleAddToCart(e.target);
      }
    });
  }

  async loadInitialData() {
    try {
      // Cargar categorías disponibles
      const categories = await this.api.getCategories();
      this.renderCategories(categories);

      // Cargar productos iniciales
      const products = await this.api.getProducts();
      this.products = products;
      this.renderProducts(products);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      this.showError('Error cargando productos de Sunsky');
    }
  }

  async handleModelSelect(model) {
    this.currentModel = model;
    console.log('Modelo seleccionado:', model);
    
    // Actualizar UI
    document.querySelectorAll('.model-selector-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-model="${model}"]`).classList.add('active');

    // Filtrar productos por compatibilidad
    await this.filterProducts();
    
    // Actualizar URL sin recargar
    const url = new URL(window.location);
    url.searchParams.set('model', model);
    window.history.pushState({}, '', url);
  }

  async handleCategoryChange(category) {
    this.currentCategory = category;
    await this.filterProducts();
  }

  async handleSearch(query) {
    try {
      const products = await this.api.getProducts(this.currentCategory, query);
      this.renderProducts(products);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  }

  async filterProducts() {
    try {
      this.showLoading(true);
      
      let filteredProducts = this.products;

      // Filtrar por modelo si está seleccionado
      if (this.currentModel) {
        filteredProducts = filteredProducts.filter(product => 
          this.isCompatible(product, this.currentModel)
        );
      }

      // Filtrar por categoría
      if (this.currentCategory) {
        filteredProducts = filteredProducts.filter(product => 
          product.category === this.currentCategory
        );
      }

      this.renderProducts(filteredProducts);
    } catch (error) {
      console.error('Error filtrando productos:', error);
    } finally {
      this.showLoading(false);
    }
  }

  isCompatible(product, model) {
    // Verificar compatibilidad basada en metadatos del producto
    if (product.compatibility) {
      return product.compatibility.includes(model);
    }
    
    // Fallback: verificar en título o descripción
    const searchText = `${product.title} ${product.description}`.toLowerCase();
    const modelVariations = this.getModelVariations(model);
    
    return modelVariations.some(variation => 
      searchText.includes(variation.toLowerCase())
    );
  }

  getModelVariations(model) {
    const variations = {
      'iphone-15-pro': ['iPhone 15 Pro', 'iphone15pro', '15 Pro'],
      'iphone-15': ['iPhone 15', 'iphone15'],
      'iphone-14-pro': ['iPhone 14 Pro', 'iphone14pro', '14 Pro'],
      'iphone-14': ['iPhone 14', 'iphone14'],
      // Agregar más variaciones según necesidad
    };
    
    return variations[model] || [model];
  }

  async handleAddToCart(button) {
    const productId = button.dataset.productId;
    const variantId = button.dataset.variantId;
    const sku = button.dataset.sku;

    try {
      button.disabled = true;
      button.textContent = 'Verificando stock...';

      // Verificar stock en Sunsky
      const stockInfo = await this.api.getStock(sku);
      
      if (stockInfo.available <= 0) {
        this.showError('Producto sin stock en Sunsky');
        return;
      }

      // Agregar al carrito de Shopify
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: 1
        })
      });

      if (response.ok) {
        this.showSuccess('Producto agregado al carrito');
        this.updateCartCount();
      } else {
        throw new Error('Error agregando al carrito');
      }

    } catch (error) {
      console.error('Error agregando al carrito:', error);
      this.showError('Error agregando producto al carrito');
    } finally {
      button.disabled = false;
      button.textContent = 'Agregar al carrito';
    }
  }

  renderProducts(products) {
    const container = document.getElementById('sunsky-product-grid');
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = `
        <div class="no-products">
          <h3>No se encontraron productos</h3>
          <p>Intenta con otros filtros o modelo</p>
        </div>
      `;
      return;
    }

    const html = products.map(product => this.renderProductCard(product)).join('');
    container.innerHTML = html;
  }

  renderProductCard(product) {
    const price = product.price || 0;
    const comparePrice = product.compareAtPrice || 0;
    const hasDiscount = comparePrice > price;
    
    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image || '/assets/placeholder.svg'}" 
               alt="${product.title}" 
               loading="lazy">
          ${hasDiscount ? `<span class="discount-badge">-${Math.round((1 - price/comparePrice) * 100)}%</span>` : ''}
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <div class="product-price">
            <span class="current-price">$${price.toFixed(2)} MXN</span>
            ${hasDiscount ? `<span class="compare-price">$${comparePrice.toFixed(2)}</span>` : ''}
          </div>
          <div class="product-meta">
            <span class="sku">SKU: ${product.sku}</span>
            <span class="stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
              ${product.stock > 0 ? 'En stock' : 'Sin stock'}
            </span>
          </div>
          <div class="product-actions">
            <button class="btn btn-primary sunsky-add-to-cart" 
                    data-product-id="${product.id}"
                    data-variant-id="${product.variantId}"
                    data-sku="${product.sku}"
                    ${product.stock <= 0 ? 'disabled' : ''}>
              ${product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderCategories(categories) {
    const container = document.getElementById('sunsky-categories');
    if (!container) return;

    const html = categories.map(category => `
      <option value="${category.id}">${category.name}</option>
    `).join('');
    
    container.innerHTML = '<option value="">Todas las categorías</option>' + html;
  }

  showLoading(show) {
    const loader = document.querySelector('.sunsky-loader');
    if (loader) {
      loader.style.display = show ? 'block' : 'none';
    }
  }

  showError(message) {
    // Implementar notificación de error
    console.error(message);
  }

  showSuccess(message) {
    // Implementar notificación de éxito
    console.log(message);
  }

  updateCartCount() {
    // Actualizar contador del carrito
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const counter = document.querySelector('.cart-count');
        if (counter) {
          counter.textContent = cart.item_count;
        }
      });
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.SunskyApp = new SunskyApp();
  });
} else {
  window.SunskyApp = new SunskyApp();
}

// Exportar para uso global
window.SunskyAPI = SunskyAPI;
