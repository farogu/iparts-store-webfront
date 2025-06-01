
class SunskyAPI {
  constructor() {
    this.baseURL = 'https://api.sunsky-online.com/v1';
    this.apiKey = window.sunskySettings?.apiKey || '';
  }

  async request(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Sunsky API Error:', error);
      return null;
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
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadProducts();
  }

  setupEventListeners() {
    // Model selector
    document.addEventListener('click', (e) => {
      if (e.target.closest('.model-item')) {
        const model = e.target.closest('.model-item').dataset.model;
        this.selectModel(model);
      }
    });

    // Model filter
    const modelFilter = document.getElementById('model-filter');
    if (modelFilter) {
      modelFilter.addEventListener('change', (e) => {
        this.filterByModel(e.target.value);
      });
    }
  }

  selectModel(model) {
    this.currentModel = model;
    
    // Update UI
    document.querySelectorAll('.model-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-model="${model}"]`).classList.add('active');
    
    // Filter products
    this.filterProducts();
  }

  filterByModel(model) {
    this.currentModel = model;
    this.filterProducts();
  }

  async filterProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    this.showLoader(true);

    try {
      const products = await this.api.getProducts();
      if (products) {
        this.renderProducts(products.filter(p => 
          !this.currentModel || this.isCompatible(p, this.currentModel)
        ));
      }
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      this.showLoader(false);
    }
  }

  isCompatible(product, model) {
    const title = product.title.toLowerCase();
    const modelName = model.replace('iphone-', '');
    return title.includes(modelName) || title.includes(`iphone ${modelName}`);
  }

  renderProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = '<p>No se encontraron productos compatibles</p>';
      return;
    }

    grid.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image || '/assets/placeholder.png'}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p class="price">$${product.price} MXN</p>
        <span class="sunsky-badge">Sunsky</span>
      </div>
    `).join('');
  }

  async loadProducts() {
    try {
      const products = await this.api.getProducts();
      if (products) {
        this.renderProducts(products);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  showLoader(show) {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.style.display = show ? 'block' : 'none';
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.SunskyApp = new SunskyApp();
});
