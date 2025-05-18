import { Component, OnInit } from '@angular/core';
import { IUserOrder } from '../../../../interfaces/order/iuserorder';
import { OrderService } from '../../../../core/services/customer/order/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../../../core/services/customer/review/review.service';

declare var bootstrap: any;

@Component({
  selector: 'app-detail-order',
  standalone: false,
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.scss'
})
export class DetailOrderComponent implements OnInit {

  isLoading = true;

  id!: number;
  pedido: IUserOrder | null = null;
  //isLoading: boolean = true;

  reviewData = {
    comentario: '',
    valoracion: 0,
    cliente_id: 0,
    producto_id: 0
  };

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : 0;

    this.isLoading = true;
    
    if (this.id) {
      this.orderService.getOrderById(this.id).subscribe({
        next: (res) => {
          console.log(res);
          this.pedido = res.pedido;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al obtener el pedido:', err);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      })
    } else {
      console.warn('ID de pedido no válido');
      this.pedido = null;
      this.isLoading = false;
    }
  }

  openReviewModal(productoId: number, clienteId: number) {
    this.reviewData = {
      comentario: '',
      valoracion: 0,
      cliente_id: clienteId,
      producto_id: productoId
    };
    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
  }

  setRating(estrella: number) {
    this.reviewData.valoracion = estrella;
  }

  submitReview() {
    this.reviewService.createReview(this.reviewData).subscribe({
      next: () => {
        console.log('Reseña enviada con éxito');

        // Actualizar solo el producto reseñado
        if (this.pedido) {
            this.pedido.empresas.forEach(empresa => {
            empresa.productos.forEach(prod => {
              if (prod.producto_id === this.reviewData.producto_id) {
                prod.valoracion_cliente = this.reviewData.valoracion;
              }
            });
          });
        }

        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al enviar reseña:', err);
        this.cerrarModal();
      }
    });
  }

  private cerrarModal() {
    const modalElement = document.getElementById('reviewModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();

    // Limpiar scroll bloqueado
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

}
