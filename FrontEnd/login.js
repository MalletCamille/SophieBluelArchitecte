
 // Envoi du login et mdp saisis par l'utilisateur au Back via la méthode Post //
async function postUsersLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Nom d\'utilisateur :', email);
    console.log('Mot de passe :', password);
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers:{
            'Content-Type' :'application/json'
        },
        body: {
            "email": email,
            "password": password,
        }
    })
    console.log(await response);
}



 // Fonction Submit pour récupérer les informations de login et mdp saisies par l'utilisateur //
document.body.onload = function () {

    let loginForm = document.querySelector(".container__login form")    
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault ()
        console.log("le formulaire est envoyé")
        console.log(event)
        postUsersLogin();
    })
}