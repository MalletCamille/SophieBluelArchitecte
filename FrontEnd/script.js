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
    const works = await getWorks();
    let nbProjects = works.length // On compte le nombre d'éléments dans le tableau works //
    for (let i=0; i<nbProjects; i++) { 
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        image.setAttribute ("src",works[i].imageUrl);
        image.setAttribute ("alt", works[i].title);
        figcaption.innerHTML=works[i].title;
        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    } 
}


