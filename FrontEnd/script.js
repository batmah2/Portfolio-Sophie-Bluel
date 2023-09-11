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
  fetch("http://localhost:5678/api/works") // Appel de la fonction fetch avec pour param l'url de l'API
    .then((response) => response.json()) // Extraction du contenu du body JSON de la réponse
    .then((data) => {
      // Loop tout les travaux et crée une figure pour chacun :
      works = data;
      createWorks(works);
      createModalGallery(works); // Loop les travaux mais dans la gallery de la modal
    });
}

// Appel des fonctions une fois tout le contenu HTML chargé
document.addEventListener("DOMContentLoaded", () => {
  getWorksWithThen();
  addDynamicFilter();
  checkToken();
});

// Définit une fonction nommée "addDynamicFilter" qui sera appelée ultérieurement.
function addDynamicFilter() {
  // Effectue une requête HTTP GET vers l'URL "http://localhost:5678/api/categories".
  fetch("http://localhost:5678/api/categories")
    // Une fois que la réponse est reçue, la convertit en format JSON.
    .then((response) => response.json())
    // Une fois les données JSON obtenues avec succès, exécute cette fonction.
    .then((data) => {
      // Parcourt les catégories dans les données récupérées.
      for (let categorie of data) {
        // Sélectionne l'élément HTML avec la classe "categories".
        const categories = document.querySelector(".categories");
        // Ajoute du contenu HTML à l'intérieur de l'élément "categories" en utilisant la fonction "createInput".
        categories.innerHTML += createInput(
          categorie.name,
          categorie.id,
          "filter"
        );
      }
      // Appelle la fonction "addEventFilter" pour ajouter des événements aux éléments créés.
      addEventFilter();
    })
    // Si une erreur se produit lors de la requête ou de la conversion en JSON, cette fonction est appelée.
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération des données :",
        error
      );
    });
}

// Définit une fonction nommée "addEventFilter" pour ajouter des écouteurs d'événements.
function addEventFilter() {
  // Sélectionne tous les éléments HTML qui sont des boutons de soumission (input de type 'submit') dans la classe "categories".
  const filters = document.querySelectorAll(".categories input[type='submit']");
  // Parcourt tous les boutons de soumission trouvés.
  for (let filter of filters) {
    // Ajoute un écouteur d'événements "click" à chaque bouton de soumission, en appelant la fonction "filterCategory" lorsqu'ils sont cliqués.
    filter.addEventListener("click", filterCategory);
  }
}

// Définit une fonction nommée "filterCategory" pour filtrer les œuvres en fonction de la catégorie sélectionnée.
function filterCategory(event) {
  // Extrait l'identifiant de la catégorie à partir de l'attribut "data-id" de l'élément HTML cliqué.
  const id = Number(event.target.dataset.id);
  // Vérifie si un identifiant valide a été extrait.
  if (id) {
    // Filtre les œuvres en ne conservant que celles ayant le même identifiant de catégorie.
    const filteredWorks = works.filter((work) => work.categoryId === id);
    // Appelle la fonction "createWorks" pour afficher les œuvres filtrées.
    createWorks(filteredWorks);
  } else {
    // Si l'identifiant n'est pas valide, affiche toutes les œuvres en appelant la fonction "createWorks".
    createWorks(works);
  }
}

// Définit une fonction nommée "createWorks" pour créer et afficher des œuvres dans une galerie.
function createWorks(works) {
  // Sélectionne l'élément HTML avec la classe "gallery" où les œuvres seront affichées.
  const gallery = document.querySelector(".gallery");
  // Efface tout le contenu actuellement présent dans la galerie.
  gallery.innerHTML = "";
  // Parcourt chaque œuvre dans le tableau "works".
  works.forEach(({ imageUrl, title, id }) => {
    // Crée une figure (élément HTML) en utilisant les informations de l'œuvre (URL de l'image, titre et identifiant).
    const figure = createFigure(imageUrl, title, id);
    // Ajoute le contenu HTML de la figure à l'intérieur de la galerie.
    gallery.innerHTML += figure;
  });
}

// Définit une fonction nommée "createModalGallery" pour créer et afficher des œuvres dans une galerie modale.
function createModalGallery(works) {
  // Sélectionne l'élément HTML avec la classe "modal-gallery" où les œuvres modales seront affichées.
  const modalGallery = document.querySelector(".modal-gallery");
  // Efface tout le contenu actuellement présent dans la galerie modale.
  modalGallery.innerHTML = "";
  // Parcourt chaque œuvre dans le tableau "works".
  works.forEach(({ imageUrl, title, id }) => {
    // Crée une figure modale (élément HTML) en utilisant les informations de l'œuvre (URL de l'image, titre et identifiant).
    const figureModal = createFigureModal(imageUrl, title, id);
    // Ajoute le contenu HTML de la figure modale à l'intérieur de la galerie modale.
    modalGallery.innerHTML += figureModal;
  });
  // Ajoute des événements de suppression aux éléments de la galerie modale.
  addDeletionEvents();
}

