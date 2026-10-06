const products = JSON.parse(localStorage.getItem("products")) || [];

const notificationList = document.getElementById("notificationList");

let today = new Date();
notificationList.innerHTML = "";

products.forEach(product => {

    let expiry = new Date(product.expiryDate);

    let days = Math.ceil(
        (expiry - today) / (1000 * 60 * 60 * 24)
    );

    let message = "";

    if (days < 0) {
        notificationList.innerHTML += `
            <div class="notification-card">
                <h3>❌ Product Expired</h3>
                <p><b>Product:</b> ${product.productName}</p>
                <p><b>Category:</b> ${product.category}</p>
                <p><b>Quantity:</b> ${product.quantity}</p>
                <p><b>Manufacturing Date:</b> ${product.manufacturingDate}</p>
                <p><b>Expiry Date:</b> ${product.expiryDate}</p>
            </div>
        `;
    }
    else if (days <= 7) {
        notificationList.innerHTML += `
            <div class="notification-card">
                <h3>⚠️ Expiring Soon</h3>
                <p><b>Product:</b> ${product.productName}</p>
                <p><b>Category:</b> ${product.category}</p>
                <p><b>Quantity:</b> ${product.quantity}</p>
                <p><b>Manufacturing Date:</b> ${product.manufacturingDate}</p>
                <p><b>Expiry Date:</b> ${product.expiryDate}</p>
                <p><b>Days Left:</b> ${days}</p>
            </div>
        `;
    }

    if (message !== "") {
        notificationList.innerHTML += `
            <div class="notification-card">
                ${message}
            </div>
        `;
    }
});

if (notificationList.innerHTML === "") {
    notificationList.innerHTML = `
        <div class="notification-card">
            ✅ No notifications.
        </div>
    `;
}