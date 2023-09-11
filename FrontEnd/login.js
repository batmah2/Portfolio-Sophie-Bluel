// Attente du chargement du document avant d'exécuter le code à l'intérieur de cette fonction
document.addEventListener('DOMContentLoaded', function() {
    
    // Sélectionne le formulaire dans le document.
    const form = document.querySelector("form");

    // Ajoute un écouteur d'événements "submit" au formulaire.
    form.addEventListener("submit", async function (event) {
        // Empêche le comportement par défaut du formulaire (rechargement de la page).
        event.preventDefault();
        // Appelle la fonction asynchrone "logIn".
        await logIn();
    });

    // Définit une fonction asynchrone "logIn" pour gérer la connexion.
    async function logIn() {
        // Crée un objet "data" contenant les valeurs des champs email et password du formulaire.
        const data = {
            email: document.querySelector(".email").value,
            password: document.querySelector(".password").value,
        };

        try {
            // Effectue une requête HTTP POST vers l'URL "http://localhost:5678/api/users/login".
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                },
                body: JSON.stringify(data) // Convertit l'objet "data" en JSON et l'envoie dans le corps de la requête.
            });
 
            if (response.ok) {
                // Si la réponse est OK, obtient l'utilisateur connecté depuis la réponse JSON.
                const user = await response.json();
                // Stocke le jeton d'authentification dans la session de stockage.
                sessionStorage.setItem("token", user.token);
                // Redirige l'utilisateur vers la page "index.html".
                window.location = "index.html";
            } else {
                // En cas de réponse non-OK, affiche le statut de la réponse et le message d'erreur JSON.
                console.error("Statut : ", response.status);
                const error = await response.json();
                console.error("Une erreur s'est produite :", error.message);
                //ajout du message d'erreur dans le DOM 
                const errorMessage = document.querySelector('.error-message')
                errorMessage.style.display = "block";
            }
        } catch (error) {
            // En cas d'erreur pendant la requête, affiche l'erreur dans la console.
            console.error("Une erreur s'est produite :", error);     
        }
    }
});
