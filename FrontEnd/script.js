let works = []; // on rend disponible la variable works sur l'ensemble de la page script.js //
let categories = []; // on rend disponible la variable categories sur l'ensemble de la page script.js //
let loginNav; // on rend disponible la variable loginNav sur l'ensemble de la page script.js //
const token = sessionStorage.getItem('token'); // on rend disponible la variable token sur l'ensemble de la page script.js //
let containerButtons; // on rend disponible la variable containerButtons sur l'ensemble de la page script.js //
let submitButtonmodalStep2; // on rend disponible la variable submitButtonmodalStep2 sur l'ensemble de la page script.js //
let modalStep1Container; // on rend disponible la variable modalStep1Container sur l'ensemble de la page script.js //
let modalStep2Container; // on rend disponible la variable modalStep2Container sur l'ensemble de la page script.js //
let formulaire; // on rend disponible la variable formulaire sur l'ensemble de la page script.js //
let contentFile; // on rend disponible la variable contenFile sur l'ensemble de la page script.js //
let imgFileProject; // on rend disponible la variable imgFileprojects sur l'ensemble de la page script.js //

// On récupère les projets depuis le Back-end //
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works"); // on récupère les projets du back grace à la méthode fetch //
    works = await response.json(); // on redéfini la valeurs des works avec la réponse du back //
}

// On récupère les catégories de projet depuis le Back-end //
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories"); // on récupère les catégories du back grace à la méthode fetch //
    categories = await response.json(); // on redéfini la valeur des catégories avec la réponse du back //
}

// Cette fonction donne les instructions au Back lorsqu'une corbeille a été cliquée dans la modalStep2 //
async function deleteWork(workId) {
    await fetch("http://localhost:5678/api/works/" + workId, { // on demande la suppression d'un works au back grace à fetch avec la méthode delete //
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}` // on joint le token d'authentification pour détenir le droit à la suppression de projet //
        }
    });
    
}

// Cette fonction permet de créer de nouveaux projets en mode édition //
async function sendNewWork(works) {
    const formData = new FormData(); // on crée un objet FormData qui va transmettre les valeurs du work //
    formData.append("title", works.titleProject); // on renseigne la valeur title du work au formData // 
    formData.append("category", works.categoryProject);  // on renseigne la valeur category du work au formData //    
    formData.append("image", works.imgProject); // on renseigne la valeur image du work au formData // 
    await fetch("http://localhost:5678/api/works/", { // on envoie le formulaire grace à fetch au back avec la méthode post  // 
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}` // on joint le token d'authentification pour détenir le droit à l'ajout de projet //
        },
        body: formData    // on joint le formData en tant que corps de la requête //   
    })
}

// Cette fonction donne les instructions au click sur logout en mode édition //
function logout() {
    sessionStorage.removeItem('token'); // on supprime le token du sessionStorage//
    alert('peu importe osef');
    loginNav.setAttribute("href","index.html"); // on recharge la page index par défaut //
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
    createProjectsCards(works);  // Fonction qui gère l'affichage des works en fonction du filtre avec le paramètre works //
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
    // On retire la sélection actuelle du bouton //
	const buttonSelected = document.querySelector(".button--selected");
	buttonSelected.classList.remove('button--selected');
	// On sélectionne la nouvelle position du bouton qui a été clické //
	const updateButtonSelected = event.target; // on séléctionne l'élément qui vient de recevoir le click//
	updateButtonSelected.classList.add("button--selected");
    // On réaffiche les projets qui correspondent à la catégorie du bouton filtre qui a été cliqué //
    let worksFiltered =  works.filter(function(work) { // On filtre les works en se demandant si le nom de la catégorie correspond //
        //au nom du bouton qui a été cliqué //
        if (event.target.innerText === "Tous") { // Dans le cas où on a cliqué sur tous on affiche alors tous les works //
            return true; // Donc on intègre tous les works dans worksfiltered //
        }
        return work.category.name === event.target.innerText;
    });

    createProjectsCards(worksFiltered);
}  

