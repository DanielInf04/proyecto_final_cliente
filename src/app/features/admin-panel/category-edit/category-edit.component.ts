import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-category-edit',
  standalone: false,
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent implements OnInit {

  id: string | null | undefined;
  myForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private ruta: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.myForm = new FormGroup({
    });
  }

  ngOnInit(): void {
    this.id = this.ruta.snapshot.paramMap.get('id');
      
    this.myForm = this.formBuilder.group({
      nombre: [null],
      iva_porcentaje: [null]
    });

    this.categoryService.getCategory(this.id).subscribe({
      next: (data) => {
        if (data.body) {
          this.myForm.setValue ({
            nombre: data.body.nombre,
            iva_porcentaje: data.body.iva_porcentaje
          });
        }
      }, 
      error: (error) => {
        this.errorMessage = error.message;
      }
    });

  }

  onSubmit(category: any) {
    const formData = new FormData();

    formData.append('nombre', category.nombre);
    formData.append('iva_porcentaje', category.iva_porcentaje);

    this.categoryService.editCategory(this.id, formData).subscribe({
      next: (data) => {
        console.log('Categoria actualizada correctamente:', data);
        this.router.navigate(['/admin-panel/categories']);
      },
      error: (error) => {
        console.error('Error al actualizar la categoria:', error);
        this.errorMessage = error.message;
      }
    })
  }

}
