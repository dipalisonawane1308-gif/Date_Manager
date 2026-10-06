
// ===============================
// Get Logged-in User
// ===============================

const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
    window.location.href = "login.html";
}


// ===============================
// User Name
// ===============================

document.getElementById("userName").innerText = user.name;


// ===============================
// Load ALL Products
// ===============================

let allProducts =
    JSON.parse(localStorage.getItem("products")) || [];


// ===============================
// Show Only Current User Products
// ===============================

let products = allProducts.filter(product => {

    return product.userId === user.email;

});


// ===============================
// Dashboard Counts
// ===============================

let total = products.length;
let expired = 0;
let expiring = 0;
let fresh = 0;

let today = new Date();

today.setHours(0, 0, 0, 0);


// Total Products

document.getElementById("totalProducts").innerText = total;


// ===============================
// Product Table
// ===============================

const tableBody =
    document.getElementById("foodTableBody");

tableBody.innerHTML = "";


products.forEach(product => {

    let expiry = new Date(product.expiryDate);

    expiry.setHours(0, 0, 0, 0);


    let diff = Math.ceil(
        (expiry - today) /
        (1000 * 60 * 60 * 24)
    );


    let status = "";


    if (diff < 0) {

        status = "Expired";
        expired++;

    }

    else if (diff <= 7) {

        status = "Expiring Soon";
        expiring++;

    }

    else {

        status = "Fresh";
        fresh++;

    }


    tableBody.innerHTML += `
        <tr>
            <td>${product.productName || "-"}</td>
            <td>${product.category || "-"}</td>
            <td>${product.quantity || "-"}</td>
            <td>${product.manufacturingDate || "-"}</td>
            <td>${product.expiryDate || "-"}</td>
            <td>${status}</td>
        </tr>
    `;

});


// ===============================
// No Products
// ===============================

if (products.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">
                No Products Available
            </td>
        </tr>
    `;

}


// ===============================
// Update Dashboard Cards
// ===============================

document.getElementById("expiredProducts").innerText =
    expired;

document.getElementById("expiringProducts").innerText =
    expiring;

document.getElementById("freshProducts").innerText =
    fresh;


// ===============================
// QR Scanner
// ===============================

document.getElementById("scanBtn")
.addEventListener("click", function () {

    document.getElementById("reader").style.display =
        "block";


    const scanner =
        new Html5Qrcode("reader");


    scanner.start(

        { facingMode: "environment" },

        {
            fps: 10,
            qrbox: 250
        },

        function (decodedText) {

            try {

                // ===============================
                // Read QR Product
                // ===============================

                let product =
                    JSON.parse(decodedText);


                // ===============================
                // Get Logged-in User
                // ===============================

                const loggedInUser =
                    JSON.parse(
                        localStorage.getItem("loggedInUser")
                    );


                if (!loggedInUser) {

                    alert("Please login first!");
                    return;

                }


                // ===============================
                // Add User Information
                // ===============================

                product.userId =
                    loggedInUser.email;

                product.userName =
                    loggedInUser.name;

                product.scanDate =
                    new Date()
                    .toISOString()
                    .split("T")[0];


                // ===============================
                // Load Existing Products
                // ===============================

                let allProducts =
                    JSON.parse(
                        localStorage.getItem("products")
                    ) || [];


                // ===============================
                // Add New Product
                // ===============================

                allProducts.push(product);


                // ===============================
                // Save ALL Products
                // ===============================

                localStorage.setItem(
                    "products",
                    JSON.stringify(allProducts)
                );


                // ===============================
                // Monthly History
                // ===============================

                let history =
                    JSON.parse(
                        localStorage.getItem(
                            "productHistory"
                        )
                    ) || [];


                let monthKey =
                    new Date()
                    .toISOString()
                    .slice(0, 7);


                if (
                    !history.some(
                        item => item.month === monthKey
                    )
                ) {

                    history.push({
                        month: monthKey,
                        products: []
                    });

                }


                let monthData =
                    history.find(
                        item => item.month === monthKey
                    );


                monthData.products.push(product);


                localStorage.setItem(
                    "productHistory",
                    JSON.stringify(history)
                );


                // ===============================
                // Success
                // ===============================

                alert(
                    "✅ Product added successfully!"
                );


                scanner.stop();


                document.getElementById("reader")
                    .style.display = "none";


                location.reload();


            }

            catch (error) {

                alert("❌ Invalid QR Code!");

            }

        },

        function (error) {

            // Ignore scan errors

        }

    );

});


// ===============================
// Logout
// ===============================

document.getElementById("logout")
.addEventListener("click", function () {

    localStorage.removeItem("loggedInUser");

    window.location.href = "login.html";

});


// ===============================
// Notification Count
// ===============================

function updateNotificationCount() {

    // Only current user's products
    const foodProducts =
        JSON.parse(
            localStorage.getItem("products")
        ) || [];


    const currentUser =
        JSON.parse(
            localStorage.getItem("loggedInUser")
        );


    const userProducts =
        foodProducts.filter(product => {

            return currentUser &&
                   product.userId === currentUser.email;

        });


    let count = 0;

    let today = new Date();

    today.setHours(0, 0, 0, 0);


    userProducts.forEach(product => {

        if (!product.expiryDate) {
            return;
        }


        let expiry =
            new Date(product.expiryDate);

        expiry.setHours(0, 0, 0, 0);


        let days = Math.ceil(
            (expiry - today) /
            (1000 * 60 * 60 * 24)
        );


        if (days <= 7) {

            count++;

        }

    });


    document.getElementById(
        "notificationMenu"
    ).innerHTML =
        `<i class="fa-solid fa-bell"></i>
         Notifications (${count})`;

}


updateNotificationCount();

