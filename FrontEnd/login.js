
 // Envoi du login et mdp au Back saisis par l'utilisateur via la méthode Post //
async function postUsersLogin() {
    const email = document.getElementById('email').value; // On récupère la valeur saisie dans le champs email par l'utilisateur  //
    const password = document.getElementById('password').value; // On récupère la valeur saisie dans le champs password par l'utilisateur  //
    try { 
        const response = await fetch("http://localhost:5678/api/users/login", { // On envoie le formulaire au back avec fetch et la méthode post  //
            method: 'POST',
            headers:{
                'Content-Type' :'application/json'
            },
            body: JSON.stringify({
                'email': email,
                'password': password,
            })
        })
        if (response.status !== 200) {  // En cas de requête correcte la réponse du Back est un code 200 //
            throw new Error("Le login ou le mot de passe est incorrect");  // on crée une erreur "Le login ou le mot de passe est incorrect" //
        }
        const responseJson = await response.json();
        // On stocke le token d'identification dans le cas où l'authentification est validée //
        sessionStorage.setItem('token', responseJson.token); 
        // Le sessionStorage est un espace virtuel sur le navigateur où on peut stocker des valeurs et récupérer ces valeurs depuis n'importe quelle page //
        // le sessionStorage est vidé lorsque l'on ferme le navigateur //
        window.location.assign("index.html");
        // On renvoie vers la page index.html et on passe en mode édition //
    }
    catch (erreur) {
        // Code à exécuter en cas d'erreur //   
        const errorMessage = document.querySelector(".error_message");   // On récupère l'élément span qui va contenir le message d'erreur //  
        errorMessage.innerHTML=erreur.message;   // On ajoute le message d'erreur //  
        errorMessage.classList.remove("display_none");   // On supprime le display none pour que le message s'affiche //  
    }
}   

 // Fonction Submit pour récupérer les informations de login et mdp saisies par l'utilisateur //
document.body.onload = function () {
    let loginForm = document.querySelector(".container__login form") // On sélectionne le container du formulaire //  
    loginForm.addEventListener("submit", async function (event) {   // On écoute l'envoi du formulaire //  
        event.preventDefault ()  // On empêche le rafraichissement de la page par défaut à l'envoi d'un formulaire //
        postUsersLogin()   // On appelle la fonction postusersLogin qui permet l'envoi au Back du login et 
        // du mdp saisis par l'utilisateur via la méthode Post //  
    })
}

