// ===============================
// Admin Access Protection
// ===============================

const adminLoggedIn =
    localStorage.getItem("adminLoggedIn");

if (adminLoggedIn !== "true") {

    window.location.href = "admin-login.html";

}


// ===============================
// Logout
// ===============================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("adminLoggedIn");

        localStorage.removeItem("adminUser");

        window.location.href = "admin-login.html";

    });

}


// ===============================
// Load Users
// ===============================

const users =
    JSON.parse(localStorage.getItem("users")) || [];


// ===============================
// Load ALL Products
// ===============================

const products =
    JSON.parse(localStorage.getItem("products")) || [];


// ===============================
// Total Products
// ===============================

document.getElementById("totalProducts").innerText =
    products.length;


// ===============================
// Product Status Count
// ===============================

let expiringCount = 0;
let expiredCount = 0;

const today = new Date();

today.setHours(0, 0, 0, 0);


// ===============================
// Table
// ===============================

const tableBody =
    document.getElementById("productsTableBody");

tableBody.innerHTML = "";


if (products.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align:center;">
                No Products Available
            </td>
        </tr>
    `;

}
else {

    products.forEach(function (product) {

        // ===============================
        // Find User
        // ===============================

        const user =
            users.find(function (u) {

                return u.email === product.userId;

            });


        const userName =
            product.userName ||
            (user ? user.name : "Unknown User");


        const userEmail =
            product.userId ||
            (user ? user.email : "-");


        // ===============================
        // Status
        // ===============================

        let status = "Fresh";

        if (product.expiryDate) {

            const expiry =
                new Date(product.expiryDate);

            expiry.setHours(0, 0, 0, 0);

            const days =
                Math.ceil(
                    (expiry - today) /
                    (1000 * 60 * 60 * 24)
                );


            if (days < 0) {

                status = "Expired";
                expiredCount++;

            }
            else if (days <= 7) {

                status = "Expiring Soon";
                expiringCount++;

            }

        }


        // ===============================
        // Add Product Row
        // ===============================

        tableBody.innerHTML += `

            <tr>

                <td>
                    ${userName}
                </td>

                <td>
                    ${userEmail}
                </td>

                <td>
                    ${product.productName || "-"}
                </td>

                <td>
                    ${product.category || "-"}
                </td>

                <td>
                    ${product.quantity || "-"}
                </td>

                <td>
                    ${product.manufacturingDate || "-"}
                </td>

                <td>
                    ${product.expiryDate || "-"}
                </td>

                <td>
                    ${status}
                </td>

            </tr>

        `;

    });

}


// ===============================
// Display Status Counts
// ===============================

document.getElementById("expiringProducts").innerText =
    expiringCount;

document.getElementById("expiredProducts").innerText =
    expiredCount;