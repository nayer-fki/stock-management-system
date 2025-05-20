import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common'; // Added CommonModule
import { Produit } from '../../Models/produit.model';

@Component({
  selector: 'app-add-product-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule // Added to support *ngFor
  ],
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.css']
})
export class AddProductDialogComponent {
  produit: Produit = { nom: '', categorie: '', prix: 0, fournisseur: '', seuilMin: 0 };
  selectedFile: File | null = null;
  categories: string[] = ['Electronics', 'Clothing', 'Books', 'Furniture']; // Predefined categories

  constructor(
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.produit) {
      this.produit = { ...data.produit };
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({ produit: this.produit, selectedFile: this.selectedFile });
  }
}
