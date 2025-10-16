// === Product Data ===
// Replace the img links with your own images
const products = [
  { id: 1, name: "Cylender", price: 220, stock: 80, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
  { id: 2, name: "Chain Kit", price: 95, stock: 90, img: "https://i.imgur.com/N18ldZS.jpeg" },
  { id: 3, name: "Moroccan Tea Set", price: 250, stock: 5, img: "https://picsum.photos/id/1013/200" },
  { id: 4, name: "Leather Wallet", price: 180, stock: 12, img: "https://picsum.photos/id/1014/200" },
  { id: 5, name: "Argan Shampoo", price: 75, stock: 20, img: "https://picsum.photos/id/1015/200" },
  { id: 6, name: "Traditional Slippers", price: 130, stock: 6, img: "https://picsum.photos/id/1016/200" },
  { id: 7, name: "Cedarwood Perfume", price: 220, stock: 9, img: "https://picsum.photos/id/1018/200" },
  { id: 8, name: "Berber Carpet", price: 650, stock: 3, img: "https://picsum.photos/id/1020/200" },
  { id: 9, name: "Handmade Basket", price: 90, stock: 15, img: "https://picsum.photos/id/1021/200" },
  { id: 10, name: "Mint Soap", price: 45, stock: 25, img: "https://picsum.photos/id/1022/200" },
  { id: 11, name: "Leather Bag", price: 400, stock: 5, img: "https://picsum.photos/id/1023/200" },
  { id: 12, name: "Ceramic Tagine", price: 300, stock: 4, img: "https://picsum.photos/id/1024/200" },
  { id: 13, name: "Spice Box Set", price: 180, stock: 10, img: "https://picsum.photos/id/1025/200" },
  { id: 14, name: "Cactus Oil", price: 150, stock: 8, img: "https://picsum.photos/id/1026/200" },
  { id: 15, name: "Rose Water", price: 60, stock: 18, img: "https://picsum.photos/id/1027/200" },
  { id: 16, name: "Moroccan Lamp", price: 280, stock: 5, img: "https://picsum.photos/id/1028/200" },
  { id: 17, name: "Shock Absorber", price: 50, stock: 100, img: "https://i.imgur.com/kEeBvLR.jpeg" },
  { id: 18, name: "Traditional Hat", price: 70, stock: 10, img: "https://picsum.photos/id/1031/200" },
  { id: 19, name: "Clay Pot", price: 85, stock: 9, img: "https://picsum.photos/id/1032/200" },
  { id: 20, name: "Wooden Spoon Set", price: 40, stock: 30, img: "https://picsum.photos/id/1033/200" }
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