// On affiche les projets en fonction du filtre qui a été cliqué avec le paramètre works //
async function createProjectsCards(worksFiltered) {
    const gallery = document.querySelector(".gallery");
    let nbProjects = worksFiltered.length // On compte le nombre d'éléments dans le tableau worksFiltered //
    gallery.innerHTML = ""; // On vide la galerie pour ne recréer que les works à afficher //
    for (let i=0; i<nbProjects; i++) { // On crée une itération pour chaque works à afficher //
        const figure = document.createElement("figure"); // On crée un élement figure //
        const image = document.createElement("img"); // On crée un élement image //
        const figcaption = document.createElement("figcaption"); // On crée un élement figcaption //
        image.setAttribute ("src",worksFiltered[i].imageUrl); // On définit un attribut src à image qui correspond à l'url de l'image à l'itération i //
        image.setAttribute ("alt", worksFiltered[i].title); // On définit un alt à image qui correspond au titre à l'itération i  //
        figcaption.innerHTML=worksFiltered[i].title; // On définit la valeur de figacption en récupérant le titre du works à l'itération i //
        figure.appendChild(image); // L'élément image sera enfant de figure //
        figure.appendChild(figcaption); // L'élément figcaption sera enfant de figure //
        gallery.appendChild(figure); // L'élément figure sera enfant de gallery //
    }  
}

// Cette fonction donne les instructions au click sur modifier en mode édition //
function openModalstep1() {
    modalStep1Container.classList.remove("display_none"); // on supprime le display none pour afficher la modalstep1 //
    manageWorks(); // On appelle la fonction manageworks qui permet de récupèrer // 
    // les images des projets dans le Back et de les afficher en prévisualisation dans la modalStep1 //
} 

// Cette fonction donne les instructions au click en dehors de la modale //
function clickOutsideModal(event) {
    if (event.target === modalStep1Container) { // Si le click est détecté sur le container en dehors de la modalstep1 //
        // alors on est forcément en dehors de la modale //
        closeModalStep1(); // Dans ce cas on ferme la modalstep1 //
    }
    if (event.target === modalStep2Container) { // Si le click est détecté sur le container en dehors de la modalstep2 //
        closeModalStep2(); // Dans ce cas on ferme la modalstep2 //
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
        trashCan.dataset.workId = works[i].id;  // On crée un attribut dataset sur l'élément trashCan qui va stocker l'id du work //
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
    const fieldsInput = document.querySelectorAll("#formAddProjects input"); // On récupère tous les champs input du formulaire //
    const fieldsSelect = document.querySelectorAll("#formAddProjects select"); // On récupère tous les champs select du formulaire //
    formulaire.addEventListener("input", function() { // On écoute la saisie de tous les champs input //
        fieldsInput.forEach(function(input) { // Pour chaque champs input//
            if (input.id === "img_project" && input.value) { // On teste si le champs est le champs qui gère l'importation de l'image //
                imgFileProject.src = URL.createObjectURL(input.files[0]); // On va attribuer au src de l'image preview l'url de l'image selectionnée //
                contentFile.classList.add("display_none"); // On rend invisible le container "ajouter une photo" //
                imgFileProject.classList.remove("display_none"); // On affiche en preview l'image qui a été ajoutée //
            }    
            if (input.value.trim() ==="") { // trim permet de supprimer les espaces au début et à la fin de chaînes de caractères //
            // Cela permet donc de ne pas considérer comme rempli un champs dans lequel on aura mis qu'un seul espace par exemple //   
                completedFields = false;
            }    
        });
        fieldsSelect.forEach(function(select) { // Pour chaque champs select //
            if (select.value ==="") { // On teste si les champs sont vides //
                completedFields = false; // Dans le cas où ils sont vides alors false //
            }
        });        
        if (completedFields) {  // Si tous les champs sont complétés //
            submitButtonmodalStep2.removeAttribute("disabled"); // On supprime l'impossibilité de clicker sur valider //
            submitButtonmodalStep2.classList.remove("button_grey"); // On supprime le style gris sur le boutton valider //
        } else {
            submitButtonmodalStep2.setAttribute("disabled", "true"); // On est dans le cas où au moins un des champs 
            // est vide donc on rend le boutton valider impossible à clicker //
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
    const selectCategory = document.querySelector("#category_work"); // On sélectionne la liste déroulante dans la modalstep2 //
    let nbCategories = categories.length // On compte le nombre de catégories //
    for (let i=0; i<nbCategories; i++) {  // On crée une boucle for pour chaque catégorie //
        const option = document.createElement("option"); // On sélectionne les options possibles dans la liste déroulante //
        selectCategory.appendChild(option); // Les options seront enfants de la liste déroulante //
        option.setAttribute("value", categories[i].id); // On définit la valeur des options par l'id de la catégorie à l'itération i 
        // (non visible à l'écran) //
        option.innerHTML = categories[i].name; // on affiche à l'écran le nom de la catégorie à l'itération i dans l'option //
    }
}    