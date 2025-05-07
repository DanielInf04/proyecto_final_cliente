import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/shared/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  standalone: false,
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {

  productos: any[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAllProductsOffer().subscribe({
      next: (resp) => {
        console.log("Productos en oferta recibidos", resp.body);
        this.productos = resp.body || [];
      },
      error: (err) => {
        console.log('Error al cargar productos en oferta', err);
      }
    })
  }

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

}