// Définit une fonction asynchrone "deleteWork" pour supprimer une œuvre par son ID.
async function deleteWork(id) {
  // Récupère le jeton d'authentification depuis la session de stockage.
  const token = sessionStorage.getItem("token");
  if (token) {
    try {
      // Effectue une requête HTTP DELETE vers l'URL spécifique pour supprimer l'œuvre.
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Vérifie si la suppression s'est bien déroulée.
      if (response.ok) {
        // Ici, vous pouvez gérer le cas où la suppression a réussi.
      } else {
        console.error(`Échec de la suppression de l'œuvre avec l'ID ${id}.`);
      }
    } catch (error) {
      console.error(`Une erreur est survenue en supprimant l'œuvre avec l'ID ${id}:`, error);
    }
  } else {
    console.error("Token introuvable, suppression impossible");
  }
}

// Définit une fonction "addDeletionEvents" pour ajouter des écouteurs d'événements de suppression aux icônes de corbeille.
function addDeletionEvents() {
  // Sélectionne toutes les icônes de corbeille dans le document.
  const trashes = document.querySelectorAll(".trash-icon");
  // Parcourt toutes les icônes de corbeille.
  for (let trash of trashes) {
    // Supprime tout écouteur d'événements "click" précédent, puis ajoute un nouveau qui appelle la fonction "deleteAndRenderWork" lorsqu'il est cliqué.
    trash.removeEventListener("click", deleteAndRenderWork);
    trash.addEventListener("click", deleteAndRenderWork);
  }
  // Ajoute un événement pour la suppression de tous les travaux.
  addDeleteAllEvent();
}

// Définit une fonction asynchrone "deleteAndRenderWork" pour supprimer une œuvre par l'ID et mettre à jour l'affichage.
async function deleteAndRenderWork() {
  // Récupère l'ID de l'œuvre à partir des données de l'élément parent.
  const { id } = this.parentElement.parentElement.dataset;
  // Appelle la fonction "deleteWork" pour supprimer l'œuvre par son ID.
  await deleteWork(id);
  // Supprime l'élément de la galerie modale.
  document.querySelector(`.modal-gallery figure[data-id="${id}"]`).remove();
  // Supprime l'élément de la galerie principale.
  document.querySelector(`.gallery figure[data-id="${id}"]`).remove();
}

// Définit une fonction "addDeleteAllEvent" pour ajouter un événement de suppression globale.
function addDeleteAllEvent() {
  // Sélectionne le bouton de suppression globale.
  const deletionButton = document.querySelector(".deleteGallery");
  // Ajoute un écouteur d'événements "click" sur le bouton.
  deletionButton.addEventListener("click", () => {
    // Demande une confirmation de suppression globale.
    const confirmation = confirm("Voulez-vous vraiment supprimer tous les travaux ?");
    if (confirmation) {
      // Parcourt tous les travaux et les supprime un par un.
      for (let work of works) {
        deleteWork(work.id);
      }
      // Vide le tableau des travaux et met à jour l'affichage.
      works = [];
      createWorks(works);
    }
  });
}


// AJOUTER UNE PHOTO
// Définit une fonction asynchrone "createWork" pour ajouter une nouvelle œuvre.
async function createWork(form) {
  // Récupère le jeton d'authentification depuis la session de stockage.
  const token = sessionStorage.getItem("token");
  if (token) {
    try {
      // Effectue une requête HTTP POST vers l'URL "http://localhost:5678/api/works".
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      // Retourne la réponse JSON de la requête.
      return await response.json();
    } catch (error) {
      // En cas d'erreur, affiche l'erreur dans la console.
      console.error(error);
    }
  }
  // Si le jeton n'est pas trouvé ou s'il y a une erreur, retourne null.
  return null;
}

// Sélectionne le formulaire avec la classe "inner-modal-form".
const form = document.querySelector(".inner-modal-form");

// Ajoute un écouteur d'événements "submit" au formulaire.
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  // Crée un objet "FormData" à partir du formulaire.
  const formData = new FormData(form);
  // Appelle la fonction "createWork" avec les données du formulaire.
  const work = await createWork(formData);
  // Ajoute la nouvelle œuvre au tableau "works".
  works.push(work);
  // Met à jour l'affichage des œuvres.
  createWorks(works);
  // Met à jour l'affichage de la galerie modale.
  createModalGallery();
  // Vide le formulaire modal.
  clearModal();
});

// Sélectionne l'élément de sélection d'ID "category".
const categorySelect = document.getElementById("category");

// Effectue une requête pour récupérer la liste des catégories depuis une API.
fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    // Une fois que les catégories sont récupérées avec succès, les parcourt.
    categories.forEach((category) => {
      // Crée un élément "option" pour chaque catégorie.
      const option = document.createElement("option");
      // Définit la valeur de l'option avec l'ID de la catégorie.
      option.value = category.id;
      // Définit le texte de l'option avec le nom de la catégorie.
      option.textContent = category.name;
      // Ajoute l'option à la liste déroulante "categorySelect".
      categorySelect.appendChild(option);
    });
  })
  .catch((error) =>
    console.error("Erreur lors de la récupération des catégories :", error)
  );

