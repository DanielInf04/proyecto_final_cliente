import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Icategory } from '../../../interfaces/product/category/icategory';
import { CategoryService } from '../../../core/services/admin/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-create',
  standalone: false,
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.scss'
})
export class CategoryCreateComponent implements OnInit {

  myForm: FormGroup;
  errorMessage: string = '';
  categoria: Icategory[] = [];

  imagenFile: File | null = null;
  imagenPreview: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.myForm = new FormGroup({
    });
  }

  ngOnInit(): void {
      this.myForm = this.formBuilder.group({
        nombre: ['', [Validators.required]],
        iva_porcentaje: ['', [Validators.required]],
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

  onSubmit(formValue: any) {
    
    const formData = new FormData();

    formData.append('nombre', formValue.nombre);
    formData.append('iva_porcentaje', formValue.iva_porcentaje);

    if (this.imagenFile) {
      formData.append('imagen', this.imagenFile);
    }

    this.categoryService.createCategory(formData).subscribe({
      next: () => {
        this.router.navigate(['admin-panel/categories'], {
          state: { messageSuccess: 'Categoría creada con éxito' }
        });
        /*alert('Categoria añadida con éxito');
        this.router.navigate(['/admin-panel/categories']);*/
      },
      error: (err) => {
        this.errorMessage = 'Error al agregar la categoria';
        console.error(err);
      }
    })

  }

}
