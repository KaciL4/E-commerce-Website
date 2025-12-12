/**
 * cart.js
 * ----------------------------
 * CORE MODULE: Responsible for cart, checkout, and confirmation flow.
 * NOTE: Assumes readCookie/writeCookie are available globally (e.g., in ui.js or a shared helpers.js)
 */

const CART_COOKIE = "myshop_cart";
const TAX_RATE = 0.10;

// Re-defining cookie helpers here for completeness if they are not in a shared utility file
function readCookie(name) {
    // ... (Your implementation of readCookie) ...
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

function writeCookie(name, value, days) {
    // ... (Your implementation of writeCookie) ...
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCart() {
    // ... (Your existing getCart logic) ...
    const raw = readCookie(CART_COOKIE);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
   
    writeCookie(CART_COOKIE, JSON.stringify(cart), 7);
    updateCartCountBadge();
}

function cartTotals(cart) {
    let subtotal = 0;
    cart.forEach(item => {
        const product = getProductById(item.id);
        if (product) {
            subtotal += product.price * item.qty;
        }
    });
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    return { subtotal, tax, total };
}

function updateCartCountBadge() {
    // ... (Your existing updateCartCountBadge logic) ...
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    $("#cart-count").text(count);
}

// -------------------------------------------------------------
// CART MANAGEMENT FUNCTIONS
// -------------------------------------------------------------

function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;

    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += quantity;
    } else {
        cart.push({ id: productId, qty: quantity });
    }
    saveCart(cart);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    initCartPage(); // Re-render the page after removal
}

function updateQuantity(productId, newQty) {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty < 1) return;

    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.qty = qty;
    }
    saveCart(cart);
    initCartPage(); // Re-render the page to update totals
}

// -------------------------------------------------------------
// PAGE INITIALIZATION
// -------------------------------------------------------------

function initCartPage() {
    const cartContainer = $("#cart-items-container");
    const totalsContainer = $("#cart-totals");
    if (cartContainer.length === 0 || totalsContainer.length === 0) return;

    if (!isDataLoaded) {
        // Defer rendering until products are loaded
        loadProducts(initCartPage);
        return;
    }

    const cart = getCart();
    cartContainer.empty();

    if (cart.length === 0) {
        cartContainer.html("<p>Your shopping cart is empty.</p>");
        totalsContainer.html("");
        return;
    }

    // A. Render Cart Items
    cart.forEach(cartItem => {
        const p = getProductById(cartItem.id);
        if (!p) return;

        cartContainer.append(`
            <div class="cart-item">
                <img src="${p.image}" alt="${p.title}">
                <div class="item-details">
                    <a href="product.html?id=${p.id}"><strong>${p.title}</strong></a>
                    <p class="category">${p.categoryName}</p>
                    <p class="price">$${p.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <input type="number" min="1" value="${cartItem.qty}" 
                           data-id="${p.id}" class="quantity-input">
                </div>
                <div class="item-subtotal">
                    $${(p.price * cartItem.qty).toFixed(2)}
                </div>
                <button class="btn btn-small remove-item" data-id="${p.id}">Remove</button>
            </div>
        `);
    });

    // B. Render Totals
    const totals = cartTotals(cart);
    totalsContainer.html(`
        <p>Subtotal: <span>$${totals.subtotal.toFixed(2)}</span></p>
        <p>Tax (${(TAX_RATE * 100).toFixed(0)}%): <span>$${totals.tax.toFixed(2)}</span></p>
        <p class="total-price">Total: <span>$${totals.total.toFixed(2)}</span></p>
        <a href="checkout.html" class="btn primary btn-full">Proceed to Checkout</a>
    `);

    // C. Attach Event Listeners
    cartContainer.find(".remove-item").on("click", function() {
        const id = parseInt($(this).data("id"), 10);
        removeFromCart(id);
    });
    cartContainer.find(".quantity-input").on("change", function() {
        const id = parseInt($(this).data("id"), 10);
        const qty = parseInt($(this).val(), 10);
        updateQuantity(id, qty);
    });
}

// Your existing initCheckoutPage() and initConfirmationPage() logic goes here...
// They are mostly complete in your original snippet, but ensure they use getCart() and cartTotals()

$(document).ready(function() {
    updateCartCountBadge();
    initCartPage();
     initCheckoutPage(); // Only runs if elements exist
    initConfirmationPage(); // Only runs if elements exist
});