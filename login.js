function login() {

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");

    emailError.innerHTML = "";
    passwordError.innerHTML = "";

    if (email == "") {
        emailError.innerHTML = "Email is required";
        return;
    }

    if (!email.includes("@")) {
        emailError.innerHTML = "Enter valid email";
        return;
    }

    if (password == "") {
        passwordError.innerHTML = "Password is required";
        return;
    }

    if (password.length < 6) {
        passwordError.innerHTML = "Password must be at least 6 characters";
        return;
    }

    // Get registered user
    let user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("No account found. Please register first.");
        window.location.href = "register.html";
        return;
    }

    if (email === user.email && password === user.password) {

        localStorage.setItem("loggedInUser", JSON.stringify(user));

        alert("Login Successful!");

        window.location.href = "dashboard.html";

    } else {

        alert("Invalid Email or Password!");

    }
}