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

const products = [
  {id:1, name:"Motorcycle Helmet", price:850, stock:5, img:"https://images.unsplash.com/photo-1600803907087-f56d462fd26b"},
  {id:2, name:"Car Brake Pads", price:600, stock:12, img:"https://images.unsplash.com/photo-1616222593965-4a1ad908b240"},
  {id:3, name:"Engine Oil 5L", price:350, stock:20, img:"https://images.unsplash.com/photo-1601924994987-69a3c8d6e9f0"},
  {id:4, name:"LED Headlight", price:250, stock:15, img:"https://images.unsplash.com/photo-1580196969807-cc6de06c05f8"},
  {id:5, name:"Racing Gloves", price:150, stock:8, img:"https://images.unsplash.com/photo-1611078484730-5c7a5f3a26bb"},
  {id:6, name:"Exhaust Pipe", price:950, stock:6, img:"https://images.unsplash.com/photo-1615463603178-b2ad4f9a8fbb"},
  {id:7, name:"Motor Oil Filter", price:120, stock:30, img:"https://images.unsplash.com/photo-1603714223985-4d5fdc54a876"},
  {id:8, name:"Car Battery", price:1100, stock:4, img:"https://images.unsplash.com/photo-1620917669754-1a93761a53d1"}
];

let cart = [];

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

function addToCart(product) {
  const qty = parseInt(quantitySelect.value);
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({...product, qty});
  }
  updateCart();
  popup.classList.add("hidden");
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(i => {
    const li = document.createElement("li");
    li.textContent = `${i.name} x${i.qty} = ${i.price * i.qty} MAD`;
    total += i.price * i.qty;
    cartItems.appendChild(li);
  });
  totalText.textContent = `Total: ${total} MAD`;
}

checkoutBtn.onclick = () => {
  if (cart.length === 0) return alert("Your cart is empty!");
  const msg = cart.map(i => `${i.name} x${i.qty} = ${i.price * i.qty} MAD`).join("\n");
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const text = encodeURIComponent(`Hello Bee Auto Parts, I'd like to order:\n${msg}\n\nTotal: ${total} MAD`);
  window.open(`https://wa.me/?text=${text}`, "_blank");
};
