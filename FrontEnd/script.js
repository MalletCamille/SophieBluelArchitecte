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
        body: formData // on joint le formData en tant que corps de la requête //   
    })
}

// Cette fonction donne les instructions au click sur logout en mode édition //
function logout() {
    sessionStorage.removeItem('token'); // on supprime le token du sessionStorage//
    loginNav.setAttribute("href","index.html"); // on recharge la page index par défaut //
}

// On appelle les fonctions au chargement du body dans le DOM //
document.body.onload = async function () {
    containerButtons = document.querySelector(".buttons__container"); // On sélectionne le container des boutons filtres //
    loginNav = document.querySelector("#nav-login"); // On sélectionne le bouton de navigation login/logout //
    modalStep1Container = document.querySelector(".container_modal-step1"); // On sélectionne le container de la modalstep1 //
    modalStep2Container = document.querySelector(".container_modal-step2"); // On sélectionne le container de la modalstep2 //
    formulaire = document.getElementById("formAddProjects"); // On sélectionne le formulaire de la modalstep2  //
    contentFile = document.querySelector(".content_file"); // On sélectionne le container de l'ajout de la photo //
    imgFileProject = document.querySelector(".img_file_project"); // on sélectionne l'image qui a été importée //
    await getCategories(); // On appelle la fonction getCategories qui permet de récupérer les catégories du Back //
    createProjects(); // On appelle la fonction createProjects qui permet de créer dynamiquement les projets sur la page//
    createFilters(); // On appelle la fonction createfilters qui permet de créer dynamiquement les filtres par catégorie //
    const buttonAll = document.querySelector(".button__filters"); // On sélectionne les boutons filtres //
    const editorModify = document.querySelector(".modify_button") // On sélectionne le bouton modifier en mode édition //
    const crossButtonStep1 = document.querySelector(".modal-step1_cross") // On sélectionne la croix de la modalstep1 //
    const crossButtonStep2 = document.querySelector(".modal-step2_cross") // On sélectionne la croix de la modalstep2 //
    const addImgButton = document.querySelector(".modal-step1_button") // On sélectionne le bouton "ajouter une photo" de la modalstep1 //
    const arrowStep2 = document.querySelector(".modal-step2_arrow") // On sélectionne la flèche de la modalstep2 //
    buttonAll.addEventListener("click", buttonClicked); //on écoute le click sur les boutons filtres et en cas de click on éxécute //
    // la fonction buttonclicked //
    if (token) { // Si on a le token d'authentification //   
        const blackBand = document.querySelector(".black_band") // On sélectionne le bandeau noir // 
        submitButtonmodalStep2 = document.querySelector("#submit_Project") // On sélectionne le bouton "valider" de la modalstep2 // 
        loginNav.innerText="logout"; // On passe le bouton de navigation en logout //
        containerButtons.classList.add("display_none"); // On ajoute un display none au vontainer des boutons filtres pour les rendre invisibles //
        blackBand.classList.remove("display_none"); // On retire le display none au bandeau noir pour le rendre visible //
        editorModify.classList.remove("display_none"); // On enlève le display none au bouton modifier pour le rendre visible //
        loginNav.addEventListener("click", logout); // On écoute le click sur le bouton logout et en cas de click on exécute //
        // la fonction logout //
        editorModify.addEventListener("click", openModalstep1); // On écoute le click sur le bouton modifier et en cas de click on exécute //
        // la fonction openModalStep1 //
        crossButtonStep1.addEventListener("click", closeModalStep1); // On écoute le click sur la croix de la modalstep1 et en cas de click //
        // on exécute la fonction closeModalStep1 //
        crossButtonStep2.addEventListener("click", closeModalStep2); // On écoute le click sur la croix de la modalstep2 et en cas de click //
        // on exécute la fonction closeModalStep2 //
        addImgButton.addEventListener("click", openModalStep2); // On écoute le click sur le bouton "ajouter une photo" dans la modalstep1 et //
        // en cas de click on exécute la fonction openmodalstep2 //
        arrowStep2.addEventListener("click", returnModalStep1); // On écoute le click sur la flèche de la modalstep2 et en cas de click //
        // on exécute la fonction returnModalStep1 //
        contentFile.addEventListener("click", addFileProject); // On écoute le click sur le container de l'ajout de la photo dans la modalstep2 //
        // et en cas de click on exécute la fonction addFileProject //
        modalStep1Container.addEventListener("click", clickOutsideModal); // On écoute le click sur le container de la modalstep1 et en cas de click //
        // on exécute la fonction clickOutsideModal //
        modalStep2Container.addEventListener("click", clickOutsideModal); // On écoute le click sur le container de la modalstep2 et en cas de click //
        // on exécute la fonction clickOutsideModal //
        submitButtonmodalStep2.addEventListener("click", submitProject); // On écoute le click sur le bouton "valider" de la modalstep2 et en cas //
        // de click on exécute la fonction submitProject //
        integrationCategoryModalStep2(); // On appelle la fonction integrationCategoryModalStep2 qui permet d'attribuer le nom des catégories //
        // aux différentes options de la liste déroulante des catégories //
        manageFormModalStep2(); // On appelle la fonction manageformModalStep2 qui permet de récupère les données issues du //
        // formulaire de la modalStep2 //
    }
}

