/*********************** GET TOKEN *******************/

const TOKEN = localStorage.getItem("token");

/*********************** GET WORKS *******************/

let works = null;
fetch("http://localhost:5678/api/works")
  .then((r) => r.json())
  .then((json) => {
    works = json;
    genererWorksModal(works);
  });

/*********************** GET WORKS CATEGORIES *******************/

let categoriesIds = [];
fetch("http://localhost:5678/api/categories")
  .then((r) => r.json())
  .then((json) => json.map((c) => categoriesIds.push(c.id)));

/*********************** MODAL OPEN / CLOSE *******************/

const FOCUSABLESSELECTOR = "button, a, input, textarea";
let focusables = [];

const openModal = function (event) {
  event.preventDefault();
  modal = document.querySelector(event.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(FOCUSABLESSELECTOR));
  focusables[0].focus();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", true);
  modal.addEventListener("click", closeModal);
  modal.querySelector(".close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
  let body = document.querySelector("body");
  body.style.overflow = "hidden";
};

const closeModal = function (event) {
  if (modal === null) return;
  event.preventDefault();
  modal.style.display = "none";
  let body = document.querySelector("body");
  body.style.overflow = null;
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
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
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

/*********************** DELETE A WORK *******************/

const deleteWork = function (event) {
  const id = event.target.dataset.id;

  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  }).then((Response) => {
    if (Response.ok) {
      works = works.filter((w) => w.id != id);
      genererWorksModal(works);
    }
  });
};

/*********************** GENERATE MODAL WORKS *******************/

function genererWorksModal(works) {
  document.querySelector(".modal-gallery").innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const article = works[i];
    const sectionGallery = document.querySelector(".modal-gallery");

    const workElement = document.createElement("figure");
    workElement.dataset.id = works[i].id;
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    const buttonElement = document.createElement("p");
    buttonElement.innerText = "éditer";
    const deleteElement = document.createElement("button");
    deleteElement.classList.add("js-delete");
    deleteElement.dataset.id = works[i].id;
    deleteElement.innerText = "supprimer";
    deleteElement.addEventListener("click", deleteWork);

    sectionGallery.appendChild(workElement);

    workElement.appendChild(imageElement);
    workElement.appendChild(buttonElement);
    workElement.appendChild(deleteElement);
  }
}

/*********************** ADD NEW WORK FORM *******************/

function modalForm() {
  document.querySelector(".modal-wrapper").innerHTML = "";
  const sectionGallery = document.querySelector(".modal-wrapper");

  const container = document.createElement("div");
  container.classList.add("container");

  const titleFormModal = document.createElement("h2");
  titleFormModal.innerText = "Ajout photo";

  // FORM

  const formElement = document.createElement("form");
  formElement.classList.add("row");

  //IMAGE ELEMENT

  const inputImage = document.createElement("input");
  inputImage.type = "file";
  inputImage.name = "image";

  // TITLE ELEMENT

  //label
  const labelTitleElement = document.createElement("label");
  labelTitleElement.innerText = "Titre";

  //input
  const titleElement = document.createElement("input");
  titleElement.name = "title";
  titleElement.type = "text";

  // CATEGORY ELEMENT

  //label
  const labelElement = document.createElement("label");
  labelElement.innerText = "Catégorie";

  //dropdown
  const categoryElement = document.createElement("select");
  categoryElement.name = "category";
  const option1 = document.createElement("option");
  option1.value = categoriesIds[0];
  option1.innerText = "Objets";

  const option2 = document.createElement("option");
  option2.value = categoriesIds[1];
  option2.innerText = "Appartements";

  const option3 = document.createElement("option");
  option3.value = categoriesIds[2];
  option3.innerText = "Hotels & restaurants";

  // BUTTON ELEMENT

  const validateButton = document.createElement("button");
  validateButton.classList.add("validate");
  validateButton.innerText = "valider";
  validateButton.type = "button";
  validateButton.addEventListener("click", addNewWork);

  sectionGallery.appendChild(titleFormModal);
  sectionGallery.appendChild(container);
  container.appendChild(formElement);
  formElement.appendChild(inputImage);
  formElement.appendChild(labelTitleElement);
  formElement.appendChild(titleElement);
  formElement.appendChild(labelElement);
  formElement.appendChild(categoryElement);
  categoryElement.appendChild(option1);
  categoryElement.appendChild(option2);
  categoryElement.appendChild(option3);
  formElement.appendChild(validateButton);
}

/* au click sur "ajouter une photo" */

const ADDPICS = document.querySelector(".add-pictures");

ADDPICS.addEventListener("click", () => {
  modalForm();
  document.querySelector(".add-pictures").style.display = "none";
  document.querySelector(".validate").style.display = null;
});

/*********************** ADD A NEW WORK *******************/

const addNewWork = () => {
  const formElement = document.querySelector("form");
  const formData = new FormData(formElement);

  console.log("form", formData);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      accept: "multipart/form-data",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: formData,
  }).then((Response) => {
    if (Response.ok) {
      console.log("Response", Response);
      genererWorksModal(works);
    }
  });
};
