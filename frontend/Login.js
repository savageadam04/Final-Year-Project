console.log("Login.js is connected!");
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("pwd").value;
    const loginMessage = document.getElementById("loginMessage");

    loginMessage.textContent = "Signing in...";

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        // Store the authentication token
        sessionStorage.setItem("token", result.token);

        // Store the logged-in user's details
        sessionStorage.setItem("user", JSON.stringify(result.user));

        loginMessage.textContent = "Login successful!";

        // Redirect to dashboard
        window.location.href = "Dashboard.html";

    } catch (error) {
        loginMessage.textContent = error.message;
        console.error("Login error:", error);
    }
});
