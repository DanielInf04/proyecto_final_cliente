import { Component, OnInit } from '@angular/core';
//import { OrderService } from '../../../core/services/order.service';
import { PedidoEmpresa } from '../../../interfaces/order/iorder';
import { OrderService } from '../../../core/services/business/order.service';

@Component({
  selector: 'app-pedidos',
  standalone: false,
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit {

  isLoading = true;

  currentPage = 1;
  perPage = 10;
  totalPages = 1;

  pedidos: PedidoEmpresa[] = [];

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.isLoading = true;
    this.orderService.getOrders(this.currentPage, this.perPage).subscribe({
      next: (resp) => {
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
      },
      error: (err) => {
        console.error("Error al actualizar estado", err);
      }
    })
  }

}
