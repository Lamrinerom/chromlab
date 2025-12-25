let cart = [];
let cartOffcanvasInstance = null; 
// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add to cart button event listeners
  document.querySelectorAll('.btn.cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            addToCart(this);
        });
    });
    // Fix: Event delegation for dynamic cart buttons (no more onclick issues)
    document.getElementById('cartItemsContainer')?.addEventListener('click', function(e) {
        if (e.target.closest('.cart-qty-btn')) {
            const itemId = parseInt(e.target.closest('.cart-item').dataset.itemId);
            const change = e.target.classList.contains('minus') ? -1 : 1;
            updateQuantity(itemId, change);
            e.stopPropagation();
        } else if (e.target.closest('.remove-item')) {
            const itemId = parseInt(e.target.closest('.cart-item').dataset.itemId);
            removeItem(itemId);
            e.stopPropagation();
        }
    });
  updateCartDisplay();
});
// Global backdrop cleanup
document.addEventListener('click', function(e) {
    // Clean up any lingering backdrops
    document.querySelectorAll('.offcanvas-backdrop').forEach(backdrop => {
        if (!document.querySelector('.offcanvas.show')) {
            backdrop.remove();
        }
    });
});
function addToCart(button) {
  const productName = button.getAttribute('data-product-name');
  const productImg = button.getAttribute('data-product-img');
  const productPrice = parseFloat(button.getAttribute('data-product-price'));

  if (!productName || !productImg || isNaN(productPrice)) {
    console.error('Missing data attributes on Add to Cart button');
    return;
  }

  // Check if product already exists in cart
  const existingItem = cart.find(item => item.name === productName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: Date.now(),
      name: productName,
      img: productImg,
      price: productPrice,
      quantity: 1
    });
  }

  updateCartDisplay();

  // Show offcanvas automatically
  showCartOffcanvas();

  // Visual feedback
  button.style.transform = 'scale(0.95)';
  setTimeout(() => {
    button.style.transform = 'scale(1)';
  }, 150);
}

function showCartOffcanvas() {
    const offcanvasEl = document.getElementById('offcanvasCart');
    if (!offcanvasEl) return;

    // Clean any existing backdrops first
    document.querySelectorAll('.offcanvas-backdrop').forEach(backdrop => backdrop.remove());

    // Use single instance or create new
    if (cartOffcanvasInstance && cartOffcanvasInstance._isShown) {
        cartOffcanvasInstance.hide();
        setTimeout(() => {
            cartOffcanvasInstance.show();
        }, 100);
    } else {
        cartOffcanvasInstance = new bootstrap.Offcanvas(offcanvasEl, {
            backdrop: true,
            keyboard: true
        });
        cartOffcanvasInstance.show();
    }

    // Listen for hide event to clean up
    offcanvasEl.addEventListener('hidden.bs.offcanvas', function cleanup() {
        document.querySelectorAll('.offcanvas-backdrop').forEach(backdrop => backdrop.remove());
        offcanvasEl.removeEventListener('hidden.bs.offcanvas', cleanup);
    }, { once: true });
}


