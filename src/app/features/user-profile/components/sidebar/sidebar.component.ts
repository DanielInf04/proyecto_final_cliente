import { Component, OnInit } from '@angular/core';
//import { AuthService } from '../../../../../services/auth.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../../../core/services/shared/auth/auth.service';
//import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  private decodedToken: any = null;

  userName: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodedToken = jwtDecode(token);
      this.userName = `Hola, ${this.decodedToken.name} 👋`;
    }
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log("Sesión cerrada:", res);
        localStorage.removeItem('token');
        localStorage.removeItem('checkoutData');
        alert("Sesión cerrada correctamente");
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error("Error al cerrar sesión", err);
      }
    })
  }

}
