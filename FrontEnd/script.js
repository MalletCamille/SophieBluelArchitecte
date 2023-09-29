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
    if (token) {
        const modifyButton = document.querySelector(".modify_button");
        const containerButtons = document.querySelector(".buttons__container");
        const blackBand = document.querySelector(".black_band")
        const buttonFilters = document.createElement("button");
        const loginNav = document.querySelector("#nav-login");
        loginNav.innerText="logout";
        containerButtons.classList.add("display_none");
        loginNav.addEventListener("click", logout);
        loginNav.innerText="logout";
        blackBand.classList.remove("display_none");
        buttonFilters.classList.add("display_none");
        modifyButton.classList.remove("display_none");
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



