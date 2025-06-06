import { Component, OnInit } from '@angular/core';
//import { AuthService } from '../../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/shared/auth/auth.service';
import { ToastService } from '../../../core/services/shared/toast.service';
//import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  showPassword = false;
  showConfirmPassword = false;
  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
      role: ['', Validators.required],

      // Cliente
      cliente_telefono: [''],

      // Empresa
      empresa_nombre: [''],
      empresa_telefono: [''],
      empresa_direccion: [''],
      empresa_descripcion: [''],
      empresa_nif: ['']

    }, {
      validators: this.passwordMatchValidator
    });

    this.registerForm.get('role')?.valueChanges.subscribe((rol) => {
      this.toggleEmpresaValidators(rol === 'empresa');
      this.toggleClienteValidators(rol === 'cliente');
    })
  }

  private toggleClienteValidators(activo: boolean) {
    const control = this.registerForm.get('cliente_telefono');
    if (activo) {
      control?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{9}$/)
      ]);
    } else {
      control?.clearValidators();
    }
    control?.updateValueAndValidity();
  }

  private toggleEmpresaValidators(activo: boolean) {
    const controls = [
      'empresa_nombre',
      'empresa_telefono',
      'empresa_direccion',
      'empresa_nif'
    ];

    controls.forEach(campo => {
      const control = this.registerForm.get(campo);
      if (activo) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isInvalid(campo: string): boolean {
    const control = this.registerForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const password = form.get('password')?.value;
    const confirm = form.get('password_confirmation');

    // Solo validar si el campo confirmación ya fue tocado o tiene valor
    if (confirm?.dirty || confirm?.touched || confirm?.value) {
      return password === confirm?.value ? null : { passwordMismatch: true };
    }

    return null;
  }

  onRegister() {
    if (this.registerForm.invalid) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    const formValue = this.registerForm.value;

    const userData: any = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password,
      password_confirmation: formValue.password_confirmation,
      role: formValue.role,
    };

    if (formValue.role === 'cliente') {
      userData.cliente = {
        telefono: formValue.cliente_telefono
      };
    } else if (formValue.role === 'empresa') {
      userData.empresa = {
        nombre: formValue.empresa_nombre,
        telefono: formValue.empresa_telefono,
        direccion: formValue.empresa_direccion,
        descripcion: formValue.empresa_descripcion,
        nif: formValue.empresa_nif
      };
    }

    /*this.authService.register(userData).subscribe({
      next: () => {
        // Login automático
        this.authService.login(formValue.email, formValue.password).subscribe({
          next: (loginResp: any) => {
            
          }
        })
      }
    })*/

    this.authService.register(userData).subscribe({
      next: (res) => {
        console.log('✅ Usuario registrado:', res);

        this.toastService.showToast('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');

        setTimeout(() => {
          this.registerForm.reset();
          this.router.navigate(['/login']);
        }, 1500);

        /*this.router.navigate(['/login']);
        alert('Registro existoso');*/
        this.registerForm.reset();
      },
      error: (err) => {
        console.error('❌ Error al registrar:', err);

        if (err.status === 422 && err.error?.errors) {
          const errores = err.error.errors;

          // Mostrarmos todos los errores en el toast
          Object.values(errores).forEach((mensajes: any) => {
            mensajes.forEach((mensaje: string) => {
              this.toastService.showToast(mensaje, 'danger');
            })
          });
        } else {
          this.toastService.showToast('Ocurrio un error inesperado. Intenta nuevamente.', 'danger');
        }

        //alert('Error en el registro');
      }
    })

  }

}
