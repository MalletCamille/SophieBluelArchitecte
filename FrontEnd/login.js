
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
        if (await response.status !== 200) {
            throw new Error("Le login ou le mot de passe est incorrect");  
        }
        const responseJson = await response.json();
        // On stocke le token d'identification dans le cas où l'authentification est validée //
        sessionStorage.setItem('token', responseJson.token); 
    }
    catch (erreur) {
        // Code à exécuter en cas d'erreur    
        alert (erreur.message)
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