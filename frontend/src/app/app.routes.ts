import { Routes } from '@angular/router';
import { ProductFormComponent } from './Components/product-form/product-form.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { UsersComponent } from './Components/users/users.component';
import { EntrepotsComponent } from './Components/entrepots/entrepots.component';
import { StocksComponent } from './Components/stocks/stocks.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'products', component: ProductFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'entrepots', component: EntrepotsComponent },
  { path: 'stocks', component: StocksComponent },
];
