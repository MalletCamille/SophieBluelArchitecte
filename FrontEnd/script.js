let works = [];
let categories = [];

// On récupère les projets depuis le Back-end //
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
    return works;
}

// On récupère les catégories de projet depuis le Back-end //
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    categories = await response.json();
    return categories;
}

function logout() {
    const loginNav = document.querySelector("#nav-login");
    sessionStorage.removeItem('token');
    loginNav.setAttribute("href","index.html")
}

// On appelle les fonctions au chargement du body dans le DOM //
document.body.onload = function () {
    createProjects();
    createFilters();
    buttonAll.addEventListener("click", buttonClicked);
    const loginNav = document.querySelector("#nav-login");
    const token = sessionStorage.getItem('token')
    const editorModify = document.querySelector(".editor_modify")
    const crossButtonStep1 = document.querySelector(".modal-step1_cross")
    const crossButtonStep2 = document.querySelector(".modal-step2_cross")
    const addImgButton = document.querySelector(".modal-step1_button")
    const arrowStep2 = document.querySelector(".modal-step2_arrow")
    if (token) {
        const modifyButton = document.querySelector(".modify_button");
        const containerButtons = document.querySelector(".buttons__container");
        const blackBand = document.querySelector(".black_band")
        const buttonFilters = document.createElement("button");
        loginNav.innerText="logout";
        containerButtons.classList.add("display_none");
        loginNav.addEventListener("click", logout);
        loginNav.innerText="logout";
        blackBand.classList.remove("display_none");
        buttonFilters.classList.add("display_none");
        modifyButton.classList.remove("display_none");
        editorModify.addEventListener("click", openModalstep1);
        crossButtonStep1.addEventListener("click", closeModal);
        crossButtonStep2.addEventListener("click", closeModa2);
        addImgButton.addEventListener("click", openModalStep2);
        arrowStep2.addEventListener("click", returnModalStep1)
    }
}



      
    


async function createProjects() {
    // Création dynamique des éléments de la page //
    const works = await getWorks();
    createProjectsCards(works);
}

async function createFilters () {
    const categories = await getCategories();
    let nbCategories = categories.length // On compte le nombre d'éléments dans le tableau categories //
    for (let i=0; i<nbCategories; i++) { 
        // On crée des boutons qui s'appuient sur les catégories que j'ai récupérées du Back-end //
        const buttonFilters = document.createElement("button");
        buttonFilters.classList.add("button__filters");
        buttonFilters.innerHTML=categories[i].name;
        const containerButtons = document.querySelector(".buttons__container");
        containerButtons.appendChild(buttonFilters);
        buttonFilters.addEventListener("click", buttonClicked);
    }
}



const buttonAll = document.querySelector(".button__filters");

 function buttonClicked (event) {
    // On retire la sélection actuelle //
	const buttonSelected = document.querySelector(".button--selected");
	buttonSelected.classList.remove('button--selected');
	// On sélectionne la nouvelle position //
	const updateButtonSelected = event.target;
	updateButtonSelected.classList.add("button--selected");

    // On supprime de l'affichage tous les projets //
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML="";
    // On réaffiche les projets qui correspondent à la catégorie du bouton filtre qui a été cliqué //
    let worksFiltered =  works.filter(function(work) {
        if (event.target.innerText === "Tous") {
            return true;
        }
        return work.category.name == event.target.innerText;
    });

    createProjectsCards(worksFiltered);
}  


function createProjectsCards(worksFiltered) {
    const gallery = document.querySelector(".gallery");
    let nbProjects = worksFiltered.length // On compte le nombre d'éléments dans le tableau worksFiltered //
    for (let i=0; i<nbProjects; i++) { 
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        image.setAttribute ("src",worksFiltered[i].imageUrl);
        image.setAttribute ("alt", worksFiltered[i].title);
        figcaption.innerHTML=worksFiltered[i].title;
        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }  
}

function openModalstep1() {
    const modalStep1 = document.querySelector(".container_modal-step1")
    modalStep1.classList.remove("display_none");
    manageWorks();
}    

function manageWorks() {
    const step1Gallery = document.querySelector(".modal-step1_gallery");
    let nbProjects = works.length // On compte le nombre d'éléments dans le tableau works //
    for (let i=0; i<nbProjects; i++) { 
        const image = document.createElement("img");
        step1Gallery.appendChild(image);
        image.setAttribute ("src",works[i].imageUrl);
        image.classList.add("gallery-editor_img");
    }
}

function closeModal() {
    const modalStep1 = document.querySelector(".container_modal-step1");
    modalStep1.classList.add("display_none");
}

function closeModa2() {
    const modalStep2 = document.querySelector(".container_modal-step2");
    modalStep2.classList.add("display_none");
}

function openModalStep2() {
    const modalStep1 = document.querySelector(".container_modal-step1");
    const modalStep2 = document.querySelector(".container_modal-step2");
    modalStep1.classList.add("display_none");
    modalStep2.classList.remove("display_none");
}

function returnModalStep1() {
    const modalStep1 = document.querySelector(".container_modal-step1");
    const modalStep2 = document.querySelector(".container_modal-step2");
    modalStep1.classList.remove("display_none");
    modalStep2.classList.add("display_none");
} 




