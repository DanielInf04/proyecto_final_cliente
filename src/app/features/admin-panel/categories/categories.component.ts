import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/admin/category.service';
import { Icategory } from '../../../interfaces/product/category/icategory';
import { Location } from '@angular/common';
import { ConfirmDialogService } from '../../../core/services/shared/confirm-dialog.service';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  isLoading = true;

  tituloListado = "Listado de categorías";
  categories: Icategory[] = [];
  messageSuccess: string | null = null;

  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(
    private categoriesService: CategoryService,
    private confirmDialog: ConfirmDialogService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Capturamos el mensaje pasado desde otra vista
    const state = this.location.getState() as { messageSuccess?: string };
    if (state.messageSuccess) {
      this.setAlert('success', state.messageSuccess);
    }

    this.isLoading = true;

    this.categoriesService.getCategories().subscribe({
      next: (resp) => {
        if (resp.body) {
          console.log(resp.body);
          this.categories = resp.body;
        } else {
          this.categories = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar categorias', err);
        this.categories = [];
        this.setAlert('danger', 'Error al cargar las categorias');
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    /*this.categoriesService.getCategories().subscribe(resp => {
      if (resp.body) {
        console.log(resp.body);
        this.categories = resp.body;
      } else {
        this.categories = [];
      }
    })*/
  }

  setAlert(type: 'success' | 'danger' | 'warning' | 'info', message: string) {
    this.alertType = type;
    this.alertMessage = message;

    setTimeout(() => {
      this.alertMessage = null;
    }, 3000); // se borra automáticamente
  }

  eliminarCategoria(categoria: Icategory): void {
    this.confirmDialog.requestConfirmation(
      `¿Estás seguro que quieres eliminar la categoria "${categoria.nombre}"?`,
      () => {
        this.categoriesService.deleteCategory(categoria.id).subscribe({
          next: () => {
            this.setAlert('danger', `Categoría "${categoria.nombre}" eliminada con éxito`);

            // Eliminación local sin recargar las categorias
            this.categories = this.categories.filter(c => c.id !== categoria.id);

            /*this.categoriesService.getCategories().subscribe(resp => {
              this.categories = resp.body || [];
            });*/
          },
          error: (err) => {
            console.error('Error al eliminar la categoria', err);
            this.setAlert('warning', 'No se pudo eliminar la categoría');
          }
        });
      }
    )
  }

  /*eliminarCategoria(id: any) {
    this.categoriesService.deleteCategory(id).subscribe(() => {
      //this.ngOnInit();
      this.categoriesService.getCategories().subscribe(resp => {
        this.categories = resp.body || [];
      });

      this.setAlert('danger', 'Categoría eliminada con éxito');
    })
  }*/

}
