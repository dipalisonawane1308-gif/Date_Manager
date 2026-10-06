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

document.getElementById("logoutBtn")
    .addEventListener("click", function () {

        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminUser");

        window.location.href = "admin-login.html";

    });


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
// Load History
// ===============================

const history =
    JSON.parse(localStorage.getItem("productHistory")) || [];

    console.log("PRODUCT HISTORY:", history);
// ===============================
// User Dropdown
// ===============================

const userSelect =
    document.getElementById("userSelect");


users.forEach(function (user) {

    const option =
        document.createElement("option");

    option.value = user.email;

    option.textContent =
        user.name + " (" + user.email + ")";

    userSelect.appendChild(option);

});

// ===============================
// Month Dropdown
// ===============================

const monthSelect =
    document.getElementById("monthSelect");

history.forEach(function (monthData) {

    const option =
        document.createElement("option");

    option.value = monthData.month;
    option.textContent = monthData.month;

    monthSelect.appendChild(option);

});

// ===============================
// Month Selection
// ===============================

monthSelect.addEventListener("change", function () {

    const selectedMonth = this.value;

    const selectedEmail = userSelect.value;

    if (!selectedEmail) {
        return;
    }

    const tableBody =
        document.getElementById("reportTableBody");

    tableBody.innerHTML = "";

    let found = false;

    history.forEach(function (monthData) {

        // If a specific month is selected
        if (
            selectedMonth !== "all" &&
            monthData.month !== selectedMonth
        ) {
            return;
        }

        monthData.products.forEach(function (product) {

            if (product.userId !== selectedEmail) {
                return;
            }

            found = true;

            let status = "Fresh";

            if (product.expiryDate) {

                const expiry =
                    new Date(product.expiryDate);

                expiry.setHours(0, 0, 0, 0);

                const today = new Date();

                today.setHours(0, 0, 0, 0);

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

            tableBody.innerHTML += `

                <tr>

                    <td>${monthData.month}</td>

                    <td>${product.productName || "-"}</td>

                    <td>${product.category || "-"}</td>

                    <td>${product.quantity || "-"}</td>

                    <td>${product.manufacturingDate || "-"}</td>

                    <td>${product.expiryDate || "-"}</td>

                    <td>${status}</td>

                </tr>

            `;

        });

    });

    if (!found) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7" style="text-align:center;">

                    No product history available for this month.

                </td>

            </tr>

        `;

    }

});
// ===============================
// Select User
// ===============================

userSelect.addEventListener("change", function () {

    const selectedEmail = this.value;

    const reportSection =
        document.getElementById("reportSection");


    if (!selectedEmail) {

        reportSection.style.display = "none";

        return;

    }


    // Find selected user

    const selectedUser =
        users.find(function (user) {

            return user.email === selectedEmail;

        });


    if (!selectedUser) {
        return;
    }


    // Show report

    reportSection.style.display = "block";


    document.getElementById("reportUserName")
        .innerText =
        "📊 " + selectedUser.name + "'s Report";


    document.getElementById("reportUserEmail")
        .innerText =
        selectedUser.email;


    // ===============================
    // Get User Products
    // ===============================

    const userProducts =
        products.filter(function (product) {

            return product.userId === selectedEmail;

        });


    // ===============================
    // Calculate Status
    // ===============================

    let fresh = 0;

    let expiring = 0;

    let expired = 0;


    const today = new Date();

    today.setHours(0, 0, 0, 0);


    userProducts.forEach(function (product) {

        if (!product.expiryDate) {
            return;
        }


        const expiry =
            new Date(product.expiryDate);

        expiry.setHours(0, 0, 0, 0);


        const days =
            Math.ceil(
                (expiry - today) /
                (1000 * 60 * 60 * 24)
            );


        if (days < 0) {

            expired++;

        }
        else if (days <= 7) {

            expiring++;

        }
        else {

            fresh++;

        }

    });


    // ===============================
    // Display Counts
    // ===============================

    document.getElementById("userTotalProducts")
        .innerText =
        userProducts.length;


    document.getElementById("userFreshProducts")
        .innerText =
        fresh;


    document.getElementById("userExpiringProducts")
        .innerText =
        expiring;


    document.getElementById("userExpiredProducts")
        .innerText =
        expired;


    // ===============================
    // Display History
    // ===============================

    const tableBody =
        document.getElementById("reportTableBody");


    tableBody.innerHTML = "";


    let historyFound = false;


    history.forEach(function (monthData) {

        const monthProducts =
            monthData.products.filter(function (product) {

                return product.userId === selectedEmail;

            });


        monthProducts.forEach(function (product) {

            historyFound = true;


            // Status

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


            tableBody.innerHTML += `

                <tr>

                    <td>
                        ${monthData.month}
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

    });


    // ===============================
    // No History
    // ===============================

    if (!historyFound) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="7" style="text-align:center;">

                    No product history available for this user.

                </td>

            </tr>

        `;

    }

});