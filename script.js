// === Product Data ===
const products = [
  { id: 1, name: "Motorcycle Cylinder", price: 220, stock: 80, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
  { id: 2, name: "Chain Kit", price: 95, stock: 90, img: "https://i.imgur.com/N18ldZS.jpeg" },
  { id: 3, name: "Shock Absorber", price: 350, stock: 12, img: "https://i.imgur.com/kEeBvLR.jpeg" },
  { id: 4, name: "Engine Oil 4T 1L", price: 110, stock: 25, img: "https://i.imgur.com/bSS5Mkb.jpeg" },
  { id: 5, name: "Brake Pads", price: 80, stock: 40, img: "https://i.imgur.com/HJh9XzZ.jpeg" },
  { id: 6, name: "Spark Plug", price: 50, stock: 60, img: "https://i.imgur.com/a4ZGR7U.jpeg" },
  { id: 7, name: "Motorcycle Battery", price: 320, stock: 15, img: "https://i.imgur.com/dpXqxJg.jpeg" },
  { id: 8, name: "Air Filter", price: 65, stock: 30, img: "https://i.imgur.com/DZcGdFZ.jpeg" },
];

// === DOM References ===
const productList = document.getElementById('product-list');
const popup = document.getElementById('product-popup');
const popupTitle = document.getElementById('popup-title');
const popupImg = document.getElementById('popup-img');
const popupPrice = document.getElementById('popup-price');
const popupStock = document.getElementById('popup-stock');
const closeBtn = document.querySelector('.close');
const quantitySelect = document.getElementById('quantity');
const addToCartBtn = document.getElementById('add-to-cart');
const cartItems = document.getElementById('cart-items');
const totalText = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

let currentProduct = null;
let cart = [];

// === Display products ===
products.forEach(p => {
  const div = document.createElement('div');
  div.classList.add('product');
  div.innerHTML = `
    <img src="${p.img}" alt="${p.name}">
    <h3>${p.name}</h3>
    <p>${p.price} MAD</p>
  `;
  div.addEventListener('click', () => openPopup(p));
  productList.appendChild(div);
});

// === Popup ===
function openPopup(product) {
  currentProduct = product;
  popupTitle.textContent = product.name;
  popupImg.src = product.img;
  popupPrice.textContent = `💰 Price: ${product.price} MAD`;
  popupStock.textContent = `📦 In stock: ${product.stock}`;
  quantitySelect.innerHTML = "";
  for (let i = 1; i <= product.stock; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = i;
    quantitySelect.appendChild(opt);
  }
  popup.classList.remove('hidden');
}

closeBtn.addEventListener('click', () => popup.classList.add('hidden'));
window.addEventListener('click', e => { if (e.target === popup) popup.classList.add('hidden'); });

// === Cart Logic ===
addToCartBtn.addEventListener('click', () => {
  if (!currentProduct) return;
  const qty = parseInt(quantitySelect.value);
  addToCart(currentProduct, qty);
  popup.classList.add('hidden');
});

function addToCart(product, quantity) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += quantity;
  else cart.push({ ...product, quantity });
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.quantity} = ${subtotal.toFixed(2)} MAD`;
    total += subtotal;
    cartItems.appendChild(li);
  });
  totalText.textContent = `Total: ${total.toFixed(2)} MAD`;
}

// === WhatsApp Checkout ===
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) return alert("Your cart is empty!");
  const number = "212600000000"; // <-- replace with your WhatsApp number
  let message = "🛒 *Bee Shop Morocco Order*\n\n";
  cart.forEach(item => {
    message += `${item.name} x${item.quantity} = ${item.price * item.quantity} MAD\n`;
  });
  const total = totalText.textContent;
  message += `\n${total}\n\nPlease confirm my order.`;
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${number}?text=${encoded}`, "_blank");
});
