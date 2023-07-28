/*********************** GET TOKEN *******************/

const TOKEN = localStorage.getItem("token");

/*********************** API URL *******************/

const URL = "http://localhost:5678/api";

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
  modal.querySelector(".back").addEventListener("click", openModal);
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

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

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
  document.querySelector(".modal-form").innerHTML = "";
  document.querySelector(".modal-gallery").innerHTML = "";
  document.querySelector(".gallery-title").innerText = "Galerie photo";
  document.querySelector(".add-pictures").style.display = null;
  document.querySelector(".delete-gallery").style.display = null;
  document.querySelector(".back").style.visibility = "hidden";
  document.querySelector(".validate").style.display = "none";

  for (let i = 0; i < works.length; i++) {
    const article = works[i];
    const sectionGallery = document.querySelector(".modal-gallery");

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
    deleteElement.innerHTML = '<i class="fa-solid fa-trash-can">' + "</i>";
    deleteElement.addEventListener("click", deleteWork);

    sectionGallery.appendChild(workElement);

    workElement.appendChild(imageElement);
    workElement.appendChild(buttonElement);
    workElement.appendChild(deleteElement);
  }
}

/*********************** DELETE A WORK *******************/

const deleteWork = (event) => {
  // const id = event.target.tagName === "I" ? event.target.parentNode.dataset.id : event.target.dataset.id;
  const id = event.target.dataset.id;

  fetch(`${URL}/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  }).then((Response) => {
    if (Response.ok) {
      works = works.filter((w) => w.id != id);
      genererWorksModal(works);
      genererWorks(works);
    }
  });
};

/*********************** ADD NEW WORK FORM *******************/

function modalForm() {
  document.querySelector(".modal-gallery").innerHTML = "";
  document.querySelector(".gallery-title").innerHTML = "";
  document.querySelector(".back").style.visibility = null;
  document.querySelector(".gallery-title").innerText = "Ajout photo";

  const sectionGallery = document.querySelector(".modal-form");

  const container = document.createElement("div");
  container.classList.add("container");

  // FORM

  const formElement = document.createElement("form");
  formElement.classList.add("row");

  //IMAGE ELEMENT
  const div1 = document.createElement("div");
  const logoImg = document.createElement("i");
  logoImg.classList.add("logo-img");
  logoImg.classList.add("fa-regular");
  logoImg.classList.add("fa-image");
  const btnAddPic = document.createElement("span");
  btnAddPic.classList.add("btn-span");
  btnAddPic.innerText = "+ Ajouter photo";
  const pFormat = document.createElement("p");
  pFormat.classList.add("p-format");
  pFormat.innerText = "jpg, png : 4mo max";
  const newWorkImg = document.createElement("img");
  newWorkImg.classList.add("new-work-img");
  newWorkImg.style.visibility = "hidden";
  const labelImage = document.createElement("label");
  labelImage.classList.add("custom-file-input");
  labelImage.for = "image";

  const inputImage = document.createElement("input");
  inputImage.type = "file";
  inputImage.name = "image";
  inputImage.id = "image";
  inputImage.addEventListener("change", uploadImg);

  // TITLE ELEMENT

  const div2 = document.createElement("div");
  //label
  const labelTitleElement = document.createElement("label");
  labelTitleElement.innerText = "Titre";

  //input
  const titleElement = document.createElement("input");
  titleElement.name = "title";
  titleElement.type = "text";

  // CATEGORY ELEMENT
  const div3 = document.createElement("div");

  //label
  const labelElement = document.createElement("label");
  labelElement.innerText = "Catégorie";

  //dropdown
  const categoryElement = document.createElement("select");
  categoryElement.classList.add("form-input");
  categoryElement.name = "category";

  const option0 = document.createElement("option");

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

  const validateButton = document.querySelector(".validate");
  validateButton.addEventListener("click", addNewWork);

  const inputs = [inputImage, titleElement, categoryElement];

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const noEmptyInput = inputs.every((input) => input.value !== "");
      if (noEmptyInput) {
        document.querySelector(".validate").style.backgroundColor = "#1D6154";
      } else {
        document.querySelector(".validate").style.backgroundColor = "#BFBFBF";
      }
    });
  });

  sectionGallery.appendChild(container);
  container.appendChild(formElement);
  formElement.appendChild(div1);
  div1.appendChild(labelImage);

  labelImage.appendChild(logoImg);
  labelImage.appendChild(btnAddPic);
  labelImage.appendChild(pFormat);
  labelImage.appendChild(inputImage);

  labelImage.appendChild(newWorkImg);
  formElement.appendChild(div2);
  div2.appendChild(labelTitleElement);
  formElement.appendChild(titleElement);
  formElement.appendChild(div3);
  div3.appendChild(labelElement);
  formElement.appendChild(categoryElement);
  categoryElement.appendChild(option0);
  categoryElement.appendChild(option1);
  categoryElement.appendChild(option2);
  categoryElement.appendChild(option3);
}
/* au click sur "ajouter une photo" */

const ADDPICS = document.querySelector(".add-pictures");

ADDPICS.addEventListener("click", () => {
  modalForm();
  document.querySelector(".add-pictures").style.display = "none";
  document.querySelector(".delete-gallery").style.display = "none";
  document.querySelector(".validate").style.display = null;
});

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
