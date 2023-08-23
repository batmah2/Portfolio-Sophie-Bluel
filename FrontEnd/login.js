// Attente du chargement du document avant d'exécuter le code à l'intérieur de cette fonction
document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        await logIn();
    });
    async function logIn() {
        const data = {
            email: document.querySelector(".email").value,
            password: document.querySelector(".password").value,
        };

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                },
                body: JSON.stringify(data)
            });
 
            if (response.ok) {
                const user = await response.json();
                sessionStorage.setItem("token", user.token)
                window.location = "index.html"
            } else {
                console.error("Statut : ", response.status);
                const error = await response.json();
                console.error("Une erreur s'est produite :", error.message);
            }
        } catch (error) {
            console.error("Une erreur s'est produite :", error);     
        }
    }
});

