import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { Utilisateur } from '../Models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private readonly apiUrl = 'http://localhost:8080/api/utilisateurs';
  private readonly authHeader = {
    headers: {
      'Authorization': 'Basic ' + btoa('user:31eacca7-cb77-43f6-870f-4aa4bddcbe30')
    }
  };

  async getUtilisateurs(): Promise<Utilisateur[]> {
    try {
      const response = await axios.get(this.apiUrl, this.authHeader);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error('Failed to fetch users: ' + (axiosError.response?.data || axiosError.message));
    }
  }

  async createUtilisateur(utilisateur: Utilisateur, image?: File): Promise<Utilisateur> {
    try {
      const formData = new FormData();
      formData.append('nom', utilisateur.nom);
      formData.append('email', utilisateur.email);
      formData.append('role', utilisateur.role);
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
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error('Failed to create user: ' + (axiosError.response?.data || axiosError.message));
    }
  }

  async updateUtilisateur(id: string, utilisateur: Utilisateur, image?: File): Promise<Utilisateur> {
    try {
      const formData = new FormData();
      formData.append('nom', utilisateur.nom);
      formData.append('email', utilisateur.email);
      formData.append('role', utilisateur.role);
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
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error('Failed to update user: ' + (axiosError.response?.data || axiosError.message));
    }
  }

  async deleteUtilisateur(id: string): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/${id}`, this.authHeader);
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error('Failed to delete user: ' + (axiosError.response?.data || axiosError.message));
    }
  }
}
