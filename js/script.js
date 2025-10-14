// Mengambil elemen navbar dan hamburger menu
const navbarNav = document.querySelector('.navbar-nav');
const hamburgerMenu = document.querySelector('#hamburger-menu');

// Toggle menu saat hamburger diklik
hamburgerMenu.addEventListener('click', () => {
  navbarNav.classList.toggle('active');
});

// Menutup menu saat klik di luar
document.addEventListener('click', (event) => {
  const isClickInside = hamburgerMenu.contains(event.target) || navbarNav.contains(event.target);
  
  if (!isClickInside && navbarNav.classList.contains('active')) {
    navbarNav.classList.remove('active');
  }
});

// Animasi scroll untuk menu
const menuCards = document.querySelectorAll('.menu-card');

function checkScroll() {
  const triggerBottom = window.innerHeight * 0.8;

  menuCards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;

    if (cardTop < triggerBottom) {
      card.classList.add('show');
    }
  });
}

// Jalankan animasi saat halaman dimuat
window.addEventListener('load', checkScroll);

// Jalankan animasi saat scroll
window.addEventListener('scroll', checkScroll);

// Update cart count
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartCount = document.getElementById('cartCount');
  
  if (cartCount) {
    if (totalItems > 0) {
      cartCount.textContent = totalItems;
      cartCount.classList.remove('hidden');
    } else {
      cartCount.textContent = '0';
      cartCount.classList.add('hidden');
    }
  }
}

// Update auth UI based on login status
function updateAuthUI() {
  try {
    const currentUser = getCurrentUser();
    const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    
    if (!loginBtn || !userMenu) {
      console.warn('Login button or user menu not found');
      return;
    }
    
    if (userLoggedIn && currentUser) {
      // User is logged in
      loginBtn.style.display = 'none';
      userMenu.style.display = 'inline-block';
      userMenu.innerHTML = `
        <i data-feather="user"></i>
        <span class="user-name">${currentUser.firstName}</span>
      `;
      
      // Remove existing dropdown if any
      const existingDropdown = userMenu.querySelector('.user-dropdown');
      if (existingDropdown) {
        existingDropdown.remove();
      }
      
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
      
      // Replace feather icons
      if (typeof feather !== 'undefined') {
        feather.replace();
      }
      
      // Remove existing event listeners by cloning
      const newUserMenu = userMenu.cloneNode(true);
      userMenu.parentNode.replaceChild(newUserMenu, userMenu);
      
      // Add click handler for user menu
      newUserMenu.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdown = newUserMenu.querySelector('.user-dropdown');
        if (dropdown) {
          dropdown.classList.toggle('active');
        }
      });
      
      // Close dropdown when clicking outside
      const closeDropdownHandler = function(e) {
        if (!newUserMenu.contains(e.target)) {
          const dropdown = newUserMenu.querySelector('.user-dropdown');
          if (dropdown) {
            dropdown.classList.remove('active');
          }
        }
      };
      
      // Remove existing event listener and add new one
      document.removeEventListener('click', closeDropdownHandler);
      document.addEventListener('click', closeDropdownHandler);
      
    } else {
      // User is not logged in
      loginBtn.style.display = 'inline-block';
      userMenu.style.display = 'none';
    }
  } catch (error) {
    console.error('Error in updateAuthUI:', error);
  }
}

// Show profile function
function showProfile() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    alert(`Profil Pengguna:\nNama: ${currentUser.firstName} ${currentUser.lastName}\nEmail: ${currentUser.email}\nTelepon: ${currentUser.phone}\nAlamat: ${currentUser.address}`);
  }
}

// Fungsi untuk mengirim pesan WhatsApp
function sendWhatsApp() {
  const nama = document.getElementById('nama').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  // Validasi form
  if (!nama || !email || !phone) {
    showNotification('Mohon lengkapi semua data!', 'error');
    return false;
  }

  // Membuat pesan dengan format yang diinginkan
  const message = `Hallo kak saya mau order Mochi%0A%0ANama: ${nama}%0AEmail: ${email}%0ANo. HP: ${phone}%0A%0ASaya tertarik dengan produk mochi Anda. Mohon informasi lebih lanjut tentang menu yang tersedia dan cara pemesanan.`;

  // Membuat URL WhatsApp dengan pesan
  const waURL = `https://wa.me/6285212312795?text=${message}`;

  // Membuka WhatsApp di tab baru
  window.open(waURL, '_blank');

  // Reset form
  document.getElementById('waForm').reset();

  // Show success notification
  showNotification('Pesan berhasil dikirim ke WhatsApp!', 'success');

  // Mencegah form melakukan submit default
  return false;
}

