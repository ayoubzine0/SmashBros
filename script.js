/* final robust script.js
   - Keeps language (localStorage)
   - Keeps cart (localStorage) with uniqueIds and ar names
   - Works with separate pages (model buttons with data-page) OR single-page dynamic
   - Translates Open Cart button, About/Contact, cart, popup, checkout
*/

///// DOM refs /////
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
const modelBtns = document.querySelectorAll(".model-btn");

///// state /////
let currentLang = localStorage.getItem("bee_lang") || "en"; // "en" or "ar"
let cartData = JSON.parse(localStorage.getItem("bee_cart") || "[]"); // array of items
// when separate pages exist, we use window.location.pathname to determine which product set to load
const path = window.location.pathname.toLowerCase();

///// PRODUCTS: per-page data (ids are local ids; uniqueId created later) /////
const allProducts = {
  // NOTE: ids below are local per-model; uniqueId created as `${pageName}-${p.id}`
  index: [
    { id: 1, name: "Sanya Cylender", ar: "أسطوانة سانيا", price: 850, stock: 5, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
    { id: 2, name: "Sanya Leather Seat", ar: "مقعد جلدي سانيا", price: 150, stock: 8, img: "https://i.imgur.com/JqNDT4P.jpeg" },
  ],
  becane: [
    { id: 1, name: "Becane Clutch", ar: "قابض بيكان", price: 700, stock: 8, img: "https://i.imgur.com/GCKdTrL.jpeg" },
    { id: 2, name: "Becane Headlight", ar: "مصباح أمامي بيكان", price: 250, stock: 10, img: "https://i.imgur.com/J6l8Ln2.jpeg" },
  ],
  c50: [
    { id: 1, name: "C50 Chain Kit", ar: "طقم سلسلة C50", price: 500, stock: 12, img: "https://i.imgur.com/N18ldZS.jpeg" },
    { id: 2, name: "C50 Exhaust", ar: "عادم C50", price: 950, stock: 5, img: "https://i.imgur.com/ragV47h.png" },
  ]
};

///// detect which page key to use for products /////
function pageKeyFromPath(p) {
  if (p.includes("becane")) return "becane";
  if (p.includes("c50")) return "c50";
  // default / index
  return "index";
}
let pageKey = pageKeyFromPath(path);
let products = allProducts[pageKey];

///// Helpers /////
function saveCart() {
  localStorage.setItem("bee_cart", JSON.stringify(cartData));
}
function saveLang() {
  localStorage.setItem("bee_lang", currentLang);
}
function totalQuantity() {
  return cartData.reduce((s, it) => s + (it.qty || 0), 0);
}
function makeUniqueId(pageKey, localId) {
  return `${pageKey}-${localId}`;
}

///// Render products list (uses currentLang) /////
function renderProducts() {
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

///// Popup ///// 
let popupProduct = null; // currently shown product (object from products)
function openPopup(product) {
  popupProduct = product;
  popupTitle.textContent = currentLang === "en" ? product.name : product.ar;
  popupImg.src = product.img;
  popupPrice.textContent = `Price: ${product.price} MAD`;
  popupStock.textContent = currentLang === "en" ? `In stock: ${product.stock}` : `المخزون: ${product.stock}`;
  // quantity options
  quantitySelect.innerHTML = "";
  for (let i = 1; i <= product.stock; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    quantitySelect.appendChild(opt);
  }
  addToCartBtn.textContent = currentLang === "en" ? "Add to Cart" : "أضف إلى السلة";
  addToCartBtn.onclick = () => addToCart(product);
  popup.classList.remove("hidden");
}
closePopup && (closePopup.onclick = () => popup.classList.add("hidden"));

///// Window click to close popups /////
window.addEventListener("click", e => {
  if (e.target === popup) popup.classList.add("hidden");
  if (e.target === aboutPopup) aboutPopup.classList.add("hidden");
  if (e.target === contactPopup) contactPopup.classList.add("hidden");
});

///// Add to cart /////
// store items with: uniqueId, pageKey, id (local), name, ar, price, qty
function addToCart(product) {
  const qty = parseInt(quantitySelect.value) || 1;
  const uid = makeUniqueId(pageKey, product.id);
  const existing = cartData.find(x => x.uniqueId === uid);
  if (existing) {
    existing.qty = (existing.qty || 0) + qty;
  } else {
    cartData.push({
      uniqueId: uid,
      pageKey,
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

///// Update cart UI /////
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cartData.forEach(item => {
    const displayName = currentLang === "en" ? item.name : (item.ar || item.name);
    const li = document.createElement("li");
    li.innerHTML = `<span>${displayName} x${item.qty} = ${item.price * item.qty} MAD</span>
                    <button class="remove-item" data-uid="${item.uniqueId}">🗑️</button>`;
    li.querySelector(".remove-item").addEventListener("click", () => removeItem(item.uniqueId));
    total += item.price * item.qty;
    cartItems.appendChild(li);
  });

  totalText.textContent = currentLang === "en" ? `Total: ${total} MAD` : `المجموع: ${total} MAD`;

  // cart badge shows total quantity
  const qty = totalQuantity();
  if (qty > 0) {
    cartCount.textContent = qty;
    cartCount.classList.remove("hidden");
  } else {
    cartCount.classList.add("hidden");
  }

  // update open-cart text to current language + qty
  openCartBtn.textContent = currentLang === "en"
    ? `🛒 Open Cart ${qty > 0 ? qty : ""}`
    : `🛒 افتح السلة ${qty > 0 ? qty : ""}`;
}

function removeItem(uniqueId) {
  cartData = cartData.filter(i => i.uniqueId !== uniqueId);
  saveCart();
  updateCart();
}

///// Checkout ///// 
checkoutBtn.addEventListener("click", () => {
  if (cartData.length === 0) {
    alert(currentLang === "en" ? "Your cart is empty!" : "سلتك فارغة!");
    return;
  }
  const lines = cartData.map(i => `${currentLang === "en" ? i.name : i.ar} x${i.qty} = ${i.price * i.qty} MAD`);
  const total = cartData.reduce((s, it) => s + it.price * it.qty, 0);
  const message = `${currentLang === "en" ? "Hello Bee Auto Parts, I'd like to order:" : "مرحباً Bee Auto Parts، أود الطلب:"}\n${lines.join("\n")}\n\n${currentLang === "en" ? "Total" : "المجموع"}: ${total} MAD`;
  const phone = "212724680135"; // your number
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) window.location.href = url;
  else window.open(url, "_blank");
});

///// Cart open/close /////
closeCartBtn.addEventListener("click", () => {
  cart.classList.remove("open");
  cart.classList.add("closed");
  document.body.classList.remove("cart-open");
});
openCartBtn.addEventListener("click", () => {
  cart.classList.add("open");
  cart.classList.remove("closed");
  document.body.classList.add("cart-open");
});

///// Model buttons: either navigate (data-page) OR if data-page missing, switch products in-page /////
modelBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.getAttribute("data-page");
    if (page) {
      // Save language and cart (already saved) then navigate
      saveLang();
      saveCart();
      window.location.href = page;
      return;
    }
    // if no data-page: single-page mode: switch product set by data-model
    const model = btn.getAttribute("data-model");
    if (model && allProducts[model]) {
      pageKey = model;
      products = allProducts[pageKey];
      renderProducts();
      applyTranslations(); // keep language
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
});

///// About / Contact popup wiring (IDs must exist) /////
aboutLink && (aboutLink.onclick = () => aboutPopup.classList.remove("hidden"));
contactLink && (contactLink.onclick = () => contactPopup.classList.remove("hidden"));

///// Translation: applyTranslations updates texts everywhere /////
function applyTranslations() {
  // Save current language so navigation to other pages keeps it
  saveLang();

  // Header
  if (aboutLink) aboutLink.textContent = currentLang === "en" ? "About" : "عن Bee Auto Parts";
  if (contactLink) contactLink.textContent = currentLang === "en" ? "Contact" : "اتصل بنا";
  if (translateBtn) translateBtn.textContent = currentLang === "en" ? "عربي" : "English";

  // Cart header & checkout button
  const cartHeader = document.querySelector("#cart h2");
  if (cartHeader) cartHeader.textContent = currentLang === "en" ? "🛒 Cart" : "🛒 السلة";
  if (checkoutBtn) checkoutBtn.textContent = currentLang === "en" ? "Checkout on WhatsApp" : "الدفع على واتساب";

  // Open Cart button & badge updated in updateCart()
  updateCart();

  // Product list titles
  productList.querySelectorAll(".product h3").forEach((h3, idx) => {
    const p = products[idx];
    if (!p) return;
    h3.textContent = currentLang === "en" ? p.name : p.ar;
  });

  // Popup texts if open
  if (!popup.classList.contains("hidden") && popupProduct) {
    popupTitle.textContent = currentLang === "en" ? popupProduct.name : popupProduct.ar;
    popupStock.textContent = currentLang === "en" ? `In stock: ${popupProduct.stock}` : `المخزون: ${popupProduct.stock}`;
    addToCartBtn.textContent = currentLang === "en" ? "Add to Cart" : "أضف إلى السلة";
  }
}

///// toggle language button wiring /////
translateBtn && translateBtn.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "ar" : "en";
  saveLang();
  applyTranslations();
});

///// on load: render/update using stored cart and lang /////
(function init() {
  // Ensure products for pageKey are set
  products = allProducts[pageKey] || allProducts.index;
  // Render UI
  renderProducts();
  applyTranslations();
  updateCart();
})();
