// script.js - fully fixed, bilingual, cart with all features preserved

// -----------------------------
// CART + TRANSLATION + PRODUCT LOGIC
// -----------------------------

const CART_KEY = "beeCart";
const LANG_KEY = "beeLang";

let currentCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
let currentLang = localStorage.getItem(LANG_KEY) || "en";
let currentModel = window.PAGE_MODEL || "sanya"; // page-specific model

// Product data (kept intact)
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

// Cached DOM elements
let openCartBtn, cartCount, cartEl, closeCartBtn, productList, translateBtn, productPopup, aboutPopup, contactPopup, addToCartBtn, quantitySelect, checkoutBtn, toast;

// -----------------------------
// Render products
// -----------------------------
function renderProducts(model) {
  if (!productList) return;
  productList.innerHTML = "";
  const products = allProducts[model];
  if (!products) return;

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.img}" alt="${product.name_en}" />
      <h3 class="product-title">${currentLang === "en" ? product.name_en : product.name_ar}</h3>
      <p class="product-price">${product.price} MAD</p>
      <div class="product-actions">
        <button class="card-add-btn" title="${currentLang === 'en' ? 'Add' : 'أضف'}">${currentLang === "en" ? "Add" : "أضف"}</button>
      </div>
    `;

    // card click opens popup
    div.addEventListener("click", () => openProductPopup(product));

    // add button opens popup, stops propagation
    div.querySelector(".card-add-btn").addEventListener("click", e => {
      e.stopPropagation();
      openProductPopup(product);
    });

    productList.appendChild(div);
  });
}

// -----------------------------
// Product popup
// -----------------------------
function openProductPopup(product) {
  if (!productPopup) return;

  const titleEl = document.getElementById("popup-title");
  const imgEl = document.getElementById("popup-img");
  const priceEl = document.getElementById("popup-price");
  const stockEl = document.getElementById("popup-stock");
  const qtyLabel = document.querySelector("label[for='quantity']");

  titleEl.textContent = currentLang === "en" ? product.name_en : product.name_ar;
  imgEl.src = product.img;
  priceEl.textContent = `${product.price} MAD`;
  stockEl.textContent = currentLang === "en" ? `In Stock: ${product.stock}` : `متوفر: ${product.stock}`;
  if (qtyLabel) qtyLabel.textContent = currentLang === "en" ? "Qty:" : "الكمية:";

  if (quantitySelect) {
    quantitySelect.innerHTML = "";
    for (let i = 1; i <= product.stock; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      quantitySelect.appendChild(option);
    }
  }

  if (addToCartBtn) {
    addToCartBtn.dataset.productId = product.id;
    addToCartBtn.dataset.model = currentModel;
    addToCartBtn.textContent = currentLang === "en" ? "Add to Cart" : "أضف إلى السلة";
  }

  productPopup.classList.remove("hidden");
}

// -----------------------------
// Close popups
// -----------------------------
function closePopups() {
  if (productPopup) productPopup.classList.add("hidden");
  if (aboutPopup) aboutPopup.classList.add("hidden");
  if (contactPopup) contactPopup.classList.add("hidden");
}

// -----------------------------
// Add to cart
// -----------------------------
function addToCart() {
  if (!addToCartBtn) return;
  const productId = addToCartBtn.dataset.productId;
  const model = addToCartBtn.dataset.model;
  const qty = parseInt(quantitySelect.value, 10);

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
  showToast(currentLang === "en" ? "Added to cart!" : "تمت الإضافة إلى السلة!");
}

// -----------------------------
// Save & update cart
// -----------------------------
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(currentCart));
}

function updateCartDisplay() {
  if (!cartCount) return;

  const count = currentCart.reduce((sum, it) => sum + (it.qty || 1), 0);
  cartCount.textContent = count;
  cartCount.classList.toggle("hidden", count === 0);

  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  if (!cartItems || !totalEl) return;

  cartItems.innerHTML = "";
  let total = 0;

  if (currentCart.length === 0) {
    cartItems.innerHTML = `<p>${currentLang === "en" ? "Your cart is empty." : "سلتك فارغة."}</p>`;
    totalEl.textContent = `${currentLang === "en" ? "Total" : "المجموع"}: 0 MAD`;
    return;
  }

  currentCart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${currentLang === "en" ? item.name_en : item.name_ar} (x${item.qty})</span>
      <span>${item.price * item.qty} MAD</span>
      <button data-index="${index}" title="${currentLang === 'en' ? 'Remove' : 'حذف'}">✖</button>
    `;
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });

  totalEl.textContent = `${currentLang === "en" ? "Total" : "المجموع"}: ${total} MAD`;

  // Remove items
  cartItems.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = parseInt(e.target.dataset.index, 10);
      currentCart.splice(idx, 1);
      saveCart();
      updateCartDisplay();
    });
  });

  checkRTL();
}

// -----------------------------
// Open/close cart
// -----------------------------
function openCart() {
  if (!cartEl) return;
  cartEl.classList.add("open");
  document.body.classList.add("cart-open");
}

function closeCart() {
  if (!cartEl) return;
  cartEl.classList.remove("open");
  document.body.classList.remove("cart-open");
}

// -----------------------------
// Checkout
// -----------------------------
function checkout() {
  if (currentCart.length === 0) return;

  const phone = "212724680135";
  let msg = currentLang === "en" ? "Order Details:\n" : "تفاصيل الطلب:\n";
  currentCart.forEach(item => {
    msg += `${currentLang === "en" ? item.name_en : item.name_ar} x${item.qty} - ${item.price * item.qty} MAD\n`;
  });
  const total = currentCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  msg += `${currentLang === "en" ? "Total" : "المجموع"}: ${total} MAD`;

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
}

