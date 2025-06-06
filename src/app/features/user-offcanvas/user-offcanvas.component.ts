import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AccountToggleService } from '../../core/services/shared/account-toggle.service';
import { TokenService } from '../../core/services/shared/auth/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/shared/auth/auth.service';
import { CartService } from '../../core/services/customer/cart/cart.service';
import { BannerService } from '../../core/services/shared/banner.service';
import { ToastService } from '../../core/services/shared/toast.service';
import { HostListener } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-user-offcanvas',
  standalone: false,
  templateUrl: './user-offcanvas.component.html',
  styleUrl: './user-offcanvas.component.scss'
})
export class UserOffcanvasComponent implements OnInit {

  @HostListener('window:popstate')
  onPopState(): void {
    this.limpiarScrollBody();
  }

  isLoggedIn = false;
  userName: string | null = null;
  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private tokenService: TokenService,
    private toastService: ToastService,
    private bannerService: BannerService,
    private accountToggleService: AccountToggleService,
    private el: ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountToggleService.toggleAccount$.subscribe(() => {
      this.abrirOffcanvas();
    });

    this.authService.currentUser$.subscribe(user => {
      console.log("AuthService UserOffcanvas:", user);
      this.isLoggedIn = !!user;
      this.userName = user?.name || null;
      this.userRole = user?.role || null;
    });
  }

  private limpiarScrollBody(): void {
    document.body.removeAttribute('style');
    document.body.removeAttribute('data-bs-padding-right');
    document.body.removeAttribute('data-bs-overflow');
  }

  ngOnDestroy(): void {
    this.limpiarScrollBody();
  }

  irACuenta() {
    if (this.userRole === 'cliente') {
      this.cerrarOffcanvasYRedirigir('/user-profile-v2/profile');
    }
  }

  irAPedidos() {
    if (this.userRole === 'cliente') {
      this.cerrarOffcanvasYRedirigir('/user-profile-v2/orders');
    } else {
      this.toastService.showToast('Esta sección está habilitada únicamente para cuentas con rol de cliente.', 'danger');
    }
  }

  onLogin() {
    this.cerrarOffcanvasYRedirigir('/login');
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('empresaNombre');

      this.bannerService.reset();
      this.bannerService.triggerReload();

      // Hacemos la limpieza visual cuando se cierre el offcanvas
      this.cerrarOffcanvasYRedirigir('/', true);
    })
  }

  onRegister() {
    this.cerrarOffcanvasYRedirigir('/register');
  }

  irAPanel() {
    if (this.userRole === 'admin') {
      this.cerrarOffcanvasYRedirigir('/admin-panel');
    } else if (this.userRole === 'empresa') {
      this.cerrarOffcanvasYRedirigir('/empresa-panel/productos-list');
    }
  }

  abrirOffcanvas() {
    this.limpiarScrollBody();
    document.body.classList.remove('offcanvas-backdrop');

    const element = this.el.nativeElement.querySelector('#accountOffcanvas');
    const offcanvas = new bootstrap.Offcanvas(element);
    offcanvas.show();
  }

  cerrarOffcanvasYRedirigir(ruta: string, postLogout: boolean = false) {
    const element = this.el.nativeElement.querySelector('#accountOffcanvas');
    const offcanvas = bootstrap.Offcanvas.getInstance(element);

    if (offcanvas) {
      element.addEventListener('hidden.bs.offcanvas', () => {
        // Solo después de cerrarse el panel, actualizamos el estado
        if (postLogout) {
          this.authService.setCurrentUser(null);
          this.cartService.resetCartState();
        }

        this.router.navigate([ruta]);
        this.limpiarScrollBody();
        /*document.body.removeAttribute('style');
        document.body.removeAttribute('data-bs-padding-right');
        document.body.removeAttribute('data-bs-overflow');*/
      }, { once: true });

      offcanvas.hide();
    } else {
      if (postLogout) {
        this.authService.setCurrentUser(null);
        this.cartService.resetCartState();
      }

      this.router.navigate([ruta]);
    }
  }

}
