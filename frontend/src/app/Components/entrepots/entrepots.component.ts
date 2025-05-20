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
import { HttpClientModule } from '@angular/common/http';
import { EntrepotService } from '../../Services/entrepot.service';
import { Entrepot } from '../../Models/entrepot.model';
import { AddEntrepotDialogComponent } from '../add-entrepot-dialog/add-entrepot-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-entrepots',
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
    MatButtonModule,
    HttpClientModule
  ],
  providers: [EntrepotService], // Temporarily provide at component level
  templateUrl: './entrepots.component.html',
  styleUrls: ['./entrepots.component.css']
})
export class EntrepotsComponent implements OnInit {
  entrepots: Entrepot[] = [];
  filteredEntrepots: Entrepot[] = [];
  searchTerm: string = '';
  errorMessage: string = '';

  constructor(private entrepotService: EntrepotService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadEntrepots();
  }

  async loadEntrepots(): Promise<void> {
    try {
      const entrepotsData = await firstValueFrom(this.entrepotService.getEntrepots());
      this.entrepots = entrepotsData || [];
      this.filterEntrepots();
      this.errorMessage = '';
    } catch (error: any) {
      console.error('Error loading entrepots:', error);
      this.entrepots = [];
      this.errorMessage = 'Failed to load warehouses. Please check your connection or credentials.';
    }
  }

  openAddEntrepotDialog(): void {
    const dialogRef = this.dialog.open(AddEntrepotDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          const createdEntrepot = await firstValueFrom(this.entrepotService.createEntrepot(result));
          if (createdEntrepot) {
            this.entrepots.push(createdEntrepot);
            this.filterEntrepots();
            this.errorMessage = '';
            console.log('Entrepot created successfully!');
          }
        } catch (error: any) {
          console.error('Error creating entrepot:', error);
          this.errorMessage = 'Failed to create warehouse. Please try again.';
        }
      }
    });
  }

  openEditEntrepotDialog(entrepot: Entrepot): void {
    const dialogRef = this.dialog.open(AddEntrepotDialogComponent, {
      width: '400px',
      data: { entrepot }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && entrepot.id) {
        try {
          const updatedEntrepot = await firstValueFrom(this.entrepotService.updateEntrepot(entrepot.id, result));
          if (updatedEntrepot) {
            const index = this.entrepots.findIndex(e => e.id === updatedEntrepot.id);
            if (index !== -1) {
              this.entrepots[index] = updatedEntrepot;
            }
            this.filterEntrepots();
            this.errorMessage = '';
            console.log('Entrepot updated successfully!');
          }
        } catch (error: any) {
          console.error('Error updating entrepot:', error);
          this.errorMessage = 'Failed to update warehouse. Please try again.';
        }
      }
    });
  }

  async deleteEntrepot(id: string | undefined): Promise<void> {
    if (!id || !confirm('Are you sure you want to delete this entrepot?')) return;

    try {
      await firstValueFrom(this.entrepotService.deleteEntrepot(id));
      this.entrepots = this.entrepots.filter(e => e.id !== id);
      this.filterEntrepots();
      this.errorMessage = '';
      console.log('Entrepot deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting entrepot:', error);
      this.errorMessage = 'Failed to delete warehouse. Please try again.';
    }
  }

  filterEntrepots(): void {
    this.filteredEntrepots = this.entrepots.filter(e =>
      e.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.adresse.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
