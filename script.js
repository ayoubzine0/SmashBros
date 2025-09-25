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

  // --- original audio, renderMenu, openModal, renderCart, removeFromCart etc ---
  // All your original Add Combo / drink logic remains unchanged

  // --- Checkout modal logic ---
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




