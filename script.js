"use strict";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log("Service worker enregistré ✅"))
    .catch(err => console.error("Erreur d'enregistrement SW ❌", err));

  // Forcer l'activation du SW en attente
  navigator.serviceWorker.getRegistration().then(registration => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  });
}

let cptTaches = 1;
let listes = [];
let listeActuelle = null;

localStorage.setItem("mode", "clair");

recupStorage();

const toggle = document.getElementById("toggle-switch");
const etat = document.getElementById("etat");

toggle.addEventListener("change", function() {
etat.textContent = this.checked ? "🌙" : "☀️";
const link = document.getElementById("mode");
if (link.getAttribute("href") == "style/clair.css"){
    link.setAttribute("href", "style/sombre.css");
    localStorage.setItem("mode", "sombre");
    document.getElementById("logo").setAttribute("src", "img/logo2-v2-blanc.png");
}
else{
    link.setAttribute("href", "style/clair.css");
    localStorage.setItem("mode", "clair");
    document.getElementById("logo").setAttribute("src", "img/logo2-v2.png");
}
});

const nvListe = document.querySelectorAll(".nouvelleListe");
for (let bt of nvListe){
    bt.addEventListener("click", creeNvListe);
}

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
    bSubmit.setAttribute("class", "submit");
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
    document.getElementById("erreur").textContent = "";
    document.getElementById("erreur2").textContent = "";
    event.preventDefault();
    if (document.getElementById("titre").value.trim()){
        const taches = document.querySelectorAll(".tache");
        let listTache = [[document.getElementById("titre").value, 0]];
        for (let tache of taches){
            if (tache.value.trim()){
                listTache.push([tache.value, 0]);
            }
        }
        if (listTache.length > 1){
            listes.push(listTache);
            
            clearDroite();

            const li = document.createElement("li");
            li.textContent = listTache[0][0];
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
    document.querySelector("#gauche p").remove();
    localStorage.setItem('listes', JSON.stringify(listes));
}

function afficherListe(event){
    clearDroite();
    const droite = document.getElementById("droite");
    const h2 = document.createElement("h2");
    let listeAffiche = listes[event.currentTarget.dataset.num];
    listeActuelle = event.currentTarget.dataset.num;
    h2.textContent = listeAffiche[0][0];
    droite.append(h2);
    let filtre = document.createElement("select");
    filtre.setAttribute("id", "filtre");
    let touteTache = document.createElement("option");
    touteTache.setAttribute("value", "3");
    touteTache.textContent = "Toutes les tâches";
    let faites = document.createElement("option");
    faites.setAttribute("value", "1");
    faites.textContent = "Tâches faites";
    let nonFaites = document.createElement("option");
    nonFaites.setAttribute("value", "0");
    nonFaites.textContent = "Tâches non faites";
    filtre.append(touteTache, faites, nonFaites);
    droite.append(filtre);
    const bfiltre = document.createElement("button");
    bfiltre.textContent = "Filtrer les tâches";
    bfiltre.addEventListener("click", filtrerTaches);
    droite.append(bfiltre);
    listeAffiche = listeAffiche.slice(1);
    let ul = document.createElement("ul");
    let cpt = 1;
    for (let t of listeAffiche){
        let li = document.createElement("li");
        li.textContent = t[0];
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener("change", checkTache);
        if (t[1] == 1){
            checkbox.checked = true;
        }
        const bSup = document.createElement("button");
        bSup.textContent = "Supprimer la tâche";
        bSup.addEventListener("click", suppTacheListe);
        li.append(checkbox);
        li.append(bSup);
        li.dataset.isChecked = 0;
        li.dataset.rang = cpt;
        ul.append(li);
        cpt += 1;
    }
    droite.append(ul);
    const p = document.createElement("p");
    p.setAttribute("id", "messFiltre");
    droite.append(p);
    const bnvTache = document.createElement("button");
    bnvTache.textContent = "Ajouter une nouvelle tâche";
    bnvTache.addEventListener("click", nvTacheListeCreee);
    bnvTache.setAttribute("id", "bnvTache");
    droite.append(bnvTache);
    const bsupp = document.createElement("button");
    bsupp.textContent = "Supprimer la liste";
    bsupp.addEventListener("click", suppListe);
    droite.append(bsupp);
}

function suppTacheListe(event){
    const liste = document.querySelectorAll("#droite ul li");
    let rang = event.currentTarget.parentElement.dataset.rang;
    if (liste.length > 1){
        event.currentTarget.parentElement.remove();
        listes[listeActuelle].splice(rang, 1);
        localStorage.setItem('listes', JSON.stringify(listes));
    }
    else{
        const erreur = document.createElement("div");
        erreur.setAttribute("id", "erreur");
        document.querySelector("#droite button").after(erreur);
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
    if (!listes.length){
        const pGauche = document.createElement("p");
        pGauche.textContent = "Vous n’avez pas encore de listes, créez-en une facilement et gratuitement !";
        document.querySelector("#gauche h2").after(pGauche);
        const pDroite = document.createElement("p");
        pDroite.textContent = "Vous n’avez pas de tâches à réaliser. Créez vos to do lists !";
        const bouton = document.createElement("button");
        bouton.textContent = "Créer une nouvelle liste";
        bouton.addEventListener("click", creeNvListe);
        bouton.classList.add("nouvelleListe");
        document.getElementById("droite").append(pDroite, bouton);
    }
    localStorage.setItem('listes', JSON.stringify(listes));
}

function recupStorage(){
    listes = JSON.parse(localStorage.getItem("listes"));
    if (listes == null || !listes.length){
        listes = [];
        const p = document.createElement("p");
        p.textContent = "Vous n’avez pas encore de listes, créez-en une facilement et gratuitement !";
        document.querySelector("#gauche h2").after(p);
    }
    else{
        for (let i = 0; i < listes.length; i++){
            let li = document.createElement("li");
            li.textContent = listes[i][0][0];
            document.getElementById("listes").append(li);
            li.addEventListener("click", afficherListe);
            li.dataset.num = i;
        }
    }

    const link = document.getElementById("mode");
    if (localStorage.getItem("mode") == "sombre"){
        link.setAttribute("href", "style/sombre.css");
        document.querySelector(".etat").textContent = "🌙";
        document.getElementById("toggle-switch").checked = true;
    }
    else{
        link.setAttribute("href", "style/clair.css");
    }
}

function filtrerTaches(event){
    let valeur = document.getElementById("filtre").value;
    afficheListeFiltree(Number(valeur));
}

function afficheListeFiltree(filtre){
    const p = document.getElementById("messFiltre");
    p.textContent = "";
    const ul = document.querySelector("#droite ul");
    while (ul.firstChild){
        ul.removeChild(ul.firstChild);
    }
    let cpt = 1;
    for (let t of listes[listeActuelle].slice(1)){
        if (t[1] == filtre || filtre == 3){
            let li = document.createElement("li");
            li.textContent = t[0];
            const checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.addEventListener("change", checkTache);
            if (t[1] == 1){
                checkbox.checked = true;
            }
            const bSup = document.createElement("button");
            bSup.textContent = "Supprimer la tâche";
            bSup.addEventListener("click", suppTacheListe);
            li.append(checkbox);
            li.append(bSup);
            li.dataset.isChecked = 0;
            li.dataset.rang = cpt;
            ul.append(li);
        }
            cpt += 1;
            }
        if (!ul.firstChild){
            const p = document.getElementById("messFiltre");
            p.textContent = "Aucune tâche ne correspond au filtre";
        }
}

function checkTache(event){
    let etat = event.currentTarget.parentElement.dataset.isChecked;
    if (etat == 0){
        event.currentTarget.parentElement.dataset.isChecked = 1;
        const rang =  event.currentTarget.parentElement.dataset.rang;
        listes[listeActuelle][rang][1] = 1;
    }
    else{
        event.currentTarget.parentElement.dataset.isChecked = 0;
        const rang =  event.currentTarget.parentElement.dataset.rang;
        listes[listeActuelle][rang][1] = 0;
    }
    localStorage.setItem('listes', JSON.stringify(listes));
}

function nvTacheListeCreee(event){
    event.currentTarget.style.display = "none";
    const tache = document.createElement("input");
    tache.setAttribute("type", "text");
    tache.setAttribute("placeholder", "Nouvelle tâche");
    tache.classList.add("tache")
    const ul = document.querySelector("#droite ul");
    const bAjt = document.createElement("button");
    bAjt.textContent = "Ajouter la tâche";
    bAjt.classList.add("bAjt");
    bAjt.addEventListener("click", ajouterTache);
    ul.after(tache);
    tache.after(bAjt);
}

function ajouterTache(event){
    document.getElementById("bnvTache").style.display = "inline-block";
    const ul = document.querySelector("#droite ul");
    const li = document.createElement("li");
    li.textContent = document.querySelector(".tache").value;
    li.dataset.isChecked = 0;
    li.dataset.rang = document.querySelectorAll("#droite ul li").length;
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("change", checkTache);
    const bSup = document.createElement("button");
    bSup.textContent = "Supprimer la tâche";
    bSup.addEventListener("click", suppTacheListe);
    li.append(checkbox);
    li.append(bSup);
    ul.append(li);
    listes[listeActuelle].push([document.querySelector(".tache").value, 0]);
    document.querySelector(".tache").remove();
    document.querySelector(".bAjt").remove();
    localStorage.setItem('listes', JSON.stringify(listes));
}