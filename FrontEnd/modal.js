let works = null;
const worksResponse = await fetch("http://localhost:5678/api/works");
works = await worksResponse.json();

const token = localStorage.getItem("token");
const focusableSelector = "button, a, input, textarea";
let focusables = [];
// const deleteButton = document.querySelectorAll(".modal-gallery figure button");

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

  {
    fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(window.preventDefault())
      .then((Response) => {
        if (Response.ok) {
          window.preventDefault();
          genererWorksModal(works);
        }
      });
  }
};

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

genererWorksModal(works);

/*********************** ADD A NEW WORK *******************/

const addPics = document.querySelector(".add-pictures");

addPics.addEventListener("click", function () {
  document.querySelector(".modal-gallery").innerHTML = "";
  modalForm();
  document.querySelector(".add-pictures").style.display = "none";
  document.querySelector(".validate").style.display = null;
});

function modalForm() {
  const sectionGallery = document.querySelector(".modal-gallery");
  const formElement = document.createElement("form");

  const inputImage = document.createElement("input");
  inputImage.type = "file";

  const captionElement = document.createElement("label");
  captionElement.innerText = "Titre";
  const titleElement = document.createElement("input");
  titleElement.type = "text";
  const labelElement = document.createElement("label");
  labelElement.innerText = "Catégorie";
  const categoryElement = document.createElement("input");
  categoryElement.type = "dropdown";

  sectionGallery.appendChild(formElement);
  formElement.appendChild(inputImage);
  formElement.appendChild(captionElement);
  formElement.appendChild(titleElement);
  formElement.appendChild(labelElement);
  formElement.appendChild(categoryElement);
}
// const boutonObjets = document.querySelector(".objects");

// boutonObjets.addEventListener("click", function () {
//   const objetsFiltered = works.filter(function (work) {
//     return work.category.name === "Objets";
//   });
//   document.querySelector(".gallery").innerHTML = "";
//   genererWorks(objetsFiltered);
// });
