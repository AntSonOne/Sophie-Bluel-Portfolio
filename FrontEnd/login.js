console.log('hello')

function ajoutListenerEnvoyerLogin() {
  const formulaireLogin = document.querySelector(".login");
  formulaireLogin.addEventListener("submit", function (event) {
  event.preventDefault();

  const login = {
      pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
      utilisateur: event.target.querySelector("[name=utilisateur]").value,
      commentaire: event.target.querySelector("[name=commentaire]").value,
      nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)
  };

  const chargeUtile = JSON.stringify(login);

  fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile
  });
  });
}

function login() {
  const formulaireLogin = document.querySelector(".login");
  formulaireLogin.addEventListener("submit", function (event) {
    if (condition) {
      return "Erreur dans l’identifiant ou le mot de passe"
    } else {
      // redirect home page as user
    }
  })
}

// fetch("/colis/livraison", {

//   "method": "POST",

//   "headers": { "Content-Type": "application/json" },

//   "body": /* ... */

// });
