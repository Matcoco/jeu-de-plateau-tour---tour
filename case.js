class Case {

    constructor(caracteristique, position) {
        this.caracteristique = caracteristique;
        this.position = position;
        this.elementCase = document.createElement('div');
        this.creationCase();

    }


    creationCase() {
        if (this.caracteristique === "#") {
            this.elementCase.setAttribute("class", "obstacle");
            this.elementCase.setAttribute("data-position", `${this.position}`);
        }

        if (this.caracteristique === "_") {
            this.elementCase.setAttribute("class", "vide");
            this.elementCase.setAttribute("data-position", `${this.position}`);
        }
        
        if (this.caracteristique.type === "arme") {

            if (this.caracteristique.nom === "pistolet") {

                this.elementCase.setAttribute("id", "pistolet");
                this.elementCase.setAttribute("data-position", `${this.position}`);
            }
            if (this.caracteristique.nom === "grenade") {

                this.elementCase.setAttribute("id", "grenade");
                this.elementCase.setAttribute("data-position", `${this.position}`);
            }
            if (this.caracteristique.nom === "fusil à pompe") {

                this.elementCase.setAttribute("id", "fusil");
                this.elementCase.setAttribute("data-position", `${this.position}`);
            }
            if (this.caracteristique.nom === "couteau") {

                this.elementCase.setAttribute("id", "couteau");
                this.elementCase.setAttribute("data-position", `${this.position}`);
            }
            if (this.caracteristique.nom === "bazooka") {

                this.elementCase.setAttribute("id", "bazooka");
                this.elementCase.setAttribute("data-position", `${this.position}`);
            }
        }

        if (this.caracteristique.type === "joueur") {
            this.elementCase.setAttribute("id", `${this.caracteristique.joueur}`);
            this.elementCase.setAttribute("data-position", `${this.position}`);
        }
    }



}