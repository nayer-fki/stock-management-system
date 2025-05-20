import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { StockService, Product, Entrepot } from '../../Services/stock.service';
import { Stock, MouvementStock } from '../../Models/stock.model';
import { firstValueFrom } from 'rxjs';
import { AddStockDialogComponent } from '../add-stock-dialog/add-stock-dialog.component';
import { AddMovementDialogComponent } from '../add-movement-dialog/add-movement-dialog.component';

interface StockWithNames extends Stock {
  produitNom: string;
  entrepotNom: string;
}

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule
  ],
  providers: [StockService],
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stocks: StockWithNames[] = [];
  filteredStocks: StockWithNames[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  products: Product[] = [];
  entrepots: Entrepot[] = [];

  constructor(private stockService: StockService, private dialog: MatDialog) {}

  async ngOnInit(): Promise<void> {
    await this.loadData();
    await this.loadStocks();
  }

  async loadData(): Promise<void> {
    try {
      this.products = await firstValueFrom(this.stockService.getProduits());
      this.entrepots = await firstValueFrom(this.stockService.getEntrepots());
      if (this.products.length === 0 || this.entrepots.length === 0) {
        this.errorMessage = 'No products or entrepots available. Please check the backend.';
      }
    } catch (error: any) {
      console.error('Error loading products or entrepots:', error);
      this.errorMessage = 'Failed to load products or entrepots. Please try again later.';
    }
  }

  async loadStocks(): Promise<void> {
    try {
      const stocksData = await firstValueFrom(this.stockService.getStocks());
      this.stocks = (stocksData || []).map(stock => ({
        ...stock,
        produitNom: this.products.find(p => p.id === stock.produitId)?.nom || 'Unknown',
        entrepotNom: this.entrepots.find(e => e.id === stock.entrepotId)?.nom || 'Unknown'
      }));
      this.filterStocks();
      this.errorMessage = '';
    } catch (error: any) {
      console.error('Error loading stocks:', error);
      this.stocks = [];
      this.errorMessage = 'Failed to load stocks. Please check your connection or credentials.';
    }
  }

  openAddStockDialog(): void {
    const dialogRef = this.dialog.open(AddStockDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log('Dialog closed with result:', result);
      if (result) {
        try {
          const createdStock = await firstValueFrom(this.stockService.createStock(result));
          if (createdStock) {
            this.stocks.push({
              ...createdStock,
              produitNom: this.products.find(p => p.id === createdStock.produitId)?.nom || 'Unknown',
              entrepotNom: this.entrepots.find(e => e.id === createdStock.entrepotId)?.nom || 'Unknown'
            });
            this.filterStocks();
            this.errorMessage = '';
            console.log('Stock created successfully!');
          }
        } catch (error: any) {
          console.error('Error creating stock:', error);
          this.errorMessage = 'Failed to create stock. Please try again.';
        }
      }
    });
  }

  openEditStockDialog(stock: StockWithNames): void {
    const dialogRef = this.dialog.open(AddStockDialogComponent, {
      width: '400px',
      data: { stock }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result && stock.id) {
        try {
          const updatedStock = await firstValueFrom(this.stockService.updateStock(stock.id, result));
          if (updatedStock) {
            const index = this.stocks.findIndex(s => s.id === updatedStock.id);
            if (index !== -1) {
              this.stocks[index] = {
                ...updatedStock,
                produitNom: this.products.find(p => p.id === updatedStock.produitId)?.nom || 'Unknown',
                entrepotNom: this.entrepots.find(e => e.id === updatedStock.entrepotId)?.nom || 'Unknown'
              };
            }
            this.filterStocks();
            this.errorMessage = '';
            console.log('Stock updated successfully!');
          }
        } catch (error: any) {
          console.error('Error updating stock:', error);
          this.errorMessage = 'Failed to update stock. Please try again.';
        }
      }
    });
  }

  openAddMovementDialog(stock: StockWithNames): void {
    const dialogRef = this.dialog.open(AddMovementDialogComponent, {
      width: '400px',
      data: { produitId: stock.produitId, entrepotId: stock.entrepotId }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await firstValueFrom(this.stockService.addStockMovement(result));
          this.loadStocks();
          this.errorMessage = '';
          console.log('Stock movement added successfully!');
        } catch (error: any) {
          console.error('Error adding stock movement:', error);
          this.errorMessage = 'Failed to add stock movement. Please try again.';
        }
      }
    });
  }

  async deleteStock(id: string | undefined): Promise<void> {
    if (!id || !confirm('Are you sure you want to delete this stock?')) return;

    try {
      await firstValueFrom(this.stockService.deleteStock(id));
      this.stocks = this.stocks.filter(s => s.id !== id);
      this.filterStocks();
      this.errorMessage = '';
      console.log('Stock deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting stock:', error);
      this.errorMessage = 'Failed to delete stock. Please try again.';
    }
  }

  filterStocks(): void {
    this.filteredStocks = this.stocks.filter(s =>
      s.produitNom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.entrepotNom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
