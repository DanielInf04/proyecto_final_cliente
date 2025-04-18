import { Component } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-empresa',
  standalone: false,
  templateUrl: './navbar-empresa.component.html',
  styleUrl: './navbar-empresa.component.scss'
})
export class NavbarEmpresaComponent {

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
    });
  }
}
