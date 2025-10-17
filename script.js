const products = [
  { name: "Motorcycle Helmet", price: 350, image: "https://i.imgur.com/1iH1f5E.png" },
  { name: "Car Oil Filter", price: 120, image: "https://i.imgur.com/Vj0PCEB.png" },
  { name: "Brake Pads", price: 200, image: "https://i.imgur.com/G1BjoXU.png" },
  { name: "Exhaust Pipe", price: 500, image: "https://i.imgur.com/mTqg7I5.png" },
  { name: "Gear Lever", price: 180, image: "https://i.imgur.com/9v2HYwT.png" },
  { name: "Spark Plug", price: 60, image: "https://i.imgur.com/yoF2VdK.png" },
  { name: "Wheel Rim", price: 750, image: "https://i.imgur.com/wE4o0Bc.png" },
  { name: "Air Filter", price: 100, image: "https://i.imgur.com/4L4gxg5.png" }
];

const productList = document.getElementById("product-list");
const cart = document.getElementById("cart");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cartCount");

let cartData = {};

function renderProducts() {
  productList.innerHTML = "";
  products.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price} MAD</p>
    `;
    card.addEventListener("click", () => addToCart(i));
    productList.appendChild(card);
  });
}

function addToCart(i) {
  const p = products[i];
  if (cartData[p.name]) {
    cartData[p.name].quantity += 1;
  } else {
    cartData[p.name] = { ...p, quantity: 1 };
  }
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let itemCount = 0;
  Object.values(cartData).forEach((item) => {
    total += item.price * item.quantity;
    itemCount++;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name} x${item.quantity}</span>
      <button onclick="removeItem('${item.name}')">🗑️</button>
    `;
    cartItems.appendChild(div);
  });
  cartTotal.textContent = `Total: ${total} MAD`;
  cartCount.textContent = itemCount;
}

function removeItem(name) {
  delete cartData[name];
  updateCart();
}

openCartBtn.addEventListener("click", () => {
  cart.classList.add("open");
});

closeCartBtn.addEventListener("click", () => {
  cart.classList.remove("open");
});

document.querySelectorAll(".close-modal").forEach(btn => {
  btn.addEventListener("click", (e) => {
    document.getElementById(e.target.dataset.close).style.display = "none";
  });
});

document.getElementById("aboutBtn").addEventListener("click", () => {
  document.getElementById("aboutModal").style.display = "flex";
});
document.getElementById("contactBtn").addEventListener("click", () => {
  document.getElementById("contactModal").style.display = "flex";
});

renderProducts();
