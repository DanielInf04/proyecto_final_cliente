import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/shared/product.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from '../../../core/services/shared/search/search.service';

@Component({
  selector: 'app-welcome-new',
  standalone: false,
  templateUrl: './welcome-new.component.html',
  styleUrl: './welcome-new.component.scss'
})
export class WelcomeNewComponent implements OnInit {

  productos: any[] = [];
  filtro: string = '';
  private subscripcion!: Subscription;

  constructor(
    private searchService: SearchService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscripcion = this.searchService.filtro$.subscribe(valor => {
      this.filtro = valor;
    });
    this.productService.getAllProducts().subscribe({
      next: (resp) => {
        console.log("Productos recibidos", resp.body);
        this.productos = resp.body || [];
      },
      error: (err) => {
        console.log('Error al cargar productos públicos', err);
      }
    })
  }

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

}
