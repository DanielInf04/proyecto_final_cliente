import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/shared/product.service';

@Component({
  selector: 'app-search-results',
  standalone: false,
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {

  termino: string = '';
  cargando: boolean = false;
  cargandoRecomendados = false;
  recomendados: any[] = [];
  resultados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.termino = params['query'];
      if (this.termino) {
        this.cargando = true;

        this.productService.searchProductos(this.termino).subscribe(response => {
          this.resultados = response.body ?? [];
          this.cargando = false;

          if (this.resultados.length === 0) {
            this.cargarRecomendados();
          }

          console.log(response.body);
        })
      }
    });
  }

  cargarRecomendados() {
    this.cargandoRecomendados = true;
    this.productService.getRecommendedProducts('search').subscribe(data => {
      this.recomendados = data;
      this.cargandoRecomendados = false;
      console.log("Contenido recomendados", this.recomendados);
    });
  }

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

}
