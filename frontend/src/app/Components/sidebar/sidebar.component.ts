import { Component } from '@angular/core';
  import { MatSidenavModule } from '@angular/material/sidenav';
  import { MatListModule } from '@angular/material/list';
  import { MatIconModule } from '@angular/material/icon';
  import { RouterLink, RouterLinkActive, Router } from '@angular/router';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [MatSidenavModule, MatListModule, MatIconModule, RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
  })
  export class SidebarComponent {
    navItems = [
      { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
      { label: 'Products', route: '/products', icon: 'inventory_2' },
      { label: 'Users', route: '/users', icon: 'people' },
      { label: 'Entrepots', route: '/entrepots', icon: 'store' },
      { label: 'Stocks', route: '/stocks', icon: 'warehouse' },
    ];
    userName = 'John Doe';

    constructor(private router: Router) {}

    logout() {
      console.log('Logout clicked');
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    }
  }
