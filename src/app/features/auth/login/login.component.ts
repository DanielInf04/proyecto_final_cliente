import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../../core/services/shared/auth/token.service';
import { AuthService } from '../../../core/services/shared/auth/auth.service';
import { OauthService } from '../../../core/services/shared/auth/oauth.service';
import { CartService } from '../../../core/services/customer/cart/cart.service';
import { CompanyService } from '../../../core/services/business/company.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  showPassword: boolean = false;

  redirectTo: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private companyService: CompanyService,
    private oAuthService: OauthService, 
    private tokenService: TokenService,
    private router:Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Recogemos si tiene parametros para redireccionar al carrito si vengo del carrito
    this.route.queryParams.subscribe(params => {
      this.redirectTo = params['redirectTo'] || '';
    });
  }

  private handlePostLogin(accessToken: string, user?: any): void {
    localStorage.setItem('token', accessToken);
    console.log('✅ Token guardado:', accessToken);

    const finalUser = user ?? this.tokenService.getUserData();

    if (!finalUser) {
      console.error('No se pudo obtener el usuario desde el token');
      this.router.navigate(['/']);
      return;
    }

    this.authService.setCurrentUser(finalUser);

    const habiaCarritoAnon = !!localStorage.getItem('anon_cart');

    // Redirecciones especiales por rol
    if (finalUser.role === 'empresa') {
      // Cargamos y guardamos el nombre de la empresa tras hacer login
      this.companyService.getMyCompany().subscribe({
        next: () => {
          this.router.navigate(['/empresa-panel/productos-list']);
        },
        error: (err) => {
          console.error('No se pudo cargar la empresa después del login', err);
          //this.router.navigate(['/empresa-panel/productos']);
        }
      });
      return;
    }

    if (finalUser.role === 'admin') {
      this.router.navigate(['/admin-panel']);
      return;
    }

    // Cliente con redirectTo y carrito anónimo
    if (this.redirectTo === '/checkout' && habiaCarritoAnon) {
      this.cartService.getCart().subscribe({
        next: (res) => {
          const productosUsuario = res.body?.items || [];

          if (productosUsuario.length > 0) {
            // ⚠️ Ya tenía productos → redirigimos al cart para decidir fusión
            this.router.navigate(['/cart'], {
              queryParams: { fromLogin: true, pendingMerge: true }
            });
          } else {
            // ✅ Backend vacío → fusionamos directamente
            this.cartService.mergeAnonCartIfExists().subscribe({
              next: () => {
                localStorage.removeItem('anon_cart');
                this.cartService.refreshCart();

                this.router.navigate(['/checkout'], {
                  queryParams: { fromLogin: true }
                });
              },
              error: (err) => {
                console.error('❌ Error al fusionar carrito:', err);
                this.router.navigate(['/checkout']);
              }
            });
          }
        },
        error: () => {
          this.router.navigate(['/checkout']);
        }
      });

    } else if (this.redirectTo) {
      this.router.navigate([this.redirectTo]);

    } else {
      // ⚠️ No hay redirectTo (login directo)
      if (habiaCarritoAnon) {
        this.cartService.mergeAnonCartIfExists().subscribe({
          next: () => {
            localStorage.removeItem('anon_cart');
            this.cartService.refreshCart();
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('❌ Error al fusionar carrito (login directo):', err);
            this.router.navigate(['/']);
          }
        });
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  handleCredentialResponse(response: any): void {
    const idToken = response.credential;
    console.log('🧠 Token de Google:', idToken);
  
    this.oAuthService.sendGoogleTokenToBackend(idToken).subscribe({
      next: (res) => {
        this.handlePostLogin(res.access_token, res.user); // 👈 Llamada unificada
      },
      error: (err) => {
        console.error('❌ Error al enviar token al backend:', err);
        alert('Error al iniciar sesión con Google');
      }
    });
  }

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        if (res.access_token && res.token_type === 'bearer') {
          this.handlePostLogin(res.access_token); // Reutiliza el mismo método
        } else {
          alert('Error: no se recibió el token');
        }
      },
      error: (err) => {
        console.error('❌ Login fallido:', err);
        if (err.status === 404) {
          this.errorMessage = 'El usuario no está registrado.';
        } else if (err.status === 403) {
          this.errorMessage = '🔒 Tu cuenta está inactiva. Contacta con el administrador.';
        } else if (err.status === 401) {
          this.errorMessage = '❌ Contraseña incorrecta.';
        } else {
          this.errorMessage = '⚠️ Ocurrió un error inesperado al iniciar sesión.';
        }
  
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log('👋 Sesión cerrada:', res);
        localStorage.removeItem('token');
        alert('Sesión cerrada correctamente');
      },
      error: (err) => {
        console.error('❌ Error al cerrar sesión:', err);
      }
    });
  }

}
