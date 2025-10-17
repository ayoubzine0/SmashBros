// Products (example data)
const products = [
  { id: 1, name: "Brake Pads", price: 120, img: "https://i.imgur.com/jKZPpWn.png" },
  { id: 2, name: "Spark Plug", price: 90, img: "https://i.imgur.com/jKZPpWn.png" },
  { id: 3, name: "Motorcycle Chain", price: 240, img: "https://i.imgur.com/jKZPpWn.png" },
  { id: 4, name: "Oil Filter", price: 75, img: "https://i.imgur.com/jKZPpWn.png" },
];

const productList = document.getElementById("product-list");
const cartSidebar = document.getElementById("cartSidebar");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

let cart = {};

function renderProducts() {
  productList.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price} MAD</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    productList.appendChild(div);
  });
}

function addToCart(id) {
  if (!cart[id]) cart[id] = { ...products.find(p => p.id === id), qty: 1 };
  else cart[id].qty++;
  updateCart();
}

function removeFromCart(id) {
  delete cart[id];
  updateCart();
}

function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let distinctItems = 0;
  Object.values(cart).forEach(item => {
    total += item.price * item.qty;
    distinctItems++;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <p>${item.name} (${item.qty}) - ${item.price * item.qty} MAD</p>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartItemsContainer.appendChild(div);
  });
  cartTotal.textContent = `Total: ${total} MAD`;
  cartCount.textContent = distinctItems;

  // WhatsApp checkout link
  const msg = Object.values(cart)
    .map(i => `${i.name} x${i.qty}`)
    .join(", ");
  document.getElementById("whatsappLink").href = `https://wa.me/212600000000?text=I'd%20like%20to%20order:%20${encodeURIComponent(msg)}%20Total:%20${total}MAD`;
}

openCartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("active");
});

closeCartBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("active");
});

// Popup handlers
document.getElementById("aboutBtn").addEventListener("click", () => {
  document.getElementById("aboutPopup").classList.remove("hidden");
});
document.getElementById("contactBtn").addEventListener("click", () => {
  document.getElementById("contactPopup").classList.remove("hidden");
});
function closePopup(id) {
  document.getElementById(id).classList.add("hidden");
}

// Initialize
renderProducts();
