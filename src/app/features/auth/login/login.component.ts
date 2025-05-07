import { Component, OnInit } from '@angular/core';
//import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
//import { AuthService } from '../../../core/services/shared/auth/auth.service';
import { TokenService } from '../../../core/services/shared/auth/token.service';
import { AuthService } from '../../../core/services/shared/auth/auth.service';
import { OauthService } from '../../../core/services/shared/auth/oauth.service';
import { CartService } from '../../../core/services/customer/cart/cart.service';
//import { AuthService } from '../../../core/services/auth.service';

declare var bootstrap: any;
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  errorMessage: string | null = null;
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isReady = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private oAuthService: OauthService, 
    private tokenService: TokenService,
    private router:Router
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {

    // Esperar a que el SDK esté disponible
    const interval = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        clearInterval(interval);

        google.accounts.id.initialize({
          client_id: '258228785172-2uspq8cjjvetkff0fum30mqoa4pgtf6e.apps.googleusercontent.com',
          callback: this.handleCredentialResponse.bind(this),
        });

        setTimeout(() => {
          const googleBtn = document.getElementById('googleBtn');
          if (googleBtn) {
            google.accounts.id.renderButton(
              document.getElementById('googleBtn'),
              {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular',
                width: '250',
              }
            );

            this.isReady = true;
          }
        }, 0);

       

        this.isReady = true;
      }
    }, 100);

  }

  handleCredentialResponse(response: any): void {
    const idToken = response.credential;
    console.log('🧠 Token de Google:', idToken);
  
    this.oAuthService.sendGoogleTokenToBackend(idToken).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        console.log('✅ Login con Google exitoso');
        alert('Login con Google completado');
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('❌ Error al enviar token al backend:', err);
        alert('Error al iniciar sesión con Google');
      }
    });
  }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        if (res.access_token && res.token_type === 'bearer') {
          localStorage.setItem('token', res.access_token);
          console.log('✅ Token guardado:', res.access_token);
  
          const user = this.tokenService.getUserFromToken();
          alert('✅ Login exitoso');
          console.log('Usuario logueado:', user?.name);
  
          if (user.role === 'empresa') {
            this.router.navigate(['/empresa-panel/productos']);
          } else if (user.role === 'admin') {
            this.router.navigate(['/admin-panel']);
            console.log('Usuario administrador');
          } else {
            // 🔁 Usuario cliente: intentar fusionar carrito anónimo
            this.cartService.mergeAnonCartIfExists().subscribe({
              next: () => {
                localStorage.removeItem('anon_cart'); // 🧹 Limpia el carrito local
                this.router.navigate(['/cart']); // 👀 Muestra su carrito actualizado
              },
              error: (err) => {
                console.error('Error al fusionar carrito anónimo', err);
                this.router.navigate(['/cart']); // Incluso si falla, lo llevamos al carrito
              }
            });
          }
  
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

  // ANTERIOR (NO TOCAR)
  /*onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        if (res.access_token && res.token_type === 'bearer') {
          localStorage.setItem('token', res.access_token)   ;
          console.log('✅ Token guardado:', res.access_token);
          const user = this.tokenService.getUserFromToken();
          alert('✅ Login exitoso');
          console.log('Usuario logueado:', user?.name);
          if (user.role === 'empresa') {
            this.router.navigate(['/empresa-panel/productos']);
          } else if (user.role === 'admin') {
            this.router.navigate(['/admin-panel']);
            console.log('Usuario administrador');
          } else {
            this.router.navigate(['']);
          }
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
      
        // Limpia el mensaje después de unos segundos
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }*/

  

  /*onRegister(): void {
    console.log("Click en registro");
  }*/

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
