import { Component, OnInit } from '@angular/core';
//import { ProductService } from '../../../core/services/product.service';
import { IProduct } from '../../../interfaces/product/iproduct';
import { PaginatedProductsResponse } from '../../../interfaces/product/paginated-products-response';
import { ProductBusinessService } from '../../../core/services/business/product-business.service';
//import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  
  constructor(
    //private productService: ProductService
    private productService: ProductBusinessService
  ) { }

  ngOnInit(): void {
    console.log('Listado de productos');
    /*this.productService.getProducts().subscribe(resp => {
      console.log('Respuesta completa:', resp);
      if (resp.body) {
        console.log('Respuesta completa:', resp.body);
        this.productos = resp.body;
      } else {
        this.productos = [];
      }
    })*/

    this.cargarProductos();

  }

  cargarProductos(): void {
    this.productService.getProducts(this.currentPage, this.perPage).subscribe(resp => {
      const body = resp.body;
      if (body) {
        console.log(body);
        this.productos = body.data;
        this.totalPages = body.last_page;
        this.currentPage = body.current_page;
      }
    })
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.cargarProductos();
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
        console.log(`Estado del producto ${producto.nombre} actualizado a ${producto.estado}`);
        //this.ngOnInit();
      },
      error: (err) => {
        console.error('Error al actualizar el estado:', err);
      }
    });
  }

  public eliminarProducto(id:number) {
    this.productService.deleteProduct(id).subscribe(resp => {
      this.ngOnInit();
    })
  }

}
