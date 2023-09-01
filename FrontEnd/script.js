let works = [];

/**
 * Fonction to create a figure element.
 * @param {string} imageURL - The URL of the image.
 * @param {string} title - The title of the image.
 * @param id - The id of the image.
 */
function createFigure(imageURL, title, id) {
  return `
      <figure data-id=${id}>
        <img src="${imageURL}" alt="${title}">
        <figcaption>${title}</figcaption>
      </figure>
  `;
}
function createFigureModal(imageURL, title, id) {
  return `
        <figure data-id="${id}" class="modal-flex">
           <div class="icon-flex">
           <img id="moveIcon" class="move-icon hidden-icon" src="./assets/icons/Move.png" alt="move icon"></img>
           <img id="trashIcon" class="trash-icon" src="./assets/icons/trash.png" alt="trash icon"></img>
          </div>
          <img class="modal-gallery-size" src="${imageURL}" alt="${title}">
          <figcaption>éditer</figcaption>
        </figure>
    `;
}
function createInput(name, id, filterClass) {
  return `
    <input type="submit" data-id="${id}" class="${filterClass}" value="${name}">
  `;
}

async function getWorksAsync() {
  const response = await fetch("http://localhost:5678/api/works");
  works = await response.json();
  createWorks(works);
}

function getWorksWithThen() {
  fetch("http://localhost:5678/api/works") // Call the fetch function passing the url of the API as a parameter
    .then((response) => response.json()) // Extract the JSON body content from the response
    .then((data) => {
      // Loop over the works and create a figure for each work:
      works = data;
      createWorks(works);
      createModalGallery(works);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  getWorksWithThen();
  addDynamicFilter();
  checkToken();
});

function addDynamicFilter() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      for (let categorie of data) {
        const categories = document.querySelector(".categories");
        categories.innerHTML += createInput(
          categorie.name,
          categorie.id,
          "filter"
        );
      }
      addEventFilter();
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération des données :",
        error
      );
    });
}

function addEventFilter() {
  const filters = document.querySelectorAll(".categories input[type='submit']");
  for (let filter of filters) {
    filter.addEventListener("click", filterCategory);
  }
}
function filterCategory(event) {
  const id = Number(event.target.dataset.id);
  if (id) {
    const filteredWorks = works.filter((work) => work.categoryId === id);
    createWorks(filteredWorks);
  } else {
    createWorks(works);
  }
}

function createWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  works.forEach(({ imageUrl, title, id }) => {
    const figure = createFigure(imageUrl, title, id);
    gallery.innerHTML += figure;
  });
}

function createModalGallery(works) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";
  works.forEach(({ imageUrl, title, id }) => {
    const figureModal = createFigureModal(imageUrl, title, id);
    modalGallery.innerHTML += figureModal;
  });
  addDeletionEvents();
}

async function deleteWork(id) {
  const token = sessionStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
      } else {
        console.error(`suppression du travail contenant l'ID ${id} échoué.`);
      }
    } catch (error) {
      console.error(`Une erreur est survenue en supprimant ID ${id}:`, error);
    }
  } else {
    console.error("Token introuvable, suppression impossible");
  }
}

function addDeletionEvents() {
  const trashes = document.querySelectorAll(".trash-icon");
  for (let trash of trashes) {
    trash.removeEventListener("click", deleteAndRenderWork);
    trash.addEventListener("click", deleteAndRenderWork);
  }
  addDeleteAllEvent();
}

async function deleteAndRenderWork() {
  const { id } = this.parentElement.parentElement.dataset;
  await deleteWork(id);
  document.querySelector(`.modal-gallery figure[data-id="${id}"]`).remove();
  document.querySelector(`.gallery figure[data-id="${id}"]`).remove();
}

function addDeleteAllEvent() {
  const deletionButton = document.querySelector(".deleteGallery"); // Sélectionner le bouton de suppression
  deletionButton.addEventListener("click", () => {
    // Ajouter un écouteur d'événement sur le bouton
    const confirmation = confirm(
      "Voulez-vous vraiment supprimer tous les travaux ?"
    );
    if (confirmation) {
      for (let work of works) {
        // Dans la fonction de callback, appeler la fonction deleteWork sur chaque work
        deleteWork(work.id);
      }
      works = [];
      createWorks(works); // -- Relancer la function createWorks() après avoir mis à jour la variable works ([] vide)
    }
  });
}

