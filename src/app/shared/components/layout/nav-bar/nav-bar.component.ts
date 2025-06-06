import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
//import { AuthService } from '../services/auth.service';
import { ModalService } from '../../../../modal.service';
import { jwtDecode } from 'jwt-decode';
import { NavigationEnd, Router } from '@angular/router';
//import { AuthService } from '../app/core/services/auth.service';
import { TokenService } from '../../../../core/services/shared/auth/token.service';
import { CartToggleService } from '../../../../core/services/shared/cart-toggle.service';
import { CartService } from '../../../../core/services/customer/cart/cart.service';
import { AuthService } from '../../../../core/services/shared/auth/auth.service';
import { CategoryService } from '../../../../core/services/admin/category.service';
import { Icategory } from '../../../../interfaces/product/category/icategory';
import { SearchService } from '../../../../core/services/shared/search/search.service';
import { filter } from 'rxjs';
import { AccountToggleService } from '../../../../core/services/shared/account-toggle.service';

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
    //private searchService: SearchService,
    private accountToggleService: AccountToggleService,
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

  ngOnInit(): void {
    console.log("Cargando ngOnInit de Navbar");

    // Escuchamos cambios de usuario
    this.authService.currentUser$.subscribe(user => {
      this.userName = user?.name || null;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cartService.refreshCart();
    });

    this.categoryService.getCategories().subscribe(resp => {
      //console.log("Categorias recibidas navbar", resp);
      this.categorias = resp.body || [];
    });

    this.cartService.refreshCart();

    this.cartService.cartItemCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  abrirCarrito() {
    this.cartToggleService.openCart();
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  abrirCuenta() {
    console.log("Abriendo cuenta");
    this.accountToggleService.openAccountPanel();
  }
  
}
