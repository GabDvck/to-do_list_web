"use strict";

let cptTaches = 1;
let listes = [];

const toggle = document.getElementById("toggle-switch");
const etat = document.getElementById("etat");

toggle.addEventListener("change", function() {
etat.textContent = this.checked ? "Mode sombre" : "Mode clair";
});

const nvListe = document.getElementById("nouvelleListe");
nvListe.addEventListener("click", creeNvListe);

function creeNvListe(event){
    const form = document.createElement("form");
    form.setAttribute("id", "formListe")

    const titre = document.createElement("input");
    titre.setAttribute("type", "text");
    titre.setAttribute("placeholder", "Titre de la liste");
    titre.setAttribute("id", "titre");
    form.append(titre);

    const bSubmit = document.createElement("input");
    bSubmit.setAttribute("type", "submit");
    bSubmit.setAttribute("value", "Ajouter la liste");
    bSubmit.addEventListener("click", ajouterListe);
    form.append(bSubmit);

    const tache = document.createElement("input");
    tache.setAttribute("type", "text");
    tache.setAttribute("placeholder", "Nouvelle tâche");
    tache.classList.add("tache");
    tache.classList.add("t1");
    form.append(tache);

    const bSupp = document.createElement("button");
    bSupp.classList.add("1");
    bSupp.textContent = "Supprimer la tâche"
    bSupp.addEventListener("click", suppTache);
    form.append(bSupp);

    document.getElementById("droite").append(form);

    const bNvTache = document.createElement("button");
    bNvTache.textContent = "Ajouter une nouvelle tâche";
    bNvTache.addEventListener("click", nvTache);
    document.getElementById("droite").append(bNvTache);
}

function nvTache(event){
    cptTaches += 1;
    const form = document.getElementById("formListe");
    const tacheN = document.createElement("input");
    tacheN.setAttribute("type", "text");
    tacheN.setAttribute("placeholder", "Nouvelle tâche");
    tacheN.classList.add("tache");
    tacheN.classList.add("t"+cptTaches);
    form.append(tacheN);

    const bSuppN = document.createElement("button");
    bSuppN.classList.add(cptTaches);
    bSuppN.textContent = "Supprimer la tâche";
    bSuppN.addEventListener("click", suppTache);
    form.append(bSuppN);
}

function suppTache(event){
    event.preventDefault();
    const bouton = event.currentTarget;
    const cBouton = bouton.className;
    const tSupp = document.querySelector("input.t"+cBouton);
    tSupp.remove();
    bouton.remove();
}

function ajouterListe(event){
    event.preventDefault();
    const taches = document.querySelectorAll(".tache");
    let listTache = [document.getElementById("titre").value];
    for (let tache of taches){
        listTache.push(tache.value);
    }
    listes.push(listTache);
    const droite = document.getElementById("droite");
    while (droite.firstChild){
        droite.removeChild(droite.firstChild);
    }

    const li = document.createElement("li");
    li.textContent = listTache[0];
    document.getElementById("listes").append(li);
    li.addEventListener("click", afficherListe);
    li.dataset.num = listes.length - 1;
}

function afficherListe(event){
    const droite = document.getElementById("droite");
    const h2 = document.createElement("h2");
    let listeAffiche = listes[event.currentTarget.dataset.num];
    h2.textContent = listeAffiche[0];
    droite.append(h2);
    listeAffiche = listeAffiche.slice(1);
    let ul = document.createElement("ul");
    for (let t of listeAffiche){
        let li = document.createElement("li");
        li.textContent = t;
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        li.append(checkbox);
        li.dataset.isChecked = 0;
        ul.append(li);
    }
    droite.append(ul);
}