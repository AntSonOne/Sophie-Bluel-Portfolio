const TOKEN = window.localStorage.getItem("token");
const TOKENLENGTH = 143;

function ajoutListenerLogin() {
  const formulaireLogin = document.querySelector(".login");
  formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    const login = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };

    const chargeUtile = JSON.stringify(login);

    const reponse = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    })
      .then((response) => response.json())
      .then(function (data) {
        const accessToken = data.token;
        if (accessToken && accessToken.length === TOKENLENGTH) {
          window.localStorage.setItem("token", accessToken);
          location.replace("user.html");
        } else {
          alert("Erreur dans l’identifiant ou le mot de passe");
        }
      });
  });
}

ajoutListenerLogin();

console.log(TOKEN.length, TOKENLENGTH);

if (
  window.location.pathname.includes("user.html") &&
  TOKEN.length !== TOKENLENGTH
) {
  location.replace("index.html");
}
