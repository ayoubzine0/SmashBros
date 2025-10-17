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

let products = [];

if (window.location.pathname.includes("becane")) {
  products = [
    { id: 1, name: "Becane Clutch", price: 700, stock: 8, img: "https://i.imgur.com/GCKdTrL.jpeg" },
    { id: 2, name: "Becane Headlight", price: 250, stock: 10, img: "https://i.imgur.com/J6l8Ln2.jpeg" },
  ];
} else if (window.location.pathname.includes("c50")) {
  products = [
    { id: 1, name: "C50 Chain Kit", price: 500, stock: 12, img: "https://i.imgur.com/N18ldZS.jpeg" },
    { id: 2, name: "C50 Exhaust", price: 950, stock: 5, img: "https://i.imgur.com/ragV47h.png" },
  ];
} else {
  // Default (Sanya)
  products = [
    { id: 1, name: "Sanya Cylender", price: 850, stock: 5, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
    { id: 2, name: "Sanya Leather Seat", price: 150, stock: 8, img: "https://i.imgur.com/JqNDT4P.jpeg" },
  ];
}

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

  const msg = cartData
    .map(i => `${i.name} x${i.qty} = ${i.price * i.qty} MAD`)
    .join("\n");

  const total = cartData.reduce((s, i) => s + i.price * i.qty, 0);
  const text = encodeURIComponent(
    `Hello Bee Auto Parts, I'd like to order:\n${msg}\n\nTotal: ${total} MAD`
  );

  const phone = "212724680135";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;

  // ✅ Detect if it's on mobile — open correctly
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = whatsappUrl; // opens WhatsApp app directly
  } else {
    window.open(whatsappUrl, "_blank"); // opens WhatsApp Web on desktop
  }
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
// ✅ Model-specific product lists
const modelProducts = {
  sanya: products, // You can replace this with filtered items later
  becane: products,
  c50: products
};

// ✅ Handle model button clicks
document.querySelectorAll(".model-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const model = btn.getAttribute("data-model");
    openModelPage(model);
  });
});

// ✅ Load model "page"
function openModelPage(model) {
  const modelTitle = model.charAt(0).toUpperCase() + model.slice(1);
  document.title = `Bee Auto Parts - ${modelTitle}`;

  // Optional: clear cart open state
  cart.classList.remove("open");
  document.body.classList.remove("cart-open");

  // Replace product list
  productList.innerHTML = "";
  modelProducts[model].forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price} MAD</p>
    `;
    div.addEventListener("click", () => openPopup(p));
    productList.appendChild(div);
  });

  // Optional: scroll to top when switching
  window.scrollTo({ top: 0, behavior: "smooth" });
}
// ✅ Navigation between categories
document.getElementById("sanya-link").onclick = () => window.location.href = "index.html";
document.getElementById("becane-link").onclick = () => window.location.href = "becane.html";
document.getElementById("c50-link").onclick = () => window.location.href = "c50.html";




