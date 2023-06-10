document.addEventListener("DOMContentLoaded", function () {
  // * Variables
  const TOKEN = localStorage.getItem("token");
  const BASE_URL = "http://localhost:5678/api/";

  let modal = null;
  const focusableSelector = "button, a, input, textarea";
  let focusables = [];

  let works = null;

  // * Initialisation des données
  fetch(`${BASE_URL}works`)
    .then((response) => response.json())
    .then((json) => {
      works = json;
      displayGalleryElements(works);
    });

  const openModal = function (event) {
    event.preventDefault();
    modal = document.querySelector(event.target.getAttribute("href"));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    focusables[0].focus();
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", true);
    modal.addEventListener("click", closeModal);
    modal.querySelector(".close").addEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-stop")
      .addEventListener("click", stopPropagation);
  };

  const closeModal = function (event) {
    if (modal === null) return;
    event.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", true);
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".close").removeEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-stop")
      .removeEventListener("click", stopPropagation);
    modal = null;
  };

  const stopPropagation = function (event) {
    event.stopPropagation();
  };

  const focusInModal = function (event) {
    event.preventDefault();
    let index = focusables.findIndex(
      (f) => f === modal.querySelector(":focus")
    );
    index++;
    if (index >= focusables.length) {
      index = 0;
    }
    focusables[index].focus();
  };

  document.querySelectorAll(".js-modal").forEach((a) => {
    a.addEventListener("click", openModal);
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.key === "Esc") {
      closeModal(event);
    }
    if (event.key === "Tab" && modal !== null) {
      focusInModal(event);
    }
  });

  /************** Gestion de la galerie ****************/
  const gallery = document.querySelector(".modal-gallery");

  // * Affiche les travaux dans la galerie
  const displayGalleryElements = (data) => {
    // * On supprime les travaux de la galerie, pour ajouter les nouvelles valeurs
    gallery.innerHTML = "";

    data.forEach((element) => {
      // * On crée la structure html de chaque travail
      let workCard = document.createElement("figure");
      let workImage = document.createElement("img");
      let workTitle = document.createElement("p");
      let deleteWorkButton = document.createElement("button");

      // * Image du travail
      workImage.src = element.imageUrl;
      workImage.alt = element.title;

      workTitle.innerText = element.title;

      workCard.dataset.category = element.category.name;
      workCard.className = "workCard";

      // * Bouton de suppression du travail
      deleteWorkButton.classList.add("js-delete");
      deleteWorkButton.dataset.id = element.id;
      deleteWorkButton.innerText = "Supprimer";
      deleteWorkButton.addEventListener("click", handlerDeleteButton);

      // * On met à jour la structure HTML dans le DOM
      gallery.appendChild(workCard);
      workCard.append(workImage, workTitle, deleteWorkButton);
    });
  };

  // * Comportement: Au clique sur le bouton supprimer, le travail en question sera supprimer et l'affichage sera mis à jour
  const handlerDeleteButton = (e) => {
    deleteWork(e.target.dataset.id);
  };

  // * Comportement : On supprime le travail via l'id fourni, dès qu'une réponse valide est retourner, l'affichage sera mis à jour
  const deleteWork = (id) => {
    fetch(`${BASE_URL}works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // * Mis à jour de l'affichage de la galerie
          works = works.filter((w) => w.id != id);
          displayGalleryElements(works);
        }
      })
      .catch((err) => console.error("Error : " + err));
  };
});
