import { Injectable } from '@angular/core';
  import axios from 'axios';
  import { Produit } from '../Models/produit.model';

  @Injectable({
    providedIn: 'root'
  })
  export class ProduitService {
    private readonly apiUrl = 'http://localhost:8080/api/produits';
    private readonly authHeader = {
      headers: {
        'Authorization': 'Basic ' + btoa('user:31eacca7-cb77-43f6-870f-4aa4bddcbe30')
      }
    };

    async createProduit(produit: Produit, image?: File): Promise<Produit> {
      const formData = new FormData();
      formData.append('nom', produit.nom);
      formData.append('categorie', produit.categorie);
      formData.append('prix', produit.prix.toString());
      formData.append('fournisseur', produit.fournisseur);
      formData.append('seuilMin', produit.seuilMin.toString());
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(this.apiUrl, formData, {
        ...this.authHeader,
        headers: {
          ...this.authHeader.headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    }

    async getProduits(): Promise<Produit[]> {
      const response = await axios.get(this.apiUrl, this.authHeader);
      return response.data;
    }

    async updateProduit(id: string, produit: Produit, image?: File): Promise<Produit> {
      const formData = new FormData();
      formData.append('nom', produit.nom);
      formData.append('categorie', produit.categorie);
      formData.append('prix', produit.prix.toString());
      formData.append('fournisseur', produit.fournisseur);
      formData.append('seuilMin', produit.seuilMin.toString());
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.put(`${this.apiUrl}/${id}`, formData, {
        ...this.authHeader,
        headers: {
          ...this.authHeader.headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    }

    async deleteProduit(id: string): Promise<void> {
      await axios.delete(`${this.apiUrl}/${id}`, this.authHeader);
    }
  }
