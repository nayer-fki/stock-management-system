import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { Stock } from '../../Models/stock.model';
import { StockService, Product, Entrepot } from '../../Services/stock.service';
import { firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-stock-dialog',
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
  templateUrl: './add-stock-dialog.component.html',
  styleUrls: ['./add-stock-dialog.component.css']
})
export class AddStockDialogComponent implements OnInit {
  stockForm: FormGroup;
  stock: Stock;
  products: Product[] = [];
  entrepots: Entrepot[] = [];
  filteredProducts: Product[] = [];
  filteredEntrepots: Entrepot[] = [];
  errorMessage: string = '';
  productSearchControl = new FormControl();
  entrepotSearchControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<AddStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stock?: Stock },
    private fb: FormBuilder,
    private stockService: StockService
  ) {
    this.stock = this.data.stock ? { ...this.data.stock } : { quantite: 0, seuilAlerte: 0, produitId: '', entrepotId: '' };
    this.stockForm = this.fb.group({
      produitId: [this.stock.produitId, Validators.required],
      entrepotId: [this.stock.entrepotId, Validators.required],
      quantite: [this.stock.quantite, [Validators.required, Validators.min(0)]],
      seuilAlerte: [this.stock.seuilAlerte, [Validators.required, Validators.min(0)]]
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.products = await firstValueFrom(this.stockService.getProduits());
      this.entrepots = await firstValueFrom(this.stockService.getEntrepots());
      this.filteredProducts = [...this.products];
      this.filteredEntrepots = [...this.entrepots];
      this.errorMessage = '';
      console.log('Products loaded:', this.products);
      console.log('Entrepots loaded:', this.entrepots);
    } catch (error: any) {
      console.error('Error loading products or entrepots:', error);
      this.errorMessage = 'Failed to load products or entrepots. Please ensure the backend server is running at http://localhost:8080.';
    }

    this.productSearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(async (searchTerm: string) => {
      if (searchTerm) {
        this.filteredProducts = await firstValueFrom(this.stockService.getProduitsByNom(searchTerm)).catch(() => []);
      } else {
        this.filteredProducts = [...this.products];
      }
      console.log('Filtered Products:', this.filteredProducts);
    });

    this.entrepotSearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(async (searchTerm: string) => {
      if (searchTerm) {
        this.filteredEntrepots = await firstValueFrom(this.stockService.getEntrepotsByNom(searchTerm)).catch(() => []);
      } else {
        this.filteredEntrepots = [...this.entrepots];
      }
      console.log('Filtered Entrepots:', this.filteredEntrepots);
    });

    this.stockForm.get('quantite')?.valueChanges.subscribe(value => {
      console.log('Quantite value changed to:', value);
      if (value === null || value === '') {
        this.stockForm.get('quantite')?.setValue(0, { emitEvent: false });
      }
    });

    this.stockForm.get('seuilAlerte')?.valueChanges.subscribe(value => {
      console.log('SeuilAlerte value changed to:', value);
      if (value === null || value === '') {
        this.stockForm.get('seuilAlerte')?.setValue(0, { emitEvent: false });
      }
    });

    this.stockForm.valueChanges.subscribe(value => {
      console.log('Form Value:', value);
      console.log('Form Valid:', this.stockForm.valid);
      console.log('Form Errors:', this.stockForm.errors);
      console.log('Button should be enabled:', !this.stockForm.invalid && !this.errorMessage);
    });
  }

  onQuantiteInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value ? parseFloat(input.value) : 0;
    if (isNaN(value) || value < 0) {
      this.stockForm.get('quantite')?.setValue(0, { emitEvent: false });
    } else {
      this.stockForm.get('quantite')?.setValue(value, { emitEvent: false });
    }
    console.log('Quantite input value:', value);
  }

  onSeuilAlerteInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value ? parseFloat(input.value) : 0;
    if (isNaN(value) || value < 0) {
      this.stockForm.get('seuilAlerte')?.setValue(0, { emitEvent: false });
    } else {
      this.stockForm.get('seuilAlerte')?.setValue(value, { emitEvent: false });
    }
    console.log('SeuilAlerte input value:', value);
  }

  onSave(): void {
    console.log('Save button clicked!');
    if (this.stockForm.valid && !this.errorMessage) {
      console.log('Closing dialog with value:', this.stockForm.value);
      this.dialogRef.close(this.stockForm.value);
    } else {
      console.log('Form is invalid or error exists. Form value:', this.stockForm.value);
      console.log('Form valid:', this.stockForm.valid);
      console.log('Error message:', this.errorMessage);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
