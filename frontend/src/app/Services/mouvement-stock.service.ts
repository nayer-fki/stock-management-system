import { Injectable } from '@angular/core';
  import axios from 'axios';
  import { MouvementStock } from '../Models/mouvement-stock.model';

  @Injectable({
    providedIn: 'root'
  })
  export class MouvementStockService {
    private readonly apiUrl = 'http://localhost:8080/api/mouvements';
    private readonly authHeader = {
      headers: {
        'Authorization': 'Basic ' + btoa('user:31eacca7-cb77-43f6-870f-4aa4bddcbe30')
      }
    };

    async createMouvementStock(mouvement: MouvementStock): Promise<MouvementStock> {
      const response = await axios.post(this.apiUrl, mouvement, this.authHeader);
      return response.data;
    }

    async getMouvementStocks(): Promise<MouvementStock[]> {
      const response = await axios.get(this.apiUrl, this.authHeader);
      return response.data;
    }
  }