// Fungsi untuk memesan langsung via WhatsApp
function orderDirect(productName, price) {
  // Tampilkan modal untuk input data
  const modal = document.createElement('div');
  modal.className = 'order-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Pesan ${productName}</h3>
        <button class="close-modal" onclick="closeOrderModal()">×</button>
      </div>
      <div class="modal-body">
        <p><strong>Produk:</strong> ${productName}</p>
        <p><strong>Harga:</strong> ${price}</p>
        <form id="directOrderForm">
          <div class="form-group">
            <label for="orderName">Nama Lengkap *</label>
            <input type="text" id="orderName" required>
          </div>
          <div class="form-group">
            <label for="orderPhone">Nomor Telepon *</label>
            <input type="tel" id="orderPhone" required>
          </div>
          <div class="form-group">
            <label for="orderAddress">Alamat Pengiriman *</label>
            <textarea id="orderAddress" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="orderQuantity">Jumlah Pesanan *</label>
            <input type="number" id="orderQuantity" min="1" value="1" required>
          </div>
          <div class="form-group">
            <label for="orderNotes">Catatan (Opsional)</label>
            <textarea id="orderNotes" rows="2" placeholder="Catatan khusus..."></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" onclick="closeOrderModal()">Batal</button>
            <button type="submit" class="btn-primary">
              <i data-feather="send"></i>
              Kirim Pesanan
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  feather.replace();
  
  // Handle form submission
  document.getElementById('directOrderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const address = document.getElementById('orderAddress').value;
    const quantity = document.getElementById('orderQuantity').value;
    const notes = document.getElementById('orderNotes').value;
    
    // Calculate total price
    const priceValue = parseInt(price.replace('IDR ', '').replace('K', '000'));
    const totalPrice = priceValue * quantity;
    
    // Create WhatsApp message
    const message = `Hallo kak, saya mau order Mochi%0A%0A📋 Detail Pesanan:%0A${productName} x${quantity} - ${price}%0A%0A👤 Data Pembeli:%0ANama: ${name}%0ATelepon: ${phone}%0AAlamat: ${address}%0A%0A📝 Catatan: ${notes || '-'}%0A%0A💰 Total: IDR ${totalPrice / 1000}K%0A%0AMohon konfirmasi pesanan saya. Terima kasih!`;
    
    // Open WhatsApp
    const waURL = `https://wa.me/6285212312795?text=${message}`;
    window.open(waURL, '_blank');
    
    // Close modal
    closeOrderModal();
    
    // Show success notification
    showNotification('Pesanan berhasil dikirim ke WhatsApp!', 'success');
  });
}

// Fungsi untuk menutup modal
function closeOrderModal() {
  const modal = document.querySelector('.order-modal');
  if (modal) {
    modal.remove();
  }
}

// Event listener untuk menutup modal saat klik di luar
let modalClickHandler = null;
let modalKeyHandler = null;

function setupModalEventListeners() {
  // Remove existing handlers
  if (modalClickHandler) {
    document.removeEventListener('click', modalClickHandler);
  }
  if (modalKeyHandler) {
    document.removeEventListener('keydown', modalKeyHandler);
  }
  
  // Create new handlers
  modalClickHandler = function(e) {
    const modal = document.querySelector('.order-modal');
    if (modal && e.target === modal) {
      closeOrderModal();
    }
  };
  
  modalKeyHandler = function(e) {
    if (e.key === 'Escape') {
      closeOrderModal();
    }
  };
  
  // Add new handlers
  document.addEventListener('click', modalClickHandler);
  document.addEventListener('keydown', modalKeyHandler);
}

// Setup modal event listeners on page load
document.addEventListener('DOMContentLoaded', function() {
  setupModalEventListeners();
});

// Search Form
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
const searchBtn = document.querySelector('#search');

searchBtn.onclick = (e) => {
  e.preventDefault();
  searchForm.classList.toggle('active');
  searchBox.focus();
};

// Klik di luar search form
document.addEventListener('click', function(e) {
  if (!searchBtn.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove('active');
  }
});

// Search functionality
searchBox.addEventListener('keyup', function(e) {
  const searchText = e.target.value.toLowerCase();
  const menuCards = document.querySelectorAll('.menu-card');
  
  menuCards.forEach(card => {
    const title = card.querySelector('.menu-card-title').textContent.toLowerCase();
    if (title.includes(searchText)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

// Add to Cart functionality
const addToCartBtns = document.querySelectorAll('.add-to-cart');

addToCartBtns.forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    
    const menuCard = this.closest('.menu-card');
    const title = menuCard.querySelector('.menu-card-title').textContent;
    const price = menuCard.querySelector('.menu-card-price').textContent;
    const imgSrc = menuCard.querySelector('img').src;
    
    // Get existing cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.title === title);
    
    if (existingItemIndex !== -1) {
      // If item exists, increase quantity
      cartItems[existingItemIndex].quantity += 1;
    } else {
      // If item doesn't exist, add new item
      cartItems.push({
        title: title,
        price: price,
        image: imgSrc,
        quantity: 1
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart count
    updateCartCount();
    
    // Animasi feedback
    this.innerHTML = '<i data-feather="check"></i> Added!';
    this.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
    
    setTimeout(() => {
      this.innerHTML = '<i data-feather="shopping-cart"></i> Add to Cart';
      this.style.background = 'linear-gradient(45deg, var(--primary), #68c587)';
      feather.replace();
    }, 1500);
    
    // Show success notification
    showNotification('Item berhasil ditambahkan ke keranjang!', 'success');
  });
});

// Show notification function
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

// Clean up corrupted data
function cleanupCorruptedData() {
  try {
    // Check if currentUser exists but isLoggedIn is false
    const currentUser = localStorage.getItem('currentUser');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (currentUser && isLoggedIn !== 'true') {
      console.log('Cleaning up corrupted auth data');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('rememberMe');
    }
    
    // Check if cartItems is corrupted
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      try {
        JSON.parse(cartItems);
      } catch (e) {
        console.log('Cleaning up corrupted cart data');
        localStorage.removeItem('cartItems');
      }
    }
  } catch (error) {
    console.error('Error cleaning up data:', error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  cleanupCorruptedData();
  updateAuthUI();
  updateCartCount();
});
