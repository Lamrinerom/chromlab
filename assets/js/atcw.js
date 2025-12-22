// === CART STORAGE HELPERS ===
function loadCart() {
  return JSON.parse(localStorage.getItem('cart')) || {};
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartItemCount(cart) {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal(cart) {
  return Object.values(cart).reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// === OFFCANVAS RENDERING ===
function renderCartItems() {
  const cart = loadCart();
  const container = document.getElementById('cartItemsContainer');
  const footer = document.querySelector('.cart-footer');
  
  if (!container) return;

  // Clear existing items
  container.innerHTML = '';

  if (Object.keys(cart).length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="hgi hgi-stroke hgi-shopping-bag-01" style="font-size: 48px; color: #ccc;"></i>
        <p>Your cart is empty</p>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  // Render each cart item
  Object.values(cart).forEach(item => {
    const itemHtml = `
      <div class="cart-item" data-product-id="${item.id}">
        <div class="cart-item-image" style="background-image: url('https://via.placeholder.com/60?text=${item.id}')"></div>
        <div class="cart-item-details">
          <h6 class="cart-item-title">${item.title}</h6>
          <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.qty}</p>
          <div class="quantity-controls">
            <button class="quantity-btn qty-minus" data-id="${item.id}">-</button>
            <input type="number" class="quantity-input" value="${item.qty}" min="1" data-id="${item.id}">
            <button class="quantity-btn qty-plus" data-id="${item.id}">+</button>
            <span class="remove-item" data-id="${item.id}">×</span>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', itemHtml);
  });

  // Show footer with total
  if (footer) {
    document.getElementById('cartTotal').textContent = getCartTotal(cart).toFixed(2);
    footer.style.display = 'block';
  }
}

// === CART OPERATIONS ===
function addToCart(product) {
  const cart = loadCart();
  
  if (cart[product.id]) {
    cart[product.id].qty += product.qty || 1;
  } else {
    cart[product.id] = { ...product, qty: product.qty || 1 };
  }
  
  saveCart(cart);
  updateHeaderCounters();
  
  // Show success tooltip (if you have one)
  showToast('Added to cart!');
}

function updateCartQuantity(id, qty) {
  const cart = loadCart();
  if (cart[id] && qty > 0) {
    cart[id].qty = qty;
    saveCart(cart);
    renderCartItems();
    updateHeaderCounters();
  } else if (qty <= 0) {
    removeFromCart(id);
  }
}

function removeFromCart(id) {
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
  renderCartItems();
  updateHeaderCounters();
}

// === EVENT DELEGATION (works for dynamic offcanvas items) ===
document.addEventListener('click', (e) => {
  // Add to cart button
  if (e.target.closest('.btn-add-cart')) {
    const card = e.target.closest('.product-card');
    const product = {
      id: card.dataset.id,
      title: card.dataset.title,
      price: Number(card.dataset.price) || 0,
      qty: 1
    };
    addToCart(product);
    return;
  }

  // Offcanvas quantity controls
  if (e.target.matches('.qty-plus, .qty-minus')) {
    const id = e.target.dataset.id;
    const input = document.querySelector(`.quantity-input[data-id="${id}"]`);
    const currentQty = parseInt(input.value) || 1;
    const newQty = e.target.classList.contains('qty-plus') ? currentQty + 1 : currentQty - 1;
    updateCartQuantity(id, newQty);
  }

  // Remove item
  if (e.target.matches('.remove-item')) {
    const id = e.target.dataset.id;
    if (confirm('Remove this item?')) {
      removeFromCart(id);
    }
  }

  // Toggle offcanvas (if using Bootstrap)
  if (e.target.matches('[data-bs-toggle="offcanvas"]')) {
    setTimeout(renderCartItems, 100); // Render after animation
  }
});

document.addEventListener('input', (e) => {
  if (e.target.matches('.quantity-input')) {
    const id = e.target.dataset.id;
    const qty = parseInt(e.target.value) || 1;
    updateCartQuantity(id, qty);
  }
});

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderCounters();
  renderCartItems();
});

function updateHeaderCounters() {
  const cart = loadCart();
  const cartCountEl = document.querySelector('#cartCount, .cart-count');
  const wishCountEl = document.querySelector('#wishlistCount, .wishlist-count');
  
  if (cartCountEl) cartCountEl.textContent = getCartItemCount(cart);
  if (wishCountEl) wishCountEl.textContent = loadWishlist().length;
}

function showToast(message) {
  // Simple toast notification
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; 
    background: #10b981; color: white; padding: 12px 20px;
    border-radius: 8px; z-index: 9999; transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
