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
// Load Products
// ===============================

const products =
    JSON.parse(localStorage.getItem("products")) || [];


// ===============================
// Total Users
// ===============================

document.getElementById("totalUsers").innerText =
    users.length;


// ===============================
// Display Users
// ===============================

const tableBody =
    document.getElementById("usersTableBody");

tableBody.innerHTML = "";


if (users.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;">
                No Users Registered
            </td>
        </tr>
    `;

}
else {

    users.forEach(function (user, index) {

        // Count user's products

        const userProducts =
            products.filter(function (product) {

                return product.userId === user.email;

            });


        tableBody.innerHTML += `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${user.name || "-"}
                </td>

                <td>
                    ${user.email || "-"}
                </td>

                <td>
                    ${user.mobile || "-"}
                </td>

                <td>
                    ${userProducts.length}
                </td>

            </tr>

        `;

    });

}