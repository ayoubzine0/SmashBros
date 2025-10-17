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

// ----- All products by model -----
const allProducts = {
  sanya: [
    { name: "Sanya Cylender", price: 850, stock: 5, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
    { name: "Sanya Leather Seat", price: 150, stock: 8, img: "https://i.imgur.com/JqNDT4P.jpeg" }
  ],
  becane: [
    { name: "Becane Clutch", price: 700, stock: 8, img: "https://i.imgur.com/GCKdTrL.jpeg" },
    { name: "Becane Headlight", price: 250, stock: 10, img: "https://i.imgur.com/J6l8Ln2.jpeg" }
  ],
  c50: [
    { name: "C50 Chain Kit", price: 500, stock: 12, img: "https://i.imgur.com/N18ldZS.jpeg" },
    { name: "C50 Exhaust", price: 950, stock: 5, img: "https://i.imgur.com/ragV47h.png" }
  ]
};

let model = "sanya"; // default page
let products = [];
let cartData = [];

// ----- Render products -----
function renderProducts() {
  productList.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `<img src="${p.img}" alt="${p.name}"> <h3>${p.name}</h3> <p>${p.price} MAD</p>`;
    div.addEventListener("click", () => openPopup(p));
    productList.appendChild(div);
  });
}

// ----- Initialize first page products -----
function loadModel(modelName) {
  model = modelName;
  products = allProducts[model].map((p, index) => ({
    ...p,
    id: `${model}-${index + 1}`, // unique id across models
    model: model
  }));
  renderProducts();
}

// Load default model
loadModel("sanya");

// ----- Product Popup -----
function openPopup(product) {
  popupTitle.textContent = product.name;
  popupImg.src = product.img;
  popupPrice.textContent = `Price: ${product.price} MAD`;
  popupStock.textContent = `In stock: ${product.stock}`;
  quantitySelect.innerHTML = "";
  for (let i = 1; i <= product.stock; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    quantitySelect.appendChild(option);
  }
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
  const existing = cartData.find(i => i.id === product.id);
  if (existing) existing.qty += qty;
  else cartData.push({ ...product, qty });
  updateCart();
  popup.classList.add("hidden");
}

// ----- Update Cart -----
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cartData.forEach(i => {
    const li = document.createElement("li");
    li.innerHTML = `<span>[${i.model.toUpperCase()}] ${i.name} x${i.qty} = ${i.price * i.qty} MAD</span>
      <button class="remove-item">🗑️</button>`;
    li.querySelector(".remove-item").onclick = () => removeItem(i.id);
    total += i.price * i.qty;
    cartItems.appendChild(li);
  });
  totalText.textContent = `Total: ${total} MAD`;

  if (cartData.length > 0) {
    // Count total quantities
    const totalQty = cartData.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalQty;
    cartCount.classList.remove("hidden");
  } else cartCount.classList.add("hidden");
}

function removeItem(id) {
  cartData = cartData.filter(i => i.id !== id);
  updateCart();
}

// ----- Checkout -----
checkoutBtn.onclick = () => {
  if (cartData.length === 0) return alert("Your cart is empty!");
  const msg = cartData.map(i => `${i.name} x${i.qty} = ${i.price * i.qty} MAD`).join("\n");
  const total = cartData.reduce((s, i) => s + i.price * i.qty, 0);
  const text = encodeURIComponent(`Hello Bee Auto Parts, I'd like to order:\n${msg}\n\nTotal: ${total} MAD`);
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

// ----- Model navigation -----
document.querySelectorAll(".model-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const selectedModel = btn.getAttribute("data-model");
    loadModel(selectedModel);
  });
});
