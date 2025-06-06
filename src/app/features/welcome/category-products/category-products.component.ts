import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/shared/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../../interfaces/product/iproduct';
import { CategoryService } from '../../../core/services/admin/category.service';

@Component({
  selector: 'app-category-products',
  standalone: false,
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.scss'
})
export class CategoryProductsComponent implements OnInit {

  categoriaId: number | null = null;
  categoriaNombre: string = '';
  productos: any[] = [];

  currentPage = 1;
  perPage = 10;
  totalPages = 1;

  isLoading = false;
  isLoadingMore = false;

  constructor (
    private ruta: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.ruta.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.categoriaId = idParam ? Number(idParam) : null;

      if (!this.categoriaId) {
        this.router.navigate(['/']);
        return;
      }

      // Limpiamos el estado
      this.productos = [];
      this.currentPage = 1;
      this.totalPages = 1;
      this.isLoading = false;

      this.categoryService.getCategory(this.categoriaId).subscribe({
        next: (resp) => {
          if (resp.body) {
            console.log(resp.body);
            this.categoriaNombre = resp.body.nombre;
          }
        },
        error: (err) => {
          console.error("No se ha podido obtener el nombre de la categoria", err);
        }
      });

      this.cargarProductos(this.categoriaId);

      /*this.productService.getProductsByCategory(categoriaId).subscribe({
        next: (resp) => {
          this.productos = resp.body || [];
  
          // Si vino vacio, mostramos un mensaje y redirigimos a productos
          if (this.productos.length === 0) {
            alert('No hay productos de esa categoria');
            this.router.navigate(['/productos']);
          }

        },
        error: (err) => {
          if (err.status === 200) {
            alert('Categoria sin productos');
            this.router.navigate(['/productos']);
          } else {
            console.error('Error inesperado', err);
            alert('Ocurrión un error inesperado.');
            this.router.navigate(['/']);
          }
        }
      });*/
    });
  }

  cargarProductos(id: number) {
    if (this.isLoading || this.currentPage > this.totalPages) return;

    if (this.currentPage === 1) {
      this.isLoading = true; // Primera carga
    } else {
      this.isLoadingMore = true; // Para scroll infinito
    }

    this.productService.getProductsByCategory(id, this.currentPage, this.perPage).subscribe({
      next: (resp) => {
        const body = resp.body;
        console.log(`Cargando productos de la categoria ${this.categoriaNombre}`, body);

        this.productos = [...this.productos, ...body.data]; // Problema de duplicado de productos
        this.totalPages = body.last_page;
        this.currentPage++;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      error: (err) => {
        console.log(`Error al cargar productos de la categoria ${this.categoriaNombre}`, err);
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    });
  }

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

}
