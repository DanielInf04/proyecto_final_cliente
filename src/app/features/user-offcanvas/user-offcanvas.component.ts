import { Component, ElementRef, OnInit } from '@angular/core';
import { AccountToggleService } from '../../core/services/shared/account-toggle.service';
import { TokenService } from '../../core/services/shared/auth/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/shared/auth/auth.service';
import { CartService } from '../../core/services/customer/cart/cart.service';
import { BannerService } from '../../core/services/shared/banner.service';

declare var bootstrap: any;

@Component({
  selector: 'app-user-offcanvas',
  standalone: false,
  templateUrl: './user-offcanvas.component.html',
  styleUrl: './user-offcanvas.component.scss'
})
export class UserOffcanvasComponent implements OnInit {

  //offCanvasInstance: any;

  isLoggedIn = false;
  userName: string | null = null;
  userRole: string | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private tokenService: TokenService,
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
      this.isLoggedIn = !!user;
      this.userName = user?.name || null;
      this.userRole = user?.role || null;
    });

    /*const user = this.tokenService.getUserFromToken();
    this.isLoggedIn = this.tokenService.isLoggedIn();
    this.userName = user?.name || null;
    this.userRole = user?.role || null;*/
  }

  irACuenta() {
    this.cerrarOffcanvasYRedirigir('/user-profile-v2-profile');
    /*this.router.navigate(['/user-profile-v2/profile']);
    this.cerrarOffcanvas();*/
  }

  irAPedidos() {
    this.cerrarOffcanvasYRedirigir('/user-profile-v2/orders');
    /*this.router.navigate(['/user-profile-v2/orders']);
    this.cerrarOffcanvas();*/
  }

  onLogin() {
    this.cerrarOffcanvasYRedirigir('/login');
    /*this.cerrarOffcanvas();
    this.router.navigate(['/login']);*/
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('empresaNombre');
      //localStorage.removeItem('cuponNombre');
      //localStorage.removeItem('cuponDescuento');
      //localStorage.removeItem('seenWelcomeBanner');

      //this.bannerService.triggerReload();
      this.bannerService.reset();
      this.bannerService.triggerReload();

      //localStorage.setItem('seenWelcomeBanner', 'true');

      // Hacemos la limpieza visual cuando se cierre el offcanvas
      this.cerrarOffcanvasYRedirigir('/', true);
    })
  }

  /*onLogout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('seenWelcomeBanner');
      this.authService.setCurrentUser(null);
      this.cartService.resetCartState();
      this.cerrarOffcanvasYRedirigir('/');
    });
  }*/

  onRegister() {
    this.cerrarOffcanvasYRedirigir('/register');
    /*this.cerrarOffcanvas();
    this.router.navigate(['/register']);*/
  }

  irAPanel() {
    if (this.userRole === 'admin') {
      this.cerrarOffcanvasYRedirigir('/admin-panel');
      //this.router.navigate(['/admin-panel']);
    } else if (this.userRole === 'empresa') {
      //this.router.navigate(['/empresa-panel/productos']);
      this.cerrarOffcanvasYRedirigir('/empresa-panel/productos');
    }
  }

  abrirOffcanvas() {
      const element = this.el.nativeElement.querySelector('#accountOffcanvas');
      const offcanvas = new bootstrap.Offcanvas(element);
      offcanvas.show();
  }

  cerrarOffcanvasYRedirigir(ruta: string, postLogout: boolean = false) {
    const element = this.el.nativeElement.querySelector('#accountOffcanvas');
    const offcanvas = bootstrap.Offcanvas.getInstance(element);

    if (offcanvas) {
      element.addEventListener('hidden.bs.offcanvas', () => {
        // 🔁 Solo después de cerrarse el panel, actualizamos el estado
        if (postLogout) {
          this.authService.setCurrentUser(null);
          this.cartService.resetCartState();
        }

        this.router.navigate([ruta]);
        document.body.removeAttribute('style');
        document.body.removeAttribute('data-bs-padding-right');
        document.body.removeAttribute('data-bs-overflow');
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

  /*cerrarOffcanvas(callback?: () => void): void {
    const element = this.el.nativeElement.querySelector('#accountOffcanvas');
    const offcanvas = bootstrap.Offcanvas.getInstance(element);

    if (offcanvas) {
      if (callback) {
        element.addEventListener('hidden.bs.offcanvas', () => {
          // Ejecuta la lógica personalizada después de cerrarse
          callback();

          // Limpieza general del body (opcional, si has tenido issues visuales)
          document.body.removeAttribute('style');
          document.body.removeAttribute('data-bs-padding-right');
          document.body.removeAttribute('data-bs-overflow');
        }, { once: true });
      }

      offcanvas.hide();
    } else {
      // Si no hay offcanvas activo, ejecuta el callback inmediatamente
      if (callback) callback();
    }
  }*/


  /*cerrarOffcanvasYRedirigir(ruta: string) {
    const element = this.el.nativeElement.querySelector('#accountOffcanvas');
    const offcanvas = bootstrap.Offcanvas.getInstance(element);

    if (offcanvas) {
      element.addEventListener('hidden.bs.offcanvas', () => {
        this.router.navigate([ruta]);
        document.body.removeAttribute('style');
        document.body.removeAttribute('data-bs-padding-right');
        document.body.removeAttribute('data-bs-overflow');
      }, { once: true });
      offcanvas.hide();
    } else {
      this.router.navigate([ruta]);
    }
  }*/

  /*abrirOffcanvas() {
    const element = this.el.nativeElement.querySelector('#accountOffcanvas');
    const offcanvas = new bootstrap.Offcanvas(element);
    offcanvas.show();
  }*/

  /*cerrarOffcanvas() {
    console.log("Cerrar offcanvas");
    const element = this.el.nativeElement.querySelector('#accountOffcanvas');
    const offcanvas = bootstrap.Offcanvas.getInstance(element);
    offcanvas?.hide();
  }*/

}
