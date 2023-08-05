/*********************** GET TOKEN *******************/

const TOKEN = localStorage.getItem("token");

/*********************** API URL *******************/

const URL = "http://localhost:5678/api";

/*********************** MAIN PAGE *******************/

const LOGBTN = document.querySelector(".logInOut");

/*********************** MODAL GALLERY *******************/

const GALLERY = document.querySelector(".gallery");
const MODALGALLERY = document.querySelector(".modal-gallery");
const MODALTITLE = document.querySelector(".gallery-title");
const HRGALLERY = document.querySelector(".hr-gallery");
const ADDPICS = document.querySelector(".add-pictures");
const DELETEGALLERY = document.querySelector(".delete-gallery");

/*********************** MODAL FORM  *******************/

const MODALFORM = document.querySelector(".modal-form");
const BACKARROW = document.querySelector(".back");

const LOGOIMG = document.querySelector(".logo-img");
const BTNSPAN = document.querySelector(".btn-span");
const PFORMAT = document.querySelector(".p-format");

const INPUTIMG = document.querySelector(".input-img");
const NEWIMG = document.querySelector(".new-work-img");
const TITLEINPUT = document.querySelector(".input-title");
const CATEGORYSELECT = document.querySelector(".select-category");

const VALIDATEBUTTON = document.querySelector(".validate");

const INPUTS = [INPUTIMG, TITLEINPUT, CATEGORYSELECT];

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
  GALLERY.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const article = works[i];
    const sectionGallery = GALLERY;
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

/*********************** LOGGED OUT *******************/

if (!TOKEN) {
  const boutonTous = document.querySelector(".all");

  boutonTous.addEventListener("click", function () {
    const tousFiltered = works.filter(function (work) {
      return work;
    });
    GALLERY.innerHTML = "";
    genererWorks(tousFiltered);
  });

  const boutonObjets = document.querySelector(".objects");

  boutonObjets.addEventListener("click", function () {
    const objetsFiltered = works.filter(function (work) {
      return work.category.name === "Objets";
    });
    GALLERY.innerHTML = "";
    genererWorks(objetsFiltered);
  });
  const boutonAppartements = document.querySelector(".appartements");

  boutonAppartements.addEventListener("click", function () {
    const appartementsFiltered = works.filter(function (work) {
      return work.category.name === "Appartements";
    });
    GALLERY.innerHTML = "";
    genererWorks(appartementsFiltered);
  });

  const boutonHotels = document.querySelector(".hotels");

  boutonHotels.addEventListener("click", function () {
    const hotelsFiltered = works.filter(function (work) {
      return work.category.name === "Hotels & restaurants";
    });
    GALLERY.innerHTML = "";
    genererWorks(hotelsFiltered);
  });

  LOGBTN.innerText = "login";
}

const removeToken = () => {
  localStorage.removeItem("token");
};

/*********************** LOGGED *******************/

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

  LOGBTN.addEventListener("click", removeToken);
  LOGBTN.innerText = "logout";
}

/*********************** GENERATE MODAL WORKS *******************/

function genererWorksModal(works) {
  MODALFORM.style.display = "none";
  BACKARROW.style.visibility = "hidden";
  MODALTITLE.innerText = "Galerie photo";
  MODALGALLERY.style.display = null;
  HRGALLERY.style.display = null;
  ADDPICS.style.display = null;
  DELETEGALLERY.style.display = null;

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
  const id = event.target.dataset.id;

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

const displayGallery = () => {
  MODALFORM.style.display = "none";
  BACKARROW.style.visibility = "hidden";
  VALIDATEBUTTON.style.display = "none";
  MODALGALLERY.style.display = null;
  HRGALLERY.style.display = null;
  ADDPICS.style.display = null;
  DELETEGALLERY.style.display = null;
};

BACKARROW.addEventListener("click", displayGallery);

INPUTS.forEach((input) => {
  input.addEventListener("input", () => {
    const noEmptyInput = INPUTS.every((input) => input.value !== "");
    if (noEmptyInput) {
      VALIDATEBUTTON.style.backgroundColor = "#1D6154";
      VALIDATEBUTTON.style.cursor = "pointer";
    } else {
      VALIDATEBUTTON.style.backgroundColor = "#BFBFBF";
      VALIDATEBUTTON.style.cursor = "not-allowed";
    }
  });
});

ADDPICS.addEventListener("click", () => {
  VALIDATEBUTTON.style.backgroundColor = "#BFBFBF";
  LOGOIMG.style.visibility = null;
  BTNSPAN.style.visibility = null;
  PFORMAT.style.visibility = null;
  INPUTIMG.value = "";
  NEWIMG.setAttribute("src", "");
  NEWIMG.style.visibility = "hidden";
  TITLEINPUT.value = "";
  CATEGORYSELECT.value = "";
  MODALGALLERY.style.display = "none";
  ADDPICS.style.display = "none";
  HRGALLERY.style.display = "none";
  DELETEGALLERY.style.display = "none";
  BACKARROW.style.visibility = null;
  MODALTITLE.innerText = "Ajout photo";
  MODALFORM.style.display = null;
  VALIDATEBUTTON.style.display = null;
});

/*********************** UPLOAD IMAGE IN INPUT FIELD *******************/

INPUTIMG.addEventListener("change", uploadImg);

function uploadImg() {
  let upload_image = "";
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    upload_image = reader.result;

    NEWIMG.style.visibility = "unset";
    LOGOIMG.style.visibility = "hidden";
    BTNSPAN.style.visibility = "hidden";
    PFORMAT.style.visibility = "hidden";
    NEWIMG.setAttribute("src", `${upload_image}`);
  });

  reader.readAsDataURL(this.files[0]);
}

/*********************** ADD A NEW WORK *******************/

const addNewWork = () => {
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

let errorMessage = document.createElement("span");
errorMessage.classList.add("alert");
errorMessage.textContent = "Ce champ est requis";

INPUTS.forEach((input) => {
  input.addEventListener("focusout", function (e) {
    const inputValue = e.target.value;
    inputValue.trim();
    if (inputValue === "") {
      input.parentNode.insertBefore(errorMessage, input.nextSibling);
      input.style.outline = "1px solid rgba(255, 0, 0, 0.9)";
    } else {
      errorMessage.remove();
      input.style.outline = "none";
    }
  });
});
