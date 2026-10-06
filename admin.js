
// ===============================
// Admin Access Protection
// ===============================

const adminLoggedIn = localStorage.getItem("adminLoggedIn");

if (adminLoggedIn !== "true") {
    window.location.href = "admin-login.html";
}


// ===============================
// Admin Logout
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

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

let users =
    JSON.parse(localStorage.getItem("users")) || [];
    


// ===============================
// Load ALL Products
// ===============================

let products =
    JSON.parse(localStorage.getItem("products")) || [];


// ===============================
// Total Users
// ===============================

document.getElementById("totalUsers").textContent = users.length;


// ===============================
// Product Counts
// ===============================

let totalProducts = products.length;
let expiringProducts = 0;
let expiredProducts = 0;

const today = new Date();

today.setHours(0, 0, 0, 0);


products.forEach(function (product) {

    if (!product.expiryDate) {
        return;
    }

    const expiryDate =
        new Date(product.expiryDate);

    expiryDate.setHours(0, 0, 0, 0);

    const difference =
        Math.ceil(
            (expiryDate - today) /
            (1000 * 60 * 60 * 24)
        );


    if (difference < 0) {

        expiredProducts++;

    }
    else if (difference <= 7) {

        expiringProducts++;

    }

});


// ===============================
// Display Product Counts
// ===============================

const totalProductsElement =
    document.getElementById("totalProducts");

if (totalProductsElement) {
    totalProductsElement.innerText = totalProducts;
}


const expiringProductsElement =
    document.getElementById("expiringProducts");

if (expiringProductsElement) {
    expiringProductsElement.innerText =
        expiringProducts;
}


const expiredProductsElement =
    document.getElementById("expiredProducts");

if (expiredProductsElement) {
    expiredProductsElement.innerText =
        expiredProducts;
}


// ===============================
// Display All Users & Products
// ===============================

const tableBody =
    document.getElementById("adminProductTableBody");

if (tableBody) {

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

            // Find User
            const productUser =
                users.find(function (user) {

                    return user.email === product.userId;

                });


            const userName =
                product.userName ||
                (productUser ? productUser.name : "Unknown User");


            const userEmail =
                product.userId ||
                (productUser ? productUser.email : "-");


            // ===============================
            // Calculate Status
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

                }
                else if (days <= 7) {

                    status = "Expiring Soon";

                }

            }


            // ===============================
            // Add Row
            // ===============================

            tableBody.innerHTML += `

                <tr>

                    <td>${userName}</td>

                    <td>${userEmail}</td>

                    <td>${product.productName || "-"}</td>

                    <td>${product.category || "-"}</td>

                    <td>${product.quantity || "-"}</td>

                    <td>${product.manufacturingDate || "-"}</td>

                    <td>${product.expiryDate || "-"}</td>

                    <td>${status}</td>

                </tr>

            `;

        });

    }

}
// ===============================
// Users Button
// ===============================

const usersBtn = document.getElementById("usersBtn");
const usersSection = document.getElementById("usersSection");

if (usersBtn && usersSection) {

    usersBtn.addEventListener("click", function (e) {

        e.preventDefault();

        usersSection.scrollIntoView({
            behavior: "smooth"
        });

    });

}


// ===============================
// Display Registered Users
// ===============================

const usersTableBody =
    document.getElementById("adminUsersTableBody");

if (usersTableBody) {

    usersTableBody.innerHTML = "";

    if (users.length === 0) {

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No Users Registered
                </td>
            </tr>
        `;

    } else {

        users.forEach(function (user, index) {

            // Count products of this user
            const userProducts = products.filter(function (product) {

                return product.userId === user.email;

            });

            usersTableBody.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${user.name || "-"}</td>

                    <td>${user.email || "-"}</td>

                    <td>${user.mobile || "-"}</td>

                    <td>${userProducts.length}</td>

                </tr>

            `;

        });

    }

}

