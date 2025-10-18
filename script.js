// -----------------------------
// CART + TRANSLATION + PRODUCT SWITCHING LOGIC
// -----------------------------

// Cached DOM elements (updated to match your HTML)
const openCartBtn = document.getElementById("open-cart");
const cartCount = document.getElementById("cart-count");
const cart = document.getElementById("cart");
const closeCartBtn = document.getElementById("close-cart");
const productList = document.getElementById("product-list");
const translateBtn = document.getElementById("translate-btn");
const productPopup = document.getElementById("product-popup");
const aboutPopup = document.getElementById("about-popup");
const contactPopup = document.getElementById("contact-popup");
const popupClose = document.querySelectorAll(".close, .close-about, .close-contact");
const addToCartBtn = document.getElementById("add-to-cart");
const quantitySelect = document.getElementById("quantity");
const checkoutBtn = document.getElementById("checkout-btn");

// LocalStorage keys
const CART_KEY = "beeCart";
const LANG_KEY = "beeLang";

// Initialize state
let currentCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
let currentLang = localStorage.getItem(LANG_KEY) || "en";
let currentModel = "sanya"; // Default model

// -----------------------------
// Product Data (replace with your real data; added images and stock for completeness)
// -----------------------------
const allProducts = {
  sanya: [
    { id: "s1", name_en: "Sanya Front Light", name_ar: "ضوء أمامي سانيا", price: 250, img: "https://i.imgur.com/r9i7m4b.png", stock: 10 },
    { id: "s2", name_en: "Sanya Engine Cover", name_ar: "غطاء المحرك سانيا", price: 400, img: "https://i.imgur.com/r9i7m4b.png", stock: 5 },
    { id: "s3", name_en: "Speedometer", name_ar: "عداد السرعة", price: 400, img: "https://i.imgur.com/r9i7m4b.png", stock: 5 },
    { id: "s4", name_en: "Sanya Headlight", name_ar: "المصباح الأمامي سانيا", price: 400, img: "https://i.imgur.com/r9i7m4b.png", stock: 5 },
    { id: "s5", name_en: "Sanya Rear Shock Absorber", name_ar: "ممتص الصدمات الخلفي سانيا", price: 400, img: "https://i.imgur.com/r9i7m4b.png", stock: 5 },
    { id: "s6", name_en: "Sanya Front Brake Lever", name_ar: "ذراع فرامل أمامية سانيا", price: 400, img: "https://i.imgur.com/r9i7m4b.png", stock: 5 },
    { id: "s7", name_en: "Sanya Exhaust Pipe", name_ar: "أنبوب العادم سانيا", price: 400, img: "https://i.imgur.com/r9i7m4b.png", stock: 5 }
  ],
  becane: [
    { id: "b1", name_en: "Becane Headlight", name_ar: "مصباح أمامي بيكان", price: 270, img: "https://i.imgur.com/r9i7m4b.png", stock: 8 },
    { id: "b2", name_en: "Becane Exhaust", name_ar: "عادم بيكان", price: 500, img: "https://i.imgur.com/r9i7m4b.png", stock: 3 }
  ],
  c50: [
    { id: "c1", name_en: "C50 Chain", name_ar: "سلسلة C50", price: 180, img: "https://i.imgur.com/r9i7m4b.png", stock: 15 },
    { id: "c2", name_en: "C50 Mirror", name_ar: "مرآة C50", price: 90, img: "https://i.imgur.com/r9i7m4b.png", stock: 20 }
  ]
};

