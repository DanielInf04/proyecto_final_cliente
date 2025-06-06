import { Component, OnInit } from '@angular/core';
//import { AuthService } from '../../../../../services/auth.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/shared/auth/auth.service';
import { TokenService } from '../../../../core/services/shared/auth/token.service';
import { CompanyService } from '../../../../core/services/business/company.service';
//import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-navbar-empresa',
  standalone: false,
  templateUrl: './navbar-empresa.component.html',
  styleUrl: './navbar-empresa.component.scss'
})
export class NavbarEmpresaComponent implements OnInit {

  nameBusiness: string = '';

  constructor(
    private authService: AuthService,
    private companyService: CompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Observamos los cambios del nombre de la empresa
    this.companyService.nombreEmpresa$.subscribe(nombre => {
      if (nombre) {
        this.nameBusiness = nombre;
      }
    });

    // 2. Solo llamamos a la API si no está el nombre cargado
    if (!this.companyService.getNombreEmpresaActual()) {
      this.companyService.getMyCompany().subscribe({
        next: () => {},
        error: (err) => {
          console.error('No se pudo obtener la empresa', err);
        }
      });
    }

    /*this.companyService.getMyCompany().subscribe({
      next: (resp) => {
        this.nameBusiness = resp.body?.nombre || 'Mi Emprsa';
      },
      error: (err) => {
        console.error('No se pudo obtener la empresa', err);
      }
    })*/
  }

  logout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('empresaNombre');
      this.router.navigate(['/']);
    });
  }
}
