let openModalButtons = document.querySelectorAll('.openModal')
console.log(openModalButtons);
let closeModalBtn = document.querySelector('.close-btn')
console.log(closeModalBtn);
const modal = document.getElementById("modal");
console.log(modal);
openModalButtons.forEach(button => {
    button.addEventListener("click", function () {
        modal.style.display = "block";
    });
});
closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

let openInnerModalButtons = document.querySelectorAll('.openInnerModal')
console.log(openInnerModalButtons);
const innerModal = document.querySelector(".inner-modal-form");
openInnerModalButtons.forEach(button => {
    button.addEventListener("click", function () {
        innerModal.style.display = "block";
    });
    button.addEventListener("click", function () {
        modal.style.display = "none";
    });
});
