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

// ----- Translation -----
const translations = {
  ar: {
    brand: "قطع غيار النحل",
    aboutTitle: "عن Bee Auto Parts",
    aboutText: "Bee Auto Parts هو مصدر موثوق في المغرب لقطع غيار الدراجات والسيارات. نحن نجمع بين الموثوقية والأسعار العادلة والتوصيل السريع لمساعدة الدراجين والورش على تشغيل محركاتهم.",
    contactTitle: "اتصل بنا",
    contactPhone: "📞 الهاتف: +212 600-123456",
    contactEmail: "📧 البريد: contact@beeautoparts.ma",
    contactAddress: "📍 العنوان: الدار البيضاء، المغرب",
    cartTitle: "🛒 سلة المشتريات",
    checkoutBtn: "الدفع عبر واتساب",
    quantityLabel: "الكمية:",
    stockText: "المخزون: ",
    totalText: "الإجمالي: "
  },
  en: {
    brand: "Bee Auto Parts",
    aboutTitle: "About Bee Auto Parts",
    aboutText: "Bee Auto Parts is Morocco’s trusted source for quality motorcycle and car parts. We combine reliability, fair pricing, and fast delivery to help riders and garages keep their engines running.",
    contactTitle: "Contact Us",
    contactPhone: "📞 Phone: +212 600-123456",
    contactEmail: "📧 Email: contact@beeautoparts.ma",
    contactAddress: "📍 Address: Casablanca, Morocco",
    cartTitle: "🛒 Cart",
    checkoutBtn: "Checkout on WhatsApp",
    quantityLabel: "Quantity:",
    stockText: "In stock: ",
    totalText: "Total: "
  }
};

let currentLang = "en";
document.getElementById("translate-btn").onclick = () => {
  currentLang = currentLang === "en" ? "ar" : "en";
  applyTranslations();
};

function applyTranslations() {
  const t = translations[currentLang];

  // Brand
  document.querySelector(".brand h1").textContent = t.brand;

  // About popup
  document.querySelector("#about-popup h2").textContent = t.aboutTitle;
  document.querySelector("#about-popup p").textContent = t.aboutText;

  // Contact popup
  document.querySelector("#contact-popup h2").textContent = t.contactTitle;
  document.querySelector("#contact-popup p:nth-child(2)").textContent = t.contactPhone;
  document.querySelector("#contact-popup p:nth-child(3)").textContent = t.contactEmail;
  document.querySelector("#contact-popup p:nth-child(4)").textContent = t.contactAddress;

  // Cart
  document.querySelector("#cart h2").textContent = t.cartTitle;
  checkoutBtn.textContent = t.checkoutBtn;

  // Popup quantity label
  document.querySelector('label[for="quantity"]').textContent = t.quantityLabel;

  // Update stock text if popup is open
  if (!popup.classList.contains("hidden") && popupStock.textContent) {
    const productName = popupTitle.textContent;
    const product = products.find(p => p.name === productName);
    if (product) popupStock.textContent = `${t.stockText}${product.stock}`;
  }

  // Update total text
  totalText.textContent = `${t.totalText}${cartData.reduce((s, i) => s + i.price * i.qty, 0)} MAD`;
}

// ----- Products per page -----
let products = [];
const path = window.location.pathname.toLowerCase();

if (path.includes("becane")) {
  products = [
    { id: 1, name: "Becane Clutch", price: 700, stock: 8, img: "https://i.imgur.com/GCKdTrL.jpeg" },
    { id: 2, name: "Becane Headlight", price: 250, stock: 10, img: "https://i.imgur.com/J6l8Ln2.jpeg" },
  ];
} else if (path.includes("c50")) {
  products = [
    { id: 1, name: "C50 Chain Kit", price: 500, stock: 12, img: "https://i.imgur.com/N18ldZS.jpeg" },
    { id: 2, name: "C50 Exhaust", price: 950, stock: 5, img: "https://i.imgur.com/ragV47h.png" },
  ];
} else {
  products = [
    { id: 1, name: "Sanya Cylender", price: 850, stock: 5, img: "https://i.imgur.com/KHFhKuJ.jpeg" },
    { id: 2, name: "Sanya Leather Seat", price: 150, stock: 8, img: "https://i.imgur.com/JqNDT4P.jpeg" },
  ];
}

// ----- Cart -----
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
renderProducts();

// ----- Product popup -----
function openPopup(product) {
  popupTitle.textContent = product.name;
  popupImg.src = product.img;
  popupPrice.textContent = `Price: ${product.price} MAD`;
  popupStock.textContent = `In stock: ${product.stock}`;
  if(currentLang === "ar") popupStock.textContent = `${translations.ar.stockText}${product.stock}`;
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
  const existing = cartData.find(i => i.id === product.id && i.model === (product.model || path));
  if (existing) existing.qty += qty;
  else cartData.push({ ...product, qty, model: product.model || path });
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
    li.querySelector(".remove-item").onclick = () => removeItem(i.id, i.model);
    total += i.price * i.qty;
    cartItems.appendChild(li);
  });
  totalText.textContent = `${translations[currentLang].totalText}${total} MAD`;

  if (cartData.length > 0) {
    cartCount.textContent = cartData.length;
    cartCount.classList.remove("hidden");
  } else cartCount.classList.add("hidden");
}

function removeItem(id, model) {
  cartData = cartData.filter(i => !(i.id === id && i.model === model));
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

// ----- Model buttons navigation -----
document.querySelectorAll(".model-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const model = btn.getAttribute("data-model");
    window.location.href = `${model}.html`;
  });
});
