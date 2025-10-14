// Auth JavaScript
document.addEventListener('DOMContentLoaded', function() {
  feather.replace();
  
  // Check if user is already logged in
  checkAuthStatus();
  
  // Setup form handlers
  setupFormHandlers();
});

// Check authentication status
function checkAuthStatus() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  if (currentUser && isLoggedIn === 'true') {
    // User is logged in, redirect to main page if on auth pages
    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
      window.location.href = 'index.html';
    }
  } else {
    // User is not logged in, redirect to login if trying to access protected pages
    const protectedPages = ['cart.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
      window.location.href = 'login.html';
    }
  }
  
  // Update UI after checking auth status
  if (typeof updateAuthUI === 'function') {
    updateAuthUI();
  }
}

// Setup form handlers
function setupFormHandlers() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;
  
  const loginBtn = e.target.querySelector('.auth-btn');
  loginBtn.classList.add('loading');
  loginBtn.disabled = true;
  
  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Login successful
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      
      if (remember) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      showNotification('Login berhasil!', 'success');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      // Login failed
      showNotification('Email atau password salah!', 'error');
    }
  } catch (error) {
    showNotification('Terjadi kesalahan saat login!', 'error');
  } finally {
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;
  }
}

// Handle register
async function handleRegister(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const terms = document.getElementById('terms').checked;
  
  // Validation
  if (password !== confirmPassword) {
    showNotification('Password tidak cocok!', 'error');
    return;
  }
  
  if (password.length < 6) {
    showNotification('Password minimal 6 karakter!', 'error');
    return;
  }
  
  if (!terms) {
    showNotification('Anda harus menyetujui syarat & ketentuan!', 'error');
    return;
  }
  
  const registerBtn = e.target.querySelector('.auth-btn');
  registerBtn.classList.add('loading');
  registerBtn.disabled = true;
  
  try {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      showNotification('Email sudah terdaftar!', 'error');
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      address,
      password,
      createdAt: new Date().toISOString()
    };
    
    // Add user to storage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    showNotification('Registrasi berhasil!', 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (error) {
    showNotification('Terjadi kesalahan saat registrasi!', 'error');
  } finally {
    registerBtn.classList.remove('loading');
    registerBtn.disabled = false;
  }
}

// Logout function
function logout() {
  try {
    // Clear all auth data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('cartItems'); // Clear cart on logout
    
    showNotification('Logout berhasil!', 'success');
    
    // Update UI immediately
    if (typeof updateAuthUI === 'function') {
      updateAuthUI();
    }
    
    // Update cart count
    if (typeof updateCartCount === 'function') {
      updateCartCount();
    }
    
    // Redirect after a short delay
    setTimeout(() => {
      // Only redirect if we're on a protected page
      const currentPage = window.location.pathname.split('/').pop();
      const protectedPages = ['cart.html', 'checkout.html'];
      
      if (protectedPages.includes(currentPage)) {
        window.location.href = 'index.html';
      }
    }, 1500);
    
  } catch (error) {
    console.error('Error during logout:', error);
    showNotification('Terjadi kesalahan saat logout!', 'error');
  }
}

// Get current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById('password');
  const toggleBtn = document.querySelector('.toggle-password i');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleBtn.setAttribute('data-feather', 'eye-off');
  } else {
    passwordInput.type = 'password';
    toggleBtn.setAttribute('data-feather', 'eye');
  }
  
  feather.replace();
}

// Toggle confirm password visibility
function toggleConfirmPassword() {
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const toggleBtn = document.querySelector('.toggle-password:last-of-type i');
  
  if (confirmPasswordInput.type === 'password') {
    confirmPasswordInput.type = 'text';
    toggleBtn.setAttribute('data-feather', 'eye-off');
  } else {
    confirmPasswordInput.type = 'password';
    toggleBtn.setAttribute('data-feather', 'eye');
  }
  
  feather.replace();
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

// Social login handlers (placeholder)
function handleGoogleLogin() {
  showNotification('Fitur login Google akan segera hadir!', 'info');
}

function handleFacebookLogin() {
  showNotification('Fitur login Facebook akan segera hadir!', 'info');
}

// Add event listeners for social buttons
document.addEventListener('DOMContentLoaded', function() {
  const googleBtn = document.querySelector('.social-btn.google');
  const facebookBtn = document.querySelector('.social-btn.facebook');
  
  if (googleBtn) {
    googleBtn.addEventListener('click', handleGoogleLogin);
  }
  
  if (facebookBtn) {
    facebookBtn.addEventListener('click', handleFacebookLogin);
  }
}); 