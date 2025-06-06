import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/shared/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  standalone: false,
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {

  productos: any[] = [];

  currentPage = 1;
  perPage = 10;
  totalPages = 1;

  isLoading = false;
  isLoadingMore = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
   this.cargarProductos();
  }

  cargarProductos() {
    if (this.isLoading || this.currentPage > this.totalPages) return;

    if (this.currentPage === 1) {
      this.isLoading = true; // Primera carga
    } else {
      this.isLoadingMore = true; // Para scroll infinito
    }

    this.productService.getAllProductsOffer(this.currentPage, this.perPage).subscribe({
      next: (resp) => {
        const body = resp.body;
        console.log("Productos en oferta recibidos", body);

        this.productos = [...this.productos, ...body.data];
        this.totalPages = body.last_page;
        this.currentPage++;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      error: (err) => {
        console.log("Error al cargar productos en oferta", err);
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    });
  }

  verProducto(id: number) {
    this.router.navigate(['/product', id]);
  }

}
