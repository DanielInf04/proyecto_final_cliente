import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { IUser } from '../../../interfaces/iuser';
import { jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private decodedToken: any = null;
  tituloListado = "Listado de usuarios";
  currentUserEmail: string | null = null;
  usuarios:IUser[] = [];
  listFilter = '';

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodedToken = jwtDecode(token);
      this.currentUserEmail = this.decodedToken.email;
    }
    console.log('Listado de usuarios');
    this.userService.getUsers().subscribe(resp => {
      if (resp.body) {
        console.log(resp.body);
        this.usuarios = resp.body;
      } else {
        this.usuarios = [];
      }
    })
  }

  cambiarEstado(usuario: IUser) {
    this.userService.actualizarEstado(usuario.id, usuario.status).subscribe({
      next: () => {
        console.log(`Estado del usuario ${usuario.name} actualizado a ${usuario.status}`);
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
      }
    })
  }

  public eliminarUsuario(id: number) {
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

    
  }

}
