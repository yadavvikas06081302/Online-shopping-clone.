const products = [
  {id:1,name:"Nova X Smartphone",category:"electronics",price:14999,old:18999,rating:4.6,emoji:"📱",deal:true,desc:"A stylish demo smartphone with a bright display, capable camera and all-day battery."},
  {id:2,name:"Wireless Headphones",category:"electronics",price:1999,old:2999,rating:4.5,emoji:"🎧",deal:true,desc:"Comfortable wireless headphones designed for music, calls and everyday use."},
  {id:3,name:"Smart Watch Pro",category:"electronics",price:2499,old:3999,rating:4.4,emoji:"⌚",deal:true,desc:"A modern smartwatch concept with activity tracking and notification support."},
  {id:4,name:"Bluetooth Speaker",category:"electronics",price:1299,old:1799,rating:4.3,emoji:"🔊",deal:false,desc:"Portable speaker concept with clear sound and compact design."},
  {id:5,name:"Classic Denim Jacket",category:"fashion",price:1799,old:2499,rating:4.5,emoji:"🧥",deal:true,desc:"Versatile denim jacket suitable for casual everyday outfits."},
  {id:6,name:"Premium Sneakers",category:"fashion",price:2299,old:3299,rating:4.7,emoji:"👟",deal:true,desc:"Comfort-first casual sneakers with a clean modern look."},
  {id:7,name:"Cotton T-Shirt",category:"fashion",price:699,old:999,rating:4.2,emoji:"👕",deal:false,desc:"Soft everyday cotton T-shirt in a simple comfortable fit."},
  {id:8,name:"Minimal Backpack",category:"fashion",price:1199,old:1699,rating:4.4,emoji:"🎒",deal:false,desc:"A lightweight backpack for college, work and daily travel."},
  {id:9,name:"Table Lamp",category:"home",price:899,old:1299,rating:4.3,emoji:"💡",deal:true,desc:"Minimal table lamp for a warm desk or bedside setup."},
  {id:10,name:"Coffee Maker",category:"home",price:2499,old:3299,rating:4.5,emoji:"☕",deal:false,desc:"Compact coffee maker concept for convenient home brewing."},
  {id:11,name:"Cushion Set",category:"home",price:799,old:1099,rating:4.1,emoji:"🛋️",deal:false,desc:"Decorative cushion set for a comfortable home interior."},
  {id:12,name:"Desk Organizer",category:"home",price:499,old:699,rating:4.0,emoji:"🗂️",deal:false,desc:"Simple organizer for stationery and desk accessories."},
  {id:13,name:"Face Care Kit",category:"beauty",price:999,old:1499,rating:4.5,emoji:"🧴",deal:true,desc:"Demo skincare kit for a simple daily care routine."},
  {id:14,name:"Perfume Collection",category:"beauty",price:1599,old:2299,rating:4.6,emoji:"🌸",deal:true,desc:"A fragrance collection concept with elegant everyday scents."},
  {id:15,name:"Hair Care Set",category:"beauty",price:849,old:1199,rating:4.2,emoji:"💆",deal:false,desc:"A demo hair-care bundle for a simple personal-care routine."},
  {id:16,name:"Makeup Pouch",category:"beauty",price:599,old:899,rating:4.1,emoji:"💄",deal:false,desc:"Compact pouch for organizing daily beauty essentials."}
];

let cart = JSON.parse(localStorage.getItem("shopnest_cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("shopnest_wishlist") || "[]");
let orders = JSON.parse(localStorage.getItem("shopnest_orders") || "[]");

const $ = id => document.getElementById(id);
const money = n => "₹" + Number(n).toLocaleString("en-IN");

function save(){
  localStorage.setItem("shopnest_cart",JSON.stringify(cart));
  localStorage.setItem("shopnest_wishlist",JSON.stringify(wishlist));
  localStorage.setItem("shopnest_orders",JSON.stringify(orders));
}

function toast(msg){
  const el=$("toast"); el.textContent=msg; el.classList.add("show");
  clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>el.classList.remove("show"),2200);
}

function renderProducts(list, targetId){
  const target=$(targetId);
  target.innerHTML=list.map(p=>{
    const wished=wishlist.includes(p.id);
    const discount=Math.round((1-p.price/p.old)*100);
    return `<article class="product-card">
      <button class="heart ${wished?"active":""}" onclick="toggleWish(${p.id})">${wished?"♥":"♡"}</button>
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        ${p.deal?`<span class="badge">${discount}% OFF</span>`:""}
        <div class="product-name">${p.name}</div>
        <div class="rating">★ ${p.rating} <span>(${Math.floor(p.rating*43)})</span></div>
        <div class="price-row"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span></div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        <button class="link-btn" style="margin-top:9px;width:100%" onclick="showProduct(${p.id})">View Details</button>
      </div>
    </article>`;
  }).join("");
}

function renderAll(){
  const q=$("searchInput").value.trim().toLowerCase();
  const cat=$("categorySelect").value;
  let list=products.filter(p=>(cat==="all"||p.category===cat)&&(p.name.toLowerCase().includes(q)||p.category.includes(q)));
  const sort=$("sortSelect").value;
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  if(sort==="rating") list.sort((a,b)=>b.rating-a.rating);
  $("resultInfo").textContent=`${list.length} product${list.length!==1?"s":""} found`;
  $("emptyState").hidden=list.length!==0;
  renderProducts(list,"productGrid");
  renderProducts(products.filter(p=>p.deal).slice(0,4),"dealProducts");
  renderCart();
  renderWishlist();
  renderOrders();
}

function addToCart(id){
  const found=cart.find(x=>x.id===id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  save(); renderAll(); toast("Added to cart");
}

function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0) cart=cart.filter(x=>x.id!==id);
  save(); renderAll();
}

