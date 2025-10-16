// === Product Data ===
const products = [
  { id: 1, name: "Cylender", price: 220, stock: 80, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
  { id: 2, name: "Chain Kit", price: 95, stock: 90, img: "https://i.imgur.com/N18ldZS.jpeg" },
  { id: 3, name: "Moroccan Tea Set", price: 250, stock: 5, img: "https://picsum.photos/id/1013/200" },
  { id: 17, name: "Shock Absorber", price: 50, stock: 100, img: "https://i.imgur.com/kEeBvLR.jpeg" },
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
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const phone = "212724680135"; // ← put your WhatsApp number here
  let message = "🛍 *Bee Shop Morocco Order*\n\n";
  cart.forEach(item => {
    message += `• ${item.name} x${item.quantity} = ${item.price * item.quantity} MAD\n`;
  });
  message += `\n💰 Total: ${totalText.textContent.replace('Total: ', '')}`;

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, "_blank");
});

