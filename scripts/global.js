// Stocke de l'URL Works de l'API sur une constante
const API_WORKS = "http://localhost:5678/api/works";
// Stocke de l'URL Categories de l'API sur une constante

// Gestion de ce qui doit apparaitre sur index.html lorsque admin est log.

// récupération des balises par leurs ID (login, logout et les filtres)
const logout = document.getElementById("logout-button");
const login = document.getElementById("login-button");
const filters = document.getElementById("filters");
const modal = document.getElementById("modal");
const blackBar = document.getElementById("black-bar");
const modalButton = document.getElementById("js-button-modal");

// récupère le token du localStorage, s'il n'y en a pas alors null, sinon elle renvoie le token
function getToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  return token;
}
// cette fonction est appelée au chargement de la page, et utilise le token pour déterminer si l'utilisateur est connecté
// Si un token existe, alors cela masque le bouton "login", filtres et modale, sinon cela masque logout
function init() {
  const token = getToken();

  if (token) {
    // Lorsque l'on click sur logout, permet de supprimer le token stocké dans le localStorage et de recharger la page
    logout.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.reload();
    });
    login.style.display = "none";
    filters.style.display = "none";
  } else {
    logout.style.display = "none";
    blackBar.style.display = "none";
    modalButton.style.display = "none";
  }
}

init();

//Fonction permettant de générer les images
function AddProjectToPage(work) {
  const figure = document.createElement("figure");
  const figureCaption = document.createElement("figcaption");
  const figureImage = document.createElement("img");

  figureImage.src = work.imageUrl;
  figureImage.alt = work.title;
  figureCaption.innerHTML = work.title;
  figure.setAttribute("data-id", work.id);
  figure.setAttribute("category-id", work.categoryId);

  figure.appendChild(figureImage);
  figure.appendChild(figureCaption);

  return figure;
}
//Fonction permettant de générer les images sur la modal
function AddProjectToModal(work) {
  const figure = document.createElement("figure");
  const figureCaption = document.createElement("modal-figcaption");
  const figureImage = document.createElement("img");
  const deleteIcon = document.createElement("i");

  figureImage.classList.add("modal-image");
  figureImage.src = work.imageUrl;
  figureImage.alt = work.title;
  figure.setAttribute("data-id", work.id);
  deleteIcon.dataset.id = work.id;
  deleteIcon.className = "fa-regular fa-trash-can";

  figure.appendChild(figureImage);
  figure.appendChild(figureCaption);
  figure.appendChild(deleteIcon);

  return { figure, deleteIcon };
}
