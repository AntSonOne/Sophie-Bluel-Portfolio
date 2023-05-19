let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []


const openModal = function(event){
    event.preventDefault()
    modal = document.querySelector(event.target.getAttribute('href'));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    focusables[0].focus();
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', true);
    modal.addEventListener('click', closeModal);
    modal.querySelector('.close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function(event){
    if (modal === null) return
    event.preventDefault()
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', true);
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null;
}

const stopPropagation = function(event){
    event.stopPropagation();
}

const focusInModal = function(event){
    event.preventDefault();
    let index = focusables.findIndex(f => f ===  modal.querySelector(':focus'))
    index++
    if (index >= focusables.length){
        index = 0
    }
    focusables[index].focus()
}

document.querySelectorAll('.js-modal').forEach( a => {
    a.addEventListener("click", openModal)
});

window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        closeModal(event)
    }
    if (event.key === 'Tab' && modal !== null) {
        focusInModal(event)
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
