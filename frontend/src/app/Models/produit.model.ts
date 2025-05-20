export interface Produit {
    id?: string;
    nom: string;
    categorie: string;
    prix: number;
    fournisseur: string;
    seuilMin: number;
    image?: string; // Base64-encoded image string
  }
