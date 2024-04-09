// Stocke de l'URL de l'API sur une constante
const API_LOGIN =
  "https://creez-une-page-web-dynamique-avec.onrender.com/api/users/login";
// Deux types de message d'erreur
const INCORRECT_USER =
  "Identifiant ou mot de passe incorrect. Veuillez réessayer.";
// Recupération des champs/boutons du login menu
const form = document.getElementById("form-login");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessageElement = document.getElementById("error-message");

// événement sur submit du formulaire, en async car attente de réponse de l'API
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Empêcher le comportement par défaut du formulaire (rechargement de la page)
  // Récupération des valeurs pour les stocker dans les variables email et password
  const email = emailInput.value;
  const password = passwordInput.value;

  // Créer un objet avec les données à envoyer à l'API
  const data = {
    email: email,
    password: password,
  };

  // Réinitialiser le message d'erreur
  errorMessageElement.textContent = "";

  // Envoyer une requête POST à l'API avec la fonction fetch
  await fetch(API_LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    // gestion de la réponse de l'API, si OK, elle est convertie en JSON sinon un message d'erreur apparait
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401 || response.status === 404) {
        errorMessageElement.textContent = INCORRECT_USER;
      }
    })
    // si la réponse contient un token, alors il est stocké dans localStorage
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // redirection vers la page index
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error(error.message);
    });
});
