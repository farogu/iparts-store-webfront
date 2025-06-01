
class SunskyAPI {
  constructor() {
    this.baseURL = 'https://api.sunsky-online.com/v1';
    this.apiKey = window.sunskySettings?.apiKey || '';
    this.isEnabled = !!this.apiKey;
  }

  async request(endpoint) {
    if (!this.isEnabled) {
      throw new Error('API no configurada');
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Sunsky API Error:', error);
      throw error;
    }
  }

  async getProducts(category = '') {
    return this.request(`/products${category ? '?category=' + category : ''}`);
  }

  async getStock(sku) {
    return this.request(`/stock/${sku}`);
  }
}

class SunskyApp {
  constructor() {
    this.api = new SunskyAPI();
    this.currentModel = '';
    this.isLoading = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    
    // Solo cargar productos de Sunsky si la API está habilitada
    if (this.api.isEnabled) {
      this.enhanceWithSunskyData();
    }
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.model-item')) {
        const model = e.target.closest('.model-item').dataset.model;
        this.selectModel(model);
      }
    });
  }

  selectModel(model) {
    this.currentModel = model;
    
    // Actualizar UI
    document.querySelectorAll('.model-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-model="${model}"]`).classList.add('active');
    
    const selectedDiv = document.querySelector('.selected-model');
    const modelName = document.getElementById('selected-model-name');
    
    if (selectedDiv && modelName) {
      selectedDiv.style.display = 'block';
      modelName.textContent = model.replace('iphone-', 'iPhone ');
    }
    
    this.filterProducts();
  }

  async filterProducts() {
    if (!this.api.isEnabled) {
      this.filterShopifyProducts();
      return;
    }

    this.showLoader(true);

    try {
      const products = await this.api.getProducts();
      const filtered = products.filter(p => 
        !this.currentModel || this.isCompatible(p, this.currentModel)
      );
      
      this.renderSunskyProducts(filtered);
      this.toggleProductGrids(true);
    } catch (error) {
      console.warn('Fallback a productos de Shopify:', error);
      this.filterShopifyProducts();
      this.toggleProductGrids(false);
    } finally {
      this.showLoader(false);
    }
  }

  filterShopifyProducts() {
    const shopifyGrid = document.getElementById('shopify-product-grid') || 
                       document.getElementById('shopify-featured-grid');
    
    if (!shopifyGrid) return;

    const products = shopifyGrid.querySelectorAll('.product-card');
    
    products.forEach(card => {
      if (!this.currentModel) {
        card.style.display = 'block';
        return;
      }
      
      const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
      const modelName = this.currentModel.replace('iphone-', '');
      const isVisible = title.includes(modelName) || title.includes(`iphone ${modelName}`);
      
      card.style.display = isVisible ? 'block' : 'none';
    });
  }

  toggleProductGrids(showSunsky) {
    const shopifyGrid = document.getElementById('shopify-product-grid') || 
                       document.getElementById('shopify-featured-grid');
    const sunskyGrid = document.getElementById('sunsky-products') || 
                      document.getElementById('sunsky-featured');
    
    if (shopifyGrid) shopifyGrid.style.display = showSunsky ? 'none' : 'grid';
    if (sunskyGrid) sunskyGrid.style.display = showSunsky ? 'grid' : 'none';
  }

  isCompatible(product, model) {
    const title = product.title.toLowerCase();
    const modelName = model.replace('iphone-', '');
    return title.includes(modelName) || title.includes(`iphone ${modelName}`);
  }

  renderSunskyProducts(products) {
    const grid = document.getElementById('sunsky-products') || 
                document.getElementById('sunsky-featured');
    
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = '<div class="no-products"><p>No se encontraron productos compatibles</p></div>';
      return;
    }

    grid.innerHTML = products.map(product => `
      <div class="product-card sunsky-product">
        <img src="${product.image || '/assets/placeholder.png'}" 
             alt="${product.title}"
             onerror="this.src='/assets/placeholder.png'">
        <h3>${product.title}</h3>
        <p class="price">$${product.price} MXN</p>
        <span class="sunsky-badge">Sunsky</span>
      </div>
    `).join('');
  }

  async enhanceWithSunskyData() {
    // Verificar stock para productos existentes con metafield sunsky_sku
    const shopifyProducts = document.querySelectorAll('[data-sunsky-sku]');
    
    shopifyProducts.forEach(async (element) => {
      const sku = element.dataset.sunskySku;
      if (!sku) return;
      
      try {
        const stockInfo = await this.api.getStock(sku);
        this.updateStockDisplay(element, stockInfo);
      } catch (error) {
        console.warn(`No se pudo verificar stock para SKU ${sku}:`, error);
      }
    });
  }

  updateStockDisplay(element, stockInfo) {
    const stockElement = element.querySelector('.stock-info');
    if (!stockElement) return;
    
    if (stockInfo.available > 0) {
      stockElement.innerHTML = `<span class="stock-available">${stockInfo.available} disponibles</span>`;
    } else {
      stockElement.innerHTML = `<span class="stock-unavailable">Sin stock</span>`;
    }
  }

  showLoader(show) {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.style.display = show ? 'block' : 'none';
    }
  }
}

// Funciones globales
function clearSelection() {
  if (window.SunskyApp) {
    window.SunskyApp.currentModel = '';
    window.SunskyApp.filterProducts();
  }
  
  document.querySelectorAll('.model-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const selectedDiv = document.querySelector('.selected-model');
  if (selectedDiv) {
    selectedDiv.style.display = 'none';
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.SunskyApp = new SunskyApp();
});
