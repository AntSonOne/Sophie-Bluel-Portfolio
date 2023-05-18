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