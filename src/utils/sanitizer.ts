
/**
 * Simple HTML sanitizer for product descriptions
 * Removes potentially dangerous HTML elements and attributes
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove all script tags and their content
  const scripts = temp.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove potentially dangerous elements
  const dangerousElements = temp.querySelectorAll('iframe, object, embed, link, meta, style');
  dangerousElements.forEach(element => element.remove());
  
  // Remove event handlers and dangerous attributes
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(element => {
    // Remove all on* attributes (onclick, onload, etc.)
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('on') || 
          attr.name === 'href' && attr.value.startsWith('javascript:') ||
          attr.name === 'src' && attr.value.startsWith('javascript:')) {
        element.removeAttribute(attr.name);
      }
    });
  });
  
  return temp.innerHTML;
};

/**
 * Extract plain text from HTML, removing all tags
 */
export const stripHTML = (html: string): string => {
  if (!html) return '';
  
  const temp = document.createElement('div');
  temp.innerHTML = sanitizeHTML(html);
  return temp.textContent || temp.innerText || '';
};
