import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  title = 'Stock Management Dashboard';
  searchQuery: string = '';
  searchResults: any[] = [];
  searchLoading: boolean = false;
  errorMessage: string = '';
  user = {
    name: 'Prof John', // Updated to match the screenshot
    profileImage: 'https://via.placeholder.com/40'
  };
  notifications = 4;

  onSearch() {
    console.log('Search term:', this.searchQuery);
    this.searchLoading = true;
    setTimeout(() => {
      this.searchResults = this.searchQuery === 'test' ? [{ name: 'Test Result' }] : [];
      this.searchLoading = false;
    }, 1000);
  }

  selectResult(result: any) {
    console.log('Selected:', result);
    this.searchQuery = result.name;
    this.searchResults = [];
  }
}
