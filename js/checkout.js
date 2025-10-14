// Checkout Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  feather.replace();
  
  // Check authentication
  checkAuthStatus();
  
  // Load order summary
  loadOrderSummary();
  
  // Auto-fill user data if logged in
  autoFillUserData();
  
  // Setup form handler
  setupCheckoutForm();
  
  // Update auth UI
  updateAuthUI();
  updateCartCount();
});

// Load order summary from cart
function loadOrderSummary() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const orderItemsContainer = document.getElementById('orderItems');
  
  if (cartItems.length === 0) {
    // Redirect to cart if empty
    window.location.href = 'cart.html';
    return;
  }
  
  orderItemsContainer.innerHTML = '';
  
  cartItems.forEach(item => {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="order-item-details">
        <div class="order-item-title">${item.title}</div>
        <div class="order-item-price">${item.price}</div>
        <div class="order-item-quantity">Qty: ${item.quantity}</div>
      </div>
    `;
    orderItemsContainer.appendChild(orderItem);
  });
  
  updateOrderSummary();
}

// Update order summary totals
function updateOrderSummary() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const subtotal = cartItems.reduce((total, item) => {
    const price = parseInt(item.price.replace('IDR ', '').replace('K', '000'));
    return total + (price * item.quantity);
  }, 0);
  
  const shipping = 5000; // IDR 5K
  const total = subtotal + shipping;
  
  document.getElementById('subtotal').textContent = `IDR ${subtotal / 1000}K`;
  document.getElementById('totalPrice').textContent = `IDR ${total / 1000}K`;
}

// Auto-fill user data if logged in
function autoFillUserData() {
  const currentUser = getCurrentUser();
  
  if (currentUser) {
    document.getElementById('firstName').value = currentUser.firstName;
    document.getElementById('lastName').value = currentUser.lastName;
    document.getElementById('phone').value = currentUser.phone;
    document.getElementById('address').value = currentUser.address;
  }
}

// Setup checkout form handler
function setupCheckoutForm() {
  const checkoutForm = document.getElementById('checkoutForm');
  
  checkoutForm.addEventListener('submit', handleCheckout);
}

// Handle checkout submission
async function handleCheckout(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const orderData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    notes: formData.get('notes'),
    paymentMethod: formData.get('paymentMethod'),
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
    orderDate: new Date().toISOString(),
    orderId: generateOrderId()
  };
  
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  placeOrderBtn.classList.add('loading');
  placeOrderBtn.disabled = true;
  
  try {
    // Validate payment method
    if (!orderData.paymentMethod) {
      showNotification('Pilih metode pembayaran!', 'error');
      return;
    }
    
    // Create order summary for WhatsApp
    const orderSummary = orderData.items.map(item => 
      `${item.title} x${item.quantity} - ${item.price}`
    ).join('\n');
    
    const total = document.getElementById('totalPrice').textContent;
    const paymentInfo = orderData.paymentMethod === 'transfer' 
      ? 'Transfer Bank BCA\nRek: 2782069951\na/n: Agitsna Wafa wafiyyah'
      : 'Cash on Delivery (COD)';
    
    // Create WhatsApp message
    const message = `Hallo kak, saya mau order Mochi%0A%0A📋 Detail Pesanan:%0A${orderSummary}%0A%0A👤 Data Pembeli:%0ANama: ${orderData.firstName} ${orderData.lastName}%0ATelepon: ${orderData.phone}%0AAlamat: ${orderData.address}%0A%0A📝 Catatan: ${orderData.notes || '-'}%0A%0A💳 Metode Pembayaran:%0A${paymentInfo}%0A%0A💰 Total: ${total}%0A%0A🆔 Order ID: ${orderData.orderId}%0A%0ATerima kasih!`;
    
    // Save order to localStorage
    saveOrder(orderData);
    
    // Open WhatsApp
    const waURL = `https://wa.me/6285212312795?text=${message}`;
    window.open(waURL, '_blank');
    
    // Clear cart
    localStorage.removeItem('cartItems');
    
    showNotification('Pesanan berhasil dikirim ke WhatsApp!', 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    
  } catch (error) {
    showNotification('Terjadi kesalahan saat checkout!', 'error');
  } finally {
    placeOrderBtn.classList.remove('loading');
    placeOrderBtn.disabled = false;
  }
}

// Generate unique order ID
function generateOrderId() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `MOCHI-${timestamp.slice(-6)}-${random}`;
}

// Save order to localStorage
function saveOrder(orderData) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(orderData);
  localStorage.setItem('orders', JSON.stringify(orders));
}

// Show notification
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
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
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
} 