// Cette fonction permet de créer les projets dynamiquement sur la page //
async function createProjects() {
    await getWorks(); // On appelle la fonction getWorks qui récupère le sprojets du Back //
    createProjectsCards(works);  // Fonction qui gère l'affichage des works en fonction du filtre avec le paramètre works //
}

// Cette fonction sert a créer les boutons filtres au chargement de la page index //
async function createFilters () {
    let nbCategories = categories.length // On compte le nombre d'éléments dans le tableau categories //
    for (let i=0; i<nbCategories; i++) { 
        // On crée des boutons qui s'appuient sur les catégories que j'ai récupérées du Back-end //
        const buttonFilters = document.createElement("button"); // Pour chaque catégorie on crée un bouton //
        buttonFilters.classList.add("button__filters"); // on attribue un style à chaque bouton //
        buttonFilters.innerHTML=categories[i].name; // on attribue au bouton le nom de la catégorie à l'itération i //
        containerButtons.appendChild(buttonFilters); // les boutons que l'on crée seront enfants du container des boutons //
        buttonFilters.addEventListener("click", buttonClicked); // on va écouter le click sur chaque bouton //
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
        return work.category.name === event.target.innerText; // Dans le cas où on a cliqué sur un bouton catégorie, on affiche les works //
        // dont la catégorie correspond au nom du bouton qui a été cliqué //
    });
    createProjectsCards(worksFiltered); // On appelle alors la fonction createprojectscards avec le paramètre worksfiltered //
    // qui permet d'afficher les projets en fonction du filtre qui a été cliqué avec le paramètre worksFiltered //
}  

// On affiche les projets en fonction du filtre qui a été cliqué avec le paramètre worksFiltered //
async function createProjectsCards(worksFiltered) {
    const gallery = document.querySelector(".gallery"); // On sélectionne la galerie dans laquelle on va afficher les works //
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
    await getWorks(); // on appelle la fonction getWorks qui récupère les projets depuis le Back-end //
    const step1Gallery = document.querySelector(".modal-step1_gallery"); // on sélectionne la galerie de la modalstep1 //
    step1Gallery.innerHTML = ""; // on vide la gallerie de la modalstep1 //
    let nbProjects = works.length // On compte le nombre d'éléments dans le tableau works //
    for (let i=0; i<nbProjects; i++) {  // on crée une boucle for et pour chaque itération de work dans le tableau work ://
        const image = document.createElement("img"); // on crée une image //
        const containerImg = document.createElement("div"); // on crée une div //
        const trashCan = document.createElement("i"); // on crée un icône poubelle //
        step1Gallery.appendChild(containerImg); // containerImg sera enfant de la galerie de la modalstep1 //
        containerImg.appendChild(trashCan); // l'icône poubelle sera enfant de containerImg //
        containerImg.appendChild(image); // l'image sera enfant de containerImg //
        image.setAttribute ("src",works[i].imageUrl); // on définit l'attribut source de l'image sur l'url du works à l'itération i //
        image.classList.add("gallery-editor_img"); // on ajoute le style css à l'image de preview //
        containerImg.classList.add("container_imgstep1"); // on ajoute le style css au container des images preview //
        trashCan.classList.add("trashcan", "fa-regular", "fa-trash-can"); // on ajoute le style aux icônes poubelles //
        trashCan.addEventListener("click", trashcanClicked); // on écoute le click sur les poubelles et en cas de click 
        // on exécute la fonction trashcanClicked //
        trashCan.dataset.workId = works[i].id;  // On crée un attribut dataset sur l'élément trashCan qui va stocker l'id du work //
    }
}

// Cette fonction donne les instructions au click sur la croix de la modalStep1 //
function closeModalStep1() {
    modalStep1Container.classList.add("display_none"); // on ajoute le display none pour rendre invisible et fermer la modalstep1 //
}

// Cette fonction donne les instructions au click sur la croix de la modalStep2 //
function closeModalStep2() {
    modalStep2Container.classList.add("display_none"); // on ajoute le display none pour rendre invisible et fermer la modalstep2 //
}

// Cette fonction donne les instructions au click sur le bouton Ajouter une photo dans la modalStep1 //
function openModalStep2() {
    modalStep1Container.classList.add("display_none"); // on ajoute le display none pour rendre invisible et fermer la modalstep1 //
    modalStep2Container.classList.remove("display_none"); // on retire le display none pour rendre visible et ouvrir la modalstep2 //
}

