let works;

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
  `
  }
  function createFigureModal(imageURL, title, id) {
    return `
        <figure data-id="${id}" class="modal-flex">
           <div class="icon-flex">
            <i class="move fa-solid fa-arrows-up-down-left-right"></i>
            <i class="trash fa-solid fa-trash-can"></i>
          </div>
          <img src="${imageURL}" alt="${title}">
          <figcaption>éditer</figcaption>
        </figure>
    `;
  }
function createInput(name, id) {
  return `
    <input type="submit" value="${name}" data-id="${id}"> 
  `
}

async function getWorksAsync() {
  const response = await fetch("http://localhost:5678/api/works");
  works = await response.json();
  createWorks(works);
}

function getWorksWithThen() {
  fetch("http://localhost:5678/api/works") // Call the fetch function passing the url of the API as a parameter
    .then(response => response.json()) // Extract the JSON body content from the response
    .then(data => {
      // Loop over the works and create a figure for each work:
      works = data;
      createWorks(works);
      createModalGallery(works);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  getWorksWithThen();
  addDynamicFilter();
});


function addDynamicFilter() {
  fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      for (let categorie of data) {
        const categories = document.querySelector(".categories");
        categories.innerHTML += createInput(categorie.name, categorie.id);
      }
      addEventFilter();
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la récupération des données :', error);
    });

}

function addEventFilter() {
  const filters = document.querySelectorAll(".categories input[type='submit']");
  console.log(filters);
  for (let filter of filters) {
    filter.addEventListener("click", filterCategory);
  }
}

function filterCategory(event) {
  const id = Number(event.target.dataset.id);
  if (id) {
    const filteredWorks = works.filter(work => work.categoryId === id);
  createWorks(filteredWorks);
  } else {
    createWorks(works);
  };
}

function createWorks(works) {
  const gallery =  document.querySelector(".gallery");
  gallery.innerHTML = "";
  works.forEach(({ imageUrl, title, id }) => {
    const figure = createFigure(imageUrl, title, id);
    gallery.innerHTML += figure;
  });
}

function createModalGallery(works) {
  const modalGallery = document.querySelector(".modal-gallery");
  console.log(modalGallery);
  modalGallery.innerHTML ="";
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
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log(`Travaux contenant l'ID ${id} supprimer avec succès.`);
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
  const trashes = document.querySelectorAll(".fa-trash-can");
  console.log(trashes);
  for (let trash of trashes) {
    trash.removeEventListener("click", deleteAndRenderWork);
    trash.addEventListener("click", deleteAndRenderWork);
  }
  addDeleteAllEvent();
}

async function deleteAndRenderWork() {
  const { id } = this.parentElement.parentElement.dataset;
  console.log(id);
  await deleteWork(id);
  document.querySelector(`.modal-gallery figure[data-id="${id}"]`).remove();
  document.querySelector(`.gallery figure[data-id="${id}"]`).remove();
}

function addDeleteAllEvent() {
  const deletionButton = document.querySelector(".deleteGallery"); // Sélectionner le bouton de suppression
  deletionButton.addEventListener("click", () => { // Ajouter un écouteur d'événement sur le bouton
    const confirmation = confirm("Voulez-vous vraiment supprimer tous les travaux ?");
    if (confirmation) {
      for (let work of works) { // Dans la fonction de callback, appeler la fonction deleteWork sur chaque work
        deleteWork(work.id);
      }
      const gallery = document.querySelector(".gallery"); // Une fois que tous les travaux sont supprimés, supprimer les figures de la galerie :
      gallery.innerHTML = ""; // -- Réinitialiser le innerHTML de la galerie
      works = [];
      createWorks(works); // -- Relancer la function createWorks() après avoir mis à jour la variable works ([] vide)            
    }
  });
}

// AJOUTER UNE PHOTO
// Faire apparaitre le formulaire au sein de la modale
// Ajouter une fonction de prévisualisation de l'image (en remplaçant l'input par l'image)
// Ajouter un écouteur d'événement sur le bouton d'ajout
// Dans la fonction de callback, récupérer les données du formulaire (FormData)
// Envoyer les données au serveur

// AFFICHER LE MODE EDITION UNIQUEMENT POUR UN UTILISATEUR CONNECTE
function checkToken() {
  const token = sessionStorage.getItem("user.token");
  if (token) {
    activateEditionMode();
  }
}
function activateEditionMode() {
  const logoutLink = document.getElementById("logout-link");
  logoutLink.style.display = "block";
  logoutLink.addEventListener("click", logout);

  document.getElementById(".edition-mod").style.display = "block";
  document.getElementById("login-link").style.display = "none";
  document.querySelector(".intro-logo").style.display = "block";
  document.querySelector(".categories").style.display = "none";
}
