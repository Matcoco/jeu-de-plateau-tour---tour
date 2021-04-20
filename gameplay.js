const Gameplay = class Gameplay {
    /**
     * 
     * @param {Object} main 
     */
    constructor(main) {
        this.joueurActif = null;
        this.joueurEnCours = null;
        this.tableauArmeADeposer = [];
        this.tableauPositionJoueur = [];
        this.modeCombat = false;
        this.ennemi = null;
        this.main = main;
        this.peutDeposerArme = false;
    }

    /**
     * La fonction permet de définir le joueur en cours et s'il est actif
     * @param {Object} joueur - Object Personnage
     * @param {Boolean} bool 
     * @returns {} void
     */
    setJoueurActif(joueur, bool) {
        this.joueurActif = bool;
        if (this.joueurActif) {
            this.joueurEnCours = joueur;
        }
    }



    /**
     * La fonction sert à déterminer le déplacement du joueur en fonction de sa position actuelle 
     * @returns {} void
     */
    deplacementJoueur() {

        this.tableauPositionJoueur = [];
        let count = 0;

        let longLigne = this.main.ligne;
        let ligne = this.main.tableauPrincipal[this.joueurEnCours.position[0]];


        //deplacement horizontale vers la droite depuis la position du joueur
        for (let i = this.joueurEnCours.position[1] + 1; i < longLigne; i++) {
            if (ligne[i].caracteristique === "#") {
                break;
            } else if (count < 3) {
                this.tableauPositionJoueur.push(ligne[i].position);
                count++;
            }
        }

        //deplacement horizontale vers la gauche depuis la position du joueur
        count = 0;
        for (let j = this.joueurEnCours.position[1] - 1; j >= 0; j--) {
            if (ligne[j].caracteristique === "#") {
                break;
            } else if (count < 3) {
                this.tableauPositionJoueur.push(ligne[j].position);
                count++;
            }
        }

        //deplacement vertical vers le haut depuis la position du joueur
        let x = this.joueurEnCours.position[0] - 1;
        x < 0 && (x = 0); // si x = -1 && (x = 0)
     
        count = 0;

        if (x < this.joueurEnCours.position[0]) {
            for (let i = x; i >= 0; i--) {
                if (this.main.tableauPrincipal[i][this.joueurEnCours.position[1]].caracteristique === "#") {
                    break;
                } else if (count < 3) {
                    this.tableauPositionJoueur.push(this.main.tableauPrincipal[i][this.joueurEnCours.position[1]].position);
                    count++;
                }
            }
        }

        //deplacement vertical vers le bas depuis la position du joueur
        x = this.joueurEnCours.position[0] + 1;
        x > this.main.tableauPrincipal.length - 1 && (x = this.main.tableauPrincipal.length - 1);

        if (x > this.joueurEnCours.position[0]) {
            count = 0;
            for (let i = this.joueurEnCours.position[0] + 1; i < this.main.tableauPrincipal.length; i++) {
                if (this.main.tableauPrincipal[i][this.joueurEnCours.position[1]].caracteristique === "#") {
                    break;
                } else if (count < 3) {
                    this.tableauPositionJoueur.push(this.main.tableauPrincipal[i][this.joueurEnCours.position[1]].position);
                    count++;
                }
            }
        }

        if (!this.main.phaseInitialisation) {
            this.affichageCaseJoueur(this.tableauPositionJoueur);
        }
    }

    /**
     * La fonction affichageCaseJoueur sert à indiquer visuellement les cases de déplacement posible du joueur en cours
     * @param {Array} tableau 
     * @param {Boolean} show 
     */
    affichageCaseJoueur(tableau, show) {
        show = show !== false;
        for (let i = 0; i < tableau.length; i++) {
            let x = tableau[i][0];
            let y = tableau[i][1];
            this.main.tableauPrincipal[x][y].elementCase.innerHTML = show ? `<span class="cliquer"></span>` : "";
        }
    }

    /**
     * La fonction "changementPosition" sert à se alimenter la variable "tableauPrincipal"
     * si le personnage est sur un case vide, alors on créé une case vide à la case d'où provient le joueur et on recréé le personnage à la nouvelle position
     * si le personnage est sur une case arme, alors l'arme est récupérée par le joueur
     * @param {Array} position
     * @returns {} void
     */
    changementPosition(position) {

        this.main.tableauPrincipal[this.joueurEnCours.position[0]][this.joueurEnCours.position[1]] = new Case("_", this.joueurEnCours.position);
        this.main.tableauPrincipal[position[0]][position[1]] = new Case(this.joueurEnCours, position);
        this.joueurEnCours.position = position;

        // boucle qui se charge de déposer l'arme du joueur au prochain tour lorsque ce dernier est tombé sur une case arme.
        for (let i = 0; i < this.tableauArmeADeposer.length; i++) {
            if (this.tableauArmeADeposer[i].joueur === this.joueurEnCours.joueur) {
                if (this.tableauArmeADeposer[i].deposerArme) {
                    let x = this.tableauArmeADeposer[i].position[0];
                    let y = this.tableauArmeADeposer[i].position[1];
                    this.main.tableauPrincipal[x][y] = new Case(this.tableauArmeADeposer[i].ancienneArme, this.tableauArmeADeposer[i].position);
                    this.tableauArmeADeposer.splice(i, 1);
                    break;
                } else {
                    this.tableauArmeADeposer[i].deposerArme = true;
                }
            }
        }
    }


    /**
     * La fonction permet d'enregistrer l'anncienne arme du joueur lorsqu'il tombe sur une case arme. Un objet est créé et envoyé dans tableauArmeADeposer
     * @param {Array} position
     * @returns {} void 
     */
    enregistrerAncienneArme(position) {

        this.tableauArmeADeposer.unshift({
            joueur: this.joueurEnCours.joueur,
            ancienneArme: this.joueurEnCours.arme,
            deposerArme: this.peutDeposerArme,
            position: position
        });
    }

    /**
     * Lorsque le joueur tombe sur une case Arme, la fonction affecterNouvelleArmeAuJoueur ajoute la nouvelle arme dans l'objet du joueur en cours
     * @param {Array} position 
     * @returns {} void
     */
    affecterNouvelleArmeAuJoueur(position) {
        this.joueurEnCours.arme = this.main.tableauPrincipal[position[0]][position[1]].caracteristique;
    }

    /**
     * La fonction verificationCase sert à vérifier si la case sélectionnée par le clique du joueur se trouve bien dans "tableauPositionJoueur" 
     * @param {Array} position
     * @returns {Boolean} bool
     */
    verificationCase(position) {
        let bool = !this.tableauPositionJoueur.every(e => e.toString() !== position.toString());
        return bool;
    }

    /**
     * La fonction sert à attaquer un ennemi, cette fonction sera utilisée par le joueurEnCours
     * @returns {} void
     */
    attaquer() {
        this.joueurEnCours.attaquer(this.ennemi);
        if (this.ennemi.vie <= 0) {
            this.gagnerPartie();
        }
        this.main.gestionJeu();
    }

    /**
    * La fonction sert à activer un bouclier afin de défendre le joueurEnCours
    * @returns {} void
    */
    seDefendre() {
        this.joueurEnCours.seDefendre();
        this.main.gestionJeu();
    }

    /**
     * @returns {} void
     */
    gagnerPartie() {
        this.main.jeuTermine = true;
        this.main.boutonChoix.style.display = "none";

        document.querySelector(`#image${this.ennemi.joueur}`).src = "http://51.178.53.98/images/rip.png";

        tourJoueur.innerHTML = `<span class="couleurJoueur">${this.joueurEnCours.nom}</span> a gagné la partie!!!`;
        this.affichageTexteTourJoueur(this.main.texteWinner);
        relancer.style.display = "block";
    }


    /**
     * La fonction sert à afficher un texte en mode combat.
     * @returns {} void
     */
    affichagetourJoueurCombat() {
        this.main.tourJoueurCombat.innerHTML = `<span class="couleurJoueur">${this.joueurEnCours.nom}</span>, que veux-tu effectuer comme action ?`;
    }

    /**
     * La fonction jouerJoueur va activer le tour du joueur suivant à l'aide de la variable toggle présent dans le fichier main.js dans la fonction "gestionJeu(event)"
     * @returns {} void
     */
    jouerJoueur() {
        this.setJoueurActif(this.main.joueur1, !this.main.toggle);
        this.setJoueurActif(this.main.joueur2, this.main.toggle);
    }

    /**
    * La fonction affiche une phrase au dessus de son avatar et qui signale le tour du joueur
    * @returns {} void
    */
    affichageTexteTourJoueur(texte) {
        this.main.joueurTourId.innerHTML = "";
        this.main.joueurTourId = document.querySelector(`#tour${this.joueurEnCours.joueur}`);
        this.main.joueurTourId.innerHTML = texte;
    }

    /**
     * La fonction tour va déterminer plusieurs fonctionnalités à chaque tour du joueur
     *  - savoir si la case selectionnée est une case valide
     *  - connaitre la nature de la case sélectionnée
     *  - changement de position
     *  ect..
     * @param {Array} position 
     * @returns {} void
     */
    tour(position) {
        if (this.verificationCase(position)) {

            if (typeof this.main.tableauPrincipal[position[0]][position[1]].caracteristique === 'object') {
                //si on clique sur un objet arme
                if (this.main.tableauPrincipal[position[0]][position[1]].caracteristique.type === 'arme') {
                    this.enregistrerAncienneArme(position);
                    this.affecterNouvelleArmeAuJoueur(position);
                    this.joueurEnCours.affichageInfosJoueur();
                }
                //si on clique sur un objet personnage
                if (this.main.tableauPrincipal[position[0]][position[1]].caracteristique.type === 'joueur') {
                    this.main.boutonChoix.style.display = "block";
                    plateau.style.display = "none";
                    this.modeCombat = true;
                    combat.style.display = "flex";
                    combat.style.justifyContent = "center";

                }
            }

            this.changementPosition(position);
            this.affichageCaseJoueur(this.tableauPositionJoueur, false);

            this.jouerJoueur();
            this.affichageTexteTourJoueur(this.main.texteTour);
            this.deplacementJoueur();
            this.main.definirEnnemi();

            this.affichageCaseJoueur(this.tableauPositionJoueur, true);
            this.main.afficherPlateauJeu(this.main.tableauPrincipal);

            if (this.modeCombat) {
                this.affichagetourJoueurCombat();
                relancer.style.display = "none";
            }
        } else {
            this.main.toggle = !this.main.toggle;
        }
    }
}
