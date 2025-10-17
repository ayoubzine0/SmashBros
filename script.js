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
const closeCartBtn = document.getElementById("close-cart-btn");
const openCartBtn = document.getElementById("open-cart-btn");
const cartItems = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCount = document.getElementById("cart-count");

const aboutPopup = document.getElementById("about-popup");
const contactPopup = document.getElementById("contact-popup");
const aboutBtn = document.getElementById("about-btn");
const contactBtn = document.getElementById("contact-btn");
const closeAbout = document.querySelector(".close-about");
const closeContact = document.querySelector(".close-contact");

let products = [
  {id:1, name:"Cylinder", price:850, stock:5, img:"https://i.imgur.com/KHFhKuJ.jpeg"},
  {id:2, name:"Chain Kit", price:600, stock:12, img:"https://i.imgur.com/N18ldZS.jpeg"},
  {id:3, name:"Spark Plug", price:350, stock:20, img:"https://i.imgur.com/ilbC97V.jpeg"},
  {id:4, name:"Clutch Kit", price:250, stock:15, img:"https://i.imgur.com/GCKdTrL.jpeg"},
  {id:5, name:"Sanya Leather Seat", price:150, stock:8, img:"https://i.imgur.com/JqNDT4P.jpeg"},
  {id:6, name:"Exhaust Pipe", price:950, stock:6, img:"https://i.imgur.com/ragV47h.png"},
  {id:7, name:"Motorcycle Alarm System", price:120, stock:30, img:"https://i.imgur.com/5kijwUc.jpeg"},
  {id:8, name:"Motorcycle Phone Support", price:1100, stock:4, img:"https://i.imgur.com/J6l8Ln2.jpeg"}
];

let cartData = [];

// RENDER PRODUCTS
function renderProducts() {
  productList.innerHTML = "";
  products.forEach(p => {
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
}
renderProducts();

// POPUP
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
window.onclick = e => { if (e.target === popup) popup.classList.add("hidden"); };

// CART
openCartBtn.onclick = () => cart.classList.add("visible");
closeCartBtn.onclick = () => cart.classList.remove("visible");

function addToCart(product) {
  const qty = parseInt(quantitySelect.value);
  const existing = cartData.find(i => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cartData.push({...product, qty});
  }
  updateCart();
  popup.classList.add("hidden");
}

function removeFromCart(id) {
  cartData = cartData.filter(i => i.id !== id);
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cartData.forEach(i => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${i.name} x${i.qty} = ${i.price * i.qty} MAD
      <button class="remove-item" onclick="removeFromCart(${i.id})">X</button>
    `;
    total += i.price * i.qty;
    cartItems.appendChild(li);
  });
  totalText.textContent = `Total: ${total} MAD`;
  cartCount.textContent = cartData.length;
}

checkoutBtn.onclick = () => {
  if (cartData.length === 0) return alert("Your cart is empty!");
  const msg = cartData.map(i => `${i.name} x${i.qty} = ${i.price * i.qty} MAD`).join("\n");
  const total = cartData.reduce((s,i)=>s+i.price*i.qty,0);
  const text = encodeURIComponent(`Hello Bee Auto Parts, I'd like to order:\n${msg}\n\nTotal: ${total} MAD`);
  window.open(`https://wa.me/?text=${text}`, "_blank");
};

// ABOUT & CONTACT POPUPS
aboutBtn.onclick = () => aboutPopup.classList.remove("hidden");
contactBtn.onclick = () => contactPopup.classList.remove("hidden");
closeAbout.onclick = () => aboutPopup.classList.add("hidden");
closeContact.onclick = () => contactPopup.classList.add("hidden");
