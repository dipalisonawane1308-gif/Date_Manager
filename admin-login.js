// ===============================
// Admin Login
// ===============================

const adminLoginForm = document.getElementById("adminLoginForm");

adminLoginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    // Predefined Admin Credentials
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    // Check Admin Login
    if (email === adminEmail && password === adminPassword) {

        // Save admin login status
        localStorage.setItem("adminLoggedIn", "true");

        // Save admin information
        localStorage.setItem("adminUser", JSON.stringify({
            email: adminEmail,
            role: "admin"
        }));

        // Open Admin Dashboard
        window.location.href = "admin.html";

    } else {

        errorMessage.innerText =
            "Invalid admin email or password.";
    }
});