// Écoute les changements de sélection dans la liste déroulante "categorySelect".
categorySelect.addEventListener("change", function () {
  // Vous pouvez accéder à la catégorie sélectionnée avec "categorySelect.value".
  // Par exemple, si vous souhaitez afficher la catégorie sélectionnée dans la console :
});
//Vérifications avant l'ajout de nouveaux travaux :

// Sélectionne des éléments HTML nécessaires pour les vérifications.
const fileTooBig = document.querySelector(".file-too-big");
const imagePreviewContainer = document.querySelector(".ajout-photo");
const image = new Image();
const workCategory = document.querySelector(".inner-modal-form #category");
const workTitle = document.querySelector(".inner-modal-form #title");
const workImage = document.getElementById("file");
const modalSubmit = document.querySelector(".add-work");

// Vérifie si la taille du fichier ne dépasse pas 4 Mo.
function validateFileSize(event) {
  const file = event.target.files[0];
  const maxFileSize = 4 * 1024 * 1024; // 4 Mo en octets

  if (file && file.size > maxFileSize) {
    // Affiche un message d'erreur si la taille du fichier est trop grande.
    fileTooBig.style.display = "block";
    event.target.value = "";
  } else {
    // Appelle la fonction "previewImage" si la taille du fichier est valide.
    previewImage();
  }
}

// Affiche une miniature de l'image sélectionnée dans la modale.
function previewImage() {
  const file = workImage.files[0];

  if (file.type.match("image.*")) {
    const reader = new FileReader();

    reader.addEventListener("load", function (event) {
      const imageUrl = event.target.result;

      image.addEventListener("load", function () {
        // Cache tous les enfants de "imagePreviewContainer".
        for (let child of imagePreviewContainer.children) {
          child.style.display = "none";
        }
        // Ajoute l'image à "imagePreviewContainer".
        imagePreviewContainer.appendChild(image);
      });

      image.src = imageUrl;
      image.style.width = "129px";
      image.style.height = "169px";
    });
    reader.readAsDataURL(file);
  }
}

// Crée un tableau d'éléments d'entrée pour les vérifications.
const inputs = [workCategory, workTitle, workImage];
for (let input of inputs) {
  // Ajoute un écouteur d'événements "input" pour chaque élément d'entrée.
  input.addEventListener("input", function () {
    // Appelle la fonction "validateInputs" pour vérifier les entrées.
    validateInputs();
  });
}

// Vérifie chaque champ d'entrée pour activer ou désactiver le bouton de soumission.
function validateInputs() {
  if (workImage.files[0] && Number(workCategory.value) && workTitle.value) {
    // Active le bouton de soumission si toutes les conditions sont remplies.
    modalSubmit.style.backgroundColor = "#1D6154";
  } else {
    // Désactive le bouton de soumission si l'une des conditions n'est pas remplie.
    modalSubmit.style.backgroundColor = "#A7A7A7";
  }
}

// Ferme la modale et la vide après la soumission d'un nouvel ajout.
function clearModal() {
  // Supprime l'image de l'aperçu.
  imagePreviewContainer.removeChild(image);
  // Affiche à nouveau tous les enfants de "imagePreviewContainer".
  for (let child of imagePreviewContainer.children) {
    child.style.display = "block";
  }
  // Masque le message d'erreur de taille de fichier.
  fileTooBig.style.display = "none";
  // Efface les champs du titre et de la catégorie.
  workTitle.value = "";
  workCategory.value = "";
  // Réinitialise la couleur du bouton de soumission.
  modalSubmit.style.backgroundColor = "#A7A7A7";
  // Masque le formulaire modal.
  form.style.display = "none";
  // Affiche à nouveau la modale principale.
  document.getElementById("modal").style.display = "block";
}

// Affiche le mode édition uniquement pour un utilisateur connecté.
function checkToken() {
  const token = sessionStorage.getItem("token");
  if (token) {
    // Active le mode édition.
    activateEditionMode();
  }
}

// Active le mode édition.
function activateEditionMode() {
  // Affiche le lien de déconnexion.
  const logoutLink = document.getElementById("logout-link");
  logoutLink.style.display = "block";
  logoutLink.addEventListener("click", logout);

  // Supprime la classe "edition-mod" de tous les éléments avec cette classe.
  document.querySelectorAll(".edition-mod").forEach((element) => {
    element.classList.remove("edition-mod");
  });

  // Masque le lien de connexion.
  document.getElementById("login-link").style.display = "none";
  // Affiche le logo d'introduction.
  document.querySelector(".intro-logo").style.display = "block";
  // Masque la section des catégories.
  document.querySelector(".categories").style.display = "none";
}

// Déconnecte l'utilisateur en supprimant le token de la session et redirige vers la page d'accueil.
function logout() {
  sessionStorage.removeItem("token");
  window.location = "index.html";
}