const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

let token = localStorage.getItem("token");

function genererWorks(works) {
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
}

genererWorks(works);

if (!token) {
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

  let loginNav = document.querySelector(".admin");
  loginNav.style.display = null;

  let logoutNav = document.querySelector(".admin");
  logoutNav.style.display = "none";
}

if (token) {
  let filters = document.querySelector(".filters");
  filters.style.display = "none";

  let modifierButton = document.querySelector(".js-modal");
  modifierButton.style.display = null;

  let adminNav = document.querySelector(".admin");
  adminNav.style.display = null;

  let loginNav = document.querySelector(".login");
  loginNav.style.display = "none";

  let logoutNav = document.querySelector(".logout");
  logoutNav.style.display = null;
  logoutNav.addEventListener("click", (token = null));
}

// const buttons = document.querySelectorAll('.button-filter');

// let value;
// buttons.forEach((v) => {
//   v.addEventListener('click', () => {
//     value = works.filter((w) => {

//       if(typeof w.category.name !== "undefined") {
//         return w.category.name === v.dataset.name
//       }

//       return w;
//     });
//   });
// });
