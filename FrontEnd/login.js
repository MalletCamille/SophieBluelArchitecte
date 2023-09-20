document.body.onload = function () {

    let loginForm = document.querySelector(".container__login form")    
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault ()
        console.log("le formulaire est envoyé")
    })
}