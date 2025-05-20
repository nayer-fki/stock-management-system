export interface Stock {
  id?: string;
  quantite: number;
  seuilAlerte: number;
  produitId: string;
  entrepotId: string;
}

export interface MouvementStock {
  id?: string;
  produitId: string;
  type: 'ENTREE' | 'SORTIE';
  quantite: number;
  date?: Date;
  entrepotId: string;
}

export interface Product {
  id: string;
  nom: string;
  categorie?: string;
  prix?: number;
  fournisseur?: string;
  seuilMin?: number;
  image?: string;
}

export interface Entrepot {
  id: string;
  nom: string;
  adresse?: string;
  capacite?: number;
}
