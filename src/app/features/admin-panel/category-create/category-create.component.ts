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

  onSubmit(formValue: any) {
    
    const formData = new FormData();

    formData.append('nombre', formValue.nombre);
    formData.append('iva_porcentaje', formValue.iva_porcentaje);

    this.categoryService.createCategory(formData).subscribe({
      next: () => {
        alert('Categoria añadida con éxito');
        this.router.navigate(['/admin-panel/categories']);
      },
      error: (err) => {
        this.errorMessage = 'Error al agregar la categoria';
        console.error(err);
      }
    })

  }

}
