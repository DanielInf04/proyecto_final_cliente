import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/shared/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../../interfaces/product/iproduct';

@Component({
  selector: 'app-category-products',
  standalone: false,
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.scss'
})
export class CategoryProductsComponent implements OnInit {

  productos: any[] = [];

  constructor (
    private ruta: ActivatedRoute,
    private productService: ProductService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.ruta.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const categoriaId = idParam ? Number(idParam) : null;

      if (!categoriaId) {
        this.router.navigate(['/']);
        return;
      }

      this.productService.getProductsByCategory(categoriaId).subscribe({
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
      });
    });
  }

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

}
