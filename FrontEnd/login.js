const TOKEN = window.localStorage.getItem("token");
const TOKENLENGTH = 143;

const login = () => {
  const formulaireLogin = document.querySelector(".login");
  formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    const login = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };

    const chargeUtile = JSON.stringify(login);

    await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    })
      .then((r) => r.json())
      .then((d) => {
        const accessToken = d.token;
        if (accessToken && accessToken.length === TOKENLENGTH) {
          window.localStorage.setItem("token", accessToken);
          location.replace("index.html");
        } else {
          alert("Erreur dans l’identifiant ou le mot de passe");
        }
      });
  });
};

login();

if (
  window.location.pathname.includes("index.html") &&
  TOKEN.length !== TOKENLENGTH
) {
  location.replace("index.html");
}
