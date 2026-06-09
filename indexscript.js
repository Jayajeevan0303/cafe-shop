/*  ORDER MENU DATA */
const orderMenu = [
    { id: 1, name: 'Cappuccino', price: 260, cat: 'coffee', img: 'images/Cappuccino.jpg' },
    { id: 2, name: 'Iced Vanilla Latte', price: 340, cat: 'coffee', img: 'images/Iced_vanilla_latte.jpg' },
    { id: 3, name: 'Americano', price: 250, cat: 'coffee', img: 'images/Americano.jpg' },
    { id: 4, name: 'Orange Espresso', price: 345, cat: 'coffee', img: 'images/darkchocolate-orange-espresso.jpg' },
    { id: 5, name: 'Dalgona', price: 200, cat: 'coffee', img: 'images/dalgona.jpg' },
    { id: 6, name: 'Cold Brew', price: 355, cat: 'coffee', img: 'images/Coldbrew.jpg' },
    { id: 7, name: 'Espresso', price: 250, cat: 'coffee', img: 'images/espresso.jpg' },
    { id: 8, name: 'Ice Coffee', price: 120, cat: 'coffee', img: 'images/ice_coffee.jpg' },
    { id: 9, name: 'Latte Macchiato', price: 160, cat: 'coffee', img: 'images/lattemacchiato.jpg' },
    { id: 10, name: 'Pudding', price: 90, cat: 'dishes', img: 'images/pudding.jpg' },
    { id: 11, name: 'Rasmalai', price: 85, cat: 'dishes', img: 'images/rasmalai.jpg' },
    { id: 12, name: 'Custard Gulabjamun', price: 150, cat: 'dishes', img: 'images/custard_gulabjamun.jpg' },
    { id: 13, name: 'Fruit Salad', price: 100, cat: 'dishes', img: 'images/fruit_salad_with_cream.jpg' },
    { id: 14, name: 'Sandwich', price: 130, cat: 'dishes', img: 'images/sandwich.jpg' },
    { id: 15, name: 'Pizza', price: 350, cat: 'dishes', img: 'images/pizza.jpg' },
    { id: 16, name: 'Momos', price: 90, cat: 'dishes', img: 'images/momos.jpg' },
    { id: 17, name: 'Garlic Cheese Bread', price: 85, cat: 'dishes', img: 'images/garlic_cheese_bread.jpg' },
    { id: 18, name: 'Wrap', price: 130, cat: 'dishes', img: 'images/wrap.jpg' },
    { id: 19, name: 'Donut', price: 65, cat: 'dishes', img: 'images/donat.jpg' },
    { id: 20, name: 'Brownie Ice Cake', price: 125, cat: 'dishes', img: 'images/brownie_icecake.jpg' },
    ];

let cart = JSON.parse(localStorage.getItem('magicCafeCart') || '[]');
let cartPanelOpen = false;

/* ---- Render order items ---- */
function renderOrderItems(cat) {
    const row = document.getElementById('order-items-row');
    const list = cat === 'all' ? orderMenu : orderMenu.filter(i => i.cat === cat);
    row.innerHTML = list.map(item => `
        <div class="menu_items m-1 order-item-card" id="ocard-${item.id}">
            <img src="${item.img}" class="main-menu-img" alt="${item.name}">
            <div class="menu-img-body">
                <h6>${item.name}</h6>
                <p>Rs:${item.price}</p>
            </div>
            <div class="order-item-controls">
                <button class="oqty-btn" onclick="oChangeQty(${item.id},-1)">−</button>
                <span class="oqty-val" id="oqty-${item.id}">1</span>
                <button class="oqty-btn" onclick="oChangeQty(${item.id},1)">+</button>
                <button class="oadd-btn" onclick="addToCart(${item.id})">Add</button>
            </div>
            <span class="oadded-badge" id="obadge-${item.id}">✓ Added</span>
        </div>
    `).join('');
}

function filterOrder(cat, btn) {
    document.querySelectorAll('.order-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderOrderItems(cat);
}

function oChangeQty(id, delta) {
    const el = document.getElementById('oqty-' + id);
    let v = parseInt(el.textContent) + delta;
    el.textContent = v < 1 ? 1 : v;
}

/* ---- Cart logic ---- */
function addToCart(id) {
    const item = orderMenu.find(i => i.id === id);
    const qty = parseInt(document.getElementById('oqty-' + id).textContent);
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ ...item, qty });
    saveCart();
    updateCartBar();
    const badge = document.getElementById('obadge-' + id);
    badge.style.display = 'block';
    setTimeout(() => badge.style.display = 'none', 1400);
    if (cartPanelOpen) renderCartPanel();
}

function saveCart() { localStorage.setItem('magicCafeCart', JSON.stringify(cart)); }

function updateCartBar() {
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    const totalAmt = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const bar = document.getElementById('order-cart-bar');
    bar.style.display = totalQty > 0 ? 'flex' : 'none';
    document.getElementById('cart-bar-count').textContent = totalQty + ' item' + (totalQty !== 1 ? 's' : '');
    document.getElementById('cart-bar-total').textContent = 'Rs: ' + totalAmt;
}

function toggleCartPanel() {
    cartPanelOpen = !cartPanelOpen;
    const panel = document.getElementById('order-cart-panel');
    panel.style.display = cartPanelOpen ? 'block' : 'none';
    document.querySelector('.cart-view-btn').textContent = cartPanelOpen ? 'View Cart ▼' : 'View Cart ▲';
    if (cartPanelOpen) renderCartPanel();
}

