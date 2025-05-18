import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './core/services/shared/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.initUserFromToken();
  }

  //title = 'proyecto_final_cliente';
  /*isEmpresaPanel = false;
  isAdminPanel = false;
  showNavBar = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = this.router.url;

        this.isEmpresaPanel = currentUrl.startsWith('/empresa-panel');
        this.isAdminPanel = currentUrl.startsWith('/admin-panel');

        // ❌ Ocultar navbar en /empresa-panel y también en login/registro
        const hideNavRoutes = ['/empresa-panel', '/admin-panel', '/login', '/register'];
        this.showNavBar = !hideNavRoutes.some(route => currentUrl.startsWith(route));
      }
    })
  }*/

  /*constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isEmpresaPanel = this.router.url.startsWith('/empresa-panel');
        this.showNavBar = !this.isEmpresaPanel;
      }
    });
  }*/

}
