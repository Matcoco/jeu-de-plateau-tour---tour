class Main {
    constructor() {
        this.colonne = 7;
        this.ligne = 7;
        this.tableauPrincipal = [];
        this.nbObstacle = 13;
        this.caractereObstacle = "#";

        this.tableauArme = [];
        this.tableauJoueur = [];
        this.nbPersoMax = 2;

        this.joueur1;
        this.joueur2;
        this.jeuTermine = false;
        this.texteWinner = "Youuppii!!";
        this.texteTour = "A moi de jouer!!";
        this.joueurTourId = null;
        this.boutonChoix = document.getElementById("boutonChoix");

        this.tourJoueurCombat = document.getElementById("tourJoueur");
        this.toggle = true;
        this.jeu = null;
        this.tableauPositionDisponible = [];
        this.tableauPositionDisponibleAleatoire = [];
        this.tableauPositionOrdreCroissant = [];

        this.phaseInitialisation = true;

        this.arme = [
            {
                type: "arme",
                nom: "bazooka",
                degat: 35
            },
            {
                type: "arme",
                nom: "pistolet",
                degat: 15
            },
            {
                type: "arme",
                nom: "grenade",
                degat: 25
            },
            {
                type: "arme",
                nom: "fusil à pompe",
                degat: 20
            },
            {
                type: "arme",
                nom: "couteau",
                degat: 10
            }
        ];

        this.nbArmeMax = this.arme.length - 1;

        this.personnage = [
            {
                type: "joueur",
                joueur: "j1",
                nom: "Alfred",
                vie: 100,
                image: "http://51.178.53.98/images/j1.jpg"
            },
            {
                type: "joueur",
                joueur: "j2",
                nom: "Cruella",
                vie: 100,
                image: "http://51.178.53.98/images/j2.jpg"
            }
        ];
    }

    /**
     * La fonction sert à générer un tableau à deux dimensions - 
     * @param {Array} nbColonne 
     * @param {Array} nbLigne 
     * @returns {Array} [ ][ ] // retourne un tableau à 2 dimensions
     */
    initialiserTableauVide(nbColonne, nbLigne) {
        let tableau = [];
        for (let i = 0; i < nbColonne; i++) {
            let ligne = [];
            for (let j = 0; j < nbLigne; j++) {
                ligne.push(" ");
                this.tableauPositionOrdreCroissant.push(`${j},${i}`);
            }
            tableau.push(ligne);
        }
        return tableau;
    }

    /**
     * La fonction sert à instancier de nouvelles armes
     * @param {object} arme
     * @returns {} void
     */
    creationArme(arme) {
        this.tableauArme.push(
            new Arme(
                arme.nom,
                arme.degat,
                arme.type
            )
        );
    }

    /**
    *La fonction sert à instancier de nouveau personnages
    * @param {object} personnage
    * @returns {} void
    */
    creationJoueur(personnage) {
        this.tableauJoueur.push(
            new Personnage(
                personnage.nom,
                personnage.vie,
                personnage.joueur,
                personnage.type,
                this.arme[this.arme.length - 1],
                personnage.image
            )
        );
    }

    /**
    * La fonction sert à mélanger un tableau qui comporte des position
    * @param {Array} tableauPosition // tableau
    * @returns {Array} tableauPosition - renvois un tableau de positions aléatoires
    */
    positionAleatoire(tableauPosition) {
        let tableauPositionAleatoire = tableauPosition.sort(() => { return .5 - Math.random(); });
        return tableauPositionAleatoire;
    }

    /**
    * La fonction sert attribue une position (case) unique et disponible pour chaque objet du jeu
    * @param {Array} tableau // tableau des Positions Aleatoires et Disponibles
    * @param {Number} nombreObjet // nombre qui va déterminer le nombre d'objets à créer  
    * @param {String} objet // chaine de caractere qui va déterminer la nature de l'objet
    * @returns {} void
    */
    utiliserPositionDisponible(tableauPositionAleatoire, nombreObjet, objet) {
        let positionX, positionY;
        for (let i = 0; i < nombreObjet; i++) {

            positionY = Number(tableauPositionAleatoire[i].split(",")[0]);
            positionX = Number(tableauPositionAleatoire[i].split(",")[1]);

            if (objet === "_") {

                this.tableauPrincipal[positionX][positionY] = new Case(objet, [positionX, positionY]);
            } else if (objet.type === "arme") {
                this.tableauPrincipal[positionX][positionY] = new Case(objet, [positionX, positionY]);
            } else if (objet.type === "joueur") {
                this.tableauPrincipal[positionX][positionY] = new Case(objet, [positionX, positionY]);
                objet.position = [positionX, positionY];
            } else if (objet === "#") {
                this.tableauPrincipal[positionX][positionY] = new Case(objet, [positionX, positionY]);
            }
        }
        tableauPositionAleatoire.splice(0, nombreObjet);
    }

    /**
     * La fonction sert à afficher le tableau principal à l'aide de l'objet html <table>
     * @param {*} tableau // tableau principal [][]
     * @returns {} void
     */
    afficherPlateauJeu(tableau) {

        let content = "<table border='1' cellspacing='0' cellpadding='0'>";
        for (let i = 0; i < tableau.length; i++) {
            content += "<tr>";
            for (let j = 0; j < tableau[i].length; j++) {
                if (typeof tableau[i][j].caracteristique === "string") {
                    content += "<td>" + tableau[i][j].elementCase.outerHTML + "</td>";
                } else {
                    content += "<td>" + tableau[i][j].elementCase.outerHTML + "</td>";
                }
            }
            content += "</tr>";
        }
        content += "</table>";
        plateau.innerHTML = content;
    }

    /**
     * La fonction sert à déterminer si les deux personnages sont à proximités, si c'est le cas, on ré initialise le tableau principal
     * @param {*} tableauPrincipal 
     * @returns {} void
     */
    personnageProximite() {
        if (this.joueur1.position[0] === this.joueur2.position[0] || this.joueur1.position[1] === this.joueur2.position[1]) {
            this.tableauJoueur = [];
            this.tableauArme = [];
            this.start();
        }
    }

    ////////////////////////////////////////////////
    /**
     * La fonction initialisation, phase de création du plateau, des joueurs et autres objets
     * @returns {} void
     */
    initialisationJeu() {
        // etape 1 : on initialise le tableau vide
        this.tableauPrincipal = this.initialiserTableauVide(this.colonne, this.ligne);

        // etape 2 : on créé un tableau en mélangeant les cases disponible aléatoirement
        this.tableauPositionDisponibleAleatoire = this.positionAleatoire(this.tableauPositionOrdreCroissant);

        // etape 3 : on place les obstacles
        this.utiliserPositionDisponible(this.tableauPositionDisponibleAleatoire, this.nbObstacle, this.caractereObstacle);

        // etape 4 : on place les armes sur le plateau de maniere aléatoire
        for (let i = 0; i < this.nbArmeMax; i++) {
            this.creationArme(this.arme[i]);
            this.utiliserPositionDisponible(this.tableauPositionDisponibleAleatoire, 1, this.tableauArme[i]);
        }

        // etape 5 : on place les personnages sur le plateau de maniere aléatoire

        for (let i = 0; i < this.nbPersoMax; i++) {
            this.creationJoueur(this.personnage[i]);
            this.utiliserPositionDisponible(this.tableauPositionDisponibleAleatoire, 1, this.tableauJoueur[i]);
        }


        // etape 6 : on place les cases vides restantes dans tableauCases
        const nbCaseVide = this.tableauPositionDisponibleAleatoire.length;
        for (let i = 0; i < nbCaseVide; i++) {
            this.utiliserPositionDisponible(this.tableauPositionDisponibleAleatoire, 1, "_");
        }

        this.joueur1 = this.tableauJoueur[0];
        this.joueur2 = this.tableauJoueur[1];

        this.personnageProximite(this.tableauPrincipal);
        this.partieEstJouable();

    }

    partieEstJouable() {
        let tabDeplacementJoueur = [];
        let nbPositionsJoueursTotal = null;

        for (let i = 0; i < this.tableauJoueur.length; i++) {
            this.jeu.setJoueurActif(this.tableauJoueur[i], true);
            this.jeu.deplacementJoueur();
            tabDeplacementJoueur.push(Array.from(this.jeu.tableauPositionJoueur));
        }

        nbPositionsJoueursTotal = tabDeplacementJoueur[0].length + tabDeplacementJoueur[1].length;

        if (nbPositionsJoueursTotal <= 14) {
            this.start();
        }
    }

    /**
     * La fonction sert à initialiser le jeu afin que le premier joueur commence
     * @returns {} void
     */
    start() {
        this.jeu = new Gameplay(this);

        this.initialisationJeu();

        this.jeu.setJoueurActif(this.joueur1, true);
        this.jeu.setJoueurActif(this.joueur2, false);

        this.definirEnnemi();
        this.joueurTourId = document.querySelector(`#tour${this.jeu.joueurEnCours.joueur}`);

        this.jeu.affichageTexteTourJoueur(this.texteTour);
        this.jeu.deplacementJoueur();

        this.jeu.affichageCaseJoueur(this.jeu.tableauPositionJoueur);

        this.afficherPlateauJeu(this.tableauPrincipal);

        this.tourJoueurCombat.innerHTML = "";
        this.boutonChoix.style.display = "none";
        this.toggle = true;
        this.jeuTermine = false;
        this.jeu.modeCombat = false;
        plateau.style.display = "block";
    }

    /**
     * La fonction va définir un ennemi, c'est à dire le joueur qui n'est pas actif
     * @returns {} void
     */
    definirEnnemi() {
        this.jeu.ennemi = this.jeu.joueurEnCours.joueur === "j1" ? this.joueur2 : this.joueur1;
    }

    /**
     * La fonction gestionJeu sert à la gestion du jeu tour à tour
     * @param {*} event // on récupère la position de la case qui a été cliqué pour effectuer les différents traitements
     * @returns {} void
     */
    gestionJeu(event) {

        if (!this.jeuTermine) {
            if (!this.jeu.modeCombat) {
                if (typeof event.target.dataset.position !== 'undefined') {
                    const position =  event.target.dataset.position.split(",").map(e => Number(e));
                    this.jeu.tour(position);
                }

            } else {

                this.jeu.jouerJoueur();
                this.definirEnnemi();
                this.jeu.affichagetourJoueurCombat();
                this.jeu.affichageTexteTourJoueur(main.texteTour);
            }
        }
        this.toggle = !this.toggle;
   
    }
}

let main = null;

function lancerJeu() {
    main = new Main();
    main.start();
}


document.addEventListener("DOMContentLoaded", () => {
    lancerJeu();
});


plateau.addEventListener("click", (event) => {
    main.gestionJeu(event);
});

relancer.addEventListener("click", () => {
    lancerJeu();
})