// AJOUTER UNE PHOTO
async function createWork(form) {
  const token = sessionStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  return null;
}
//Ajouter des works
const form = document.querySelector(".inner-modal-form");
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const work = await createWork(formData);
  works.push(work);
  createWorks(works);
  createModalGallery();
  clearModal();
});

// ajouter recuperation des categories dans l'input
const categorySelect = document.getElementById("category");

// Effectuez une requête à votre API pour obtenir la liste des catégories
// Remarque : Vous devrez remplacer l'URL de l'API par la vôtre.
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    // Une fois que vous avez reçu les catégories depuis l'API,
    // parcourez-les et ajoutez-les à la liste déroulante.
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id; // Remplacez par la valeur appropriée pour chaque catégorie
      option.textContent = category.name; // Remplacez par le nom de la catégorie
      categorySelect.appendChild(option);
    });
  })
  .catch((error) =>
    console.error("Erreur lors de la récupération des catégories :", error)
  );

// Écoutez les changements de sélection de la liste déroulante
categorySelect.addEventListener("change", function () {
  // Vous pouvez accéder à la catégorie sélectionnée avec categorySelect.value
  // Par exemple, si vous voulez afficher la catégorie sélectionnée dans la console :
});
//Vérifications avant l'ajout de nouveaux travaux :

const fileTooBig = document.querySelector(".file-too-big");
const imagePreviewContainer = document.querySelector(".ajout-photo");
const image = new Image();
const workCategory = document.querySelector(".inner-modal-form #category");
const workTitle = document.querySelector(".inner-modal-form #title");
const workImage = document.getElementById("file");
const modalSubmit = document.querySelector(".add-work");

//Verifier si la  taille ne dépasse pas les 4 mo
function validateFileSize(event) {
  const file = event.target.files[0];
  const maxFileSize = 4 * 1024 * 1024; // 4 Mo en octets

  if (file && file.size > maxFileSize) {
    // Afficher un message d'erreur
    fileTooBig.style.display = "block";
    event.target.value = "";
  } else {
    // Appeler la fonction previewImage si la taille est valide
    previewImage();
  }
}

//Faire apparaitre la miniature dans la modale
function previewImage() {
  const file = workImage.files[0];

  if (file.type.match("image.*")) {
    const reader = new FileReader();

    reader.addEventListener("load", function (event) {
      const imageUrl = event.target.result;

      image.addEventListener("load", function () {
        for (let child of imagePreviewContainer.children) {
          child.style.display = "none";
        }
        imagePreviewContainer.appendChild(image);
      });

      image.src = imageUrl;
      image.style.width = "129px";
      image.style.height = "169px";
    });
    reader.readAsDataURL(file);
  }
}

//Création d'un tableau pour stocker les inputs
const inputs = [workCategory, workTitle, workImage];
for (let input of inputs) {
  input.addEventListener("input", function () {
    validateInputs();
  });
}

// Vérification de chaque champ d'entrée
function validateInputs() {
  if (workImage.files[0] && Number(workCategory.value) && workTitle.value) {
    modalSubmit.style.backgroundColor = "#1D6154";
  } else {
    modalSubmit.style.backgroundColor = "#A7A7A7";
  }
}

//Ferme et vide la modale après validation pour un nouvel ajout
function clearModal() {
  imagePreviewContainer.removeChild(image);
  for (let child of imagePreviewContainer.children) {
    child.style.display = "block";
  }
  fileTooBig.style.display = "none";
  workTitle.value = "";
  workCategory.value = "";
  modalSubmit.style.backgroundColor = "#A7A7A7";
}

// AFFICHER LE MODE EDITION UNIQUEMENT POUR UN UTILISATEUR CONNECTE
function checkToken() {
  const token = sessionStorage.getItem("token");
  if (token) {
    activateEditionMode();
  }
}
function activateEditionMode() {
  const logoutLink = document.getElementById("logout-link");
  logoutLink.style.display = "block";
  logoutLink.addEventListener("click", logout);

  document.querySelectorAll(".edition-mod").forEach((element) => {
    element.classList.remove("edition-mod");
  });
  document.getElementById("login-link").style.display = "none";
  document.querySelector(".intro-logo").style.display = "block";
  document.querySelector(".categories").style.display = "none";
}

function logout() {
  sessionStorage.removeItem("token");
  window.location = "index.html";
}
