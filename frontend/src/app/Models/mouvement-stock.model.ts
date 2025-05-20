export interface MouvementStock {
    id?: string;
    produitId: string;
    type: 'ENTREE' | 'SORTIE';
    quantite: number;
    date?: Date;
    entrepotId: string;
  }
