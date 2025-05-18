import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../core/services/business/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Icompany } from '../../../interfaces/user/icompany';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {

  isLoading = true;

  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(
    private companyService: CompanyService,
    private router:Router,
    private formBuilder:FormBuilder,
    private ruta:ActivatedRoute
  ) {
    this.myForm = new FormGroup({
    });
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      nombre: [null],
      descripcion: [null],
      telefono: [null],
      direccion: [null],
      nif: [null]
    });
    this.cargarPerfil();
    /*this.companyService.getMyCompany().subscribe({
      next: (data) => {
        if(data.body) {
          console.log(data.body);
          this.myForm.setValue ({
            nombre: data.body.nombre,
            descripcion: data.body.descripcion,
            telefono: data.body.telefono,
            direccion: data.body.direccion,
            nif: data.body.nif
          })
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
      }
    })*/
  }

  cargarPerfil(): void {
    this.isLoading = true;
    this.companyService.getMyCompany().subscribe({
      next: (data) => {
        if (data.body) {
          console.log(data.body);
          this.myForm.setValue({
            nombre: data.body.nombre,
            descripcion: data.body.descripcion,
            telefono: data.body.telefono,
            direccion: data.body.direccion,
            nif: data.body.nif
          });
        }
      },
      error: (err) => {
        console.log('Error al cargar datos de la empresa', err);
        this.setAlert('danger', 'Error al cargar el perfil de la empreesa');
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  setAlert(type: 'success' | 'danger' | 'warning' | 'info', message: string) {
    this.alertType = type;
    this.alertMessage = message;

    setTimeout(() => {
      this.alertMessage = null;
    }, 4000);
  }

  myForm:FormGroup;
  errorMessage:string='';
  empresa:Icompany[] = [];

  onSubmit(company: any) {
    this.companyService.updateCompany(company).subscribe({
      next: () => {
        this.router.navigate(['/empresa-panel/perfil']);
        //alert('Datos actualizados correctamente');
        this.setAlert('success', 'Datos de empresa actualizados correctamente');
      },
      error: (err) => {
        console.log("Ha ocurrido un error al actualizar la empresa", err);
        this.setAlert('danger', 'Ha ocurrido un error al actualizar la empresa');
        //this.errorMessage = error.message;
      }
    })
  }

}
