/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {

  tabCookies = [];
  tabClickedCookies = [];

  constructor(l , c) {
    this.nbLignes = l;
    this.nbColonnes = c;
    this.remplirTableauDeCookies(6);
  }

  getCookieFromLC(imgClicked) {
    let nbLignes = imgClicked.dataset.ligne;
    let nbColonnes = imgClicked.dataset.colonne;
    return this.tabCookies[nbLignes][nbColonnes];
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.nbColonnes);
      let colonne = index % this.nbColonnes;
      let img = this.tabCookies[ligne][colonne].htmlImage;

      console.log(img);
      // Ajout de l'écouteur
      img.onclick = (event) => {
        let ClickedImg = event.target;
        let clickedCookie = this.getCookieFromLC(ClickedImg);
        console.log("Ligne : " + clickedCookie.ligne + " Colonne : " + clickedCookie.colonne + " Type : " + clickedCookie.type);
        clickedCookie.selectionnee();

        // 1ère cookie cliquée
        if (this.tabClickedCookies.length === 0) {
          this.tabClickedCookies.push(clickedCookie);
        } else if (this.tabClickedCookies.length === 1) {
          // 2ème cookie cliquée
          this.tabClickedCookies.push(clickedCookie);

          if (this.possibleSwap()) {
            console.log("swap");
            this.swapCookies();
          } else {
            console.log("SWAP IMPOSSIBLE");
          }
          // Vidage tableau et déselection des cookies
          this.tabClickedCookies[0].deselectionnee();
          this.tabClickedCookies[1].deselectionnee();
          this.tabClickedCookies = [];
        }
      };

      // Drag n drop
      img.ondragstart = (evt) => {
        console.log("dragstart");
        let ClickedImg = evt.target;
        let l = ClickedImg.dataset.ligne;
        let c = ClickedImg.dataset.colonne;
        let draggedCookie = this.tabCookies[l][c];

        this.tabClickedCookies = [];
        this.tabClickedCookies.push(draggedCookie);
        draggedCookie.selectionnee();
      };

      img.ondragover = (evt) => {
        return false;
      };

      img.ondragenter = (evt) => {
        console.log("ondragenter");
        let img = evt.target;
        img.classList.add("grilleDragOver");
      };

      img.ondragleave = (evt) => {
        console.log("ondragleave");
        let img = evt.target;
        img.classList.remove("grilleDragOver");
      };

      img.ondrop = (evt) => {
        console.log("ondrop");
        let imgDrop = evt.target;
        let l = imgDrop.dataset.ligne;
        let c = imgDrop.dataset.colonne;
        let cookieSurZoneDeDrop = this.tabCookies[l][c];

        this.tabClickedCookies.push(cookieSurZoneDeDrop);

        if (this.swapPossible()) {
          console.log("swap");
          this.swapCookies();
        } else {
          console.log("SWAP IMPOSSIBLE");
        }
        this.tabClickedCookies[0].deselectionnee();
        this.tabClickedCookies[1].deselectionnee();
        imgDrop.classList.remove("grilleDragOver");

        this.tabClickedCookies = [];
      };
      
      div.appendChild(img);
    });
  }

  remplirTableauDeCookies(nbDeCookiesDifferents) {
   this.tabCookies= create2DArray(this.nbLignes);

    for(let i=0; i<this.nbLignes; i++) {
      for(let j=0; j<this.nbColonnes; j++) {
        let type = Math.floor(nbDeCookiesDifferents * Math.random());
        console.log(type);
        this.tabCookies[i][j] = new Cookie(type, i, j);
        console.log(this.tabCookies[i][j]);
      }
    }
  }

  possibleSwap() {
    let cookie1 = this.tabClickedCookies[0];
    let cookie2 = this.tabClickedCookies[1];
    return Cookie.distance(cookie1, cookie2) === 1;
  }

  swapCookies() {
    let cookie1 = this.tabClickedCookies[0];
    let cookie2 = this.tabClickedCookies[1];

    let tmpType = cookie1.type;
    let tmpImgSrc = cookie1.htmlImage.src;

    cookie1.type = cookie2.type;
    cookie1.htmlImage.src = cookie2.htmlImage.src;

    cookie2.type = tmpType;
    cookie2.htmlImage.src = tmpImgSrc;
    
    do {
      this.chuteCookies;
    } while(this.detectAllalignments);
  }

  detectAllalignments() {
    this.nbAlignements = 0;

    // For each line
    for (let l = 0; l < this.nbLignes; l++) {
      this.detecterMatch3Lignes(l);
    }
    // For each column
    for (let c = 0; c < this.nbColonnes; c++) {
      this.detecterMatch3Colonnes(c);
    }

    return this.nbAlignements !== 0;
  }

  detecterMatch3Lignes(numLigne) {
    let ligneGrille = this.tabCookies[numLigne];

    for (let l = 0; l <= this.nbColonnes - 3; l++) {
      let cookie1 = ligneGrille[l];
      let cookie2 = ligneGrille[l + 1];
      let cookie3 = ligneGrille[l + 2];

      if (cookie1.type === cookie2.type && cookie1.type === cookie3.type) {
        console.log(cookie1);
        // on marque les trois
        cookie1.supprimer();
        cookie2.supprimer();
        cookie3.supprimer();
        this.nbAlignements++;
      }
    }
  }

  detecterMatch3Colonnes(numColonne) {
    // on veut afficher les cookies situées sur une colonne donnée
    for (let ligne = 0; ligne <= this.nbLignes - 3; ligne++) {
      let cookie1 = this.tabCookies[ligne][numColonne];
      let cookie2 = this.tabCookies[ligne + 1][numColonne];
      let cookie3 = this.tabCookies[ligne + 2][numColonne];

      if (cookie1.type === cookie2.type && cookie1.type === cookie3.type) {
        // on marque les trois
        cookie1.supprimer();
        cookie2.supprimer();
        cookie3.supprimer();

        this.nbAlignements++;
      }
    }
  }

  // Simule une remontée des éléments à supprimer, puis les supprime.
  chuteCookies(){
    for(let l = this.nbLignes-1; l>0; l--){
      for(let c = 0 ; c<this.nbColonnes ; c++){
        // Element à supprimer
        if(this.tabCookies[l][c].isASupprimer()){
          let caseSuperieure = l-1;
          let lastLine = new Boolean("false");
          // Recherche d'un Element au-dessus qui ne doit pas être supprimé
          while(this.tabCookies[caseSuperieure][c].isASupprimer() && !lastLine) {
            console.log(l);
            caseSuperieure--;
            if(caseSuperieure==-1) {
              lastLine = "true";
            }
          }
          // Swap des deux éléments
          Cookie.swapCookies(this.tabCookies[caseSuperieure][c], this.tabCookies[l][c])
          this.tabCookies[caseSuperieure][c].supprimer();
          this.tabCookies[l][c].annulerASupprimer();
        }
      }
    }
    this.replaceDeletedCookies();
  }

  replaceDeletedCookies(){
    for(let l = this.nbLignes-1 ; l>=0 ; l--){
      for(let c = 0 ; c<this.nbColonnes ; c++){
        if(this.tabCookies[l][c].isASupprimer()){
            this.tabCookies[l][c].type = Math.floor(this.nbCookiesDifferents * Math.random());
            this.tabCookies[l][c].htmlImage.src = Cookie.urlsImagesNormales[this.tabCookies[l][c].type];
            this.tabCookies[l][c].annulerASupprimer();
        }
      }
    }
  }

  highlightAllCookies() {
    // For each line
    for (let l = 0; l < this.nbLignes; l++) {
      this.highlightMatch3Lignes(l);
    }
    // For each column
    for (let c = 0; c < this.nbColonnes; c++) {
      this.highlightMatch3Colonnes(c);
    }
  }

  highlightMatch3Lignes(numLigne) {
    let ligneGrille = this.tabCookies[numLigne];

    for (let l = 0; l <= this.nbColonnes - 3; l++) {
      let cookie1 = ligneGrille[l];
      let cookie2 = ligneGrille[l + 1];
      let cookie3 = ligneGrille[l + 2];

      if (cookie1.type === cookie2.type && cookie1.type === cookie3.type) {
        console.log(cookie1);
        // on marque les trois
        cookie1.selectionnee();
        cookie2.selectionnee();
        cookie3.selectionnee();
        this.nbAlignements++;
      }
    }
  }

  highlightMatch3Colonnes(numColonne) {
    // on veut afficher les cookies situées sur une colonne donnée
    for (let ligne = 0; ligne <= this.nbLignes - 3; ligne++) {
      let cookie1 = this.tabCookies[ligne][numColonne];
      let cookie2 = this.tabCookies[ligne + 1][numColonne];
      let cookie3 = this.tabCookies[ligne + 2][numColonne];

      if (cookie1.type === cookie2.type && cookie1.type === cookie3.type) {
        // on marque les trois
        cookie1.selectionnee();
        cookie2.selectionnee();
        cookie3.selectionnee();

        this.nbAlignements++;
      }
    }
  }
}