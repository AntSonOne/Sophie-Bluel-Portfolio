/*********************** GET TOKEN *******************/

const TOKEN = localStorage.getItem("token");

/*********************** API URL *******************/

const URL = "http://localhost:5678/api";

/*********************** MODAL GALLERY *******************/

const MODALGALLERY = document.querySelector(".modal-gallery");

/*********************** MODAL FORM VALIDATE BUTTON *******************/

const VALIDATEBUTTON = document.querySelector(".validate");

/*********************** GET WORKS *******************/

let works = null;
function getWorks() {
  fetch(`${URL}/works`)
    .then((r) => r.json())
    .then((json) => {
      works = json;
      genererWorks(works);
    });
}
getWorks();

/*********************** GET WORKS CATEGORIES *******************/

let categoriesIds = [];
fetch(`${URL}/categories`)
  .then((r) => r.json())
  .then((json) => json.map((c) => categoriesIds.push(c.id)));

/*********************** GENERATE WORKS *******************/

const genererWorks = (works) => {
  document.querySelector(".gallery").innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const article = works[i];
    const sectionGallery = document.querySelector(".gallery");
    const workElement = document.createElement("figure");
    workElement.dataset.id = works[i].id;
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = article.title;

    sectionGallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(titleElement);
  }
};

/*********************** MODAL OPEN / CLOSE *******************/

const FOCUSABLESSELECTOR = "button, a, input, textarea";
let focusables = [];
let modal = null;

const openModal = (event) => {
  MODALGALLERY.innerHTML = "";
  genererWorksModal(works);

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
  document.querySelector("body").style.overflow = "hidden";
};

const closeModal = (event) => {
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
  document.querySelector("body").style.overflow = "unset";
};

const stopPropagation = (event) => {
  event.stopPropagation();
};

const focusInModal = (event) => {
  event.preventDefault();
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  index++;
  if (index >= focusables.length) {
    index = 0;
  }
  focusables[index].focus();
};

document.querySelector(".js-modal").addEventListener("click", openModal);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal(event);
  }
  if (event.key === "Tab" && modal !== null) {
    focusInModal(event);
  }
});

/*********************** WORK *******************/

