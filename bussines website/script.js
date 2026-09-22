/* =========================================
   BREW HAVEN - MAIN JAVASCRIPT
   ========================================= */

let cart = [];

let currentCategory = "all";

let statusTimer;


/* =========================================
   SHOPPING CART
   ========================================= */

function addToCart(name, price, image) {

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });

    }

    updateCart();

    openCart();
}


function updateCart() {

    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutTotal = document.getElementById("checkoutTotal");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;
    let itemCount = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add something delicious from our menu.</p>
            </div>
        `;

    } else {

        cart.forEach((item, index) => {

            const itemTotal = item.price * item.quantity;

            total += itemTotal;
            itemCount += item.quantity;

            cartItems.innerHTML += `
                <div class="cart-item">

                    <img src="${item.image}" alt="${item.name}">

                    <div class="cart-item-info">

                        <h3>${item.name}</h3>

                        <p>₱${item.price}</p>

                        <div class="cart-controls">

                            <button onclick="changeCartQuantity(${index}, -1)">
                                −
                            </button>

                            <span>${item.quantity}</span>

                            <button onclick="changeCartQuantity(${index}, 1)">
                                +
                            </button>

                            <button
                                class="remove-btn"
                                onclick="removeFromCart(${index})">
                                🗑
                            </button>

                        </div>

                    </div>

                    <strong>₱${itemTotal}</strong>

                </div>
            `;

        });

    }

    if (cartCount) {
        cartCount.textContent = itemCount;
    }

    if (cartTotal) {
        cartTotal.textContent = total;
    }

    if (checkoutTotal) {
        checkoutTotal.textContent = total;
    }
}


function changeCartQuantity(index, amount) {

    if (!cart[index]) return;

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}


function removeFromCart(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    updateCart();
}


function openCart() {

    const panel = document.getElementById("cartPanel");
    const overlay = document.getElementById("cartOverlay");

    if (panel) {
        panel.classList.add("open");
    }

    if (overlay) {
        overlay.classList.add("show");
    }
}


function closeCart() {

    const panel = document.getElementById("cartPanel");
    const overlay = document.getElementById("cartOverlay");

    if (panel) {
        panel.classList.remove("open");
    }

    if (overlay) {
        overlay.classList.remove("show");
    }
}


/* =========================================
   CHECKOUT
   ========================================= */

function openCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty. Please add an item first.");

        return;
    }

    const modal = document.getElementById("checkoutModal");

    if (modal) {

        updateCart();

        modal.classList.add("show");

    }
}


function closeCheckout() {

    const modal = document.getElementById("checkoutModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


function placeOrder(event) {

    event.preventDefault();

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    const customerName =
        document.getElementById("customerName").value.trim();

    const customerContact =
        document.getElementById("customerContact").value.trim();

    const orderType =
        document.getElementById("orderType").value;

    const paymentMethod =
        document.getElementById("paymentMethod").value;

    const specialRequest =
        document.getElementById("specialRequest").value.trim();


    if (customerName === "" || customerContact === "") {

        alert("Please complete your name and contact number.");

        return;
    }


    const orderNumber =
        "BH-" + Math.floor(1000 + Math.random() * 9000);


    document.getElementById("orderNumber").textContent =
        orderNumber;


    console.log("ORDER DETAILS");

    console.log("Order Number:", orderNumber);
    console.log("Customer:", customerName);
    console.log("Contact:", customerContact);
    console.log("Order Type:", orderType);
    console.log("Payment:", paymentMethod);
    console.log("Special Request:", specialRequest);
    console.log("Items:", cart);


    closeCheckout();
    closeCart();

    resetOrderStatus();

    const statusModal =
        document.getElementById("statusModal");

    if (statusModal) {
        statusModal.classList.add("show");
    }

    startOrderStatus();

    cart = [];

    updateCart();
}


/* =========================================
   ORDER STATUS
   ========================================= */

function resetOrderStatus() {

    clearInterval(statusTimer);

    for (let i = 1; i <= 4; i++) {

        const step =
            document.getElementById("status" + i);

        if (step) {

            step.classList.remove("active");
            step.classList.remove("completed");

        }
    }

    const firstStep =
        document.getElementById("status1");

    if (firstStep) {
        firstStep.classList.add("active");
    }

    const currentStatus =
        document.getElementById("currentStatus");

    if (currentStatus) {
        currentStatus.textContent =
            "Order Received 📋";
    }
}


function startOrderStatus() {

    let currentStep = 1;

    statusTimer = setInterval(() => {

        currentStep++;

        if (currentStep === 2) {

            activateStatus(
                2,
                "Preparing Your Order ☕"
            );

        }

        if (currentStep === 3) {

            activateStatus(
                3,
                "Your Order Is Ready! 🍰"
            );

        }

        if (currentStep === 4) {

            activateStatus(
                4,
                "Order Completed! 🎉"
            );

            clearInterval(statusTimer);

        }

    }, 4000);
}


function activateStatus(stepNumber, message) {

    for (let i = 1; i <= stepNumber; i++) {

        const step =
            document.getElementById("status" + i);

        if (step) {

            step.classList.add("active");

            if (i < stepNumber) {
                step.classList.add("completed");
            }

        }
    }

    const currentStatus =
        document.getElementById("currentStatus");

    if (currentStatus) {
        currentStatus.textContent = message;
    }
}


function closeStatus() {

    const modal =
        document.getElementById("statusModal");

    if (modal) {
        modal.classList.remove("show");
    }

    clearInterval(statusTimer);
}


/* =========================================
   SEARCH
   ========================================= */

function searchProducts() {

    const input =
        document.getElementById("searchInput");

    if (!input) return;

    const searchText =
        input.value.toLowerCase().trim();

    const products =
        document.querySelectorAll(".product-card");


    products.forEach(product => {

        const name =
            product.dataset.name.toLowerCase();

        const category =
            product.dataset.category.toLowerCase();


        const matchesSearch =
            name.includes(searchText);

        const matchesCategory =
            currentCategory === "all" ||
            category === currentCategory;


        if (matchesSearch && matchesCategory) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });
}


/* =========================================
   CATEGORY FILTER
   ========================================= */

function filterCategory(category, button) {

    currentCategory = category;

    document
        .querySelectorAll(".category-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    if (button) {
        button.classList.add("active");
    }


    searchProducts();
}


/* =========================================
   CONTACT FORM
   ========================================= */

function sendMessage(event) {

    event.preventDefault();

    alert(
        "Thank you for contacting Brew Haven! ☕\n\nYour message has been received."
    );

    event.target.reset();
}


/* =========================================
   CLOSE MODALS BY CLICKING OUTSIDE
   ========================================= */

window.addEventListener("click", function(event) {

    const checkoutModal =
        document.getElementById("checkoutModal");

    const statusModal =
        document.getElementById("statusModal");


    if (
        checkoutModal &&
        event.target === checkoutModal
    ) {

        closeCheckout();

    }


    if (
        statusModal &&
        event.target === statusModal
    ) {

        closeStatus();

    }

});


/* =========================================
   ESC KEY
   ========================================= */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeCart();
        closeCheckout();
        closeStatus();

    }

});


/* =========================================
   INITIALIZE
   ========================================= */

document.addEventListener("DOMContentLoaded", function() {

    updateCart();

});