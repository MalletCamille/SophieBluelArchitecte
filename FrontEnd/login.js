
 // Envoi du login et mdp saisis par l'utilisateur au Back via la méthode Post //
async function postUsersLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try { 
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers:{
                'Content-Type' :'application/json'
            },
            body: JSON.stringify({
                'email': email,
                'password': password,
            })
        })
        if (response.status !== 200) {
            throw new Error("Le login ou le mot de passe est incorrect");  
        }
        const responseJson = response.json();
        // On stocke le token d'identification dans le cas où l'authentification est validée //
        sessionStorage.setItem('token', responseJson.token); 
        window.location.assign("index.html");
    }
    catch (erreur) {
        // Code à exécuter en cas d'erreur    
        const errorMessage = document.querySelector(".error_message");
        errorMessage.innerHTML=erreur.message;
        errorMessage.classList.remove("display_none");
    }
}   

// Pour récupérer le token d'authentification //
//const token = sessionStorage.getItem('token');//



 // Fonction Submit pour récupérer les informations de login et mdp saisies par l'utilisateur //
document.body.onload = function () {

    let loginForm = document.querySelector(".container__login form")    
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault ()
        postUsersLogin()
    })
}

