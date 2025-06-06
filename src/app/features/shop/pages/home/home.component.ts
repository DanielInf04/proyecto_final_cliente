import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/shared/product.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from '../../../../core/services/shared/search/search.service';
import { CategoryService } from '../../../../core/services/admin/category.service';
import { Icategory } from '../../../../interfaces/product/category/icategory';

@Component({
  selector: 'app-welcome-new',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  categorias: Icategory[] = [];
  //productos: any[] = [];

  productosSinOferta: any[] = [];
  productosConOferta: any[] = [];

  isLoading = true;
  isLoadingCategorias = true;
  filtro: string = '';
  private subscripcion!: Subscription;

  constructor(
    private searchService: SearchService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscripcion = this.searchService.filtro$.subscribe(valor => {
      this.filtro = valor;
    });
    
    this.cargarCategorias();
    this.cargarProductos();

  }

  cargarCategorias() {
    this.categoryService.getCategories().subscribe({
      next: (resp) => {
        if (resp.body) {
          console.log("categorias recibidas:", resp.body);
          this.categorias = resp.body || [];
          this.isLoadingCategorias = false;
        }
      },
      error: (err) => {
        console.error("Error al cargar categorias", err);
        this.isLoadingCategorias = false;
      }
    });
  }

  cargarProductos() {
    console.log("Cargando productos de la página de inicio");
    this.productService.getIndex().subscribe({
      next: (resp) => {
        if (resp.body) {
          this.productosSinOferta = resp.body.productos_sin_oferta || [];
          this.productosConOferta = resp.body.productos_con_oferta || [];

          console.log("Productos sin oferta:", this.productosSinOferta);
          console.log("Productos con oferta:", this.productosConOferta);

          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error("Error al cargar los productos de la página principal", err);
        this.isLoading = false;
      }
    })
  }

  verProducto(id: number) {
    this.router.navigate(['/product', id]);
  }

  verCategoria(id: number) {
    this.router.navigate(['/category', id]);
  }

}
