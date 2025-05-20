import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Stock, MouvementStock } from '../Models/stock.model';

export interface Product {
  id: string;
  nom: string;
  categorie: string;
  prix: number;
  fournisseur: string;
}

export interface Entrepot {
  id: string;
  nom: string;
  adresse: string;
  capacite: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8080/api';
  private produitsApiUrl = `${this.apiUrl}/produits`;
  private entrepotsApiUrl = `${this.apiUrl}/entrepots`;
  private stocksApiUrl = `${this.apiUrl}/stocks`;
  private mouvementsApiUrl = `${this.apiUrl}/mouvements`;

  private username = 'user';
  private password = '31eacca7-cb77-43f6-870f-4aa4bddcbe30';

  constructor(private http: HttpClient) {}

  private createAuthHeaders(): HttpHeaders {
    const auth = btoa(`${this.username}:${this.password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    });
  }

  getProduits(): Observable<Product[]> {
    return this.http.get<Product[]>(this.produitsApiUrl, { headers: this.createAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }

  getProduitsByNom(nom: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.produitsApiUrl}/by-name?nom=${encodeURIComponent(nom)}`, { headers: this.createAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error searching products by name:', error);
        return throwError(() => new Error('Failed to search products by name'));
      })
    );
  }

  getEntrepots(): Observable<Entrepot[]> {
    return this.http.get<Entrepot[]>(this.entrepotsApiUrl, { headers: this.createAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching entrepots:', error);
        return throwError(() => new Error('Failed to fetch entrepots'));
      })
    );
  }

  getEntrepotsByNom(nom: string): Observable<Entrepot[]> {
    return this.http.get<Entrepot[]>(`${this.entrepotsApiUrl}/by-name?nom=${encodeURIComponent(nom)}`, { headers: this.createAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error searching entrepots by name:', error);
        return throwError(() => new Error('Failed to search entrepots by name'));
      })
    );
  }

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.stocksApiUrl, { headers: this.createAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching stocks:', error);
        return throwError(() => new Error('Failed to fetch stocks'));
      })
    );
  }

  createStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.stocksApiUrl, stock, { headers: this.createAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error creating stock:', error);
        return throwError(() => new Error('Failed to create stock'));
      })
    );
  }

  updateStock(id: string, stock: Stock): Observable<Stock> {
    return this.http.put<Stock>(`${this.stocksApiUrl}/${id}`, stock, { headers: this.createAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error updating stock:', error);
        return throwError(() => new Error('Failed to update stock'));
      })
    );
  }

  deleteStock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.stocksApiUrl}/${id}`, { headers: this.createAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error deleting stock:', error);
        return throwError(() => new Error('Failed to delete stock'));
      })
    );
  }

  addStockMovement(mouvement: MouvementStock): Observable<void> {
    return this.http.post<void>(this.mouvementsApiUrl, mouvement, { headers: this.createAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error adding stock movement:', error);
        return throwError(() => new Error('Failed to add stock movement'));
      })
    );
  }
}
