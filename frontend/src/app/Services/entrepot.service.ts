import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Entrepot } from '../Models/entrepot.model';

@Injectable({
  providedIn: 'root'
})
export class EntrepotService {
  private apiUrl = 'http://localhost:8080/api/entrepots';

  private username = 'user';
  private password = '31eacca7-cb77-43f6-870f-4aa4bddcbe30';

  private createAuthHeaders(): HttpHeaders {
    const auth = btoa(`${this.username}:${this.password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    });
  }

  constructor(private http: HttpClient) {}

  getEntrepots(): Observable<Entrepot[]> {
    return this.http.get<Entrepot[]>(this.apiUrl, { headers: this.createAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createEntrepot(entrepot: Entrepot): Observable<Entrepot> {
    return this.http.post<Entrepot>(this.apiUrl, entrepot, { headers: this.createAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateEntrepot(id: string, entrepot: Entrepot): Observable<Entrepot> {
    return this.http.put<Entrepot>(`${this.apiUrl}/${id}`, entrepot, { headers: this.createAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteEntrepot(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.createAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error.status, error.message);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
