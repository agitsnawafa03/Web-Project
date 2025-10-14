// Cart Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  loadCartItems();
  updateCartSummary();
  updateCartCount();
  updateAuthUI();
  
  // Hamburger menu functionality
  const navbarNav = document.querySelector('.navbar-nav');
  const hamburgerMenu = document.querySelector('#hamburger-menu');

  hamburgerMenu.addEventListener('click', () => {
    navbarNav.classList.toggle('active');
  });

  // Search functionality
  const searchForm = document.querySelector('.search-form');
  const searchBox = document.querySelector('#search-box');
  const searchBtn = document.querySelector('#search');

  searchBtn.onclick = (e) => {
    e.preventDefault();
    searchForm.classList.toggle('active');
    searchBox.focus();
  };

  // Close search form when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchBtn.contains(e.target) && !searchForm.contains(e.target)) {
      searchForm.classList.remove('active');
    }
  });
});

// Load cart items from localStorage
function loadCartItems() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartContainer = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const cartContent = document.querySelector('.cart-content');

  if (cartItems.length === 0) {
    cartContent.style.display = 'none';
    emptyCart.style.display = 'block';
    return;
  }

  cartContent.style.display = 'grid';
  emptyCart.style.display = 'none';
  cartContainer.innerHTML = '';

  cartItems.forEach((item, index) => {
    const cartItemElement = createCartItemElement(item, index);
    cartContainer.appendChild(cartItemElement);
  });

  feather.replace();
}

// Create cart item element
function createCartItemElement(item, index) {
  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item';
  cartItem.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <div class="cart-item-details">
      <div class="cart-item-title">${item.title}</div>
      <div class="cart-item-price">${item.price}</div>
      <div class="cart-item-quantity">
        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
        <span class="quantity-display">${item.quantity}</span>
        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
      </div>
    </div>
    <div class="cart-item-total">${calculateItemTotal(item)}</div>
    <button class="remove-item-btn" onclick="removeItem(${index})">
      <i data-feather="trash-2"></i>
    </button>
  `;
  return cartItem;
}

// Update item quantity
function updateQuantity(index, change) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  if (cartItems[index]) {
    cartItems[index].quantity += change;
    
    if (cartItems[index].quantity <= 0) {
      removeItem(index);
      return;
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCartItems();
    updateCartSummary();
    updateCartCount();
  }
}

// Remove item from cart
function removeItem(index) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  cartItems.splice(index, 1);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
  loadCartItems();
  updateCartSummary();
  updateCartCount();
  
  // Show success message
  showNotification('Item berhasil dihapus dari keranjang!', 'success');
}

// Calculate item total
function calculateItemTotal(item) {
  const price = parseInt(item.price.replace('IDR ', '').replace('K', '000'));
  return `IDR ${(price * item.quantity / 1000)}K`;
}

// Update cart summary
function updateCartSummary() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => {
    const price = parseInt(item.price.replace('IDR ', '').replace('K', '000'));
    return total + (price * item.quantity);
  }, 0);
  
  const shipping = 5000; // IDR 5K
  const total = subtotal + shipping;
  
  document.getElementById('totalItems').textContent = totalItems;
  document.getElementById('subtotal').textContent = `IDR ${subtotal / 1000}K`;
  document.getElementById('totalPrice').textContent = `IDR ${total / 1000}K`;
  
  // Disable checkout button if cart is empty
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (totalItems === 0) {
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Keranjang Kosong';
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.innerHTML = '<i data-feather="credit-card"></i> Checkout Sekarang';
    feather.replace();
  }
}

// Checkout functionality
document.getElementById('checkoutBtn').addEventListener('click', function() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  
  if (cartItems.length === 0) {
    showNotification('Keranjang belanja kosong!', 'error');
    return;
  }
  
  // Redirect to checkout page
  window.location.href = 'checkout.html';
});

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 
                 type === 'error' ? 'linear-gradient(45deg, #f44336, #d32f2f)' : 
                 'linear-gradient(45deg, var(--primary), #68c587)'};
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 300px;
    font-weight: 600;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Clear cart function (for testing)
function clearCart() {
  localStorage.removeItem('cartItems');
  loadCartItems();
  updateCartSummary();
  showNotification('Keranjang belanja berhasil dikosongkan!', 'success');
} 

// Update cart count
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartCount = document.getElementById('cartCount');
  
  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.classList.remove('hidden');
  } else {
    cartCount.classList.add('hidden');
  }
}

// Update auth UI based on login status
function updateAuthUI() {
  const currentUser = getCurrentUser();
  const isLoggedIn = isLoggedIn();
  const loginBtn = document.getElementById('login-btn');
  const userMenu = document.getElementById('user-menu');
  
  if (isLoggedIn && currentUser) {
    // User is logged in
    loginBtn.style.display = 'none';
    userMenu.style.display = 'inline-block';
    userMenu.innerHTML = `
      <i data-feather="user"></i>
      <span class="user-name">${currentUser.firstName}</span>
    `;
    
    // Add user menu dropdown
    const userDropdown = document.createElement('div');
    userDropdown.className = 'user-dropdown';
    userDropdown.innerHTML = `
      <div class="user-info">
        <strong>${currentUser.firstName} ${currentUser.lastName}</strong>
        <small>${currentUser.email}</small>
      </div>
      <div class="dropdown-actions">
        <a href="#" onclick="showProfile()">
          <i data-feather="user"></i>
          Profil
        </a>
        <a href="#" onclick="logout()">
          <i data-feather="log-out"></i>
          Logout
        </a>
      </div>
    `;
    
    userMenu.appendChild(userDropdown);
    feather.replace();
    
    // Add click handler for user menu
    userMenu.addEventListener('click', function(e) {
      e.preventDefault();
      userDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!userMenu.contains(e.target)) {
        userDropdown.classList.remove('active');
      }
    });
  } else {
    // User is not logged in
    loginBtn.style.display = 'inline-block';
    userMenu.style.display = 'none';
  }
}

// Show profile function
function showProfile() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    alert(`Profil Pengguna:\nNama: ${currentUser.firstName} ${currentUser.lastName}\nEmail: ${currentUser.email}\nTelepon: ${currentUser.phone}\nAlamat: ${currentUser.address}`);
  }
} 