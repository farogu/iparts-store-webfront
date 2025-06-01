
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.remove('hidden');
  } else {
    mobileMenu.classList.add('hidden');
  }
}

// Model selector functionality
document.addEventListener('DOMContentLoaded', function() {
  const modelCards = document.querySelectorAll('.model-card');
  
  modelCards.forEach(card => {
    card.addEventListener('click', function() {
      const model = this.dataset.model;
      
      // Remove active state from all cards
      modelCards.forEach(c => c.classList.remove('active'));
      
      // Add active state to clicked card
      this.classList.add('active');
      
      // You can add functionality here to filter products by model
      console.log('Selected model:', model);
      
      // Optional: Redirect to collection page with model filter
      // window.location.href = '/collections/all?model=' + model;
    });
  });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Add active styles for model selection
const style = document.createElement('style');
style.textContent = `
  .model-card.active {
    border-color: var(--electric-blue);
    background: #f0f7ff;
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 102, 255, 0.15);
  }
`;
document.head.appendChild(style);
