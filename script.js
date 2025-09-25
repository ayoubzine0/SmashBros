JS (script.js)
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = [
    { id: 1, name: "Simple Smash Burger", price: 35, combo: 50, img: "https://i.imgur.com/C8oaoZU.png" },
    { id: 2, name: "Cheese Smash Burger", price: 40, combo: 55, img: "https://i.imgur.com/XCeEQ50.png" },
    { id: 3, name: "Double Smash Burger", price: 50, combo: 60, img: "https://i.imgur.com/2mMSb4F.png" },
    { id: 4, name: "Double Cheese Smash Burger", price: 55, combo: 65, img: "https://i.imgur.com/RUk5cLU.jpeg" },
    { id: 5, name: "Loaded Fries", price: 25, img: "https://i.imgur.com/5YOTnl6.png" }
  ];

  const menuDiv = document.getElementById("menu");
  const cartUl = document.getElementById("cart");
  const totalP = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.querySelector(".modal-body");
  const closeModal = document.getElementById("closeModal");
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutCart = document.getElementById("checkoutCart");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutName = document.getElementById("checkoutName");
  const checkoutPhone = document.getElementById("checkoutPhone");
  const confirmOrderBtn = document.getElementById("confirmOrderBtn");
  const cancelOrderBtn = document.getElementById("cancelOrderBtn");
  const closeCheckout = document.getElementById("closeCheckout");
  const coinSound = document.getElementById("coinSound");

  let cart = [];
  let currentItem = null;

  function playCoin(){
    try { coinSound.currentTime = 0; coinSound.play(); } catch(err) {}
  }

  function renderMenu() {
    menuDiv.innerHTML = "";
    menuItems.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.backgroundImage = `url(${item.img})`;
      card.innerHTML = `<div><h3>${item.name}</h3><p>${item.price} DH</p></div>`;

      if(item.combo){
        const btn = document.createElement("button");
        btn.className = "btn green";
        btn.textContent = "Customize";
        btn.addEventListener("click", () => openModal(item));
        card.appendChild(btn);
      } else {
        const right = document.createElement("div");
        right.style.display="flex"; right.style.gap="8px"; right.style.alignItems="center";
        const qtyInput=document.createElement("input"); qtyInput.type="number"; qtyInput.min="1"; qtyInput.value="1"; qtyInput.className="qtyInput";
        const addBtn=document.createElement("button"); addBtn.className="btn green"; addBtn.textContent="Add to Cart";
        addBtn.addEventListener("click",()=>{ 
          const qty=parseInt(qtyInput.value)||1; 
          for(let i=0;i<qty;i++){ cart.push({name:item.name,price:item.price,details:"x1"}); } 
          renderCart(); qtyInput.value=1; playCoin(); 
        });
        right.appendChild(qtyInput); right.appendChild(addBtn); card.appendChild(right);
      }
      menuDiv.appendChild(card);
    });
  }

  renderMenu();

  function openModal(item){
    currentItem=item;
    modalTitle.textContent=`Customize ${item.name}`;
    modalBody.innerHTML=`
      <p>
        <label><input type="checkbox" id="comboCheck"> Add Combo</label>
        <label><input type="checkbox" id="noComboCheck"> No Combo</label>
      </p>
      <p>Extras (Toppings):</p>
      <label><input type="checkbox" value="Tomato"> Tomato</label>
      <label><input type="checkbox" value="Onion"> Onion</label>
      <label><input type="checkbox" value="Lettuce"> Lettuce</label>
      <label><input type="checkbox" value="Cheese"> Cheese</label>
      <p>Sauces:</p>
      <label><input type="checkbox" value="Mayo" class="sauce"> Mayo</label>
      <label><input type="checkbox" value="Ketchup" class="sauce"> Ketchup</label>
      <label><input type="checkbox" value="Mustard" class="sauce"> Mustard</label>
      <p>Drinks:</p>
      <label><input type="radio" name="drink" value="Coke" disabled> Coke</label>
      <label><input type="radio" name="drink" value="Sprite" disabled> Sprite</label>
      <label><input type="radio" name="drink" value="Hawai" disabled> Hawai</label>
      <p>Quantity: <input type="number" min="1" value="1" id="modalQty"></p>
      <p id="modalPrice">Price: ${item.price} DH</p>
      <button id="confirmBtn" class="btn green">Add to Cart</button>
    `;

    const comboCheck=document.getElementById("comboCheck");
    const noComboCheck=document.getElementById("noComboCheck");
    const modalQty=document.getElementById("modalQty");
    const confirmBtn=document.getElementById("confirmBtn");

    function updateDrinks() {
      modal.querySelectorAll('input[name="drink"]').forEach(rb=>{
        rb.disabled = !comboCheck.checked;
        if(rb.disabled) rb.checked=false;
      });
    }

    comboCheck.addEventListener("change",()=>{ 
      if(comboCheck.checked) noComboCheck.checked=false;
      updateDrinks();
      modal.querySelector('#modalPrice').textContent=`Price: ${comboCheck.checked ? item.combo : item.price} DH`; 
    });

    noComboCheck.addEventListener("change",()=>{ 
      if(noComboCheck.checked) comboCheck.checked=false;
      updateDrinks();
      modal.querySelector('#modalPrice').textContent=`Price: ${noComboCheck.checked ? item.price : item.combo} DH`; 
    });

    confirmBtn.addEventListener("click",()=>{
      const qty=parseInt(modalQty.value)||1;
      const extras=[];
      modal.querySelectorAll('input[type="checkbox"]:not(#comboCheck):not(#noComboCheck):checked').forEach(cb=>extras.push(cb.value));
      const selectedDrink=modal.querySelector('input[name="drink"]:checked');
      let drink=""; if(selectedDrink) drink=selectedDrink.value;
      const price=(comboCheck.checked?item.combo:item.price);
      for(let i=0;i<qty;i++){
        cart.push({name:item.name+(comboCheck.checked?" Combo":""), price:price, details:(extras.length?extras.join(", "):"")+(drink? (extras.length?" | Drink: ":"Drink: ")+drink:"")||"No extras"});
      }
      renderCart(); modal.style.display="none"; playCoin();
    });

    modal.style.display="flex";
  }

  closeModal.addEventListener("click",()=>{modal.style.display="none";});
  modal.addEventListener("click",(e)=>{if(e.target===modal) modal.style.display="none";});

  function renderCart(){
    cartUl.innerHTML="";
    let total=0;
    cart.forEach((it,idx)=>{ 
      total+=it.price; 
      const li=document.createElement("li"); 
      li.innerHTML=`${it.name} (${it.details}) - ${it.price} DH <button class="btn red" onclick="removeFromCart(${idx})">Remove</button>`; 
      cartUl.appendChild(li); 
    });
    totalP.textContent=`Total: ${total} DH`;
  }

  window.removeFromCart=function(index){ cart.splice(index,1); renderCart(); }

  // Checkout modal
  checkoutBtn.addEventListener("click",()=>{
    if(cart.length===0){alert("🛑 Your cart is empty!"); return;}
    checkoutCart.innerHTML="";
    cart.forEach(it=>{
      const li = document.createElement("li");
      li.textContent=`${it.name} (${it.details}) - ${it.price} DH`;
      checkoutCart.appendChild(li);
    });
    checkoutTotal.textContent=`Total: ${cart.reduce((sum,i)=>sum+i.price,0)} DH`;
    checkoutModal.style.display="flex";
  });

  cancelOrderBtn.addEventListener("click",()=>{checkoutModal.style.display="none";});
  closeCheckout.addEventListener("click",()=>{checkoutModal.style.display="none";});

  confirmOrderBtn.addEventListener("click",()=>{
    const name = checkoutName.value.trim();
    const phone = checkoutPhone.value.trim();
    if(!name || !phone){alert("Please enter Name and Phone Number"); return;}
    const items = cart.map(i=>`${i.name} (${i.details}) - ${i.price} DH`).join('%0A');
    const total = cart.reduce((sum,i)=>sum+i.price,0);
    const waUrl = `https://wa.me/212724680135?text=New Order from ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AItems:%0A${encodeURIComponent(items)}%0ATotal: ${total} DH`;
    window.open(waUrl,"_blank");
    cart = [];
    renderCart();
    checkoutModal.style.display="none";
  });
});
