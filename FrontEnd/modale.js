// Sélectionne tous les boutons ayant la classe "openModal".
let openModalButtons = document.querySelectorAll('.openModal');

// Sélectionne tous les boutons ayant la classe "close-btn".
let closeModalBtn = document.querySelectorAll('.close-btn');

// Sélectionne l'élément modal avec l'ID "modal".
const modal = document.getElementById("modal");

// Ajoute un écouteur d'événements "click" à chaque bouton "openModal".
openModalButtons.forEach(button => {
    button.addEventListener("click", function () {
        // Affiche le modal en changeant son style pour "block".
        modal.style.display = "block";
    });
});

// Ajoute des écouteurs d'événements "click" à chaque bouton "close-btn".
closeModalBtn.forEach(button => {
    button.addEventListener("click", function () {
        // Cache le modal en changeant son style pour "none".
        modal.style.display = "none";
    });
    // Ajoute un deuxième écouteur d'événements "click" pour un autre élément (peut-être "innerModal").
    button.addEventListener("click", function () {
        innerModal.style.display = "none";
    });
});

// Sélectionne tous les boutons ayant la classe "openInnerModal".
let openInnerModalButtons = document.querySelectorAll('.openInnerModal');

// Sélectionne l'élément modal interne avec la classe "inner-modal-form".
const innerModal = document.querySelector(".inner-modal-form");

// Ajoute un écouteur d'événements "click" à chaque bouton "openInnerModal".
openInnerModalButtons.forEach(button => {
    button.addEventListener("click", function () {
        // Affiche le modal interne en changeant son style pour "block".
        innerModal.style.display = "block";
    });
    // Ajoute un deuxième écouteur d'événements "click" pour cacher le modal principal.
    button.addEventListener("click", function () {
        modal.style.display = "none";
    });
});

// Sélectionne tous les boutons ayant la classe "return-btn".
let returnToModalButton = document.querySelectorAll('.return-btn');

// Ajoute des écouteurs d'événements "click" à chaque bouton "return-btn".
returnToModalButton.forEach(image => {
    image.addEventListener("click", function () {
        // Cache le modal interne en changeant son style pour "none".
        innerModal.style.display = "none";
    });
    // Ajoute un deuxième écouteur d'événements "click" pour afficher le modal principal.
    image.addEventListener("click", function () {
        modal.style.display = "block";
    });
});