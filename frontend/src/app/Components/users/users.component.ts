import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { UtilisateurService } from '../../Services/utilisateur.service';
import { Utilisateur } from '../../Models/utilisateur.model';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  utilisateurs: Utilisateur[] = [];
  filteredUtilisateurs: Utilisateur[] = [];
  searchTerm: string = '';
  filterRole: string = '';

  constructor(private utilisateurService: UtilisateurService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  async loadUtilisateurs(): Promise<void> {
    try {
      this.utilisateurs = await this.utilisateurService.getUtilisateurs();
      this.filterUtilisateurs();
    } catch (error: any) {
      console.error('Error loading users:', error);
    }
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          const createdUtilisateur = await this.utilisateurService.createUtilisateur(result.formUtilisateur, result.imageFile);
          this.utilisateurs.push(createdUtilisateur);
          this.filterUtilisateurs();
          console.log('User created successfully!');
        } catch (error: any) {
          console.error('Error creating user:', error);
        }
      }
    });
  }

  openEditUserDialog(utilisateur: Utilisateur): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      data: { utilisateur }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && utilisateur.id) {
        try {
          const updatedUtilisateur = await this.utilisateurService.updateUtilisateur(
            utilisateur.id,
            result.formUtilisateur,
            result.imageFile
          );
          const index = this.utilisateurs.findIndex(u => u.id === updatedUtilisateur.id);
          if (index !== -1) {
            this.utilisateurs[index] = updatedUtilisateur;
          }
          this.filterUtilisateurs();
          console.log('User updated successfully!');
        } catch (error: any) {
          console.error('Error updating user:', error);
        }
      }
    });
  }

  async deleteUtilisateur(id: string | undefined): Promise<void> {
    if (!id || !confirm('Are you sure you want to delete this user?')) return;

    try {
      await this.utilisateurService.deleteUtilisateur(id);
      this.utilisateurs = this.utilisateurs.filter(u => u.id !== id);
      this.filterUtilisateurs();
      console.log('User deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting user:', error);
    }
  }

  filterUtilisateurs(): void {
    this.filteredUtilisateurs = this.utilisateurs.filter(u =>
      (u.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       u.email.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.filterRole ? u.role === this.filterRole : true)
    );
  }

  getUniqueRoles(): string[] {
    return [...new Set(this.utilisateurs.map(u => u.role))];
  }
}
