

class Personnage {
    /**
    * @param {String} nom
    * @param {Number} vie
    * @param {String} joueur
    * @param {String} type
    * @param {Object} arme - contient un Object arme
    * @param {String} image
    * @param {Boolean} bouclier
    */
    constructor(nom, vie, joueur, type, arme, image, bouclier = false) {
        this.nom = nom;
        this.vie = vie;
        this.joueur = joueur;
        this.type = type;
        this.arme = arme;
        this.elementNomArmeJoueur = null;
        this.position = [];
        this.bouclier = bouclier;
        this.affichageInfosJoueur();
        this.image = image;
        this.afficherImage();
    }

    /**
    * La fonction sert à la gestion de l'affichage des informations du personnage
    * @returns {} void 
    */
    affichageInfosJoueur() {
        this.elementNomArmeJoueur = document.getElementById(`infos${this.joueur}`).innerHTML = `<p class="detail_infos"><img class="icons"src='http://51.178.53.98/images/nom.png'/> : <span>${this.nom}</span></p><p class="detail_infos"><img class="icons"src='http://51.178.53.98/images/vie.png'/> : <span>${this.vie}</span></p><p class="detail_infos"><img class="icons"src='http://51.178.53.98/images/arme.png'/> : <span>${this.arme.nom}</span></p></p><p class="detail_infos"><img class="icons"src='http://51.178.53.98/images/degat.png'/> : <span>${this.arme.degat}</span><p class="detail_infos"><img class="icons"src='http://51.178.53.98/images/bouclier.png'/> : <span>${this.bouclier ? "Activé" : "Désactivé"}</span></p>`
    }

    /**
    * La fonction sert à la gestion de l'attaque de l'ennemi
    * @param {Object} ennemi
    * @returns {} void 
    */
    attaquer(ennemi) {
        if (ennemi.bouclier) {
            ennemi.vie -= this.arme.degat / 2;
            ennemi.bouclier = false;
            ennemi.affichageInfosJoueur();
        } else {
            ennemi.vie -= this.arme.degat;
            ennemi.affichageInfosJoueur();
        }

        if (ennemi.vie < 0) {
            ennemi.vie = 0;
            ennemi.affichageInfosJoueur();
        }
    }

    /**
    * La fonction sert à la gestion du personnage
    * @returns {} void 
    */
    seDefendre() {
        this.bouclier = true;
        this.affichageInfosJoueur();
    }

    /**
    * La fonction sert à la gestion de l'image du personnage lors de sa création
    * @returns {} void 
    */
    afficherImage() {
        if (this.joueur === "j1") {
            imagej1.src = this.image;
        } else {
            imagej2.src = this.image;
        }
    }
}