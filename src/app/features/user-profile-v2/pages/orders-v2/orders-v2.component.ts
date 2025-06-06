import { Component, OnInit, ViewChild } from '@angular/core';
import { IPaginatedOrders, IUserOrder } from '../../../../interfaces/order/iuserorder';
import { OrderService } from '../../../../core/services/customer/order/order.service';
import { ReviewService } from '../../../../core/services/customer/review/review.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/shared/toast.service';

declare var bootstrap: any;

@Component({
  selector: 'app-orders-v2',
  standalone: false,
  templateUrl: './orders-v2.component.html',
  styleUrl: './orders-v2.component.scss'
})
export class OrdersV2Component implements OnInit {
  @ViewChild('reviewModal') reviewModal!: any;

  isLoading = false;
  isLoadingMore = false;

  currentPage = 1;
  perPage = 5;
  totalPages = 1;

  pedidos: IUserOrder[] = [];

  constructor(
    private orderService: OrderService,
    //private reviewService: ReviewService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos() {
    if (this.isLoading || this.currentPage > this.totalPages) return;

    this.currentPage === 1 ? this.isLoading = true : this.isLoadingMore = true;

    this.orderService.getUserOrders(this.currentPage, this.perPage).subscribe({
      next: (resp) => {
        console.log("Respuesta paginada:", resp);

        // Actualizamos totalPages
        this.totalPages = resp.last_page;

        const nuevosPedidos = resp.data || [];

        // Si es la primera página, reemplazamos; si no, agregamos
        if (this.currentPage === 1) {
          this.pedidos = nuevosPedidos;
        } else {
          this.pedidos = [...this.pedidos, ...nuevosPedidos];
        }

        this.currentPage++;
      },
      error: (err) => {
        console.error("Error al cargar pedidos:", err);
        if (this.currentPage === 1) this.pedidos = [];
      },
      complete: () => {
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    });
  }

  cargarMasPedidos() {
    this.cargarPedidos();
  }

  openReviewModal(productId: number, clienteId: number) {
    this.reviewModal.open(productId, clienteId);
  }

  actualizarValoracion(data: { producto_id: number, valoracion: number }) {
    this.pedidos.forEach(pedido => {
      pedido.empresas.forEach(empresa => {
        empresa.productos.forEach(prod => {
          if (prod.producto_id === data.producto_id) {
            prod.valoracion_cliente = data.valoracion;
          }
        });
      })
    });

    this.toastService.showToast(`¡Gracias por tu reseña!`, 'success');

    // Limpieza manual por si aún queda scroll bloqueado
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  }

  verProducto(id: number) {
    this.router.navigate(['/product', id]);
  }

}
