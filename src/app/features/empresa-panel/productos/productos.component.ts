import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../../interfaces/product/iproduct';
import { ProductBusinessService } from '../../../core/services/business/product-business.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConfirmDialogService } from '../../../core/services/shared/confirm-dialog.service';
import { ToastService } from '../../../core/services/shared/toast.service';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  
  isLoading = true;

  accionPendiente: 'eliminar' | null = null;

  messageSuccess: string | null = null;

  estadoSeleccionado: string = '';

  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(
    //private productService: ProductService
    private router: Router,
    private productService: ProductBusinessService,
    private toastService: ToastService,
    private confirmService: ConfirmDialogService,
    private location: Location
  ) { }

  ngOnInit(): void {
    console.log('Listado de productos');

    // Capturamos el mensaje pasado desde otra vista
    const state = this.location.getState() as { messageSuccess?: string };
    if (state.messageSuccess) {
      this.setAlert('success', state.messageSuccess);
    }

    //this.cargarProductos();
    this.cargarProductosPagina();

  }

  filtrarPorEstado() {
    this.currentPage = 1;
    this.cargarProductosPagina(1, this.estadoSeleccionado);
  }

  setAlert(type: 'success' | 'danger' | 'warning' | 'info', message: string) {
    this.alertType = type;
    this.alertMessage = message;

    setTimeout(() => {
      this.alertMessage = null;
    }, 4000); // se borra automáticamente
  }

  buscar(): void {
    if (this.listFilter.trim()) {
      this.router.navigate(['empresa-panel/productos/search'], { queryParams: { query: this.listFilter.trim() } });
    }
  }

    cargarProductosPagina(pagina: number = this.currentPage, estado: string = ''): void {
      this.isLoading = true;
      this.productService.getProducts(pagina, this.perPage, estado).subscribe({
        next: (resp) => {
          const data = resp.body;
          this.productos = data?.data || [];
          this.totalPages = data?.last_page || 1;
          this.currentPage = data?.current_page || pagina;
        },
        error: (err) => {
          console.error('Error al cargar productos', err);
          this.setAlert('danger', 'Error al cargar los productos');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      //this.currentPage = pagina;
      //this.cargarProductos();
      this.cargarProductosPagina(pagina, this.estadoSeleccionado);
    }
  }

  tituloListado = 'Listado de productos';
  productos:IProduct[] = [];
  listFilter = '';

  currentPage = 1;
  perPage = 10;
  totalPages = 1;

  cambiarEstado(producto: IProduct) {
    this.productService.actualizarEstado(producto.id, producto.estado).subscribe({
      next: () => {
        this.toastService.showToast(`Estado del producto actualizado a ${producto.estado}`);
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
        this.toastService.showToast('No se pudo actualizar el estado del producto');
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
            this.productos = this.productos.filter(p => p.id !== id);

            // Si estamos en la última página y hemos eliminado el último producto, retrocedemos de página
            if (this.productos.length === 0 && this.currentPage > 1) {
              //this.currentPage--;
              //this.cargarProductos();
              this.cargarProductosPagina(this.currentPage - 1);
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
