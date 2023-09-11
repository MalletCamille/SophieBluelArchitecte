async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}


document.body.onload = function () {
    createProjects();
}

async function createProjects() {
    // Récupération des éléments de la page //
    const gallery = document.querySelector(".gallery");
    // Création dynamique des éléments de la page //
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    const works = await getWorks();
    image.setAttribute ("src",works[0].imageUrl);
    image.setAttribute ("alt", works[0].title);
    figcaption.innerHTML=works[0].title;
    figure.appendChild(image);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

