
// ===============================
// Get Form
// ===============================

const form = document.getElementById("registerForm");


// ===============================
// Show / Hide Password
// ===============================

const password = document.getElementById("password");
const eye = document.getElementById("eye");

eye.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        eye.innerHTML = "🙈";
    } else {
        password.type = "password";
        eye.innerHTML = "👁";
    }

});


// ===============================
// Registration
// ===============================

form.addEventListener("submit", function (e) {

    e.preventDefault();


    // ===============================
    // Get Values
    // ===============================

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let mobile = document.getElementById("mobile").value.trim();
    let pass = document.getElementById("password").value;
    let confirm = document.getElementById("confirmPassword").value;


    // ===============================
    // Clear Errors
    // ===============================

    document.getElementById("nameError").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";
    document.getElementById("mobileError").innerHTML = "";
    document.getElementById("passwordError").innerHTML = "";
    document.getElementById("confirmError").innerHTML = "";


    let valid = true;


    // ===============================
    // Name Validation
    // ===============================

    if (!/^[A-Za-z ]+$/.test(name)) {

        document.getElementById("nameError").innerHTML =
            "Enter a valid name";

        valid = false;
    }


    // ===============================
    // Email Validation
    // ===============================

    if (!/^\S+@\S+\.\S+$/.test(email)) {

        document.getElementById("emailError").innerHTML =
            "Enter a valid email";

        valid = false;
    }


    // ===============================
    // Mobile Validation
    // ===============================

    // ===============================
// Mobile Validation
// ===============================

if (mobile === "") {

    document.getElementById("mobileError").innerHTML =
        "Mobile number is required";

    valid = false;

} else if (!/^[0-9]{10}$/.test(mobile)) {

    document.getElementById("mobileError").innerHTML =
        "Enter a valid 10-digit mobile number";

    valid = false;

} else {

    // Check repeated digits
    const digitCount = {};

    for (let digit of mobile) {
        digitCount[digit] = (digitCount[digit] || 0) + 1;
    }

    const repeatedTooMuch = Object.values(digitCount).some(
        count => count > 4
    );

    if (repeatedTooMuch) {

        document.getElementById("mobileError").innerHTML =
            "A digit cannot be repeated more than 4 times";

        valid = false;
    }
}


    // ===============================
    // Password Validation
    // ===============================

    if (pass.length < 6) {

        document.getElementById("passwordError").innerHTML =
            "Password must be at least 6 characters";

        valid = false;
    }


    // ===============================
    // Confirm Password
    // ===============================

    if (pass !== confirm) {

        document.getElementById("confirmError").innerHTML =
            "Passwords do not match";

        valid = false;
    }


    // ===============================
    // Save User
    // ===============================

    if (valid) {

        const user = {
            name: name,
            email: email,
            mobile: mobile,
            password: pass
        };


        // ===============================
        // Save Current User
        // ===============================

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        // ===============================
        // Save All Registered Users
        // ===============================

        let users =
            JSON.parse(localStorage.getItem("users")) || [];


        // Add new user
        users.push(user);


        // Save users array
        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        // ===============================
        // Mark User as Logged In
        // ===============================

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
        );


        // ===============================
        // Success Message
        // ===============================

        alert("🎉 Registration Successful!");


        // ===============================
        // Go to Dashboard
        // ===============================

        window.location.href = "dashboard.html";

    }

});

