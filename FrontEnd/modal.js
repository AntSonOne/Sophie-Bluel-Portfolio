let modal = null


const openModal = function(event){
    event.preventDefault()
    const target = document.querySelector(event.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', true);
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function(event){
    if (modal === null) return
    event.preventDefault()
    modal.style.display = 'none';
    target.setAttribute('aria-hidden', true);
    target.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null;
}

const stopPropagation = function(event){
    event.stopPropagation();
}

document.querySelectorAll('.js-modal').forEach( a => {
    a.addEventListener("click", openModal)
});

window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        closeModal(event)
    }
});

const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();


function genererWorksModal(works){
  for (let i = 0; i < works.length; i++) {

    const article = works[i]
    const sectionGallery = document.querySelector(".modal-gallery");
    const workElement = document.createElement("figure");
    workElement.dataset.id = works[i].id;
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    const buttonElement = document.createElement("button");
    buttonElement.innerText = "éditer";

    sectionGallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(buttonElement);
  }
};

genererWorksModal(works);