// -----------------------------
// Render Products for Current Model
// -----------------------------
function renderProducts(model) {
  productList.innerHTML = "";
  const products = allProducts[model];
  if (!products) return;

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.img}" alt="${product.name_en}" />
      <h3>${currentLang === "en" ? product.name_en : product.name_ar}</h3>
      <p>${product.price} MAD</p>
    `;
    div.addEventListener("click", () => openProductPopup(product));
    productList.appendChild(div);
  });
}

// -----------------------------
// Open Product Popup
// -----------------------------
function openProductPopup(product) {
  document.getElementById("popup-title").textContent = currentLang === "en" ? product.name_en : product.name_ar;
  document.getElementById("popup-img").src = product.img;
  document.getElementById("popup-price").textContent = `${product.price} MAD`;
  document.getElementById("popup-stock").textContent = currentLang === "en" ? `In Stock: ${product.stock}` : `متوفر: ${product.stock}`;

  // Populate quantity options (up to stock)
  quantitySelect.innerHTML = "";
  for (let i = 1; i <= product.stock; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    quantitySelect.appendChild(option);
  }

  // Store current product for add-to-cart
  addToCartBtn.dataset.productId = product.id;
  addToCartBtn.dataset.model = currentModel;

  productPopup.classList.remove("hidden");
}

// -----------------------------
// Close Popups
// -----------------------------
function closePopups() {
  productPopup.classList.add("hidden");
  aboutPopup.classList.add("hidden");
  contactPopup.classList.add("hidden");
}

// -----------------------------
// Add to Cart from Popup
// -----------------------------
function addToCart() {
  const productId = addToCartBtn.dataset.productId;
  const model = addToCartBtn.dataset.model;
  const qty = parseInt(quantitySelect.value);

  const products = allProducts[model];
  const product = products.find(p => p.id === productId);
  if (!product || qty > product.stock) return;

  const existing = currentCart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    currentCart.push({ ...product, model, qty });
  }

  saveCart();
  updateCartDisplay();
  closePopups();
  alert(currentLang === "en" ? "Added to cart!" : "تمت الإضافة إلى السلة!");
}

// -----------------------------
// Save and Update Cart
// -----------------------------
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(currentCart));
}

function updateCartDisplay() {
  const count = currentCart.length;
  if (count > 0) {
    cartCount.textContent = count;
    cartCount.classList.remove("hidden");
  } else {
    cartCount.classList.add("hidden");
  }

  // Update cart items list
  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  cartItems.innerHTML = "";
  let total = 0;

  if (currentCart.length === 0) {
    cartItems.innerHTML = `<p>${currentLang === "en" ? "Your cart is empty." : "سلتك فارغة."}</p>`;
    totalEl.textContent = `Total: 0 MAD`;
    return;
  }

  currentCart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${currentLang === "en" ? item.name_en : item.name_ar} (x${item.qty})</span>
      <span>${item.price * item.qty} MAD</span>
      <button data-index="${index}">✖</button>
    `;
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });

  totalEl.textContent = `Total: ${total} MAD`;

  // Add remove listeners
  document.querySelectorAll("#cart-items button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      currentCart.splice(index, 1);
      saveCart();
      updateCartDisplay();
    });
  });
}

// -----------------------------
// Open/Close Cart
// -----------------------------
function openCart() {
  cart.classList.add("open");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cart.classList.remove("open");
  document.body.classList.remove("cart-open");
}

// -----------------------------
// Checkout on WhatsApp
// -----------------------------
function checkout() {
  if (currentCart.length === 0) return;

  const phone = "+212600123456"; // Replace with your WhatsApp number
  let message = currentLang === "en" ? "Order Details:\n" : "تفاصيل الطلب:\n";
  currentCart.forEach(item => {
    message += `${currentLang === "en" ? item.name_en : item.name_ar} x${item.qty} - ${item.price * item.qty} MAD\n`;
  });
  const total = currentCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  message += `${currentLang === "en" ? "Total" : "المجموع"}: ${total} MAD`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

// -----------------------------
// Switch Language
// -----------------------------
function switchLang() {
  currentLang = currentLang === "en" ? "ar" : "en";
  localStorage.setItem(LANG_KEY, currentLang);

  document.documentElement.lang = currentLang;
  document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
  translateBtn.textContent = currentLang === "en" ? "عربي" : "EN";

  // Re-render everything
  renderProducts(currentModel);
  updateCartDisplay();
}

// -----------------------------
// Switch Model (via nav buttons)
// -----------------------------
function switchModel(model) {
  currentModel = model;
  renderProducts(model);
}

// -----------------------------
// Open About/Contact Popups
// -----------------------------
function openAbout() {
  aboutPopup.classList.remove("hidden");
}

function openContact() {
  contactPopup.classList.remove("hidden");
}

// -----------------------------
// Init on Load
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Set initial language
  document.documentElement.lang = currentLang;
  document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
  translateBtn.textContent = currentLang === "en" ? "عربي" : "EN";

  // Load initial products and cart
  renderProducts(currentModel);
  updateCartDisplay();

  // Event Listeners
  openCartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  translateBtn.addEventListener("click", switchLang);
  addToCartBtn.addEventListener("click", addToCart);
  checkoutBtn.addEventListener("click", checkout);

  // Model buttons
  document.getElementById("sanya-link").addEventListener("click", () => switchModel("sanya"));
  document.getElementById("becane-link").addEventListener("click", () => switchModel("becane"));
  document.getElementById("c50-link").addEventListener("click", () => switchModel("c50"));

  // Popup buttons
  document.getElementById("about-link").addEventListener("click", openAbout);
  document.getElementById("contact-link").addEventListener("click", openContact);

  // Close popups
  popupClose.forEach(btn => btn.addEventListener("click", closePopups));
  [productPopup, aboutPopup, contactPopup].forEach(popup => {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopups();
    });
  });
});


