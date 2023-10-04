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

async function deleteWork(workId) {
    const token = sessionStorage.getItem('token')
    const response = await fetch("http://localhost:5678/api/works/" + workId, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    
}

async function sendNewWork(works) {
    const formData = new FormData();
    const token = sessionStorage.getItem('token');
    formData.append("title", works.titleProject);     
    formData.append("category", works.categoryProject);     
    formData.append("image", works.imgProject);
    const response = await fetch("http://localhost:5678/api/works/", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData       
    })
    if (response.status !== 201) {
        console.log(response.status);
    }   
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
        const addFile = document.querySelector(".content_file");
        const submitButton = document.querySelector("#submit_Project")
        loginNav.innerText="logout";
        containerButtons.classList.add("display_none");
        loginNav.addEventListener("click", logout);
        loginNav.innerText="logout";
        blackBand.classList.remove("display_none");
        buttonFilters.classList.add("display_none");
        modifyButton.classList.remove("display_none");
        editorModify.addEventListener("click", openModalstep1);
        crossButtonStep1.addEventListener("click", closeModalStep1);
        crossButtonStep2.addEventListener("click", closeModalStep2);
        addImgButton.addEventListener("click", openModalStep2);
        arrowStep2.addEventListener("click", returnModalStep1);
        addFile.addEventListener("click", addFileProject);
        submitButton.addEventListener("click", submitProject);
        integrationCategoryModalStep2();
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
    gallery.innerHTML = "";
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

async function manageWorks() {
    const works = await getWorks();
    const step1Gallery = document.querySelector(".modal-step1_gallery");
    step1Gallery.innerHTML = "";
    let nbProjects = works.length // On compte le nombre d'éléments dans le tableau works //
    for (let i=0; i<nbProjects; i++) { 
        const image = document.createElement("img");
        const containerImg = document.createElement("div");
        const trashCan = document.createElement("i");
        step1Gallery.appendChild(containerImg);
        containerImg.appendChild(trashCan);
        containerImg.appendChild(image);
        image.setAttribute ("src",works[i].imageUrl);
        image.classList.add("gallery-editor_img");
        containerImg.classList.add("container_imgstep1");
        trashCan.classList.add("trashcan", "fa-regular", "fa-trash-can");
        trashCan.addEventListener("click", trashcanClicked);
        trashCan.setAttribute("workID", works[i].id);
    }
}

function closeModalStep1() {
    const modalStep1 = document.querySelector(".container_modal-step1");
    modalStep1.classList.add("display_none");
}

function closeModalStep2() {
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

async function trashcanClicked(event) {
    const workId = event.target.getAttribute('workId');
    deleteWork(workId);
    // On supprime de l'affichage tous les projets //
    const galleryStep1 = document.querySelector(".modal-step1_gallery");
    galleryStep1.innerHTML="";
    manageWorks();
    createProjects();
}

function addFileProject() {
    const buttonFile = document.querySelector("#img_project");
    buttonFile.click();
}

document.addEventListener('DOMContentLoaded', function() {
    const formulaire = document.getElementById("formAddProjects");
    const submitButton = document.getElementById("submit_Project");
    const fieldsInput = document.querySelectorAll("#formAddProjects input");
    const fieldsSelect = document.querySelectorAll("#formAddProjects select");
    const contentFile = document.querySelector(".content_file")
    formulaire.addEventListener("input", function() {
        let completedFields = true;
        fieldsInput.forEach(function(input) {
            console.log(input.id, input.value);
            if (input.id === "img_project" && input.value) {
                let imgFileProject = document.querySelector(".img_file_project");
                imgFileProject.src = URL.createObjectURL(input.files[0]);
                contentFile.classList.add("display_none");
                imgFileProject.classList.remove("display_none");
            }    
            if (input.value.trim() ==="") {
                completedFields = false;
            }    
        });
        fieldsSelect.forEach(function(select) {
            console.log(select.id, select.value);
            if (select.value ==="") {
                completedFields = false;
            }
        });        
        if (completedFields) {
            submitButton.removeAttribute("disabled");
            submitButton.classList.remove("button_grey");
        } else {
            submitButton.setAttribute("disabled", "true");
        }
    });
});        


async function submitProject() {
    console.log("le bouton a été cliqué");
    const imgProject = document.querySelector("#img_project");
    const titleProject = document.querySelector("#title-work");
    const categoryProject = document.querySelector("#category_work");
    const form = document.querySelector("#formAddProjects");
    const contentFile = document.querySelector(".content_file")
    const submitButton = document.getElementById("submit_Project");
    let imgFileProject = document.querySelector(".img_file_project");
    const works =  {
        imgProject : imgProject.files[0],
        titleProject : titleProject.value,
        categoryProject : categoryProject.value
    }    
    await sendNewWork(works);
    closeModalStep2();
    createProjects();
    form.reset();
    contentFile.classList.remove("display_none");
    imgFileProject.classList.add("display_none");
    submitButton.setAttribute("disabled", "");
    submitButton.classList.add("button_grey");
}

async function integrationCategoryModalStep2 () {
    const categories = await getCategories();
    console.log(categories);
    const selectCategory = document.querySelector("#category_work")
    let nbCategories = categories.length // On compte le nombre de catégories //
    for (let i=0; i<nbCategories; i++) {    
        const option = document.createElement("option");
        selectCategory.appendChild(option);
        option.setAttribute("value", categories[i].id);
        option.innerHTML = categories[i].name;
    }
}    