// -----------------------------
// Toast
// -----------------------------
function showToast(msg) {
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #f1c40f;
      color: #000;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 99999;
      display: none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 1500);
}

// -----------------------------
// Language / translations
// -----------------------------
function applyTranslations() {
  if (translateBtn) translateBtn.textContent = currentLang === "en" ? "عربي" : "EN";
  const aboutLink = document.getElementById("about-link");
  const contactLink = document.getElementById("contact-link");
  if (aboutLink) aboutLink.textContent = currentLang === "en" ? "About" : "حول";
  if (contactLink) contactLink.textContent = currentLang === "en" ? "Contact" : "اتصال";

  const brandTitle = document.querySelector(".brand h1");
  if (brandTitle) brandTitle.textContent = currentLang === "en" ? "Bee Auto Parts" : "Bee لقطع غيار السيارات";

  const cartH2 = document.querySelector("#cart h2");
  if (cartH2) cartH2.textContent = currentLang === "en" ? "🛒 Cart" : "🛒 السلة";

  const checkoutBtnEl = document.getElementById("checkout-btn");
  if (checkoutBtnEl) checkoutBtnEl.textContent = currentLang === "en" ? "Checkout on WhatsApp" : "اتمام الطلب عبر واتساب";

  document.querySelectorAll(".product .card-add-btn").forEach(btn => {
    btn.textContent = currentLang === "en" ? "Add" : "أضف";
  });

  updatePopupContent();
}

// -----------------------------
function updatePopupContent() {
  if (!aboutPopup || !contactPopup) return;

  const aboutTitle = aboutPopup.querySelector("h2");
  const aboutText = aboutPopup.querySelector("p");
  const contactTitle = contactPopup.querySelector("h2");
  const contactPs = contactPopup.querySelectorAll("p");

  if (currentLang === "en") {
    if (aboutTitle) aboutTitle.textContent = "About Bee Auto Parts";
    if (aboutText) aboutText.textContent = "Bee Auto Parts is Morocco’s trusted source for quality motorcycle and car parts...";
    if (contactTitle) contactTitle.textContent = "Contact Us";
    if (contactPs[0]) contactPs[0].textContent = "📞 Phone: +212 724-680-135";
    if (contactPs[1]) contactPs[1].textContent = "📧 Email: contact@beeautoparts.ma";
    if (contactPs[2]) contactPs[2].textContent = "📍 Address: Casablanca, Morocco";
  } else {
    if (aboutTitle) aboutTitle.textContent = "حول Bee Auto Parts";
    if (aboutText) aboutText.textContent = "Bee Auto Parts هي المصدر الموثوق في المغرب لقطع غيار الدراجات النارية والسيارات عالية الجودة...";
    if (contactTitle) contactTitle.textContent = "اتصل بنا";
    if (contactPs[0]) contactPs[0].textContent = "📞 الهاتف: ‎+212 724-680-135";
    if (contactPs[1]) contactPs[1].textContent = "📧 البريد الإلكتروني: contact@beeautoparts.ma";
    if (contactPs[2]) contactPs[2].textContent = "📍 العنوان: الدار البيضاء، المغرب";
  }
}

// -----------------------------
function switchLang() {
  currentLang = currentLang === "en" ? "ar" : "en";
  localStorage.setItem(LANG_KEY, currentLang);
  document.documentElement.lang = currentLang;
  applyTranslations();
  renderProducts(currentModel);
  updateCartDisplay();  // Ensures cart updates immediately, even if empty
}

// -----------------------------
// RTL for cart count
// -----------------------------
function checkRTL() {
  if (!cartCount) return;
  const isArabic = document.documentElement.lang === "ar";
  if (isArabic) {
    cartCount.style.right = "unset";
    cartCount.style.left = "-8px";
  } else {
    cartCount.style.left = "unset";
    cartCount.style.right = "-8px";
  }
}

// -----------------------------
// Init
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  openCartBtn = document.getElementById("open-cart");
  cartCount = document.getElementById("cart-count");
  cartEl = document.getElementById("cart");
  closeCartBtn = document.getElementById("close-cart");
  productList = document.getElementById("product-list");
  translateBtn = document.getElementById("translate-btn");
  productPopup = document.getElementById("product-popup");
  aboutPopup = document.getElementById("about-popup");
  contactPopup = document.getElementById("contact-popup");
  addToCartBtn = document.getElementById("add-to-cart");
  quantitySelect = document.getElementById("quantity");
  checkoutBtn = document.getElementById("checkout-btn");

  renderProducts(currentModel);
  updateCartDisplay();
  applyTranslations();

  // About / Contact links
  document.getElementById("about-link")?.addEventListener("click", () => aboutPopup.classList.remove("hidden"));
  document.getElementById("contact-link")?.addEventListener("click", () => contactPopup.classList.remove("hidden"));

  // Close buttons
  productPopup?.querySelector(".close")?.addEventListener("click", closePopups);
  aboutPopup?.querySelector(".close-about")?.addEventListener("click", closePopups);
  contactPopup?.querySelector(".close-contact")?.addEventListener("click", closePopups);

  // Cart buttons
  openCartBtn?.addEventListener("click", openCart);
  closeCartBtn?.addEventListener("click", closeCart);
  checkoutBtn?.addEventListener("click", checkout);

  // Add to cart
  addToCartBtn?.addEventListener("click", addToCart);

  // Language switch
  translateBtn?.addEventListener("click", switchLang);

  // Initial RTL
  checkRTL();
  
  // Force initial cart update based on saved language
  updateCartDisplay();
});



