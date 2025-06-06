import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../core/services/business/order.service';
import { PedidoEmpresa } from '../../../../interfaces/order/iorder';

@Component({
  selector: 'app-search-pedidos',
  standalone: false,
  templateUrl: './search-pedidos.component.html',
  styleUrl: './search-pedidos.component.scss'
})
export class SearchPedidosComponent implements OnInit {

  currentPage = 1;
  perPage = 10;
  totalPages = 1;

  isLoading = true;

  termino: string = '';
  resultados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Capturamos el parametro de la query
    this.route.queryParams.subscribe(params => {
      this.termino = params['query'] || '';
      if (this.termino) {
        this.cargarPedidos(this.termino);
      }
    })
  }

  cargarPedidos(termino: string) {
    console.log("Termino", termino);
    this.orderService.searchMyOrders(termino, this.currentPage, this.perPage).subscribe({
      next: (resp) => {
        console.log("Buscar pedidos", resp);
        this.resultados = resp.body?.data || [];
        this.totalPages = resp.body?.last_page || 1;
        this.currentPage = resp.body?.current_page || 1;
        console.log("Pedidos cargados", this.resultados);
      },
      error: (err) => {
        console.error("Error al cargar pedidos:", err);
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.cargarPedidos(this.termino);
    }
  }

  cambiarEstado(pedido: PedidoEmpresa) {
    this.orderService.actualizarEstado(pedido.id, pedido.estado_envio).subscribe({
      next: () => {
        console.log(`Estado actualizado: ${pedido.estado_envio}`);
      },
      error: (err) => {
        console.error("Error al actualizar estado", err);
      }
    })
  }



}
