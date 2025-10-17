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

const products = [
  { id: 1, name: "Cylender", price: 850, stock: 5, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
  { id: 2, name: "Chain Kit", price: 600, stock: 12, img: "https://i.imgur.com/N18ldZS.jpeg" },
  { id: 3, name: "Spark Plug", price: 350, stock: 20, img: "https://i.imgur.com/ilbC97V.jpeg" },
  { id: 4, name: "Clutch Kit", price: 250, stock: 15, img: "https://i.imgur.com/GCKdTrL.jpeg" },
  { id: 5, name: "Sanya Leather Seat", price: 150, stock: 8, img: "https://i.imgur.com/JqNDT4P.jpeg" },
  { id: 6, name: "Exhaust Pipe", price: 950, stock: 6, img: "https://i.imgur.com/ragV47h.png" },
  { id: 7, name: "Motorcycle Alarm System", price: 120, stock: 30, img: "https://i.imgur.com/5kijwUc.jpeg" },
  { id: 8, name: "Motorcycle Phone Support", price: 1100, stock: 4, img: "https://i.imgur.com/J6l8Ln2.jpeg" }
];

let cartData = [];

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
renderProducts();

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

function addToCart(product) {
  const qty = parseInt(quantitySelect.value);
  const existing = cartData.find(i => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cartData.push({ ...product, qty });
  }
  updateCart();
  popup.classList.add("hidden");
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cartData.forEach(i => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${i.name} x${i.qty} = ${i.price * i.qty} MAD</span>
      <button class="remove-item">🗑️</button>`;
    li.querySelector(".remove-item").onclick = () => removeItem(i.id);
    total += i.price * i.qty;
    cartItems.appendChild(li);
  });
  totalText.textContent = `Total: ${total} MAD`;

  const uniqueCount = cartData.length;
  if (uniqueCount > 0) {
    cartCount.textContent = uniqueCount;
    cartCount.classList.remove("hidden");
  } else {
    cartCount.classList.add("hidden");
  }
}

function removeItem(id) {
  cartData = cartData.filter(i => i.id !== id);
  updateCart();
}

checkoutBtn.onclick = () => {
  if (cartData.length === 0) return alert("Your cart is empty!");
  const msg = cartData.map(i => `${i.name} x${i.qty} = ${i.price * i.qty} MAD`).join("\n");
  const total = cartData.reduce((s, i) => s + i.price * i.qty, 0);
  const text = encodeURIComponent(`Hello Bee Auto Parts, I'd like to order:\n${msg}\n\nTotal: ${total} MAD`);
  window.open(`https://wa.me/?text=${text}`, "_blank");
};

// CART OPEN/CLOSE
closeCartBtn.addEventListener("click", () => {
  cart.classList.remove("open");
  cart.classList.add("closed");
});

openCartBtn.addEventListener("click", () => {
  cart.classList.add("open");
  cart.classList.remove("closed");
});
openCartBtn.addEventListener("click", () => {
  cart.classList.add("open");
  document.body.classList.add("cart-open");
});
closeCartBtn.addEventListener("click", () => {
  cart.classList.remove("open");
  document.body.classList.remove("cart-open");
});
