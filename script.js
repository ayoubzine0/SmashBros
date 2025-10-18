// -----------------------------
// CART + TRANSLATION + SWITCHING LOGIC
// -----------------------------

// Cached DOM elements
const openCartBtn = document.getElementById("open-cart");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const productsContainer = document.getElementById("products-container");
const langSwitch = document.getElementById("lang-switch");

// LocalStorage keys
const CART_KEY = "motoCart";
const LANG_KEY = "motoLang";

// Initialize state
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
let currentLang = localStorage.getItem(LANG_KEY) || "en";

// -----------------------------
// Helper: Ensure Open Cart button has dot + label
// -----------------------------
function ensureOpenCartStructure() {
  const btn = document.getElementById("open-cart");
  if (!btn) return;

  // Ensure #cart-count span exists
  let span = document.getElementById("cart-count");
  if (!span) {
    span = document.createElement("span");
    span.id = "cart-count";
    span.className = "hidden";
    span.textContent = "0";
    btn.insertBefore(span, btn.firstChild.nextSibling);
  }

  // Ensure label span exists
  let label = btn.querySelector(".cart-label");
  if (!label) {
    label = document.createElement("span");
    label.className = "cart-label";
    label.textContent = currentLang === "ar" ? "عرض السلة" : "Open Cart";
    btn.appendChild(label);
  }
}
ensureOpenCartStructure();

// -----------------------------
// Safe updater for button text
// -----------------------------
function safeOpenCartUpdate(enText, arText) {
  const btn = document.getElementById("open-cart");
  if (!btn) return;
  const label = btn.querySelector(".cart-label");
  if (label) label.textContent = currentLang === "en" ? enText : arText;
}

// -----------------------------
// Product Data (example placeholders, replace with yours)
// -----------------------------
const allProducts = {
  sanya: [
    { id: "s1", name_en: "Sanya Front Light", name_ar: "ضوء أمامي سانيا", price: 250 },
    { id: "s2", name_en: "Sanya Engine Cover", name_ar: "غطاء المحرك سانيا", price: 400 }
  ],
  becane: [
    { id: "b1", name_en: "Becane Headlight", name_ar: "مصباح أمامي بيكان", price: 270 },
    { id: "b2", name_en: "Becane Exhaust", name_ar: "عادم بيكان", price: 500 }
  ],
  c50: [
    { id: "c1", name_en: "C50 Chain", name_ar: "سلسلة C50", price: 180 },
    { id: "c2", name_en: "C50 Mirror", name_ar: "مرآة C50", price: 90 }
  ]
};

// -----------------------------
// Render products by type
// -----------------------------
function renderProducts(type) {
  productsContainer.innerHTML = "";
  const products = allProducts[type];
  if (!products) return;

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${currentLang === "en" ? p.name_en : p.name_ar}</h3>
      <p>${p.price} MAD</p>
      <button class="add-btn" data-id="${p.id}" data-type="${type}">
        ${currentLang === "en" ? "Add to Cart" : "أضف إلى السلة"}
      </button>
    `;
    productsContainer.appendChild(div);
  });

  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      const type = e.target.dataset.type;
      addToCart(type, id);
    });
  });
}

// -----------------------------
// Add to Cart Logic
// -----------------------------
function addToCart(type, id) {
  const products = allProducts[type];
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, type, qty: 1 });
  }

  saveCart();
  updateCartDisplay();
}

// -----------------------------
// Save and Update Cart
// -----------------------------
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartDisplay() {
  // Number of unique types in cart
  const uniqueTypes = new Set(cart.map(item => item.type));
  const count = uniqueTypes.size;

  if (count > 0) {
    cartCount.textContent = count;
    cartCount.classList.remove("hidden");
  } else {
    cartCount.classList.add("hidden");
  }

  safeOpenCartUpdate("Open Cart", "عرض السلة");
}

// -----------------------------
// Cart Modal Handling
// -----------------------------
function openCart() {
  cartModal.style.display = "block";
  renderCartItems();
}

function closeCart() {
  cartModal.style.display = "none";
}

function renderCartItems() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  if (cart.length === 0) {
    container.innerHTML =
      currentLang === "en" ? "<p>Your cart is empty.</p>" : "<p>سلتك فارغة.</p>";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${currentLang === "en" ? item.name_en : item.name_ar}</span>
      <span>${item.price} MAD x ${item.qty}</span>
      <button class="remove" data-id="${item.id}">${
      currentLang === "en" ? "Remove" : "إزالة"
    }</button>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      cart = cart.filter(i => i.id !== id);
      saveCart();
      updateCartDisplay();
      renderCartItems();
    });
  });
}

// -----------------------------
// Switch Language
// -----------------------------
function switchLang() {
  currentLang = currentLang === "en" ? "ar" : "en";
  localStorage.setItem(LANG_KEY, currentLang);

  document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
  safeOpenCartUpdate("Open Cart", "عرض السلة");
  langSwitch.textContent = currentLang === "en" ? "AR" : "EN";

  // re-render current product set if it exists
  const currentType = document.querySelector(".switch-btn.active")?.dataset.type || "sanya";
  renderProducts(currentType);
  renderCartItems();
}

// -----------------------------
// Switch Product Type
// -----------------------------
function setupTypeSwitching() {
  document.querySelectorAll(".switch-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".switch-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const type = btn.dataset.type;
      renderProducts(type);
    });
  });
}

// -----------------------------
// Init
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay();
  renderProducts("sanya");
  setupTypeSwitching();
  document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
  langSwitch.textContent = currentLang === "en" ? "AR" : "EN";

  // Event listeners
  openCartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  langSwitch.addEventListener("click", switchLang);
});
