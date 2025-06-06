import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/admin/user.service';
import { IUser } from '../../../interfaces/user/iuser';
import { jwtDecode} from 'jwt-decode';
import { Router } from '@angular/router';
import { TokenService } from '../../../core/services/shared/auth/token.service';
import { ConfirmDialogService } from '../../../core/services/shared/confirm-dialog.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  isLoading = true;

  currentPage = 1;
  perPage = 10;
  totalPages = 1;

  private decodedToken: any = null;
  tituloListado = "Listado de usuarios";
  currentUserEmail: string | null = null;
  usuarios:IUser[] = [];
  listFilter = '';

  rolSeleccionado: string = '';

  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private confirmDialog: ConfirmDialogService,
    private router: Router,
    private location: Location
  ) { }

  buscar(): void {
    if (this.listFilter.trim()) {
      this.router.navigate(['admin-panel/users/search'], { queryParams: { query: this.listFilter.trim() } });
    }
  }

  filtrarPorRol() {
    this.currentPage = 1;
    this.cargarUsuariosPagina(1, this.rolSeleccionado);
  }

  ngOnInit(): void {
    // Capturamos el mensaje pasado desde otra vista
    const state = this.location.getState() as { messageSuccess?: string };;
    if (state.messageSuccess) {
      this.setAlert('success', state.messageSuccess);
    }

    // Obtenemos el correo del usuario actual
    this.currentUserEmail = this.tokenService.getUserEmail();

    // Cargamos los usaurios
    this.cargarUsuariosPagina();
  }

  setAlert(type: 'success' | 'danger' | 'warning' | 'info', message: string) {
    this.alertType = type;
    this.alertMessage = message;

    setTimeout(() => {
      this.alertMessage = null;
    }, 4000); // se borra automáticamente
  }

  cargarUsuariosPagina(pagina: number = this.currentPage, rol: string = ''): void {
    this.isLoading = true;
    this.userService.getUsers(pagina, this.perPage, rol).subscribe({
      next: (resp) => {
        const data = resp.body;
        this.usuarios = data?.data || [];
        this.totalPages = data?.last_page || 1;
        this.currentPage = data?.current_page || pagina;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.setAlert('danger', 'Error al cargar los usuarios');
        this.usuarios = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.cargarUsuariosPagina(pagina, this.rolSeleccionado);
    }
  }


  /*cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.cargarUsuarios();
    }
  }*/

  cambiarEstado(usuario: IUser) {
    this.userService.actualizarEstado(usuario.id, usuario.status).subscribe({
      next: () => {
        console.log(`Estado del usuario ${usuario.name} ha sido actualizado a ${usuario.status}`);
        this.setAlert('success', `El estado del usaurio "${usuario.name}" ha sido actualizado a ${usuario.status}`);
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
        this.setAlert('info', '¡Ha ocurrido un error al actualizar el estado del usuario "${usuario.name}"!');
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
            this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);

            if (this.usuarios.length === 0 && this.currentPage > 1) {
              /*this.currentPage--;
              this.cargarUsuarios();*/
              this.cargarUsuariosPagina(this.currentPage - 1);
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
