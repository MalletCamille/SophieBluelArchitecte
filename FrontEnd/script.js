// On récupère les projets depuis le Back-end //
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}

// On récupère les catégories de projet depuis le Back-end //
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
}

// On appelle les fonctions au chargement du body dans le DOM //
document.body.onload = function () {
    createProjects();
    createFilters();
    buttonFilters.addEventListener("click", buttonClicked);
}

async function createProjects() {
    // Récupération des éléments de la page //
    const gallery = document.querySelector(".gallery");
    // Création dynamique des éléments de la page //
    const works = await getWorks();
    let nbProjects = works.length // On compte le nombre d'éléments dans le tableau works //
    for (let i=0; i<nbProjects; i++) { 
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        image.setAttribute ("src",works[i].imageUrl);
        image.setAttribute ("alt", works[i].title);
        figcaption.innerHTML=works[i].title;
        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    } 
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
    }
}


/*
const buttonFilters = document.querySelector(".button__filters");

function buttonClicked () {
    buttonFilters.classList.add(".button--selected");
    console.log("j'ai cliqué")
    
}*/