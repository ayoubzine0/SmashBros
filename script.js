/* Robust script.js
   - Preserves popup, cart panel, add/remove, checkout, translations
   - Persists cart + language via localStorage across pages
   - Red dot shows NUMBER OF UNIQUE ITEM TYPES (per product id + page)
   - Safe if some optional elements/IDs are missing (won't throw)
*/

// ---------- Config / storage keys ----------
const STORAGE_CART = "bee_cart_v2";
const STORAGE_LANG = "bee_lang_v2";

// ---------- DOM refs (guarded) ----------
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
let cartCount = document.getElementById("cart-count"); // may be recreated by script

const aboutPopup = document.getElementById("about-popup");
const contactPopup = document.getElementById("contact-popup");
const aboutLink = document.getElementById("about-link");
const contactLink = document.getElementById("contact-link");
const translateBtn = document.getElementById("translate-btn");

// ---------- State ----------
let cartData = JSON.parse(localStorage.getItem(STORAGE_CART) || "[]");
let currentLang = localStorage.getItem(STORAGE_LANG) || "en";

// ---------- Products per page (default datasets) ----------
const allProducts = {
  sanya: [
    { id: 1, name: "Sanya Cylender", ar: "أسطوانة سانيا", price: 850, stock: 5, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
    { id: 2, name: "Sanya Leather Seat", ar: "مقعد جلدي سانيا", price: 150, stock: 8, img: "https://i.imgur.com/JqNDT4P.jpeg" },
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

// ---------- Helpers ----------
function saveCart() { localStorage.setItem(STORAGE_CART, JSON.stringify(cartData)); }
function saveLang() { localStorage.setItem(STORAGE_LANG, currentLang); }
function pageKeyFromPath() {
  const p = window.location.pathname.toLowerCase();
  if (p.includes("becane")) return "becane";
  if (p.includes("c50")) return "c50";
  return "sanya";
}
const pageKey = pageKeyFromPath();
let products = allProducts[pageKey] || [];

// unique id for a product instance across pages
function getUniqueId(page, localId) { return `${page}::${localId}`; }

// compute unique types count (product id + page)
function uniqueTypesCount() {
  const s = new Set(cartData.map(i => `${i.page}::${i.id}`));
  return s.size;
}

// ensure cartCount element exists (some versions of your HTML re-create it)
function ensureCartCountEl() {
  cartCount = document.getElementById("cart-count");
  if (!cartCount && openCartBtn) {
    // create a small span inside openCartBtn
    cartCount = document.createElement("span");
    cartCount.id = "cart-count";
    cartCount.className = "hidden";
    openCartBtn.appendChild(cartCount);
  }
}
ensureCartCountEl();

// ---------- Render products ----------
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

// ---------- Popup ----------
let popupProduct = null;
function openPopup(product) {
  popupProduct = product;
  if (popupTitle) popupTitle.textContent = currentLang === "en" ? product.name : product.ar;
  if (popupImg) popupImg.src = product.img;
  if (popupPrice) popupPrice.textContent = `Price: ${product.price} MAD`;
  if (popupStock) popupStock.textContent = currentLang === "en" ? `In stock: ${product.stock}` : `المخزون: ${product.stock}`;
  if (quantitySelect) {
    quantitySelect.innerHTML = "";
    for (let i = 1; i <= product.stock; i++) {
      const opt = document.createElement("option");
      opt.value = i; opt.textContent = i; quantitySelect.appendChild(opt);
    }
  }
  if (addToCartBtn) addToCartBtn.textContent = currentLang === "en" ? "Add to Cart" : "أضف إلى السلة";
  if (addToCartBtn) addToCartBtn.onclick = () => addToCartFromPopup(product);
  if (popup) popup.classList.remove("hidden");
}
if (closePopup) closePopup.onclick = () => popup && popup.classList.add("hidden");

// close popups when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === popup) popup.classList.add("hidden");
  if (e.target === aboutPopup) aboutPopup.classList.add("hidden");
  if (e.target === contactPopup) contactPopup.classList.add("hidden");
});

// ---------- Add to cart (from popup) ----------
function addToCartFromPopup(product) {
  const qty = parseInt(quantitySelect && quantitySelect.value) || 1;
  const uid = getUniqueId(pageKey, product.id);
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
  if (popup) popup.classList.add("hidden");
}

// ---------- Update cart UI (fixed red-dot logic) ----------
function updateCart() {
  ensureCartCountEl();
  if (!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0;
  cartData.forEach(item => {
    const li = document.createElement("li");
    const displayName = currentLang === "en" ? item.name : (item.ar || item.name);
    li.innerHTML = `<span>${displayName} x${item.qty} = ${item.price * item.qty} MAD</span>
                    <button class="remove-item" data-uid="${item.uniqueId}">🗑️</button>`;
    const btn = li.querySelector(".remove-item");
    if (btn) btn.addEventListener("click", () => removeItem(item.uniqueId));
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });

  if (totalText) totalText.textContent = currentLang === "en" ? `Total: ${total} MAD` : `المجموع: ${total} MAD`;

  // RED DOT: number of unique product types
  const uniqCount = uniqueTypesCount();
  if (cartCount) {
    if (uniqCount > 0) {
      cartCount.textContent = uniqCount;
      cartCount.classList.remove("hidden");
      cartCount.style.display = "inline-block";
    } else {
      cartCount.textContent = "";
      cartCount.classList.add("hidden");
      cartCount.style.display = "none";
    }
  }

  // update open-cart text (keeps language)
  if (openCartBtn) {
    openCartBtn.textContent = currentLang === "en"
      ? `🛒 Open Cart ${uniqCount > 0 ? uniqCount : ""}`
      : `🛒 افتح السلة ${uniqCount > 0 ? uniqCount : ""}`;
    // append cartCount span if missing (openCartBtn.innerText overwrote it)
    ensureCartCountEl();
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
if (checkoutBtn) checkoutBtn.addEventListener("click", () => {
  if (cartData.length === 0) {
    alert(currentLang === "en" ? "Your cart is empty!" : "سلتك فارغة!");
    return;
  }
  const lines = cartData.map(i => `${currentLang === "en" ? i.name : i.ar} x${i.qty} = ${i.price * i.qty} MAD`);
  const total = cartData.reduce((s, it) => s + it.price * it.qty, 0);
  const message = `${currentLang === "en" ? "Hello Bee Auto Parts, I'd like to order:" : "مرحباً Bee Auto Parts، أود الطلب:"}\n${lines.join("\n")}\n\n${currentLang === "en" ? "Total" : "المجموع"}: ${total} MAD`;
  const phone = "212724680135";
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) window.location.href = url;
  else window.open(url, "_blank");
});

// ---------- Cart open/close ----------
if (openCartBtn) openCartBtn.addEventListener("click", () => {
  cart.classList.add("open"); document.body.classList.add("cart-open");
});
if (closeCartBtn) closeCartBtn.addEventListener("click", () => {
  cart.classList.remove("open"); document.body.classList.remove("cart-open");
});

// ---------- About & Contact wiring ----------
if (aboutLink) aboutLink.addEventListener("click", () => aboutPopup.classList.remove("hidden"));
const closeAboutEl = document.querySelector(".close-about");
if (closeAboutEl) closeAboutEl.addEventListener("click", () => aboutPopup.classList.add("hidden"));
if (contactLink) contactLink.addEventListener("click", () => contactPopup.classList.remove("hidden"));
const closeContactEl = document.querySelector(".close-contact");
if (closeContactEl) closeContactEl.addEventListener("click", () => contactPopup.classList.add("hidden"));

// ---------- Navigation (persist state before navigating) ----------
const sanyaBtn = document.getElementById("sanya-link");
const becaneBtn = document.getElementById("becane-link");
const c50Btn = document.getElementById("c50-link");
function navigateTo(page) {
  saveCart(); saveLang();
  window.location.href = page;
}
if (sanyaBtn) sanyaBtn.addEventListener("click", () => navigateTo("index.html"));
if (becaneBtn) becaneBtn.addEventListener("click", () => navigateTo("becane.html"));
if (c50Btn) c50Btn.addEventListener("click", () => navigateTo("c50.html"));

// ---------- Translation ----------
function applyTranslations() {
  if (aboutLink) aboutLink.textContent = currentLang === "en" ? "About" : "عن Bee Auto Parts";
  if (contactLink) contactLink.textContent = currentLang === "en" ? "Contact" : "اتصل بنا";
  if (translateBtn) translateBtn.textContent = currentLang === "en" ? "عربي" : "English";
  const cartHeader = document.querySelector("#cart h2");
  if (cartHeader) cartHeader.textContent = currentLang === "en" ? "🛒 Cart" : "🛒 السلة";
  if (checkoutBtn) checkoutBtn.textContent = currentLang === "en" ? "Checkout on WhatsApp" : "الدفع على واتساب";
  // product headings and popup text
  document.querySelectorAll("#product-list .product h3").forEach((h3, idx) => {
    const p = products[idx]; if (!p) return;
    h3.textContent = currentLang === "en" ? p.name : p.ar;
  });
  if (popup && !popup.classList.contains("hidden") && popupProduct) {
    popupTitle.textContent = currentLang === "en" ? popupProduct.name : popupProduct.ar;
    popupStock.textContent = currentLang === "en" ? `In stock: ${popupProduct.stock}` : `المخزون: ${popupProduct.stock}`;
    if (addToCartBtn) addToCartBtn.textContent = currentLang === "en" ? "Add to Cart" : "أضف إلى السلة";
  }
  updateCart();
}
if (translateBtn) translateBtn.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "ar" : "en";
  saveLang();
  applyTranslations();
});

// ---------- Init ----------
(function init() {
  products = allProducts[pageKey] || [];
  renderProducts();
  applyTranslations();
  updateCart();
})();
