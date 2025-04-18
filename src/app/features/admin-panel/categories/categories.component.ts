import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/category.service';
import { Icategory } from '../../../interfaces/icategory';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  tituloListado = "Listado de categorias";
  categories: Icategory[] = [];

  constructor(
    private categoriesService: CategoryService
  ) {}

  ngOnInit(): void {
      this.categoriesService.getCategories().subscribe(resp => {
        if (resp.body) {
          console.log(resp.body);
          this.categories = resp.body;
        } else {
          this.categories = [];
        }
      })
  }

  eliminarCategoria(id: any) {
    this.categoriesService.deleteCategory(id).subscribe(() => {
      this.ngOnInit();
    })
  }

}
