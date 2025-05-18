import { Component, OnInit } from '@angular/core';
import { IPaginatedOrders, IUserOrder } from '../../../../interfaces/order/iuserorder';
import { OrderService } from '../../../../core/services/customer/order/order.service';
import { ReviewService } from '../../../../core/services/customer/review/review.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-orders-v2',
  standalone: false,
  templateUrl: './orders-v2.component.html',
  styleUrl: './orders-v2.component.scss'
})
export class OrdersV2Component implements OnInit {

  isLoading = false;
  isLoadingMore = false;

  currentPage = 1;
  perPage = 5;
  totalPages = 1;

  pedidos: IUserOrder[] = [];

  reviewData = {
    comentario: '',
    valoracion: 0,
    cliente_id: 0,
    producto_id: 0
  };

  constructor(
    private orderService: OrderService,
    private reviewService: ReviewService,
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

    /*this.orderService.getUserOrders().subscribe({
      next: (resp) => {
        console.log("Respuesta paginada:", resp);

        if (resp.pedidos && resp.pedidos.length > 0) {
          this.pedidos = resp.pedidos.sort((a, b) => {
            return new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime();
          });
        } else {
          console.log("No se han encontrado pedidos");
          this.pedidos = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar pedidos:", err);
        this.pedidos = [];
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });*/
  

  

  openReviewModal(productoId: number, clienteId: number) {
    this.reviewData = {
      comentario: '',
      valoracion: 0,
      cliente_id: clienteId,
      producto_id: productoId
    }
    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
  }

  setRating(estrella: number) {
    this.reviewData.valoracion = estrella;
  }

  submitReview() {
    console.log('Enviando reseña:', this.reviewData);

    this.reviewService.createReview(this.reviewData).subscribe({
      next: () => {
        console.log('Reseña enviada con éxito');

        // Buscamos el producto y actualizamos su valoración
        this.pedidos.forEach(pedido => {
          pedido.empresas.forEach(empresa => {
            empresa.productos.forEach(prod => {
              if (prod.producto_id === this.reviewData.producto_id) {
                prod.valoracion_cliente = this.reviewData.valoracion;
              }
            });
          });
        });

        const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
        modal.hide();

        // Limpiamos scroll bloqueado manualmente
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
      },
      error: (err) => {
        console.error('Error al enviar reseña:', err);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
        if (modal) modal.hide();
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
      }
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
    modal.hide();
  }

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

}
