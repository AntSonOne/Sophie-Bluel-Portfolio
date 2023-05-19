let modal = null


const openModal = function(event){
    event.preventDefault()
    const target = document.querySelector(event.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', true);
    modal = target;
    modal.addEventListener('click', closeModal)
}

const closeModal = function(event){
    if (modal === null) return
    event.preventDefault()
    modal.style.display = 'none';
    target.setAttribute('aria-hidden', true);
    target.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal)
    modal = null;
}

document.querySelectorAll('.js-modal').forEach( a => {
    a.addEventListener("click", openModal)
});

const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();


function genererWorksModale(works){
  for (let i = 0; i < works.length; i++) {

    const article = works[i]
    const sectionGallery = document.querySelector(".modal-gallery");
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

genererWorksModale(works);