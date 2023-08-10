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