// Cette fonction donne les instructions au click sur la flèche dans la modalStep2 //
function returnModalStep1() {
    modalStep1Container.classList.remove("display_none"); // on retire le display none pour rendre visible et ouvrir la modalstep1 //
    modalStep2Container.classList.add("display_none"); // on ajoute le display none pour rendre invisible et fermer la modalstep2 //
} 

// Cette fonction donne les instructions lorsqu'une corbeille est cliquée dans la modalStep1 //
async function trashcanClicked(event) {
    const workId = event.target.dataset.workId; // On récupère l'id du work stocké dans le dataset //
    const galleryStep1 = document.querySelector(".modal-step1_gallery"); // on récupère la galerie de la modalstep1 //
    await deleteWork(workId); // On appelle la fonction deleteWork avec le paramètre workId qui donne les instructions au Back 
    // lorsqu'une corbeille a été cliquée dans la modalStep2 //
    galleryStep1.innerHTML=""; // On vide la galerie de la modalstep1 //
    manageWorks(); // On appelle la fonction manageWorks qui récupère les images des projets dans le //
    // Back et les affiche en prévisualisation dans la modalStep1 //
    createProjects(); // On appelle la fonction createProjects qui permet de créer les projets dynamiquement sur la page //
}

// Cette fonction permet de simuler le click sur le bouton de l'input file au click sur le container "ajout photo" //
function addFileProject() {
    const buttonFile = document.querySelector("#img_project"); // On sélectionne l'input //
    buttonFile.click(); // On déclenche le click par le code //
}

// Cette fonction récupère les données issues du formulaire de la modalStep2 //
function manageFormModalStep2() {
    const fieldsInput = document.querySelectorAll("#formAddProjects input"); // On récupère tous les champs input du formulaire //
    const fieldsSelect = document.querySelectorAll("#formAddProjects select"); // On récupère tous les champs select du formulaire //
    formulaire.addEventListener("input", function() { // On écoute la saisie de tous les champs input //
        let completedFields = true // Par défaut les champs sont remplis //
        fieldsInput.forEach(function(input) { // Pour chaque champs input//
            if (input.id === "img_project" && input.value) { // On teste si le champs est le champs qui gère l'importation de l'image //
                imgFileProject.src = URL.createObjectURL(input.files[0]); // On va attribuer au src de l'image preview l'url de l'image selectionnée //
                contentFile.classList.add("display_none"); // On rend invisible le container "ajouter une photo" //
                imgFileProject.classList.remove("display_none"); // On affiche en preview l'image qui a été ajoutée //
            }    
            if (input.value.trim() ==="") { // trim permet de supprimer les espaces au début et à la fin de chaînes de caractères //
            // Cela permet donc de ne pas considérer comme rempli un champs dans lequel on aura mis qu'un seul espace par exemple //   
                completedFields = false; // Dans le cas où les champs sont vides alors la condition est fausse // 
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
    const imgProject = document.querySelector("#img_project"); // On récupère le fichier image qui a été envoyé //
    const titleProject = document.querySelector("#title-work"); // On récupère le titre qui a été saisi //
    const categoryProject = document.querySelector("#category_work"); // On récupère la catégorie qui a été selectionnée //
    const worksToCreate =  { // On crée un objet worksToCreate dans lequel on va rassembler les données //
        imgProject : imgProject.files[0], // on attribue l'url de l'image qui a été importée //
        titleProject : titleProject.value, // on attribue la valeur qui a été saisie dans le champs titre au titre du projet //
        categoryProject : categoryProject.value // on attribue la catégorie qui a été sélectionnée dans la liste déroulante à la catégorie du projet //
    }    
    await sendNewWork(worksToCreate); // on appelle la fonction sendNewWork avec le paramètre worksToCreate qui //
    // permet de créer de nouveaux projets en mode édition //
    closeModalStep2(); // on appelle la fonction closeModalStep2 qui permet de fermer la modalStep2 //
    createProjects(); // on appelle la fonction createProjects qui permet de créer dynamiquement les projets sur la page //
    formulaire.reset(); // On reset les données du formulaire de la modalstep2 //
    contentFile.classList.remove("display_none"); // On enlève le display none au container "ajout photo" pour le rendre de nouveau visible //
    imgFileProject.classList.add("display_none"); // On ajoute le display none à la préview de l'image précédemment importée //
    submitButtonmodalStep2.setAttribute("disabled", ""); // On rajoute l'impossibilité de clicker sur le bouton "valider" du formulaire //
    submitButtonmodalStep2.classList.add("button_grey"); // On rajoute le style gris au bouton "valider" du formulaire //
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