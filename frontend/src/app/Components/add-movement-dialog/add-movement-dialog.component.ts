import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { MouvementStock } from '../../Models/stock.model';
import { StockService, Product, Entrepot } from '../../Services/stock.service';
import { firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-movement-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    HttpClientModule
  ],
  providers: [StockService],
  templateUrl: './add-movement-dialog.component.html',
  styleUrls: ['./add-movement-dialog.component.css']
})
export class AddMovementDialogComponent implements OnInit {
  movementForm: FormGroup;
  mouvement: MouvementStock;
  products: Product[] = [];
  entrepots: Entrepot[] = [];
  filteredProducts: Product[] = [];
  filteredEntrepots: Entrepot[] = [];
  errorMessage: string = '';
  productSearchControl = new FormControl();
  entrepotSearchControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<AddMovementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { produitId?: string; entrepotId?: string },
    private fb: FormBuilder,
    private stockService: StockService
  ) {
    this.mouvement = {
      produitId: this.data.produitId || '',
      type: 'ENTREE',
      quantite: 0,
      entrepotId: this.data.entrepotId || ''
    };
    this.movementForm = this.fb.group({
      produitId: [this.mouvement.produitId, Validators.required],
      entrepotId: [this.mouvement.entrepotId, Validators.required],
      type: [this.mouvement.type, Validators.required],
      quantite: [this.mouvement.quantite, [Validators.required, Validators.min(0)]]
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.products = await firstValueFrom(this.stockService.getProduits());
      this.entrepots = await firstValueFrom(this.stockService.getEntrepots());
      this.filteredProducts = [...this.products];
      this.filteredEntrepots = [...this.entrepots];
      this.errorMessage = '';

      this.productSearchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(async (searchTerm: string) => {
        if (searchTerm) {
          this.filteredProducts = await firstValueFrom(this.stockService.getProduitsByNom(searchTerm));
        } else {
          this.filteredProducts = [...this.products];
        }
      });

      this.entrepotSearchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(async (searchTerm: string) => {
        if (searchTerm) {
          this.filteredEntrepots = await firstValueFrom(this.stockService.getEntrepotsByNom(searchTerm));
        } else {
          this.filteredEntrepots = [...this.entrepots];
        }
      });
    } catch (error: any) {
      console.error('Error loading products or entrepots:', error);
      this.errorMessage = 'Failed to load products or entrepots. Please try again later.';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.movementForm.valid) {
      this.dialogRef.close(this.movementForm.value);
    }
  }
}
