import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/admin/user.service';
import { IUser } from '../../../interfaces/user/iuser';
import { TokenService } from '../../../core/services/shared/auth/token.service';
import { ConfirmDialogService } from '../../../core/services/shared/confirm-dialog.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search-users',
  standalone: false,
  templateUrl: './search-users.component.html',
  styleUrl: './search-users.component.scss'
})
export class SearchUsersComponent implements OnInit {

  isLoading = true;

  //private decodedToken: any = null;
  currentUserEmail: string | null = null;

  currentPage = 1;
  perPage = 10;
  totalPages = 1;

  termino: string = '';
  resultados: any[] = [];

  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private confirmDialog: ConfirmDialogService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Capturamos el mensaje pasado desde otra vista
    const state = this.location.getState() as { messageSuccess?: string };;
    if (state.messageSuccess) {
      this.setAlert('success', state.messageSuccess);
    }

    // Obtenemos el correo del usuario
    this.currentUserEmail = this.tokenService.getUserEmail();

    // Obtenemos el token del usuario
    /*this.currentUser = this.tokenService.getUserName();
    console.log("CurrentUserEmail:", this.currentUser);*/

    // Obtenemos el termino de la query string
    this.route.queryParams.subscribe(params => {
      this.termino = params['query'] || '';
      if (this.termino) {
        this.buscarUsuarios(this.termino);
      }
    });
  }

  setAlert(type: 'success' | 'danger' | 'warning' | 'info', message: string) {
    this.alertType = type;
    this.alertMessage = message;

    setTimeout(() => {
      this.alertMessage = null;
    }, 3000); // se borra automáticamente
  }

  buscarUsuarios(termino: string): void {
    this.isLoading = true;
    this.userService.searchMyUsers(termino, this.currentPage, this.perPage).subscribe({
      next: (resp) => {
        const data = resp.body;
        this.resultados = data?.data || [];
        this.totalPages = data?.last_page || 1;
        this.currentPage = data?.current_page || 1;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.buscarUsuarios(this.termino);
    }
  }

  cambiarEstado(usuario: IUser) {
    this.userService.actualizarEstado(usuario.id, usuario.status).subscribe({
      next: () => {
        console.log(`Estado del usuario ${usuario.name} actualizado a ${usuario.status}`);
        this.setAlert('success', `Estado del usaurio ${usuario.name} actualizado a ${usuario.status}`);
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
        this.setAlert('danger', '¡Ha ocurrido un error al actualizar el estado del usuario "${usuario.name}"!');
      }
    })
  }

  public eliminarUsuario(usuario: IUser): void {
    this.confirmDialog.requestConfirmation(
      `¿Estás seguro que quieres eliminar al usuario "${usuario.name}"?`,
      () => {
        this.userService.deleteUser(usuario.id).subscribe({
          next: (resp) => {
            console.log('Usuario eliminado', resp);
            this.setAlert('danger', `Usuario "${usuario.name}" eliminado con éxito`);

            // Eliminamos el usuario del array local
            this.resultados = this.resultados.filter(u => u.id !== usuario.id);

            if (this.resultados.length === 1 && this.currentPage > 1) {
              this.currentPage--;
              this.buscarUsuarios(this.termino);
            }
            
          },
          error: (err) => {
            console.error('Error al eliminar usuario', err);
            this.setAlert('warning', 'No se pudo eliminar el usuario');
          }
        })
      }
    )
  }

  /*public eliminarUsuario(id: number) {
    const confirmado = confirm('¿Estás seguro que quieres eliminar a este usuario?');

    if (confirmado) {
      this.userService.deleteUser(id).subscribe({
        next: (resp) => {
          console.log('Usuario eliminado', resp);
        },
        error: (err) => {
          console.error('Error al eliminar usuario', err);
        }
      });
    } else {
      console.log('Eliminación cancelada por el usuario');
    }

    
  }*/

}
