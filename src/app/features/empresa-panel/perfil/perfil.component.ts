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
    this.companyService.getMyCompany().subscribe({
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
    })
  }

  myForm:FormGroup;
  errorMessage:string='';
  empresa:Icompany[] = [];

  onSubmit(company: any) {
    this.companyService.updateCompany(company).subscribe({
      next: () => {
        this.router.navigate(['/empresa-panel/perfil']);
        alert('Datos actualizados correctamente');
      },
      error: (error) => {
        this.errorMessage = error.message;
      }
    })
  }

}