if (!TOKEN) {
  const boutonTous = document.querySelector(".all");

  boutonTous.addEventListener("click", function () {
    const tousFiltered = works.filter(function (work) {
      return work;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(tousFiltered);
  });

  const boutonObjets = document.querySelector(".objects");

  boutonObjets.addEventListener("click", function () {
    const objetsFiltered = works.filter(function (work) {
      return work.category.name === "Objets";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(objetsFiltered);
  });
  const boutonAppartements = document.querySelector(".appartements");

  boutonAppartements.addEventListener("click", function () {
    const appartementsFiltered = works.filter(function (work) {
      return work.category.name === "Appartements";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(appartementsFiltered);
  });

  const boutonHotels = document.querySelector(".hotels");

  boutonHotels.addEventListener("click", function () {
    const hotelsFiltered = works.filter(function (work) {
      return work.category.name === "Hotels & restaurants";
    });
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(hotelsFiltered);
  });

  document.querySelector(".logInOut").innerText = "login";
}

let logoutNav = document.querySelector(".logInOut");
const removeToken = () => {
  localStorage.removeItem("token");
};

if (TOKEN) {
  let filters = document.querySelector(".filters");
  filters.style.display = "none";

  let modifierButton = document.querySelector(".modify");
  modifierButton.style.display = null;

  let modifierButton2 = document.querySelector(".modify2");
  modifierButton2.style.display = null;

  let modifierButtonModal = document.querySelector(".js-modal");
  modifierButtonModal.style.display = null;

  let adminNav = document.querySelector(".admin");
  adminNav.style.display = null;

  logoutNav.addEventListener("click", removeToken);
  document.querySelector(".logInOut").innerText = "logout";
}

/*********************** GENERATE MODAL WORKS *******************/

function genererWorksModal(works) {
  document.querySelector(".add-pictures").style.display = null;
  document.querySelector(".delete-gallery").style.display = null;
  document.querySelector(".hr-gallery").style.display = null;
  document.querySelector(".modal-form").style.display = "none";
  document.querySelector(".modal-gallery").style.display = null;
  document.querySelector(".gallery-title").innerText = "Galerie photo";

  for (let i = 0; i < works.length; i++) {
    const article = works[i];
    const sectionGallery = MODALGALLERY;

    const workElement = document.createElement("figure");
    workElement.classList.add("figure");
    workElement.dataset.id = works[i].id;
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    const buttonElement = document.createElement("p");
    buttonElement.innerText = "éditer";
    buttonElement.classList.add("edit");
    const deleteElement = document.createElement("button");
    deleteElement.classList.add("js-delete");
    deleteElement.dataset.id = works[i].id;
    deleteElement.innerHTML =
      '<i class="fa-solid fa-trash-can" style="pointer-events: none;">' +
      "</i>";
    deleteElement.addEventListener("click", deleteWork);

    sectionGallery.appendChild(workElement);

    workElement.appendChild(imageElement);
    workElement.appendChild(buttonElement);
    workElement.appendChild(deleteElement);
  }
}

/*********************** DELETE A WORK *******************/

const deleteWork = (event) => {
  const id =
    event.target.tagName === "I"
      ? event.target.parentNode.dataset.id
      : event.target.dataset.id;

  fetch(`${URL}/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  }).then((Response) => {
    if (Response.ok) {
      works = works.filter((w) => w.id != id);
      MODALGALLERY.innerHTML = "";
      genererWorksModal(works);
      genererWorks(works);
    }
  });
};

/*********************** ADD NEW WORK FORM *******************/

const ADDPICS = document.querySelector(".add-pictures");

const displayGallery = () => {
  MODALGALLERY.style.display = null;
  document.querySelector(".add-pictures").style.display = null;
  document.querySelector(".delete-gallery").style.display = null;
  document.querySelector(".hr-gallery").style.display = null;
  document.querySelector(".back").style.visibility = "hidden";
  VALIDATEBUTTON.style.display = "none";
  document.querySelector(".modal-form").style.display = "none";
};
const backBtn = document.querySelector(".back");
backBtn.addEventListener("click", displayGallery);

ADDPICS.addEventListener("click", () => {
  MODALGALLERY.style.display = "none";
  document.querySelector(".add-pictures").style.display = "none";
  document.querySelector(".hr-gallery").style.display = "none";
  document.querySelector(".delete-gallery").style.display = "none";
  backBtn.style.visibility = null;
  document.querySelector(".gallery-title").innerText = "Ajout photo";
  document.querySelector(".modal-form").style.display = null;
  VALIDATEBUTTON.style.display = null;
});

const inputImage = document.querySelector(".input-img");
inputImage.addEventListener("change", uploadImg);

const titleElement = document.querySelector(".input-title");
const categoryElement = document.querySelector(".form-input");

const inputs = [inputImage, titleElement, categoryElement];

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    const noEmptyInput = inputs.every((input) => input.value !== "");
    if (noEmptyInput) {
      VALIDATEBUTTON.style.backgroundColor = "#1D6154";
    } else {
      VALIDATEBUTTON.style.backgroundColor = "#BFBFBF";
    }
  });
});

// UPLOAD IMAGE IN INPUT FIELD

function uploadImg() {
  let upload_image = "";
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    upload_image = reader.result;
    const photo = document.querySelector(".new-work-img ");
    photo.style.visibility = "unset";
    photo.setAttribute("src", `${upload_image}`);
    document.querySelector(".logo-img").style.visibility = "hidden";
    document.querySelector(".btn-span").style.visibility = "hidden";
    document.querySelector(".p-format").style.visibility = "hidden";
  });

  reader.readAsDataURL(this.files[0]);
}

/*********************** ADD A NEW WORK *******************/

const addNewWork = () => {
  console.log("here I am");
  const formElement = document.querySelector("form");
  const formData = new FormData(formElement);

  fetch(`${URL}/works`, {
    method: "POST",
    headers: {
      accept: "multipart/form-data",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: formData,
  }).then((Response) => {
    if (Response.ok) {
      getWorks();
      genererWorks(works);
      alert("Votre nouveau travail a bien été créé !");
    } else {
      alert("Veuillez compléter tous les champs");
    }
  });
};

VALIDATEBUTTON.addEventListener("click", addNewWork);
