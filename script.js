/* Final script.js
   - Keeps all original behavior (popups, cart slide, add/remove, whatsapp checkout)
   - Persists cart and language across pages (localStorage)
   - Red dot shows number of unique product types
   - Works with 3 separate pages (index.html, becane.html, c50.html)
   - Translates everything (header, open-cart, popups, cart items)
*/

// ---------- DOM Refs ----------
const productList = document.getElementById("product-list");
const popup = document.getElementById("product-popup");
const popupTitle = document.getElementById("popup-title");
const popupImg = document.getElementById("popup-img");
const popupPrice = document.getElementById("popup-price");
const popupStock = document.getElementById("popup-stock");
const quantitySelect = document.getElementById("quantity");
const addToCartBtn = document.getElementById("add-to-cart");
const closePopup = document.querySelector(".close");

const cart = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeCartBtn = document.getElementById("close-cart");
const openCartBtn = document.getElementById("open-cart");
const cartCount = document.getElementById("cart-count");

const aboutPopup = document.getElementById("about-popup");
const contactPopup = document.getElementById("contact-popup");
const aboutLink = document.getElementById("about-link");
const contactLink = document.getElementById("contact-link");

const translateBtn = document.getElementById("translate-btn");

// ---------- State & Persistence ----------
const STORAGE_CART = "bee_cart_v1";
const STORAGE_LANG = "bee_lang_v1";

let currentLang = localStorage.getItem(STORAGE_LANG) || "en"; // "en" or "ar"
let cartData = JSON.parse(localStorage.getItem(STORAGE_CART) || "[]");

// Determine page key (used to create unique ids per product across pages)
function pageKeyFromPath() {
  const p = window.location.pathname.toLowerCase();
  if (p.includes("becane")) return "becane";
  if (p.includes("c50")) return "c50";
  // default index/sanya
  return "sanya";
}
const pageKey = pageKeyFromPath();

// ---------- Products (per-page default data) ----------
const allProducts = {
  sanya: [
    { id: 1, name: "Sanya Cylender", ar: "اسطوانة سانيا", price: 850, stock: 5, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
    { id: 2, name: "Sanya Leather Seat", ar: "مقعد جلدي سانيا", price: 150, stock: 8, img: "https://i.imgur.com/JqNDT4P.jpeg" },
    // add more if you had them...
  ],
  becane: [
    { id: 1, name: "Becane Clutch", ar: "كلتش بيكان", price: 700, stock: 8, img: "https://i.imgur.com/GCKdTrL.jpeg" },
    { id: 2, name: "Becane Headlight", ar: "مصباح أمامي بيكان", price: 250, stock: 10, img: "https://i.imgur.com/J6l8Ln2.jpeg" },
  ],
  c50: [
    { id: 1, name: "C50 Chain Kit", ar: "طقم سلسلة C50", price: 500, stock: 12, img: "https://i.imgur.com/N18ldZS.jpeg" },
    { id: 2, name: "C50 Exhaust", ar: "عادم C50", price: 950, stock: 5, img: "https://i.imgur.com/ragV47h.png" },
  ]
};

// Current product list loaded for the current page
let products = allProducts[pageKey] || [];

// ---------- Helpers ----------
function saveCart() {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cartData));
}
function saveLang() {
  localStorage.setItem(STORAGE_LANG, currentLang);
}
function makeUniqueId(pageKey, id) {
  return `${pageKey}-${id}`;
}
function uniqueTypesCount() {
  const set = new Set(cartData.map(i => `${i.page}_${i.id}`));
  return set.size;
}

