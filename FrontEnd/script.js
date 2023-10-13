let works = [];
let categories = [];
let loginNav;
const token = sessionStorage.getItem('token');
let containerButtons;
let submitButtonmodalStep2;
let modalStep1Container;
let modalStep2Container;
let formulaire;
let contentFile;
let imgFileProject; 

// On récupère les projets depuis le Back-end //
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
}

// On récupère les catégories de projet depuis le Back-end //
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    categories = await response.json();
}

// Cette fonction donne les instructions au Back lorsqu'une corbeille a été cliquée dans la modalStep2 //
async function deleteWork(workId) {
    await fetch("http://localhost:5678/api/works/" + workId, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    
}

async function sendNewWork(works) {
    const formData = new FormData();
    formData.append("title", works.titleProject);     
    formData.append("category", works.categoryProject);     
    formData.append("image", works.imgProject);
    await fetch("http://localhost:5678/api/works/", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData       
    })
}

// Cette fonction donne les instructions au click sur logout en mode édition //
function logout() {
    sessionStorage.removeItem('token');
    loginNav.setAttribute("href","index.html")
}

// On appelle les fonctions au chargement du body dans le DOM //
document.body.onload = async function () {
    containerButtons = document.querySelector(".buttons__container");
    loginNav = document.querySelector("#nav-login");
    modalStep1Container = document.querySelector(".container_modal-step1");
    modalStep2Container = document.querySelector(".container_modal-step2");
    formulaire = document.getElementById("formAddProjects");
    contentFile = document.querySelector(".content_file");
    imgFileProject = document.querySelector(".img_file_project");
    backgroundModalstep1 = document.querySelector(".container_modal-step1")
    backgroundModalstep2 = document.querySelector(".container_modal-step2")
    await getCategories();
    createProjects();
    createFilters();
    const buttonAll = document.querySelector(".button__filters");
    const editorModify = document.querySelector(".editor_modify")
    const crossButtonStep1 = document.querySelector(".modal-step1_cross")
    const crossButtonStep2 = document.querySelector(".modal-step2_cross")
    const addImgButton = document.querySelector(".modal-step1_button")
    const arrowStep2 = document.querySelector(".modal-step2_arrow")
    buttonAll.addEventListener("click", buttonClicked);
    if (token) {
        const modifyButton = document.querySelector(".modify_button");
        const blackBand = document.querySelector(".black_band")
        const addFile = document.querySelector(".content_file");
        submitButtonmodalStep2 = document.querySelector("#submit_Project")
        loginNav.innerText="logout";
        containerButtons.classList.add("display_none");
        blackBand.classList.remove("display_none");
        modifyButton.classList.remove("display_none");
        loginNav.addEventListener("click", logout);
        editorModify.addEventListener("click", openModalstep1);
        crossButtonStep1.addEventListener("click", closeModalStep1);
        crossButtonStep2.addEventListener("click", closeModalStep2);
        addImgButton.addEventListener("click", openModalStep2);
        arrowStep2.addEventListener("click", returnModalStep1);
        addFile.addEventListener("click", addFileProject);
        backgroundModalstep1.addEventListener("click", clickOutsideModal);
        backgroundModalstep2.addEventListener("click", clickOutsideModal);
        submitButtonmodalStep2.addEventListener("click", submitProject);
        integrationCategoryModalStep2();
        manageFormModalStep2();  
    }
}

async function createProjects() {
    // Création dynamique des projets sur la page //
    await getWorks();
    createProjectsCards(works);
}

// Cette fonction sert a créer les boutons filtres au chargement de la page index //
async function createFilters () {
    let nbCategories = categories.length // On compte le nombre d'éléments dans le tableau categories //
    for (let i=0; i<nbCategories; i++) { 
        // On crée des boutons qui s'appuient sur les catégories que j'ai récupérées du Back-end //
        const buttonFilters = document.createElement("button");
        buttonFilters.classList.add("button__filters");
        buttonFilters.innerHTML=categories[i].name;
        containerButtons.appendChild(buttonFilters);
        buttonFilters.addEventListener("click", buttonClicked);
    }
}


// On donne les instructions au click sur un bouton filtre //
 function buttonClicked (event) {
    // On retire la sélection actuelle //
	const buttonSelected = document.querySelector(".button--selected");
	buttonSelected.classList.remove('button--selected');
	// On sélectionne la nouvelle position //
	const updateButtonSelected = event.target;
	updateButtonSelected.classList.add("button--selected");

    // On réaffiche les projets qui correspondent à la catégorie du bouton filtre qui a été cliqué //
    let worksFiltered =  works.filter(function(work) {
        if (event.target.innerText === "Tous") {
            return true;
        }
        return work.category.name === event.target.innerText;
    });

    createProjectsCards(worksFiltered);
}  

