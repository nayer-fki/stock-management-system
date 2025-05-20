import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../Services/produit.service';
import { Produit } from '../../Models/produit.model';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  searchTerm: string = '';
  filterCategory: string = '';
  categories: string[] = [];

  constructor(private produitService: ProduitService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  async loadProduits() {
    try {
      this.produits = await this.produitService.getProduits();
      this.filteredProduits = [...this.produits];
      this.categories = [...new Set(this.produits.map(p => p.categorie))];
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Failed to load products');
    }
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.produitService.createProduit(result.produit, result.selectedFile);
          alert('Product created successfully!');
          this.loadProduits();
        } catch (error: any) {
          console.error('Error creating product:', error);
          alert('Error creating product: ' + (error.response?.data || error.message));
        }
      }
    });
  }

  openEditProductDialog(produit: Produit): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '400px',
      data: { produit }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && produit.id) {
        try {
          await this.produitService.updateProduit(produit.id, result.produit, result.selectedFile);
          alert('Product updated successfully!');
          this.loadProduits();
        } catch (error: any) {
          console.error('Error updating product:', error);
          alert('Error updating product: ' + (error.response?.data || error.message));
        }
      }
    });
  }

  async deleteProduit(id?: string): Promise<void> {
    if (id && confirm('Are you sure you want to delete this product?')) {
      try {
        await this.produitService.deleteProduit(id);
        alert('Product deleted successfully!');
        this.loadProduits();
      } catch (error: any) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + (error.response?.data || error.message));
      }
    }
  }

  filterProducts(): void {
    this.filteredProduits = this.produits.filter(produit =>
      (produit.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       produit.fournisseur.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.filterCategory ? produit.categorie === this.filterCategory : true)
    );
  }
}
