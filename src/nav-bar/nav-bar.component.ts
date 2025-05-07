import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '../environments/environment.development';
//import { AuthService } from '../services/auth.service';
import { ModalService } from '../app/modal.service';
import { jwtDecode } from 'jwt-decode';
import { NavigationEnd, Router } from '@angular/router';
//import { AuthService } from '../app/core/services/auth.service';
import { TokenService } from '../app/core/services/shared/auth/token.service';
import { CartToggleService } from '../app/core/services/shared/cart-toggle.service';
import { CartService } from '../app/core/services/customer/cart/cart.service';
import { AuthService } from '../app/core/services/shared/auth/auth.service';
import { CategoryService } from '../app/core/services/admin/category.service';
import { Icategory } from '../app/interfaces/product/category/icategory';
import { SearchService } from '../app/core/services/shared/search/search.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {

  private decodedToken: any = null;

  userName: string | null = null;

  categorias:Icategory[] = [];

  cartCount = 0;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private searchService: SearchService,
    private categoryService: CategoryService,
    private cartToggleService: CartToggleService,
    private cartService: CartService,
    private router: Router
  ) {}

  onBuscar(valor: string) {
    const termino = valor.trim();
    if (termino) {
      this.router.navigate(['/search'], { queryParams: { query: termino } });
    }
  }

  /*onBuscar(valor: string) {
    this.searchService.actualizarFiltro(valor.trim());
  }*/

  ngOnInit(): void {
    this.userName = this.tokenService.getUserName();
    
    this.categoryService.getCategories().subscribe(resp => {
      if (resp.body) {
        console.log("Categorias", resp.body);
        this.categorias = resp.body;
      } else {
        this.categorias = [];
      }
    })

    if (this.authService.isLoggedIn()) {

      this.cartService.updateCartCount();

      this.cartService.cartItemCount$.subscribe(count => {
        this.cartCount = count;
      });
      
    }
  }

  abrirCarrito() {
    this.cartToggleService.openCart();
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  onCuentaClick() {
    if (!this.isLoggedIn) {
      // Si no está logueado redirecciona al login component
      this.router.navigate(['/login']);
    } else {
      // Si no está logueado, redirige según el rol
      const role = this.decodedToken?.role;

      if (role === 'empresa') {
        this.router.navigate(['/empresa-panel/productos']);
      } else if (role === 'admin') {
        this.router.navigate(['/admin-panel/']);
      } else {
        this.router.navigate(['/user-profile']);
      }
    }
  }
  
}
