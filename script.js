"use strict";

let cptTaches = 1;
let listes = [];
let listeActuelle = null;

const toggle = document.getElementById("toggle-switch");
const etat = document.getElementById("etat");

toggle.addEventListener("change", function() {
etat.textContent = this.checked ? "Mode sombre" : "Mode clair";
});

const nvListe = document.getElementById("nouvelleListe");
nvListe.addEventListener("click", creeNvListe);

function creeNvListe(event){
    clearDroite();
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

    const divErreur = document.createElement("div");
    divErreur.setAttribute("id", "erreur");
    form.append(divErreur);

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

    const divErreur2 = document.createElement("div");
    divErreur2.setAttribute("id", "erreur2");
    form.append(divErreur2);

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

function clearDroite(){
    const droite = document.getElementById("droite");
            while (droite.firstChild){
                droite.removeChild(droite.firstChild);
            }
    listeActuelle = null;
}

function ajouterListe(event){
    event.preventDefault();
    if (document.getElementById("titre").value.trim()){
        const taches = document.querySelectorAll(".tache");
        let listTache = [document.getElementById("titre").value];
        for (let tache of taches){
            if (tache.value.trim()){
            listTache.push(tache.value);
            }
        }
        if (listTache.length > 1){
            listes.push(listTache);
            
            clearDroite();

            const li = document.createElement("li");
            li.textContent = listTache[0];
            document.getElementById("listes").append(li);
            li.addEventListener("click", afficherListe);
            li.dataset.num = listes.length - 1;
        }
        else{
            document.getElementById("erreur2").textContent = "Veuillez ajouter au moins une tâche";
        }
    }
    else{
        document.getElementById("erreur").textContent = "Veuillez donner un nom à la liste";
    }
}

function afficherListe(event){
    clearDroite();
    const droite = document.getElementById("droite");
    const h2 = document.createElement("h2");
    let listeAffiche = listes[event.currentTarget.dataset.num];
    listeActuelle = event.currentTarget.dataset.num;
    h2.textContent = listeAffiche[0];
    droite.append(h2);
    listeAffiche = listeAffiche.slice(1);
    let ul = document.createElement("ul");
    let cpt = 1;
    for (let t of listeAffiche){
        let li = document.createElement("li");
        li.textContent = t;
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        const bSup = document.createElement("button");
        bSup.textContent = "Supprimer la tâche";
        bSup.addEventListener("click", suppTacheListe);
        bSup.dataset.rang = cpt;
        li.append(checkbox);
        li.append(bSup);
        li.dataset.isChecked = 0;
        ul.append(li);
        cpt += 1;
    }
    droite.append(ul);
    const bsupp = document.createElement("button");
    bsupp.textContent = "Supprimer la liste";
    bsupp.addEventListener("click", suppListe);
    droite.append(bsupp);
}

function suppTacheListe(event){
    const liste = document.querySelectorAll("#droite ul li");
    let rang = event.currentTarget.dataset.rang
    if (liste.length > 1){
        console.log(rang);
        event.currentTarget.parentElement.remove();
        listes[listeActuelle].splice(rang, 1);
    }
    else{
        const erreur = document.createElement("div");
        erreur.setAttribute("id", "erreur");
        document.querySelector("#droite h2").after(erreur);
        document.getElementById("erreur").textContent = "Il doit y avoir au moins une tâche dans votre liste";
    }
}

function suppListe(event){
    listes.splice(listeActuelle, 1);
    const liListes = document.querySelectorAll("#listes li");
    for (let li of liListes){
        if (li.dataset.num == listeActuelle){
            li.remove();
        }
    }
    const liListes2 = document.querySelectorAll("#listes li");
    for (let i = 0; i < liListes2.length; i++){
        console.log(i);
        liListes2[i].dataset.num = i;
    }
    clearDroite();
}