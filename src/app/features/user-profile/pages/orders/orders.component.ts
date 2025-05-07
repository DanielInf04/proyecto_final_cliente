import { Component, OnInit } from '@angular/core';
import { IUserOrder } from '../../../../interfaces/order/iuserorder';
//import { OrderService } from '../../../../core/services/order.service';
import { ReviewService } from '../../../../core/services/customer/review/review.service';
import { OrderService } from '../../../../core/services/customer/order/order.service';

declare var bootstrap: any;

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  pedidos: IUserOrder[] = [];

  reviewData = {
    comentario: '',
    valoracion: 0,
    cliente_id: 0,
    producto_id: 0
  };

  constructor(
    private orderService: OrderService,
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.orderService.getUserOrders().subscribe({
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
    })
  }

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
      },
      error: (err) => {
        console.error('Error al enviar reseña:', err);
      }
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
    modal.hide();
  }

}
