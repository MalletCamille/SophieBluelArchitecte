
 // Envoi du login et mdp saisis par l'utilisateur au Back via la méthode Post //
async function postUsersLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
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
    return await response.json();
}



 // Fonction Submit pour récupérer les informations de login et mdp saisies par l'utilisateur //
document.body.onload = function () {

    let loginForm = document.querySelector(".container__login form")    
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault ()
        postUsersLogin();
    })
}