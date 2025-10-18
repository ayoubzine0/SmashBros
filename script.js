// === Selectors ===
const productList = document.getElementById("product-list");
const popup = document.getElementById("product-popup");
const popupTitle = document.getElementById("popup-title");
const popupImg = document.getElementById("popup-img");
const popupPrice = document.getElementById("popup-price");
const popupStock = document.getElementById("popup-stock");
const quantitySelect = document.getElementById("quantity");
const addToCartBtn = document.getElementById("add-to-cart");
const closePopup = document.querySelector(".close");
const cartItems = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout-btn");
const cart = document.getElementById("cart");
const closeCartBtn = document.getElementById("close-cart");
const openCartBtn = document.getElementById("open-cart");
const cartCount = document.getElementById("cart-count");

const aboutPopup = document.getElementById("about-popup");
const contactPopup = document.getElementById("contact-popup");

// === Popups ===
document.getElementById("about-link").onclick = () => aboutPopup.classList.remove("hidden");
document.getElementById("contact-link").onclick = () => contactPopup.classList.remove("hidden");
document.querySelector(".close-about").onclick = () => aboutPopup.classList.add("hidden");
document.querySelector(".close-contact").onclick = () => contactPopup.classList.add("hidden");

// === Detect Page & Load Products ===
const path = window.location.pathname.toLowerCase();
let products = [];

if (path.includes("becane")) {
  products = [
    { id: 1, name: "Becane Clutch", ar: "قابض بيكان", price: 700, stock: 8, img: "https://i.imgur.com/GCKdTrL.jpeg" },
    { id: 2, name: "Becane Headlight", ar: "مصباح أمامي بيكان", price: 250, stock: 10, img: "https://i.imgur.com/J6l8Ln2.jpeg" },
  ];
} else if (path.includes("c50")) {
  products = [
    { id: 1, name: "C50 Chain Kit", ar: "طقم سلسلة C50", price: 500, stock: 12, img: "https://i.imgur.com/N18ldZS.jpeg" },
    { id: 2, name: "C50 Exhaust", ar: "عادم C50", price: 950, stock: 5, img: "https://i.imgur.com/ragV47h.png" },
  ];
} else {
  products = [
    { id: 1, name: "Sanya Cylinder", ar: "أسطوانة سانيا", price: 850, stock: 5, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
    { id: 2, name: "Sanya Leather Seat", ar: "مقعد جلدي سانيا", price: 150, stock: 8, img: "https://i.imgur.com/JqNDT4P.jpeg" },
  ];
}

// === Cart Persistence ===
let cartData = JSON.parse(localStorage.getItem("cartData")) || [];
let currentLang = localStorage.getItem("lang") || "en";

// === Render Products ===
function renderProducts() {
  productList.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `<img src="${p.img}" alt="${p.name}">
                     <h3>${currentLang === "en" ? p.name : p.ar}</h3>
                     <p>${p.price} MAD</p>`;
    div.onclick = () => openPopup(p);
    productList.appendChild(div);
  });
}
renderProducts();

// === Popup ===
function openPopup(product) {
  popupTitle.textContent = currentLang === "en" ? product.name : product.ar;
  popupImg.src = product.img;
  popupPrice.textContent = `${product.price} MAD`;
  popupStock.textContent = currentLang === "en" ? `In stock: ${product.stock}` : `المخزون: ${product.stock}`;
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
closePopup.onclick = () => popup.classList.add("hidden");
window.onclick = e => {
  if (e.target === popup) popup.classList.add("hidden");
  if (e.target === aboutPopup) aboutPopup.classList.add("hidden");
  if (e.target === contactPopup) contactPopup.classList.add("hidden");
};

// === Cart ===
function addToCart(product) {
  const qty = parseInt(quantitySelect.value);
  const existing = cartData.find(i => i.id === product.id && i.name === product.name);
  if (existing) existing.qty += qty;
  else cartData.push({ ...product, qty });
  updateCart();
  popup.classList.add("hidden");
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cartData.forEach(i => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${currentLang === "en" ? i.name : i.ar} x${i.qty} = ${i.price * i.qty} MAD</span>
                    <button class="remove-item">🗑️</button>`;
    li.querySelector(".remove-item").onclick = () => removeItem(i.id);
    cartItems.appendChild(li);
    total += i.price * i.qty;
  });

  totalText.textContent =
    currentLang === "en" ? `Total: ${total} MAD` : `المجموع: ${total} MAD`;

  cartCount.textContent = cartData.length;
  cartCount.classList.toggle("hidden", cartData.length === 0);

  localStorage.setItem("cartData", JSON.stringify(cartData));
}

function removeItem(id) {
  cartData = cartData.filter(i => i.id !== id);
  updateCart();
}
updateCart();

// === Checkout ===
checkoutBtn.onclick = () => {
  if (cartData.length === 0) return alert(currentLang === "en" ? "Your cart is empty!" : "سلتك فارغة!");
  const msg = cartData.map(i => `${i.name} x${i.qty} = ${i.price * i.qty} MAD`).join("\n");
  const total = cartData.reduce((s, i) => s + i.price * i.qty, 0);
  const text = encodeURIComponent(`Hello Bee Auto Parts, I'd like to order:\n${msg}\n\nTotal: ${total} MAD`);
  const url = `https://wa.me/212724680135?text=${text}`;
  window.open(url, "_blank");
};

// === Cart open/close ===
openCartBtn.onclick = () => { cart.classList.add("open"); document.body.classList.add("cart-open"); };
closeCartBtn.onclick = () => { cart.classList.remove("open"); document.body.classList.remove("cart-open"); };

// === Navigation ===
document.getElementById("sanya-link").onclick = () => navigateTo("index.html");
document.getElementById("becane-link").onclick = () => navigateTo("becane.html");
document.getElementById("c50-link").onclick = () => navigateTo("c50.html");

function navigateTo(page) {
  localStorage.setItem("cartData", JSON.stringify(cartData));
  localStorage.setItem("lang", currentLang);
  window.location.href = page;
}

// === Translation ===
const translateBtn = document.getElementById("translate-btn");
translateBtn.textContent = currentLang === "en" ? "عربي" : "English";

translateBtn.onclick = () => {
  currentLang = currentLang === "en" ? "ar" : "en";
  localStorage.setItem("lang", currentLang);
  applyTranslations();
};

function applyTranslations() {
  document.getElementById("about-link").textContent = currentLang === "en" ? "About" : "عن Bee Auto Parts";
  document.getElementById("contact-link").textContent = currentLang === "en" ? "Contact" : "اتصل بنا";
  translateBtn.textContent = currentLang === "en" ? "عربي" : "English";
  document.querySelector("#cart h2").textContent = currentLang === "en" ? "🛒 Cart" : "🛒 السلة";
  document.getElementById("open-cart").innerHTML =
    currentLang === "en" ? `🛒 Open Cart <span id="cart-count">${cartData.length}</span>` :
    `🛒 عرض السلة <span id="cart-count">${cartData.length}</span>`;
  checkoutBtn.textContent = currentLang === "en" ? "Checkout on WhatsApp" : "الدفع على واتساب";
  renderProducts();
  updateCart();
}
applyTranslations();
