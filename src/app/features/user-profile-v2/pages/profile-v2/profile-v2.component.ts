import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/shared/auth/auth.service';
import { ToastService } from '../../../../core/services/shared/toast.service';
import { ProfileService } from '../../../../core/services/customer/profile/profile.service';

@Component({
  selector: 'app-profile-v2',
  standalone: false,
  templateUrl: './profile-v2.component.html',
  styleUrl: './profile-v2.component.scss'
})
export class ProfileV2Component implements OnInit {
  mostrarModal = false;
  isLoading = false;

  usuario: any = {};
  formDataModal: any = {};

  constructor (
    private authService: AuthService,
    private profileUser: ProfileService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.isLoading = true;
    
    this.profileUser.getProfile().subscribe({
      next: (resp) => {
        console.log("Datos de usuario recibidos", resp);
        const user = resp.body;

        this.usuario = {
          name: user.name,
          telefono: user.telefono,
          fecha_creacion: user.fecha_creacion
        };
      },
      error: (err) => {
        console.error("Error al obtener el perfil:", err);
        this.toastService.showToast("No se pudo cargar el perfil", "danger");
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  abrirModal() {
    this.formDataModal = { ...this.usuario };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarCambios(data: any) {
    this.authService.updateProfile(data).subscribe({
      next: (usuarioActualizado) => {
        console.log("Usuario actualizado", usuarioActualizado);

        this.usuario = {
          ...this.usuario,
          name: usuarioActualizado.name,
          telefono: usuarioActualizado.telefono
        };

        this.toastService.showToast("¡Información personal actualizada correctamente!", "success");
        this.cerrarModal();
      },
      error: (err) => {
        console.log("Error al actualizar perfil", err);
        this.toastService.showToast("Error al actualizar el perfil", "danger");
      }
    });
  }
}
