async function signUp() {
    console.log("Sign-up button clicked");
    
    const email = document.getElementById("signup-email").value;
    const name = document.getElementById("signup-name").value;
    const role = document.getElementById("signup-role").value;
    const password = document.getElementById("signup-password").value;
    const repeatPassword = document.getElementById("signup-repeat-password").value;
    
    console.log("Collected values:", { email, name, role, password, repeatPassword });

    if (password !== repeatPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, name, role, password })
        });
        
        console.log("Response from signup:", response);

        if (response.ok) {
            // Automatically log in the user after sign-up
            const loginResponse = await fetch("http://localhost:8000/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({ username: email, password })
            });
            
            console.log("Response from login after signup:", loginResponse);

            if (loginResponse.ok) {
                const data = await loginResponse.json();
                localStorage.setItem("token", data.access_token);
                checkLogin();
            } else {
                alert("Failed to login after sign-up");
            }
        } else {
            const data = await response.json();
            alert(data.detail);
        }
    } catch (error) {
        console.error("Error during sign-up:", error);
        alert("An error occurred during sign-up");
    }
}

async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch("http://localhost:8000/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ username: email, password })
        });

        console.log("Response from login:", response);

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.access_token);
            checkLogin();
        } else {
            const data = await response.json();
            alert(data.detail);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login");
    }
}

function checkLogin() {
    const token = localStorage.getItem("token");
    if (token) {
        fetch("http://localhost:8000/users/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => response.json()).then(data => {
            const welcomeMessage = document.getElementById("welcome-message");
            if (data.role === "admin") {
                welcomeMessage.innerText = "Hello admin";
            } else {
                welcomeMessage.innerText = "Hello user";
            }
            document.getElementById("login").classList.add("hidden");
            document.getElementById("signup").classList.add("hidden");
            document.getElementById("welcome").classList.remove("hidden");
        }).catch(() => {
            localStorage.removeItem("token");
            showLogin();
        });
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById("login").classList.remove("hidden");
    document.getElementById("signup").classList.add("hidden");
    document.getElementById("welcome").classList.add("hidden");
}

function showSignUp() {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("signup").classList.remove("hidden");
    document.getElementById("welcome").classList.add("hidden");
}
