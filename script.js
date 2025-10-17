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

// Popups
const aboutPopup = document.getElementById("about-popup");
const contactPopup = document.getElementById("contact-popup");
document.getElementById("about-link").onclick = () => aboutPopup.classList.remove("hidden");
document.getElementById("contact-link").onclick = () => contactPopup.classList.remove("hidden");
document.querySelector(".close-about").onclick = () => aboutPopup.classList.add("hidden");
document.querySelector(".close-contact").onclick = () => contactPopup.classList.add("hidden");

// Translation
const translateBtn = document.getElementById("translate-btn");
let currentLang = "en"; // default language

// Cart
let cartData = [];

// Track popup product
let currentPopupProduct = null;

// ----- Products for each page -----
let products = [];
const path = window.location.pathname.toLowerCase();

if (path.includes("becane")) {
  products = [
    { id: 1, name: "Becane Clutch", ar: "كلتش بيكان", price: 700, stock: 8, img: "https://i.imgur.com/GCKdTrL.jpeg" },
    { id: 2, name: "Becane Headlight", ar: "مصباح أمامي بيكان", price: 250, stock: 10, img: "https://i.imgur.com/J6l8Ln2.jpeg" },
  ];
} else if (path.includes("c50")) {
  products = [
    { id: 1, name: "C50 Chain Kit", ar: "عدة سلسلة C50", price: 500, stock: 12, img: "https://i.imgur.com/N18ldZS.jpeg" },
    { id: 2, name: "C50 Exhaust", ar: "عادم C50", price: 950, stock: 5, img: "https://i.imgur.com/ragV47h.png" },
  ];
} else {
  // Default Sanya
  products = [
    { id: 1, name: "Sanya Cylender", ar: "أسطوانة سانيا", price: 850, stock: 5, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
    { id: 2, name: "Sanya Leather Seat", ar: "مقعد جلدي سانيا", price: 150, stock: 8, img: "https://i.imgur.com/JqNDT4P.jpeg" },
  ];
}

// ----- Render Products -----
function renderProducts() {
  productList.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `<img src="${p.img}" alt="${p.name}">
                     <h3>${currentLang === "en" ? p.name : p.ar}</h3>
                     <p>${p.price} MAD</p>`;
    div.addEventListener("click", () => openPopup(p));
    productList.appendChild(div);
  });
}
renderProducts();

// ----- Product Popup -----
function openPopup(product) {
  currentPopupProduct = product;
  popupTitle.textContent = currentLang === "en" ? product.name : product.ar;
  popupImg.src = product.img;
  popupPrice.textContent = `Price: ${product.price} MAD`;
  popupStock.textContent = currentLang === "en" ? `In stock: ${product.stock}` : `المخزون: ${product.stock}`;
  quantitySelect.innerHTML = "";
  for (let i = 1; i <= product.stock; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    quantitySelect.appendChild(option);
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

// ----- Add to Cart -----
function addToCart(product) {
  const qty = parseInt(quantitySelect.value);
  const existing = cartData.find(i => i.id === product.id && i.model === product.model);
  if (existing) existing.qty += qty;
  else cartData.push({ ...product, qty, model: path.includes("becane") ? "becane" : path.includes("c50") ? "c50" : "sanya" });
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
    li.querySelector(".remove-item").onclick = () => removeItem(i.id, i.model);
    total += i.price * i.qty;
    cartItems.appendChild(li);
  });
  totalText.textContent = currentLang === "en"
    ? `Total: ${total} MAD`
    : `المجموع: ${total} MAD`;

  if (cartData.length > 0) {
    cartCount.textContent = cartData.length;
    cartCount.classList.remove("hidden");
  } else cartCount.classList.add("hidden");
}

function removeItem(id, model) {
  cartData = cartData.filter(i => !(i.id === id && i.model === model));
  updateCart();
}

// ----- Checkout -----
checkoutBtn.onclick = () => {
  if (cartData.length === 0) return alert(currentLang === "en" ? "Your cart is empty!" : "سلتك فارغة!");
  const msg = cartData.map(i => `${currentLang === "en" ? i.name : i.ar} x${i.qty} = ${i.price * i.qty} MAD`).join("\n");
  const total = cartData.reduce((s, i) => s + i.price * i.qty, 0);
  const text = encodeURIComponent(`${currentLang === "en" ? "Hello Bee Auto Parts, I'd like to order:" : "مرحباً Bee Auto Parts، أود طلب:"}\n${msg}\n\n${currentLang === "en" ? "Total" : "المجموع"}: ${total} MAD`);
  const phone = "212724680135";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) window.location.href = whatsappUrl;
  else window.open(whatsappUrl, "_blank");
};

// ----- Cart open/close -----
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

// ----- Model buttons -----
document.querySelectorAll(".model-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const model = btn.getAttribute("data-model");
    openModelPage(model);
  });
});

function openModelPage(model) {
  let modelProducts;
  if (model === "sanya") {
    modelProducts = [
      { id: 1, name: "Sanya Cylender", ar: "أسطوانة سانيا", price: 850, stock: 5, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
      { id: 2, name: "Sanya Leather Seat", ar: "مقعد جلدي سانيا", price: 150, stock: 8, img: "https://i.imgur.com/JqNDT4P.jpeg" },
    ];
  } else if (model === "becane") {
    modelProducts = [
      { id: 1, name: "Becane Clutch", ar: "كلتش بيكان", price: 700, stock: 8, img: "https://i.imgur.com/GCKdTrL.jpeg" },
      { id: 2, name: "Becane Headlight", ar: "مصباح أمامي بيكان", price: 250, stock: 10, img: "https://i.imgur.com/J6l8Ln2.jpeg" },
    ];
  } else {
    modelProducts = [
      { id: 1, name: "C50 Chain Kit", ar: "عدة سلسلة C50", price: 500, stock: 12, img: "https://i.imgur.com/N18ldZS.jpeg" },
      { id: 2, name: "C50 Exhaust", ar: "عادم C50