function renderCartPanel() {
    const items = document.getElementById('cart-panel-items');
    if (cart.length === 0) {
        items.innerHTML = '<p style="text-align:center;color:#aaa;padding:14px 0;">Your cart is empty</p>';
        document.getElementById('cart-panel-total-amt').textContent = 'Rs: 0';
        return;
    }
    items.innerHTML = cart.map(item => `
        <div class="cart-panel-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cpi-info">
                <span class="cpi-name">${item.name}</span>
                <span class="cpi-price">Rs:${item.price} × ${item.qty} = Rs:${item.price * item.qty}</span>
            </div>
            <div class="cpi-controls">
                <button class="oqty-btn small" onclick="cartQty(${item.id},-1)">−</button>
                <span>${item.qty}</span>
                <button class="oqty-btn small" onclick="cartQty(${item.id},1)">+</button>
                <button class="cpi-remove" onclick="removeFromCart(${item.id})">✕</button>
            </div>
        </div>
    `).join('');
    document.getElementById('cart-panel-total-amt').textContent = 'Rs: ' + cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function cartQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
    saveCart(); updateCartBar(); renderCartPanel();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart(); updateCartBar(); renderCartPanel();
}

function clearCart() {
    cart = []; saveCart(); updateCartBar(); renderCartPanel();
}

function placeOrder() {
    if (cart.length === 0) return;
    const orderId = 'ORD-' + Date.now();
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const order = { id: orderId, items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })), total, placedAt: new Date().toLocaleString(), status: 'Confirmed' };
    const orders = JSON.parse(localStorage.getItem('magicCafeOrders') || '[]');
    orders.unshift(order);
    localStorage.setItem('magicCafeOrders', JSON.stringify(orders));
    cart = []; saveCart(); updateCartBar(); renderCartPanel();
    if (cartPanelOpen) toggleCartPanel();
    const confirm = document.getElementById('order-confirm');
    document.getElementById('order-confirm-msg').textContent = '✅ Order ' + orderId + ' placed successfully! Total: Rs:' + total;
    confirm.style.display = 'block';
    setTimeout(() => confirm.style.display = 'none', 4000);
    renderPastOrders();
}

function renderPastOrders() {
    const orders = JSON.parse(localStorage.getItem('magicCafeOrders') || '[]');
    const list = document.getElementById('past-orders-list');
    if (orders.length === 0) {
        list.innerHTML = '<p class="no-past-orders">No orders yet. Add items and place your first order!</p>';
        return;
    }
    list.innerHTML = orders.map(o => `
    <div class="past-order-card" id="poc-${o.id}">
        <div class="poc-header">
            <span class="poc-id">${o.id}</span>
            <div style="display:flex;align-items:center;gap:8px;">
                <span class="poc-status">${o.status}</span>
                <button class="poc-delete-btn" onclick="deletePastOrder('${o.id}')" title="Remove this order">✕</button>
            </div>
        </div>
        <p class="poc-items">${o.items.map(i => i.name + ' ×' + i.qty).join(', ')}</p>
        <p class="poc-total">Total: Rs:${o.total}</p>
        <p class="poc-time">${o.placedAt}</p>
    </div>
    `).join('');
}

function deletePastOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem('magicCafeOrders') || '[]');
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('magicCafeOrders', JSON.stringify(orders));
    const card = document.getElementById('poc-' + orderId);
    if (card) {
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity = '0';
        card.style.transform = 'translateX(30px)';
        setTimeout(() => renderPastOrders(), 320);
    }
}

// ---- BOOK TABLE(locak database) ----
function bookTable() {
    const name    = document.getElementById('b-name').value.trim();
    const email   = document.getElementById('b-email').value.trim();
    const phone   = document.getElementById('b-phone').value.trim();
    const date    = document.getElementById('b-date').value;
    const time    = document.getElementById('b-time').value;
    const guests  = document.getElementById('b-guests').value;
    const msg     = document.getElementById('book-msg');

    if (!name || !phone || !date || !time || !guests) {
        msg.textContent = '⚠ Please fill in all required fields.';
        msg.style.color = '#ff9999';
        return;
    }

    const booking = { id: Date.now(), name, email, phone, date, time, guests, bookedAt: new Date().toLocaleString() };
    const bookings = JSON.parse(localStorage.getItem('magicCafeBookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('magicCafeBookings', JSON.stringify(bookings));

    msg.textContent = `✅ Table booked for ${name} on ${date} at ${time}!`;
    msg.style.color = '#a8e6a3';
    updateBookingCount();

    // Clear form
    ['b-name','b-email','b-phone','b-date','b-time'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('b-guests').selectedIndex = 0;
}

function updateBookingCount() {
    const bookings = JSON.parse(localStorage.getItem('magicCafeBookings') || '[]');
    const el = document.getElementById('booking-count');
    if (el) el.textContent = `${bookings.length} reservation${bookings.length !== 1 ? 's' : ''} saved`;
}

function subscribe() {
    const email = document.getElementById('sub-email').value.trim();
    const msg = document.getElementById('sub-msg');
    if (!email || !email.includes('@')) {
        msg.textContent = '⚠ Please enter a valid email.';
        msg.style.color = '#c07a3a';
        return;
    }
    const subs = JSON.parse(localStorage.getItem('magicCafeSubs') || '[]');
    if (subs.includes(email)) {
        msg.textContent = 'You are already subscribed!';
        msg.style.color = '#c07a3a';
        return;
    }
    subs.push(email);
    localStorage.setItem('magicCafeSubs', JSON.stringify(subs));
    msg.textContent = '🎉 Subscribed! Your 15% off code: MAGIC15';
    msg.style.color = '#8B5E3C';
    document.getElementById('sub-email').value = '';
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-navbar');
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

/* ---- Init ---- */
renderOrderItems('all');
renderPastOrders();
updateBookingCount();