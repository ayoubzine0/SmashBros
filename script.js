// -----------------------------
// script.js - Full bilingual cart (paste in place)
// -----------------------------

// Cached DOM elements
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
// Product Data (full list)
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

    const title = currentLang === "en" ? product.name_en : product.name_ar;
    const priceText = `${product.price} MAD`;
    const addText = currentLang === "en" ? "Add to Cart" : "أضف إلى السلة";

    // Product card (click opens popup)
    div.innerHTML = `
      <img src="${product.img}" alt="${product.name_en}" />
      <h3>${title}</h3>
      <p>${priceText}</p>
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
  addToCartBtn.textContent = currentLang === "en" ? "Add to Cart" : "أضف إلى السلة";

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
    // store minimal product fields to cart to keep search simple
    currentCart.push({ id: product.id, model, name_en: product.name_en, name_ar: product.name_ar, price: product.price, qty });
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
  const count = currentCart.reduce((sum, item) => sum + (item.qty || 1), 0);
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
    totalEl.textContent = `${currentLang === "en" ? "Total" : "المجموع"}: 0 MAD`;
    return;
  }

  currentCart.forEach((item, index) => {
    const name = currentLang === "en" ? item.name_en : item.name_ar;
    const lineTotal = item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${name} (x${item.qty})</span>
      <span>${lineTotal} MAD</span>
      <button data-index="${index}">✖</button>
    `;
    cartItems.appendChild(li);
    total += lineTotal;
  });

  totalEl.textContent = `${currentLang === "en" ? "Total" : "المجموع"}: ${total} MAD`;

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

  const phone = "212600123456"; // Replace with your WhatsApp number (without leading +)
  let message = currentLang === "en" ? "Order Details:\n" : "تفاصيل الطلب:\n";
  currentCart.forEach(item => {
    const name = currentLang === "en" ? item.name_en : item.name_ar;
    message += `${name} x${item.qty} - ${item.price * item.qty} MAD\n`;
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

  // Update navbar button labels
  document.getElementById("about-link").textContent =
    currentLang === "en" ? "About" : "حول";
  document.getElementById("contact-link").textContent =
    currentLang === "en" ? "Contact" : "اتصال";
  document.getElementById("checkout-btn").textContent =
    currentLang === "en" ? "Checkout on WhatsApp" : "اتمام الطلب عبر واتساب";
  const cartH2 = document.querySelector("#cart h2");
  if (cartH2) cartH2.textContent =
    currentLang === "en" ? "🛒 Cart" : "🛒 السلة";
  const cartLabel = document.querySelector(".cart-label");
  if (cartLabel) cartLabel.textContent =
    currentLang === "en" ? "Open Cart" : "افتح السلة";

  addToCartBtn.textContent = currentLang === "en" ? "Add to Cart" : "أضف إلى السلة";

  // Update popups content
  updatePopupContent();

  // Re-render everything
  renderProducts(currentModel);
  updateCartDisplay();
}

// -----------------------------
// Update About & Contact Popups
// -----------------------------
function updatePopupContent() {
  const aboutTitle = aboutPopup.querySelector("h2");
  const aboutText = aboutPopup.querySelector("p");
  const contactTitle = contactPopup.querySelector("h2");
  const contactPs = contactPopup.querySelectorAll("p");

  if (currentLang === "en") {
    if (aboutTitle) aboutTitle.textContent = "About Bee Auto Parts";
    if (aboutText) aboutText.textContent =
      "Bee Auto Parts is Morocco’s trusted source for quality motorcycle and car parts...";
    if (contactTitle) contactTitle.textContent = "Contact Us";
    if (contactPs[0]) contactPs[0].textContent = "📞 Phone: +212 600-123456";
    if (contactPs[1]) contactPs[1].textContent = "📧 Email: contact@beeautoparts.ma";
    if (contactPs[2]) contactPs[2].textContent = "📍 Address: Casablanca, Morocco";
  } else {
    if (aboutTitle) aboutTitle.textContent = "حول Bee Auto Parts";
    if (aboutText) aboutText.textContent =
      "Bee Auto Parts هي المصدر الموثوق في المغرب لقطع غيار الدراجات النارية والسيارات عالية الجودة...";
    if (contactTitle) contactTitle.textContent = "اتصل بنا";
    if (contactPs[0]) contactPs[0].textContent = "📞 الهاتف: ‎+212 600-123456";
    if (contactPs[1]) contactPs[1].textContent = "📧 البريد الإلكتروني: contact@beeautoparts.ma";
    if (contactPs[2]) contactPs[2].textContent = "📍 العنوان: الدار البيضاء، المغرب";
  }
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
  updatePopupContent();
  aboutPopup.classList.remove("hidden");
}

function openContact() {
  updatePopupContent();
  contactPopup.classList.remove("hidden");
}

// -----------------------------
// Init on Load
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Set initial language from storage
  document.documentElement.lang = currentLang;
  document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
  translateBtn.textContent = currentLang === "en" ? "عربي" : "EN";

  // Ensure nav labels show correct language on load
  document.getElementById("about-link").textContent =
    currentLang === "en" ? "About" : "حول";
  document.getElementById("contact-link").textContent =
    currentLang === "en" ? "Contact" : "اتصال";
  document.getElementById("checkout-btn").textContent =
    currentLang === "en" ? "Checkout on WhatsApp" : "اتمام الطلب عبر واتساب";
  const cartH2 = document.querySelector("#cart h2");
  if (cartH2) cartH2.textContent = currentLang === "en" ? "🛒 Cart" : "🛒 السلة";
  const cartLabel = document.querySelector(".cart-label");
  if (cartLabel) cartLabel.textContent = currentLang === "en" ? "Open Cart" : "افتح السلة";

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
  const sanyaBtn = document.getElementById("sanya-link");
  const becaneBtn = document.getElementById("becane-link");
  const c50Btn = document.getElementById("c50-link");
  if (sanyaBtn) sanyaBtn.addEventListener("click", () => switchModel("sanya"));
  if (becaneBtn) becaneBtn.addEventListener("click", () => switchModel("becane"));
  if (c50Btn) c50Btn.addEventListener("click", () => switchModel("c50"));

  // Popup buttons
  document.getElementById("about-link").addEventListener("click", openAbout);
  document.getElementById("contact-link").addEventListener("click", openContact);

  // Close popups
  popupClose.forEach(btn => btn.addEventListener("click", closePopups));
  [productPopup, aboutPopup, contactPopup].forEach(popup => {
    if (!popup) return;
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopups();
    });
  });
});
