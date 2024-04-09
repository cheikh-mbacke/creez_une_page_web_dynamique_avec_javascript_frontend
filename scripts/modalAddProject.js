const API_CATEGORIES = "http://localhost:5678/api/categories";

// Récupération du bouton "Ajouter une photo" présent sur modalDeleteProject"
const addProjectButton = document.getElementById("add-project-button");
// Récupération du bouton <- de la modal 2
const backButton = document.getElementById("back-button");
// Récupération du bouton "+ Ajouter une photo"

// Se déplacer vers la modal 2 en clickant sur le bouton "Ajouter une photo" présent sur la modal 1
addProjectButton.addEventListener("click", function () {
  modalContainer.style.display = "none";
  modalUploadProjectContainer.style.display = "flex";
});

// Revenir sur la modal 1 en utilisant le bouton <- ça change le display de la modal 2 en none la 1 en flex
backButton.addEventListener("click", function () {
  modalContainer.style.display = "flex";
  modalUploadProjectContainer.style.display = "none";
});

// -----Création d'une miniature lorsque l'on choisi l'image à upload-----
const projectPictureInput = document.getElementById("project-picture-input");
const dropProjectContainer = document.getElementById("drop-project-container");

projectPictureInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
    // Cacher les balises enfants de dropProjectContainer si un fichier est sélectionné
    dropProjectContainer.childNodes.forEach((child) => {
      if (child.nodeType === 1) {
        child.style.display = "none";
      }
    });

    // Créer un objet FileReader pour lire le contenu du fichier
    const reader = new FileReader();

    reader.onload = function (e) {
      const thumbnailImage = document.createElement("img");
      thumbnailImage.src = e.target.result;
      thumbnailImage.alt = "Thumbnail";
      thumbnailImage.classList.add("thumbnail-image");

      // Appliquer les styles à l'aperçu de l'image pour qu'il rentre dans le container drop-project-container
      thumbnailImage.style.maxHeight = "100%";
      thumbnailImage.style.width = "auto";

      // Ajouter l'aperçu de l'image dans le container
      dropProjectContainer.appendChild(thumbnailImage);
    };

    // Charger le contenu du fichier en tant que Data URL
    reader.readAsDataURL(file);
  }
});

//-----Récupération des catégories dans la modal 2-----
const categorySelect = document.getElementById("modal-photo-category");
// Fonction asynchrone pour récupérer les catégories depuis l'API
async function getCategories() {
  try {
    const response = await fetch(API_CATEGORIES);

    if (!response.ok) {
      throw new Error("Échec de la récupération des catégories.");
    }

    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error(error);
  }
}
// Charger les catégories et les ajouter à la liste déroulante
async function loadCategories() {
  try {
    const categories = await getCategories();

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.text = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}
loadCategories();

// -----Vérification des conditions requises afin d'upload une photo-----
// Selection de l'input file permettant de choisir l'image à upload
const thumbnailImage = document.getElementById("project-picture-input");
// Selection de l'input texte pour le titre
const pictureTitle = document.getElementById("picture-title");
// Sélection du bouton Valider
const confirmButton = document.getElementById("confirm-button");
// Fonction afin de check si les conditions sont requises afin de débloquer le bouton Valider et de l'afficher en couleur verte
function checkConfirmationButton(event) {
  // Empêcher la soumission du formulaire par défaut
  event.preventDefault();
  const selectedCategory = categorySelect.options[categorySelect.selectedIndex];

  const isSubmitButtonValid =
    pictureTitle.value.length > 1 &&
    selectedCategory.value !== "-1" &&
    thumbnailImage.value;
  // Vérification des conditions

  if (isSubmitButtonValid) {
    // Si les conditions sont validées, alors le bouton n'est plus en disabled
    confirmButton.disabled = false;

    return true;
  } else {
    confirmButton.disabled = true;

    return false;
  }
}
thumbnailImage.addEventListener("input", function (event) {
  checkConfirmationButton(event);
});
pictureTitle.addEventListener("input", function (event) {
  checkConfirmationButton(event);
});
categorySelect.addEventListener("change", function (event) {
  checkConfirmationButton(event);
});

// Ajouter un événement de clic pour le bouton Valider
confirmButton.addEventListener("click", function (event) {
  const canSubmit = checkConfirmationButton(event);
  if (canSubmit) {
    // Si les conditions sont remplies, appeler la fonction addProject
    addProject();
  }
});

// ----------Ajouter des projets----------
async function addProject() {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("image", thumbnailImage.files[0]);
  formData.append("title", pictureTitle.value);
  formData.append("category", categorySelect.value);

  try {
    const response = await fetch(API_WORKS, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Erreur lors de l'ajout du projet. Code HTTP ${response.status}`
      );
    }

    const work = await response.json();

    // Création et ajout du nouveau projet à la galerie
    const figure = AddProjectToPage(work);
    const gallery = document.querySelector(".gallery");
    gallery.appendChild(figure);

    // Création et ajout du nouveau projet à la galerie modale
    const result = AddProjectToModal(work);

    const galleryModal = document.getElementById("modal-gallery");

    galleryModal.appendChild(result.figure);

    alert("Le nouveau projet a été ajouté avec succès.");
    closeModal(modalUploadProjectContainer);
  } catch (error) {
    console.error("Erreur catch:", error);
    if (error.response) {
      console.error("Réponse du serveur:", await error.response.json());
    }
  }
}