// On affiche les projets en fonction du filtre qui a été cliqué //
async function createProjectsCards(worksFiltered) {
    const gallery = document.querySelector(".gallery");
    let nbProjects = worksFiltered.length // On compte le nombre d'éléments dans le tableau worksFiltered //
    gallery.innerHTML = "";
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

// Cette fonction donne les instructions au click sur modifier en mode édition //
function openModalstep1() {
    modalStep1Container.classList.remove("display_none");
    manageWorks(); 
} 

// Cette fonction donne les instructions au click en dehors de la modale //
function clickOutsideModal(event) {
    if (event.target === modalStep1Container) {
        closeModalStep1();
    }
    if (event.target === modalStep2Container) {
        closeModalStep2();
    }
}

// Cette fonction récupère les images des projets dans le Back et les affiche en prévisualisation dans la modalStep1 //
async function manageWorks() {
    await getWorks();
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
        trashCan.dataset.workId = works[i].id;
    }
}

// Cette fonction donne les instructions au click sur la croix de la modalStep1 //
function closeModalStep1() {
    modalStep1Container.classList.add("display_none");
}

// Cette fonction donne les instructions au click sur la croix de la modalStep2 //
function closeModalStep2() {
    modalStep2Container.classList.add("display_none");
}

// Cette fonction donne les instructions au click sur le bouton Ajouter une photo dans la modalStep1 //
function openModalStep2() {
    modalStep1Container.classList.add("display_none");
    modalStep2Container.classList.remove("display_none");
}

// Cette fonction donne les instructions au click sur la flèche dans la modalStep2 //
function returnModalStep1() {
    modalStep1Container.classList.remove("display_none");
    modalStep2Container.classList.add("display_none");
} 

// Cette fonction donne les instructions lorsqu'une corbeille est cliquée dans la modalStep1 //
async function trashcanClicked(event) {
    const workId = event.target.dataset.workId;
    const galleryStep1 = document.querySelector(".modal-step1_gallery");
    await deleteWork(workId);
    // On supprime de l'affichage tous les projets //
    galleryStep1.innerHTML="";
    manageWorks();
    createProjects();
}

// Cette fonction donne les instructions au click sur tout le container "Ajout photo" dans la modalDtep2 //
function addFileProject() {
    const buttonFile = document.querySelector("#img_project");
    buttonFile.click();
}

// Cette fonction récupère les données issues du formulaire de la modalStep2 //
function manageFormModalStep2() {
    const fieldsInput = document.querySelectorAll("#formAddProjects input");
    const fieldsSelect = document.querySelectorAll("#formAddProjects select");
    formulaire.addEventListener("input", function() {
        let completedFields = true;
        fieldsInput.forEach(function(input) {
            if (input.id === "img_project" && input.value) {
                imgFileProject.src = URL.createObjectURL(input.files[0]);
                contentFile.classList.add("display_none");
                imgFileProject.classList.remove("display_none");
            }    
            if (input.value.trim() ==="") {
                completedFields = false;
            }    
        });
        fieldsSelect.forEach(function(select) {
            if (select.value ==="") {
                completedFields = false;
            }
        });        
        if (completedFields) {
            submitButtonmodalStep2.removeAttribute("disabled");
            submitButtonmodalStep2.classList.remove("button_grey");
        } else {
            submitButtonmodalStep2.setAttribute("disabled", "true");
        }
    });
};        

// Cette fonction permet de créer un nouveau projet dans le Back en se servant des données issues du formulaire de la modalStep2// 
async function submitProject() {
    const imgProject = document.querySelector("#img_project");
    const titleProject = document.querySelector("#title-work");
    const categoryProject = document.querySelector("#category_work");
    const worksToCreate =  {
        imgProject : imgProject.files[0],
        titleProject : titleProject.value,
        categoryProject : categoryProject.value
    }    
    await sendNewWork(worksToCreate);
    closeModalStep2();
    createProjects();
    formulaire.reset();
    contentFile.classList.remove("display_none");
    imgFileProject.classList.add("display_none");
    submitButtonmodalStep2.setAttribute("disabled", "");
    submitButtonmodalStep2.classList.add("button_grey");
}

// Cette fonction permet de récupérer dynamiquement les catégories pour les intégrer à la liste déroulante dans le formulaire de la modalStep2 //
async function integrationCategoryModalStep2 () {
    const selectCategory = document.querySelector("#category_work")
    let nbCategories = categories.length // On compte le nombre de catégories //
    for (let i=0; i<nbCategories; i++) {    
        const option = document.createElement("option");
        selectCategory.appendChild(option);
        option.setAttribute("value", categories[i].id);
        option.innerHTML = categories[i].name;
    }
}    