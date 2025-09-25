document.addEventListener("DOMContentLoaded", () => {

  const menuItems = [
    { id: 1, name: "Simple Smash Burger", price: 35, combo: 50, img: "https://i.imgur.com/C8oaoZU.png" }, // <-- replace URL
    { id: 2, name: "Cheese Smash Burger", price: 40, combo: 55, img: "https://i.imgur.com/image2.png" }, // <-- replace URL
    { id: 3, name: "Double Smash Burger", price: 50, combo: 60, img: "https://i.imgur.com/image3.png" }, // <-- replace URL
    { id: 4, name: "Double Cheese Smash Burger", price: 55, combo: 65, img: "https://i.imgur.com/image4.png" }, // <-- replace URL
    { id: 5, name: "Loaded Fries", price: 25, img: "https://i.imgur.com/image5.png" } // <-- replace URL
  ];

  const menuDiv = document.getElementById("menu");
  const cartUl = document.getElementById("cart");
  const totalP = document.getElementById("total");
  const checkoutDiv = document.getElementById("checkout");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const orderForm = document.getElementById("orderForm");
  const methodSelect = document.getElementById("method");
  const addressInput = document.getElementById("address");

  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalQty = document.getElementById("modalQty");
  const confirmBtn = document.getElementById("confirmBtn");
  const comboCheck = document.getElementById("comboCheck");
  const modalPrice = document.getElementById("modalPrice");

  const coinSound = document.getElementById("coinSound");
  let cart = [];
  let currentItem = null;

  // Render menu cards
  menuItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.background = `url('${item.img}') no-repeat center/cover`; // <-- this sets the image

    card.innerHTML = `<div><h3>${item.name}</h3><p>${item.price} DH</p></div>`;

    if (item.combo) {
      const btn = document.createElement("button");
      btn.className = "btn green";
      btn.textContent = "Customize";
      btn.addEventListener("click", () => openModal(item));
      card.appendChild(btn);
    } else {
      const right = document.createElement("div");
      right.style.display = "flex"; right.style.gap = "8px"; right.style.alignItems = "center";

      const qtyInput = document.createElement("input");
      qtyInput.type = "number"; qtyInput.min = "1"; qtyInput.value = "1"; qtyInput.className = "qtyInput";

      const addBtn = document.createElement("button");
      addBtn.className = "btn green"; addBtn.textContent = "Add to Cart";

      addBtn.addEventListener("click", () => {
        const qty = parseInt(qtyInput.value) || 1;
        for (let i = 0; i < qty; i++) {
          cart.push({ name: item.name, price: item.price, details: "x1" });
        }
        renderCart();
        qtyInput.value = 1;
        playCoin();
      });

      right.appendChild(qtyInput);
      right.appendChild(addBtn);
      card.appendChild(right);
    }

    menuDiv.appendChild(card);
  });

  // Open modal
  function openModal(item) {
    currentItem = item;
    modalTitle.textContent = `Customize ${item.name}`;
    modalQty.value = 1;
    modal.querySelectorAll('input[type="checkbox"]:not(#comboCheck)').forEach(cb => cb.checked = false);
    comboCheck.checked = false;
    modal.querySelectorAll('input[name="drink"]').forEach(rb => { rb.checked = false; rb.disabled = true; });
    modalPrice.textContent = `Price: ${item.price} DH`;
    modal.style.display = "flex";
  }

  comboCheck.addEventListener("change", () => {
    if (!currentItem) return;
    modalPrice.textContent = comboCheck.checked && currentItem.combo ? `Price: ${currentItem.combo} DH` : `Price: ${currentItem.price} DH`;
    modal.querySelectorAll('input[name="drink"]').forEach(rb => { rb.disabled = !comboCheck.checked; if(!comboCheck.checked) rb.checked=false; });
  });

  closeModal.addEventListener("click", () => modal.style.display="none");
  modal.addEventListener("click", (e) => { if(e.target===modal) modal.style.display="none"; });

  confirmBtn.addEventListener("click", () => {
    const qty = parseInt(modalQty.value) || 1;
    const extras = [];
    modal.querySelectorAll('input[type="checkbox"]:not(#comboCheck):checked').forEach(cb => extras.push(cb.value));
    const selectedDrink = modal.querySelector('input[name="drink"]:checked');
    let drink = selectedDrink ? selectedDrink.value : "";
    const price = comboCheck.checked && currentItem.combo ? currentItem.combo : currentItem.price;

    for (let i=0; i<qty; i++) {
      cart.push({ name: currentItem.name + (comboCheck.checked?" Combo":""), price: price, details: extras.concat(drink ? ["Drink: "+drink]:[]).join(", ") || "No extras" });
    }

    renderCart(); modal.style.display="none"; playCoin();
  });

  function renderCart() {
    cartUl.innerHTML=""; let total=0;
    cart.forEach((it,idx)=>{
      total+=it.price;
      const li=document.createElement("li");
      li.innerHTML=`${it.name} (${it.details}) - ${it.price} DH <button class="btn red" onclick="removeFromCart(${idx})">Remove</button>`;
      cartUl.appendChild(li);
    });
    totalP.textContent=`Total: ${total} DH`;
  }

  window.removeFromCart = function(idx) { cart.splice(idx,1); renderCart(); }
  checkoutBtn.addEventListener("click",()=>checkoutDiv.classList.toggle("hidden"));
  methodSelect.addEventListener("change",()=>addressInput.classList.toggle("hidden",methodSelect.value!=="delivery"));
  orderForm.addEventListener("submit", e=> {
    e.preventDefault();
    if(cart.length===0){ alert("🛑 Your cart is empty!"); return; }
    const customerName=document.getElementById("name").value;
    const customerPhone=document.getElementById("phone").value;
    const method=document.getElementById("method").value;
    const address=document.getElementById("address").value;
    const orderItems=cart.map(i=>`${i.name} (${i.details}) - ${i.price} DH`).join('%0A');
    const total=cart.reduce((sum,i)=>sum+i.price,0);
    const waUrl=`https://wa.me/212724680135?text=New Order from ${encodeURIComponent(customerName)}%0APhone: ${encodeURIComponent(customerPhone)}%0AMethod: ${encodeURIComponent(method)}%0AAddress: ${encodeURIComponent(address)}%0AItems:%0A${encodeURIComponent(orderItems)}%0ATotal: ${total} DH`;
    window.open(waUrl,"_blank");
    cart=[]; renderCart(); checkoutDiv.classList.add("hidden");
  });

  function playCoin(){ try{ coinSound.currentTime=0; coinSound.play(); } catch(err){} }

});