let cart = [];
let currentCategory = "all";
let statusTimer;

let appliedPromo = null;
let promoDiscount = 0;

const promoCodes = {
    BREW10: 0.10,
    COFFEE20: 0.20,
    STUDENT50: 50
};


// =========================
// ADD TO CART
// =========================

function addToCart(name, price, image) {

    const existingItem =
        cart.find(item => item.name === name);

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

    animateCart();

    showNotification(
        name + " added to cart! ☕"
    );
}


// =========================
// CART ANIMATION
// =========================

function animateCart() {

    const cartButton =
        document.querySelector(
            ".cart-floating"
        );

    if (!cartButton) return;

    cartButton.classList.remove("bounce");

    void cartButton.offsetWidth;

    cartButton.classList.add("bounce");

}


// =========================
// NOTIFICATION
// =========================

function showNotification(message) {

    let notification =
        document.getElementById(
            "notification"
        );

    if (!notification) {

        notification =
            document.createElement("div");

        notification.id =
            "notification";

        notification.style.position =
            "fixed";

        notification.style.top =
            "90px";

        notification.style.right =
            "25px";

        notification.style.background =
            "#3e2723";

        notification.style.color =
            "white";

        notification.style.padding =
            "14px 20px";

        notification.style.borderRadius =
            "10px";

        notification.style.zIndex =
            "10000";

        notification.style.boxShadow =
            "0 8px 25px rgba(0,0,0,.2)";

        notification.style.opacity =
            "0";

        notification.style.transform =
            "translateY(-15px)";

        notification.style.transition =
            "0.3s";

        document.body.appendChild(
            notification
        );
    }

    notification.textContent =
        message;

    notification.style.opacity =
        "1";

    notification.style.transform =
        "translateY(0)";

    clearTimeout(
        notification.hideTimer
    );

    notification.hideTimer =
        setTimeout(() => {

            notification.style.opacity =
                "0";

            notification.style.transform =
                "translateY(-15px)";

        }, 2200);
}


// =========================
// UPDATE CART
// =========================

function updateCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    const cartTotal =
        document.getElementById(
            "cartTotal"
        );

    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let subtotal = 0;
    let itemCount = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div style="
                text-align:center;
                padding:40px 10px;
                animation:fadeUp .5s ease;
            ">

                <div style="font-size:45px;">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p style="color:#795548;">
                    Add something delicious
                    from our menu.
                </p>

            </div>

        `;

    } else {

        cart.forEach((item, index) => {

            const itemTotal =
                item.price *
                item.quantity;

            subtotal += itemTotal;

            itemCount +=
                item.quantity;


            cartItems.innerHTML += `

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div class="cart-item-info">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ₱${item.price}
                        </p>

                        <div class="cart-controls">

                            <button
                                onclick="
                                changeCartQuantity(
                                    ${index},
                                    -1
                                )">

                                −

                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="
                                changeCartQuantity(
                                    ${index},
                                    1
                                )">

                                +

                            </button>

                            <button
                                class="remove-btn"
                                onclick="
                                removeFromCart(
                                    ${index}
                                )">

                                🗑

                            </button>

                        </div>

                    </div>

                    <strong>
                        ₱${itemTotal.toFixed(2)}
                    </strong>

                </div>

            `;

        });

    }


    const discount =
        calculateDiscount(
            subtotal
        );

    const finalTotal =
        subtotal - discount;


    cartCount.textContent =
        itemCount;

    cartTotal.textContent =
        finalTotal.toFixed(2);

    checkoutTotal.textContent =
        finalTotal.toFixed(2);


    updatePromoDisplay(
        discount
    );
}


// =========================
// CALCULATE DISCOUNT
// =========================

function calculateDiscount(
    subtotal
) {

    if (!appliedPromo) {

        promoDiscount = 0;

        return 0;
    }


    if (appliedPromo === "BREW10") {

        promoDiscount =
            subtotal * 0.10;

    }

    else if (
        appliedPromo === "COFFEE20"
    ) {

        promoDiscount =
            subtotal * 0.20;

    }

    else if (
        appliedPromo === "STUDENT50"
    ) {

        promoDiscount =
            Math.min(
                50,
                subtotal
            );
    }


    return promoDiscount;
}


// =========================
// PROMO DISPLAY
// =========================

function updatePromoDisplay(
    discount
) {

    const promoDisplay =
        document.getElementById(
            "promoDisplay"
        );

    if (!promoDisplay) return;


    if (appliedPromo) {

        promoDisplay.innerHTML = `

            <div class="promo-applied">

                <span>
                    🎟️ ${appliedPromo}
                    applied
                </span>

                <strong>
                    -₱${discount.toFixed(2)}
                </strong>

                <button
                    onclick="removePromo()">

                    Remove

                </button>

            </div>

        `;

    } else {

        promoDisplay.innerHTML = "";

    }
}


// =========================
// APPLY PROMO
// =========================

function applyPromo() {

    const input =
        document.getElementById(
            "promoCode"
        );

    const code =
        input.value
            .trim()
            .toUpperCase();


    if (code === "") {

        showNotification(
            "Please enter a promo code."
        );

        return;
    }


    if (!promoCodes[code]) {

        showNotification(
            "❌ Invalid promo code."
        );

        return;
    }


    appliedPromo = code;

    input.value = "";

    updateCart();


    showNotification(
        "🎟️ " +
        code +
        " applied successfully!"
    );
}


// =========================
// REMOVE PROMO
// =========================

function removePromo() {

    appliedPromo = null;

    promoDiscount = 0;

    updateCart();

    showNotification(
        "Promo code removed."
    );
}


// =========================
// CHANGE QUANTITY
// =========================

function changeCartQuantity(
    index,
    amount
) {

    if (!cart[index]) return;

    cart[index].quantity +=
        amount;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(index, 1);

    }


    updateCart();
}


// =========================
// REMOVE ITEM
// =========================

function removeFromCart(index) {

    if (!cart[index]) return;

    const itemName =
        cart[index].name;

    cart.splice(index, 1);

    updateCart();

    showNotification(
        itemName +
        " removed from cart."
    );
}


// =========================
// OPEN CART
// =========================

function openCart() {

    document
        .getElementById(
            "cartPanel"
        )
        .classList.add("open");

    document
        .getElementById(
            "cartOverlay"
        )
        .classList.add("show");
}


// =========================
// CLOSE CART
// =========================

function closeCart() {

    document
        .getElementById(
            "cartPanel"
        )
        .classList.remove("open");

    document
        .getElementById(
            "cartOverlay"
        )
        .classList.remove("show");
}


// =========================
// CHECKOUT
// =========================

function openCheckout() {

    if (cart.length === 0) {

        showNotification(
            "Your cart is empty."
        );

        return;
    }

    updateCart();

    document
        .getElementById(
            "checkoutModal"
        )
        .classList.add("show");
}


function closeCheckout() {

    document
        .getElementById(
            "checkoutModal"
        )
        .classList.remove("show");
}


// =========================
// PLACE ORDER
// =========================

function placeOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {

        showNotification(
            "Your cart is empty."
        );

        return;
    }


    const customerName =
        document
            .getElementById(
                "customerName"
            )
            .value
            .trim();


    const customerContact =
        document
            .getElementById(
                "customerContact"
            )
            .value
            .trim();


    const orderType =
        document
            .getElementById(
                "orderType"
            )
            .value;


    const paymentMethod =
        document
            .getElementById(
                "paymentMethod"
            )
            .value;


    const specialRequest =
        document
            .getElementById(
                "specialRequest"
            )
            .value
            .trim();


    const orderNumber =
        "BH-" +
        Math.floor(
            1000 +
            Math.random() *
            9000
        );


    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );


    const discount =
        calculateDiscount(
            subtotal
        );


    const finalTotal =
        subtotal -
        discount;


    const promoUsed =
        appliedPromo;


    document
        .getElementById(
            "orderNumber"
        )
        .textContent =
        orderNumber;


    generateReceipt(

        orderNumber,

        customerName,

        customerContact,

        orderType,

        paymentMethod,

        specialRequest,

        subtotal,

        discount,

        finalTotal,

        promoUsed

    );


    closeCheckout();

    closeCart();

    resetOrderStatus();


    document
        .getElementById(
            "statusModal"
        )
        .classList.add("show");


    startOrderStatus();


    cart = [];

    appliedPromo = null;

    promoDiscount = 0;

    updateCart();


    showNotification(
        "🎉 Order placed successfully!"
    );
}


// =========================
// GENERATE RECEIPT
// =========================

function generateReceipt(

    orderNumber,

    customerName,

    customerContact,

    orderType,

    paymentMethod,

    specialRequest,

    subtotal,

    discount,

    finalTotal,

    promoCode

) {

    const receiptItems =
        document.getElementById(
            "receiptItems"
        );

    receiptItems.innerHTML = "";


    cart.forEach(item => {

        const itemTotal =
            item.price *
            item.quantity;


        receiptItems.innerHTML += `

            <div class="receipt-item">

                <span>
                    ${item.name}
                    × ${item.quantity}
                </span>

                <strong>
                    ₱${itemTotal.toFixed(2)}
                </strong>

            </div>

        `;

    });


    document.getElementById(
        "receiptOrderNumber"
    ).textContent =
        orderNumber;


    document.getElementById(
        "receiptCustomer"
    ).textContent =
        customerName;


    document.getElementById(
        "receiptContact"
    ).textContent =
        customerContact;


    document.getElementById(
        "receiptOrderType"
    ).textContent =
        orderType;


    document.getElementById(
        "receiptPayment"
    ).textContent =
        paymentMethod;


    document.getElementById(
        "receiptSubtotal"
    ).textContent =
        "₱" +
        subtotal.toFixed(2);


    const receiptPromoCode =
        document.getElementById(
            "receiptPromoCode"
        );


    if (receiptPromoCode) {

        receiptPromoCode.textContent =
            promoCode ||
            "None";

    }


    document.getElementById(
        "receiptDiscount"
    ).textContent =
        "-₱" +
        discount.toFixed(2);


    document.getElementById(
        "receiptTotal"
    ).textContent =
        "₱" +
        finalTotal.toFixed(2);


    document.getElementById(
        "receiptRequest"
    ).textContent =
        specialRequest ||
        "None";
}


// =========================
// RECEIPT
// =========================

function openReceipt() {

    document
        .getElementById(
            "receiptModal"
        )
        .classList.add("show");
}


function closeReceipt() {

    document
        .getElementById(
            "receiptModal"
        )
        .classList.remove("show");
}


function printReceipt() {

    window.print();
}


// =========================
// ORDER STATUS
// =========================

function resetOrderStatus() {

    clearInterval(
        statusTimer
    );


    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const step =
            document.getElementById(
                "status" + i
            );

        if (step) {

            step.classList.remove(
                "active"
            );

            step.classList.remove(
                "completed"
            );
        }
    }


    document
        .getElementById(
            "status1"
        )
        .classList.add(
            "active"
        );


    document
        .getElementById(
            "currentStatus"
        )
        .textContent =
        "Order Received 📋";
}


// =========================
// START ORDER STATUS
// =========================

function startOrderStatus() {

    let currentStep = 1;


    statusTimer =
        setInterval(() => {

            currentStep++;


            if (
                currentStep === 2
            ) {

                activateStatus(
                    2,
                    "Preparing Your Order ☕"
                );

            }


            if (
                currentStep === 3
            ) {

                activateStatus(
                    3,
                    "Your Order Is Ready! 🍰"
                );

            }


            if (
                currentStep === 4
            ) {

                activateStatus(
                    4,
                    "Order Completed! 🎉"
                );

                clearInterval(
                    statusTimer
                );

            }

        }, 4000);
}


// =========================
// ACTIVATE STATUS
// =========================

function activateStatus(
    stepNumber,
    message
) {

    for (
        let i = 1;
        i <= stepNumber;
        i++
    ) {

        const step =
            document.getElementById(
                "status" + i
            );

        if (!step) continue;


        step.classList.add(
            "active"
        );


        if (
            i < stepNumber
        ) {

            step.classList.add(
                "completed"
            );

        }
    }


    document
        .getElementById(
            "currentStatus"
        )
        .textContent =
        message;
}


// =========================
// CLOSE STATUS
// =========================

function closeStatus() {

    document
        .getElementById(
            "statusModal"
        )
        .classList.remove(
            "show"
        );

    clearInterval(
        statusTimer
    );
}


// =========================
// SEARCH
// =========================

function searchProducts() {

    const input =
        document.getElementById(
            "searchInput"
        );

    if (!input) return;


    const searchText =
        input.value
            .toLowerCase()
            .trim();


    document
        .querySelectorAll(
            ".product-card"
        )
        .forEach(product => {

            const name =
                product.dataset.name
                    .toLowerCase();


            const categories =
                product.dataset.category
                    .toLowerCase();


            const matchesSearch =
                name.includes(
                    searchText
                );


            const matchesCategory =
                currentCategory ===
                    "all" ||
                categories.includes(
                    currentCategory
                );


            if (
                matchesSearch &&
                matchesCategory
            ) {

                product.style.display =
                    "";

                product.style.animation =
                    "fadeUp .5s ease";

            } else {

                product.style.display =
                    "none";
            }

        });
}


// =========================
// FILTER CATEGORY
// =========================

function filterCategory(
    category,
    button
) {

    currentCategory =
        category;


    document
        .querySelectorAll(
            ".category-btn"
        )
        .forEach(btn => {

            btn.classList.remove(
                "active"
            );

        });


    button.classList.add(
        "active"
    );


    searchProducts();
}


// =========================
// MODAL CLICK OUTSIDE
// =========================

window.addEventListener(
    "click",
    function(event) {

        const checkout =
            document.getElementById(
                "checkoutModal"
            );

        const status =
            document.getElementById(
                "statusModal"
            );

        const receipt =
            document.getElementById(
                "receiptModal"
            );


        if (
            event.target === checkout
        ) {

            closeCheckout();

        }


        if (
            event.target === status
        ) {

            closeStatus();

        }


        if (
            event.target === receipt
        ) {

            closeReceipt();

        }

    }
);


// =========================
// ESCAPE KEY
// =========================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeCart();

            closeCheckout();

            closeStatus();

            closeReceipt();

        }

    }
);


// =========================
// PAGE LOAD
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCart();

    }
);