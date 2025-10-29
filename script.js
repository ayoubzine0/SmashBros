// Bee Auto Parts Script - Updated with Gallery + Zoom (keep everything else intact)
document.addEventListener("DOMContentLoaded", () => {
  const model = window.PAGE_MODEL || "sanya";

  // -----------------------------
  // PRODUCT DATA
  // -----------------------------
  const PRODUCTS = {
    sanya: [
      { id: "s1", name_en: "Jellahoodie Muza", name_ar: "جلاهودي موزا", price: 250, stock: 10,
        imgs: [
          "https://i.imgur.com/n747oql.png",
          "https://i.imgur.com/QMMMb3q.jpeg",
          "https://i.imgur.com/rzrAFd4.jpeg"
        ]
      },
      { id: "s2", name_en: "Headlight Sanya", name_ar: "ضوء أمامي سانيا", price: 180, stock: 8,
        imgs: [
          "https://i.imgur.com/gLX4OVp.jpeg",
          "https://i.imgur.com/PC5nUMa.jpeg",
          "https://i.imgur.com/5ZoRk8p.jpeg"
        ]
      }
    ],
    becane: [
      { id: "b1", name_en: "Brake Lever", name_ar: "مقبض الفرامل", price: 75, stock: 12,
        imgs: [
          "https://i.imgur.com/CudLOgD.jpeg",
          "https://i.imgur.com/4YXLlOQ.jpeg",
          "https://i.imgur.com/xsEbH09.jpeg"
        ]
      },
      { id: "b2", name_en: "Rear Mirror", name_ar: "مرآة خلفية", price: 60, stock: 20,
        imgs: [
          "https://i.imgur.com/NsHPKyc.jpeg",
          "https://i.imgur.com/yR7dZ7V.jpeg",
          "https://i.imgur.com/Z6tI9MQ.jpeg"
        ]
      }
    ],
    c50: [
      { id: "c1", name_en: "C50 Exhaust", name_ar: "عادم C50", price: 220, stock: 5,
        imgs: [
          "https://i.imgur.com/tUuxi1s.jpeg",
          "https://i.imgur.com/yS2VUPp.jpeg",
          "https://i.imgur.com/GEU6RJ9.jpeg"
        ]
      },
      { id: "c2", name_en: "Rear Light", name_ar: "ضوء خلفي", price: 130, stock: 9,
        imgs: [
          "https://i.imgur.com/nCrl8Ev.jpeg",
          "https://i.imgur.com/0lWALex.jpeg",
          "https://i.imgur.com/3Vk9spU.jpeg"
        ]
      }
    ]
  };

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  let currentLang = localStorage.getItem("lang") || "en";

  // -----------------------------
  // RENDER PRODUCTS
  // -----------------------------
  function renderProducts(model) {
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    PRODUCTS[model].forEach(p => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${p.imgs[0]}" alt="${p.name_en}">
        <h3>${currentLang === "ar" ? p.name_ar : p.name_en}</h3>
        <p>${p.price} MAD</p>
        <button data-id="${p.id}" class="view-btn">${currentLang === "ar" ? "عرض" : "View"}</button>
      `;
      div.querySelector(".view-btn").addEventListener("click", () => openProductPopup(p));
      list.appendChild(div);
    });
  }

  // -----------------------------
  // POPUPS
  // -----------------------------
  const productPopup = document.getElementById("product-popup");
  const galleryEl = document.getElementById("popup-gallery");
  const zoomedImg = document.getElementById("zoomed-image");
  const popupTitle = document.getElementById("popup-title");
  const popupPrice = document.getElementById("popup-price");
  const popupStock = document.getElementById("popup-stock");
  const quantitySelect = document.getElementById("quantity");
  const addToCartBtn = document.getElementById("add-to-cart");

  function openProductPopup(product) {
    popupTitle.textContent = currentLang === "ar" ? product.name_ar : product.name_en;
    popupPrice.textContent = product.price + " MAD";
    popupStock.textContent = `${currentLang === "ar" ? "المخزون" : "Stock"}: ${product.stock}`;

    galleryEl.innerHTML = "";
    (product.imgs || []).forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = product.name_en;
      img.addEventListener("click", () => openZoom(src));
      galleryEl.appendChild(img);
    });

    quantitySelect.innerHTML = "";
    for (let i = 1; i <= product.stock; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i;
      quantitySelect.appendChild(opt);
    }

    addToCartBtn.onclick = () => addToCart(product.id);
    productPopup.classList.remove("hidden");
  }

  function closePopups() {
    productPopup.classList.add("hidden");
    document.getElementById("about-popup")?.classList.add("hidden");
    document.getElementById("contact-popup")?.classList.add("hidden");
    closeZoom();
  }

  document.querySelectorAll(".close, .close-about, .close-contact").forEach(btn => {
    btn.addEventListener("click", closePopups);
  });

  // -----------------------------
  // ZOOM FEATURE
  // -----------------------------
  function openZoom(src) {
    zoomedImg.src = src;
    zoomedImg.style.display = "block";
  }

  function closeZoom() {
    zoomedImg.style.display = "none";
  }

  zoomedImg.addEventListener("click", closeZoom);

  // -----------------------------
  // CART SYSTEM
  // -----------------------------
  const openCartBtn = document.getElementById("open-cart");
  const closeCartBtn = document.getElementById("close-cart");
  const cartEl = document.getElementById("cart");
  const cartItemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const cartCountEl = document.getElementById("cart-count");

  function addToCart(id) {
    const qty = parseInt(quantitySelect.value);
    const product = PRODUCTS[model].find(p => p.id === id);
    if (!product) return;
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, qty, model });
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("✅ Added to cart!");
    updateCartDisplay();
  }

  function updateCartDisplay() {
    cartItemsEl.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
      const prod = PRODUCTS[item.model].find(p => p.id === item.id);
      if (!prod) return;
      total += prod.price * item.qty;
      count += item.qty;
      const li = document.createElement("li");
      li.textContent = `${currentLang === "ar" ? prod.name_ar : prod.name_en} x${item.qty}`;
      cartItemsEl.appendChild(li);
    });

    totalEl.textContent = `Total: ${total} MAD`;
    cartCountEl.textContent = count;
    cartCountEl.classList.toggle("hidden", count === 0);
  }

  openCartBtn.addEventListener("click", () => cartEl.classList.add("active"));
  closeCartBtn.addEventListener("click", () => cartEl.classList.remove("active"));

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2000);
  }

  // -----------------------------
  // TRANSLATION
  // -----------------------------
  const translateBtn = document.getElementById("translate-btn");

  function switchLang() {
    currentLang = currentLang === "en" ? "ar" : "en";
    localStorage.setItem("lang", currentLang);
    translateBtn.textContent = currentLang === "ar" ? "EN" : "عربي";
    document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
    renderProducts(model);
    updateCartDisplay();
  }

  translateBtn.addEventListener("click", switchLang);

  // -----------------------------
  // CHECKOUT
  // -----------------------------
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) return alert("Cart is empty!");
    let message = "🛒 Bee Auto Parts Order:\n";
    let total = 0;
    cart.forEach(item => {
      const p = PRODUCTS[item.model].find(pr => pr.id === item.id);
      message += `• ${p.name_en} x${item.qty} = ${p.price * item.qty} MAD\n`;
      total += p.price * item.qty;
    });
    message += `\nTotal: ${total} MAD`;
    const url = "https://wa.me/212724680135?text=" + encodeURIComponent(message);
    window.open(url, "_blank");
  });

  // -----------------------------
  // INIT
  // -----------------------------
  renderProducts(model);
  updateCartDisplay();
});
