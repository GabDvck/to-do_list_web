"use strict";

let cptTaches = 1;

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
    form.append(titre);

    const bSubmit = document.createElement("input");
    bSubmit.setAttribute("type", "submit");
    bSubmit.setAttribute("value", "Ajouter la liste");
    form.append(bSubmit);

    const tache = document.createElement("input");
    tache.setAttribute("type", "text");
    tache.setAttribute("placeholder", "Tâche 1");
    tache.dataset.numero = 1;
    form.append(tache);

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
    tacheN.setAttribute("placeholder", `Tâche ${cptTaches}`);
    tacheN.dataset.numero = cptTaches;
    form.append(tacheN);
}