import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { PedidoEmpresa } from '../../../interfaces/iorder';

@Component({
  selector: 'app-pedidos',
  standalone: false,
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit {

  pedidos: PedidoEmpresa[] = [];

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (resp) => {
        if (resp.pedidos && resp.pedidos.length > 0) {
          this.pedidos = resp.pedidos;
          console.log("Pedidos cargados:", this.pedidos);
        } else {
          console.log("No se han encontrado pedidos");
        }
      },
      error: (err) => {
        console.error("Error al cargar pedidos:", err);
      }
    });
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