// ---------- Render Products ----------
function renderProducts() {
  if (!productList) return;
  productList.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${currentLang === "en" ? p.name : p.ar}</h3>
      <p>${p.price} MAD</p>
    `;
    div.addEventListener("click", () => openPopup(p));
    productList.appendChild(div);
  });
}
renderProducts();

// ---------- Popup logic ----------
let popupProduct = null;
function openPopup(product) {
  popupProduct = product;
  popupTitle.textContent = currentLang === "en" ? product.name : product.ar;
  popupImg.src = product.img;
  popupPrice.textContent = `Price: ${product.price} MAD`;
  popupStock.textContent = currentLang === "en" ? `In stock: ${product.stock}` : `المخزون: ${product.stock}`;
  quantitySelect.innerHTML = "";
  for (let i = 1; i <= product.stock; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    quantitySelect.appendChild(opt);
  }
  addToCartBtn.textContent = currentLang === "en" ? "Add to Cart" : "أضف إلى السلة";
  addToCartBtn.onclick = () => addToCartFromPopup(product);
  popup.classList.remove("hidden");
}
if (closePopup) closePopup.onclick = () => popup.classList.add("hidden");

// close popups on outside click
window.addEventListener("click", (e) => {
  if (e.target === popup) popup.classList.add("hidden");
  if (e.target === aboutPopup) aboutPopup.classList.add("hidden");
  if (e.target === contactPopup) contactPopup.classList.add("hidden");
});

// ---------- Add to cart (from popup) ----------
function addToCartFromPopup(product) {
  const qty = parseInt(quantitySelect.value) || 1;
  const uid = makeUniqueId(pageKey, product.id);
  const existing = cartData.find(x => x.uniqueId === uid);
  if (existing) {
    existing.qty = (existing.qty || 0) + qty;
  } else {
    cartData.push({
      uniqueId: uid,
      page: pageKey,
      id: product.id,
      name: product.name,
      ar: product.ar || product.name,
      price: product.price,
      qty
    });
  }
  saveCart();
  updateCart();
  popup.classList.add("hidden");
}

// ---------- Update cart UI ----------
function updateCart() {
  if (!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0;
  cartData.forEach(item => {
    const li = document.createElement("li");
    const displayName = currentLang === "en" ? item.name : (item.ar || item.name);
    li.innerHTML = `<span>${displayName} x${item.qty} = ${item.price * item.qty} MAD</span>
                    <button class="remove-item" data-uid="${item.uniqueId}">🗑️</button>`;
    li.querySelector(".remove-item").addEventListener("click", () => removeItem(item.uniqueId));
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });

  totalText.textContent = currentLang === "en" ? `Total: ${total} MAD` : `المجموع: ${total} MAD`;

  // red dot with number of unique item types
  const uniqueCount = uniqueTypesCount();
  if (cartCount) {
    if (uniqueCount > 0) {
      cartCount.textContent = uniqueCount;
      cartCount.classList.remove("hidden");
      cartCount.style.display = "inline-block";
    } else {
      cartCount.classList.add("hidden");
      cartCount.style.display = "none";
    }
  }

  saveCart();
}

// ---------- Remove item ----------
function removeItem(uniqueId) {
  cartData = cartData.filter(i => i.uniqueId !== uniqueId);
  saveCart();
  updateCart();
}

// ---------- Checkout (WhatsApp) ----------
checkoutBtn.addEventListener("click", () => {
  if (cartData.length === 0) {
    alert(currentLang === "en" ? "Your cart is empty!" : "سلتك فارغة!");
    return;
  }
  const lines = cartData.map(i => `${currentLang === "en" ? i.name : i.ar} x${i.qty} = ${i.price * i.qty} MAD`);
  const total = cartData.reduce((s, it) => s + it.price * it.qty, 0);
  const message = `${currentLang === "en" ? "Hello Bee Auto Parts, I'd like to order:" : "مرحباً Bee Auto Parts، أود الطلب:"}\n${lines.join("\n")}\n\n${currentLang === "en" ? "Total" : "المجموع"}: ${total} MAD`;
  const phone = "212724680135"; // your target number
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
  // open properly on mobile vs desktop
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) window.location.href = url;
  else window.open(url, "_blank");
});

// ---------- Cart open/close ----------
if (openCartBtn) openCartBtn.addEventListener("click", () => {
  cart.classList.add("open");
  document.body.classList.add("cart-open");
});
if (closeCartBtn) closeCartBtn.addEventListener("click", () => {
  cart.classList.remove("open");
  document.body.classList.remove("cart-open");
});

// ---------- About / Contact wiring ----------
if (aboutLink) aboutLink.addEventListener("click", () => aboutPopup.classList.remove("hidden"));
const closeAboutBtn = document.querySelector(".close-about");
if (closeAboutBtn) closeAboutBtn.addEventListener("click", () => aboutPopup.classList.add("hidden"));
if (contactLink) contactLink.addEventListener("click", () => contactPopup.classList.remove("hidden"));
const closeContactBtn = document.querySelector(".close-contact");
if (closeContactBtn) closeContactBtn.addEventListener("click", () => contactPopup.classList.add("hidden"));

// ---------- Navigation (model buttons) ----------
const sanyaBtn = document.getElementById("sanya-link");
const becaneBtn = document.getElementById("becane-link");
const c50Btn = document.getElementById("c50-link");

function navigateTo(page) {
  // persist cart & language before navigation
  saveCart();
  saveLang();
  window.location.href = page;
}

if (sanyaBtn) sanyaBtn.addEventListener("click", () => navigateTo("index.html"));
if (becaneBtn) becaneBtn.addEventListener("click", () => navigateTo("becane.html"));
if (c50Btn) c50Btn.addEventListener("click", () => navigateTo("c50.html"));

// ---------- Translation ----------
function applyTranslations() {
  // header
  if (aboutLink) aboutLink.textContent = currentLang === "en" ? "About" : "عن Bee Auto Parts";
  if (contactLink) contactLink.textContent = currentLang === "en" ? "Contact" : "اتصل بنا";
  if (translateBtn) translateBtn.textContent = currentLang === "en" ? "عربي" : "English";

  // cart header & open-cart text
  const cartHeader = document.querySelector("#cart h2");
  if (cartHeader) cartHeader.textContent = currentLang === "en" ? "🛒 Cart" : "🛒 السلة";

  if (openCartBtn) {
    const uniq = uniqueTypesCount();
    openCartBtn.textContent = currentLang === "en"
      ? `🛒 Open Cart ${uniq > 0 ? uniq : ""}`
      : `🛒 افتح السلة ${uniq > 0 ? uniq : ""}`;
  }

  if (checkoutBtn) checkoutBtn.textContent = currentLang === "en" ? "Checkout on WhatsApp" : "الدفع على واتساب";

  // product list headings
  document.querySelectorAll("#product-list .product h3").forEach((h3, idx) => {
    const p = products[idx];
    if (!p) return;
    h3.textContent = currentLang === "en" ? p.name : p.ar;
  });

  // popup content if visible
  if (!popup.classList.contains("hidden") && popupProduct) {
    popupTitle.textContent = currentLang === "en" ? popupProduct.name : popupProduct.ar;
    popupStock.textContent = currentLang === "en" ? `In stock: ${popupProduct.stock}` : `المخزون: ${popupProduct.stock}`;
    addToCartBtn.textContent = currentLang === "en" ? "Add to Cart" : "أضف إلى السلة";
  }

  // cart items names and totals
  updateCart();
}

if (translateBtn) {
  translateBtn.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "ar" : "en";
    saveLang();
    applyTranslations();
  });
}

// ---------- Init on load ----------
(function init() {
  // ensure products for this page are set
  products = allProducts[pageKey] || [];
  // render UI
  renderProducts();
  applyTranslations();
  updateCart();
})();
