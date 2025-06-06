import { Component, OnInit } from '@angular/core';
//import { OrderService } from '../../../core/services/order.service';
import { PedidoEmpresa } from '../../../../interfaces/order/iorder';
import { OrderService } from '../../../../core/services/business/order.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/shared/toast.service';

@Component({
  selector: 'app-pedidos',
  standalone: false,
  templateUrl: './pedidos-list.component.html',
  styleUrl: './pedidos-list.component.scss'
})
export class PedidosListComponent implements OnInit {

  tituloListado = 'Listado de pedidos';
  ordenSeleccionado: string = 'recientes';

  listFilter = '';
  estadoSeleccionado: string = '';

  isLoading = true;

  currentPage = 1;
  perPage = 10;
  totalPages = 1;

  pedidos: PedidoEmpresa[] = [];

  constructor(
    private orderService: OrderService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarPedidos();
  }

  buscar(): void {
    if (this.listFilter.trim()) {
      this.router.navigate(['empresa-panel/pedidos/search'], { queryParams: { query: this.listFilter.trim() } });
    }
  }

  cargarPedidos(): void {
    this.isLoading = true;

    this.orderService.getOrders(this.currentPage, this.perPage, this.ordenSeleccionado).subscribe({
      next: (resp) => {
        console.log("Pedidos recibidos", resp);
        this.pedidos = resp.data || [];
        this.totalPages = resp.last_page || 1;
        this.currentPage = resp.current_page || 1;
        console.log("Pedidos cargados:", this.pedidos);
      },
      error: (err) => {
        console.error("Error al cargar pedidos:", err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  filtrarPorOrden() {
    this.currentPage = 1;
    this.cargarPedidos();
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.cargarPedidos();
    }
  }

  cambiarEstado(pedido: PedidoEmpresa) {
    this.orderService.actualizarEstado(pedido.id, pedido.estado_envio).subscribe({
      next: () => {
        console.log(`Estado actualizado: ${pedido.estado_envio}`);
        this.toastService.showToast(`Estado del envio actualizado a ${pedido.estado_envio}.`);
      },
      error: (err) => {
        console.error("Error al actualizar estado", err);
      }
    })
  }

}
