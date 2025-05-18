import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/admin/category.service';
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

  imagenActual: string | null = null;
  imagenFile: File | null = null;
  imagenPreview: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private ruta: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.myForm = new FormGroup({
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.imagenFile = target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imagenPreview = reader.result as string;
      reader.readAsDataURL(this.imagenFile);
    }
  }

  ngOnInit(): void {
    this.id = this.ruta.snapshot.paramMap.get('id');
      
    this.myForm = this.formBuilder.group({
      nombre: [null],
      iva_porcentaje: [null]
    });

    this.categoryService.getCategory(this.id).subscribe({
      next: (data) => {
        console.log("Categoria obtenida", data);
        if (data.body) {
          this.myForm.setValue ({
            nombre: data.body.nombre,
            iva_porcentaje: data.body.iva_porcentaje
          });

          this.imagenActual = data.body.imagen;
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

    if (this.imagenFile) {
      formData.append('imagen', this.imagenFile);
    }

    this.categoryService.editCategory(this.id, formData).subscribe({
      next: (data) => {
        console.log('Categoria actualizada correctamente:', data);

        const returnTo = history.state.returnTo || '/admin-panel/categories';

        this.router.navigateByUrl(returnTo, {
          state: { messageSuccess: 'Categoria actualizada correctamente' }
        });

        //this.router.navigate(['/admin-panel/categories']);
      },
      error: (error) => {
        console.error('Error al actualizar la categoria:', error);
        this.errorMessage = error.message;
      }
    })
  }

}
