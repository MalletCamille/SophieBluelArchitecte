async function postUsersLogin() {
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        body: {
            "email": "string",
            "password": "string"
        }
    })
}




document.body.onload = function () {

    let loginForm = document.querySelector(".container__login form")    
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault ()
        console.log("le formulaire est envoyé")
        console.log(event)
    })
}