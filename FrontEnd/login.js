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
      body: chargeUtile
    });

    if (reponse.status !== 200) {
      alert("Erreur dans l’identifiant ou le mot de passe");
    } else {
      location.replace("index.html");
    }
  });
};

ajoutListenerLogin()
