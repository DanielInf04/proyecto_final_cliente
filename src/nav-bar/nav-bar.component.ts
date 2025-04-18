import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment.development';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../app/modal.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {

  private decodedToken: any = null;

  userName: string | null = null;

  constructor(
    public authService: AuthService, 
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      //const decoded: any = jwtDecode(token);
      this.decodedToken = jwtDecode(token);
      this.userName = this.decodedToken.name;
      //this.userName = decoded.name;
    }

    /*if (this.authService.isLoggedIn()) {
      this.userName = this.authService.getUserName();
    }*/
  }

  get userIsEmpresa(): boolean {
    return this.decodedToken?.role === 'empresa';
  }

  /*get userIsEmpresa(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      console.log("Role:", decoded.name);
      return decoded.role === 'empresa';
    } catch (e) {
      return false;
    }
  }*/

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    this.authService.logout();
    window.location.reload();
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
