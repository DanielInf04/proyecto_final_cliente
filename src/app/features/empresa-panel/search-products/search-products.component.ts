import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductBusinessService } from '../../../core/services/business/product-business.service';
import { IProduct } from '../../../interfaces/product/iproduct';
import { ConfirmDialogService } from '../../../core/services/shared/confirm-dialog.service';

@Component({
  selector: 'app-search-products',
  standalone: false,
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.scss'
})
export class SearchProductsComponent implements OnInit {

  messageSuccess: string | null = null;

  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  currentPage = 1;
  perPage = 10;
  totalPages = 1;

  termino: string = '';
  resultados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductBusinessService,
    private confirmService: ConfirmDialogService,
  ) {}

  ngOnInit(): void {
    // Capturamos el mensaje pasado desde otra vista
    const state = history.state as { messageSuccess?: string };
    console.log("State", state);
    if (state.messageSuccess) {
      this.setAlert('success', state.messageSuccess);
    }

    this.route.queryParams.subscribe(params => {
      this.termino = params['query'] || '';
      if (this.termino) {
        this.buscarProductos(this.termino);
      }
    });
  }

  setAlert(type: 'success' | 'danger' | 'warning' | 'info', message: string) {
    this.alertType = type;
    this.alertMessage = message;

    setTimeout(() => {
      this.alertMessage = null;
    }, 4000); // se borra automáticamente
  }

  buscarProductos(termino: string): void {
    this.productService.searchMyProducts(termino, this.currentPage, this.perPage).subscribe({
      next: (res) => {
        console.log("Buscar productos", res);
        const body = res.body;
        this.resultados = body?.data || [];
        this.totalPages = body?.last_page || 1;
        this.currentPage = body?.current_page || 1;
      },
      error: (err) => {
        console.error('Error al buscar productos:', err);
      }
    })
  }

  cambiarPagina(pagina: number): void {
  if (pagina >= 1 && pagina <= this.totalPages) {
    this.currentPage = pagina;
    this.buscarProductos(this.termino);
  }
}

  cambiarEstado(producto: IProduct) {
    this.productService.actualizarEstado(producto.id, producto.estado).subscribe({
      next: () => {
        console.log(`Estado del producto ${producto.nombre} actualizado a ${producto.estado}`);
        this.setAlert('info', `Estado del producto actualizado a ${producto.estado}.`);
        //this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
        this.setAlert('danger', `No se pudo actualizar el estado del producto "${producto.nombre}".`);
      }
    });
  }

  public eliminarProducto(id: number): void {
    this.confirmService.requestConfirmation(
      '¿Estás seguro de que deseas eliminar este producto?',
      () => {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.setAlert('success', 'Producto eliminado con éxito');

            // Eliminamos el producto del array
            this.resultados = this.resultados.filter(p => p.id !== id);

            // Si estamos en la última página y hemos eliminado el último producto, retrocedemos de página
            if (this.resultados.length === 0 && this.currentPage > 1) {
              this.currentPage--;
              this.buscarProductos(this.termino);
            }

          },
          error: (err) => {
            console.error('Error al eliminar el producto', err);
            this.setAlert('warning', 'No se pudo eliminar el producto');
          }
        });
      }
    )
  }

}
