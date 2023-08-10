let works;

/**
 * Fonction to create a figure element.
 * @param {string} imageURL - The URL of the image.
 * @param {string} title - The title of the image.
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
      <div class="modal-flex">     
        <figure data-id="${id} class="modal-flex">
          <div class="icon-flex">
            <i class="move fa-solid fa-arrows-up-down-left-right"></i>
            <i class="trash fa-solid fa-trash-can"></i>
          </div>
          <img src="${imageURL}" alt="${title}">
          <figcaption>éditer</figcaption>
        </figure>
      </div>
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
      addDeletionEvents();
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
}

async function deleteAndRenderWork() {
  const { id } = this.parentElement.parentElement.dataset;
  await deleteWork(id);
  document.querySelector(`.modal-gallery figure[data-id="${id}"]`).remove();
  document.querySelector(`.gallery figure[data-id="${id}"]`).remove();
}

function deleteAllWorks() {
  const deleteGallery = document.querySelector(".deleteGallery")
  deleteButton = addEventListener('click', () => {
    
  })
}