function removeCart(id){
  cart=cart.filter(x=>x.id!==id); save(); renderAll(); toast("Removed from cart");
}

function toggleWish(id){
  wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);
  save(); renderAll(); toast(wishlist.includes(id)?"Added to wishlist":"Removed from wishlist");
}

function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  $("cartCount").textContent=count;
  if(!cart.length){
    $("cartItems").innerHTML=`<div class="empty">Your cart is empty.<br><br>Start shopping and add products.</div>`;
  }else{
    $("cartItems").innerHTML=cart.map(item=>{
      const p=products.find(x=>x.id===item.id);
      return `<div class="cart-item">
        <div class="mini-img">${p.emoji}</div>
        <div><h4>${p.name}</h4><strong>${money(p.price)}</strong>
          <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${item.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div>
          <button class="remove" onclick="removeCart(${p.id})">Remove</button>
        </div>
        <strong>${money(p.price*item.qty)}</strong>
      </div>`;
    }).join("");
  }
  const subtotal=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  const delivery=subtotal===0?0:(subtotal>=499?0:49);
  $("subtotal").textContent=money(subtotal);
  $("delivery").textContent=delivery?money(delivery):"FREE";
  $("grandTotal").textContent=money(subtotal+delivery);
}

function renderWishlist(){
  $("wishlistCount").textContent=wishlist.length;
  if(!wishlist.length){$("wishlistItems").innerHTML=`<div class="empty">No saved products yet.</div>`;return;}
  $("wishlistItems").innerHTML=wishlist.map(id=>{
    const p=products.find(x=>x.id===id);
    return `<div class="wishlist-item"><div class="mini-img">${p.emoji}</div><div class="grow"><strong>${p.name}</strong><div>${money(p.price)}</div><button onclick="addToCart(${p.id})">Add to Cart</button> · <button onclick="toggleWish(${p.id})">Remove</button></div></div>`;
  }).join("");
}

function renderOrders(){
  const box=$("ordersList");
  if(!orders.length){box.innerHTML=`<div class="empty">No orders yet. Place a demo order from your cart.</div>`;return;}
  box.innerHTML=orders.map(o=>`<div class="order-card">
    <div class="order-head"><strong>Order #${o.id}</strong><span class="status">Confirmed</span></div>
    <div class="order-products">${o.items.map(i=>`${i.name} × ${i.qty}`).join(", ")}</div>
    <div style="margin-top:8px"><strong>Total: ${money(o.total)}</strong> · ${o.date}</div>
  </div>`).join("");
}

function showProduct(id){
  const p=products.find(x=>x.id===id);
  $("productDetails").innerHTML=`<div class="detail-grid">
    <div class="detail-img">${p.emoji}</div>
    <div class="detail-info">
      <span class="badge">${p.category.toUpperCase()}</span>
      <h2>${p.name}</h2>
      <div class="rating">★ ${p.rating} / 5</div>
      <div class="price-row"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span></div>
      <p>${p.desc}</p>
      <p><strong>✓ In stock</strong> · Free delivery over ₹499</p>
      <button class="primary-btn full" onclick="addToCart(${p.id});closeModal('productModal')">Add to Cart</button>
    </div>
  </div>`;
  $("productModal").classList.add("show");
}

function closeModal(id){$(id).classList.remove("show")}

function openDrawer(id){
  $(id).classList.add("open"); $("overlay").classList.add("show");
}
function closeDrawers(){
  document.querySelectorAll(".drawer").forEach(x=>x.classList.remove("open"));
  $("overlay").classList.remove("show");
}

$("searchInput").addEventListener("input",renderAll);
$("searchBtn").addEventListener("click",()=>{document.querySelector("#products").scrollIntoView();renderAll()});
$("categorySelect").addEventListener("change",()=>{document.querySelector("#products").scrollIntoView();renderAll()});
$("sortSelect").addEventListener("change",renderAll);
$("cartBtn").addEventListener("click",()=>openDrawer("cartPanel"));
$("wishlistBtn").addEventListener("click",()=>openDrawer("wishlistPanel"));
$("closeCart").addEventListener("click",closeDrawers);
$("closeWishlist").addEventListener("click",closeDrawers);
$("overlay").addEventListener("click",closeDrawers);
$("menuBtn").addEventListener("click",()=>$("nav").classList.toggle("open"));
$("dealHeroBtn").addEventListener("click",()=>$("deals").scrollIntoView());
$("allProductsBtn").addEventListener("click",()=>$("products").scrollIntoView());
$("accountBtn").addEventListener("click",()=>{$("orders").scrollIntoView();toast("Your orders are shown below");});

document.querySelectorAll("[data-cat]").forEach(btn=>btn.addEventListener("click",()=>{
  $("categorySelect").value=btn.dataset.cat;$("searchInput").value="";renderAll();$("products").scrollIntoView();
}));

document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>closeModal(btn.dataset.close)));

document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show")}));

$("checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){toast("Your cart is empty");return}
  $("checkoutModal").classList.add("show");
});

$("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const subtotal=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  const delivery=subtotal>=499?0:49;
  const order={
    id:"SN"+Date.now().toString().slice(-7),
    date:new Date().toLocaleDateString("en-IN"),
    total:subtotal+delivery,
    items:cart.map(x=>({name:products.find(p=>p.id===x.id).name,qty:x.qty}))
  };
  orders.unshift(order);cart=[];save();renderAll();closeModal("checkoutModal");closeDrawers();$("checkoutForm").reset();$("orders").scrollIntoView();toast("Order placed successfully!");
});

$("newsletterForm").addEventListener("submit",e=>{e.preventDefault();e.target.reset();toast("Subscribed successfully!");});

renderAll();