function updateCartDisplay() {
  const cartContainer = document.getElementById('cartItemsContainer');
  const cartCount = document.getElementById('cartCount');
  const cartFooter = document.querySelector('.cart-footer');
  const cartTotal = document.getElementById('cartTotal');

  if (!cartContainer || !cartCount || !cartFooter || !cartTotal) {
    console.error('Cart elements not found in DOM');
    return;
  }

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

  if (totalItems === 0) {
    // Show empty cart
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <i class="hgi hgi-stroke hgi-shopping-cart-remove-01" 
          style="font-size: 100px;
          color: #ccc;
          display: block;
          margin: 0 auto;
          text-align: center;">
        </i>
        <p class="emptycart">Your cart is empty</p>
        <div class="shopnow"><a href="index.html">Shop Now</div>
      </div>
    `;
    cartFooter.style.display = 'none';
  } else {
    // Render each cart item
    const itemsHtml = cart.map(item => `
      <div class="cart-item" data-item-id="${item.id}">
        <div class="remove-item" onclick="removeItem(${item.id})"><i class="hgi hgi-stroke hgi-delete-02"></i></div>
        <img src="${item.img}" class="cart-img" alt="${item.name}">
        <div class="cart-details">
          <div class="cart-name">${item.name}</div>
          <div class="r-qunt">
            <div class="cart-price">$${item.price.toFixed(2)}</div>
            <div class="quantity-controls">
              <button class="cart-qty-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
              <span class="qty">${item.quantity}</span>
              <button class="cart-qty-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
          </div>
          <div class="subtotal">
            Subtotal: $${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    `).join('');

    cartContainer.innerHTML = itemsHtml;

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    cartFooter.style.display = 'block';
  }
}

function updateQuantity(itemId, change) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeItem(itemId);
    } else {
      updateCartDisplay();
    }
  }
}

function removeItem(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCartDisplay();
}

// --------------------------------------------Wishlist

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let wishlistDropdownOpen = false;

document.addEventListener('DOMContentLoaded', function() {
    // Wishlist card button event listeners
    document.querySelectorAll('.btn.view').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // keep dropdown from closing
            addToWishlist(this, { openDropdown: true });
        });
    });

    // Header wishlist toggle
    const toggleEl = document.getElementById('wishlistToggle');
    if (toggleEl) {
        toggleEl.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlistDropdown();
        });
    }

    // Close dropdown on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#wishlistToggle') && !e.target.closest('.wishlist-dropdown')) {
            closeWishlistDropdown();
        }
    });

    // Keep clicks inside dropdown from closing it
    const dropdown = document.getElementById('wishlistDropdown');
    if (dropdown) {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Restore tooltip state for already-wishlisted items
    document.querySelectorAll('.btn.view').forEach(button => {
        const name = button.getAttribute('data-product-name');
        const exists = wishlist.find(item => item.name === name);
        if (exists) {
            button.style.color = '#dc3545';
            button.setAttribute('data-tip', 'Added');
            button.setAttribute('title', 'Added');
        }
    });

    updateWishlistDisplay();
});

function addToWishlist(button, options = {}) {
    const productName = button.getAttribute('data-product-name');
    const productImg = button.getAttribute('data-product-img');
    const productPrice = parseFloat(button.getAttribute('data-product-price'));

    if (!productName || !productImg || isNaN(productPrice)) {
        console.error('Missing wishlist data attributes');
        return;
    }

    const existingItem = wishlist.find(item => item.name === productName);
    
    if (existingItem) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.name !== productName);
        button.style.color = '#4ba024';          // Reset icon color
        button.setAttribute('data-tip', 'Wishlist');
        button.setAttribute('title', 'Wishlist');
    } else {
        // Add to wishlist
        wishlist.push({
            id: Date.now(),
            name: productName,
            img: productImg,
            price: productPrice,
            addedAt: new Date().toISOString()
        });
        button.style.color = '#dc3545';          // Active icon color
        button.setAttribute('data-tip', 'Added');
        button.setAttribute('title', 'Added');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    updateWishlistDisplay();

    // 1) When clicking wishlist button, also show dropdown
    if (options.openDropdown) {
        openWishlistDropdown();
    }

    // Visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

function updateWishlistDisplay() {
    const wishlistContainer = document.getElementById('wishlistItemsContainer');
    const wishlistCount = document.getElementById('wishlistCount');
    const wishlistTotalCount = document.getElementById('wishlistTotalCount');
    const wishlistFooter = document.querySelector('.wishlist-footer');

    if (!wishlistContainer || !wishlistCount || !wishlistTotalCount || !wishlistFooter) return;

    const totalItems = wishlist.length;
    
    wishlistCount.textContent = totalItems;
    wishlistCount.style.display = totalItems > 0 ? 'flex' : 'none';
    wishlistTotalCount.textContent = totalItems;

    if (totalItems === 0) {
        wishlistContainer.innerHTML = `
            <div class="wishlist-empty">
                <i class="hgi hgi-stroke hgi-heart-remove"></i>
                <p>Your wishlist is empty</p>
                <small>Add items to your wishlist for quick access</small>
            </div>
        `;
        wishlistFooter.style.display = 'none';
    } else {
        wishlistContainer.innerHTML = wishlist.map(item => `
            <div class="wishlist-item" data-id="${item.id}">
                <img src="${item.img}" class="wishlist-img" alt="${item.name}">
                <div class="wishlist-details">
                    <div class="wishlist-name">${item.name}</div>
                    <div class="wishlist-price">$${item.price.toFixed(2)}</div>
                    <div class="wishlist-actions">
                        <button class="wishlist-btn wishdelete" onclick="removeFromWishlist(${item.id}); event.stopPropagation();"><i class="hgi hgi-stroke hgi-delete-02"></i></button>
                        <a href="productdescription.html" class="wishlist-btn wishview">View</a>
                    </div>
                </div>
            </div>
        `).join('');
        wishlistFooter.style.display = 'block';
    }
}

function toggleWishlistDropdown() {
    if (wishlistDropdownOpen) {
        closeWishlistDropdown();
    } else {
        openWishlistDropdown();
    }
}

function openWishlistDropdown() {
    const dropdown = document.getElementById('wishlistDropdown');
    if (!dropdown) return;
    dropdown.classList.add('show');
    document.body.classList.add('dropdown-open');
    wishlistDropdownOpen = true;
    updateWishlistDisplay();
}

function closeWishlistDropdown() {
    const dropdown = document.getElementById('wishlistDropdown');
    if (!dropdown) return;
    dropdown.classList.remove('show');
    document.body.classList.remove('dropdown-open');
    wishlistDropdownOpen = false;
}

function removeFromWishlist(itemId) {
    wishlist = wishlist.filter(item => item.id !== itemId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistDisplay();

    // 2) Keep dropdown open after removing
    openWishlistDropdown();

    // Reset related card button tooltip/color if present
    const removedItem = wishlist.find(item => item.id === itemId);
    document.querySelectorAll('.btn.view').forEach(button => {
        const name = button.getAttribute('data-product-name');
        const exists = wishlist.find(item => item.name === name);
        if (!exists) {
            button.style.color = '#6c757d';
            button.setAttribute('data-tip', 'Wishlist');
            button.setAttribute('title', 'Wishlist');
        }
    });
}

// -----------------------------------------------------------------------------


// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});