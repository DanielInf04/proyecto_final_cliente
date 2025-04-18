import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
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
