import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
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
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
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

    this.authService.register(userData).subscribe({
      next: (res) => {
        console.log('✅ Usuario registrado:', res);
        alert('Registro existoso');
        this.registerForm.reset();
      },
      error: (err) => {
        console.error('❌ Error al registrar:', err);
        alert('Error en el registro');
      }
    })

  }

}
