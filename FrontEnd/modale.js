let openModalButtons = document.querySelectorAll('.openModal')
let closeModalBtn = document.querySelectorAll('.close-btn')
const modal = document.getElementById("modal");


openModalButtons.forEach(button => {
    button.addEventListener("click", function () {
        modal.style.display = "block";
    });
});
closeModalBtn.forEach(button => {
    button.addEventListener("click", function () {
    modal.style.display = "none";
    });
    button.addEventListener("click", function () {
    innerModal.style.display = "none";
    });
});
let moveIconActive = document.querySelectorAll(".move-icon")
let activateMoveIcon = document.querySelectorAll(".modal-gallery-size")

image.addEventListener("mouseover", function() {
    moveIconActive.style.display= "block";
})


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

let returnToModalButton = document.querySelectorAll('.return-btn')
returnToModalButton.forEach(image => {
    image.addEventListener("click", function () {
        innerModal.style.display= "none";
    });
    image.addEventListener("click", function () {
        modal.style.display="block";
    });
});
