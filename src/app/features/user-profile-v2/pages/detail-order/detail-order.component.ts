import { Component, OnInit, ViewChild } from '@angular/core';
import { IUserOrder } from '../../../../interfaces/order/iuserorder';
import { OrderService } from '../../../../core/services/customer/order/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../../../core/services/customer/review/review.service';
import { ToastService } from '../../../../core/services/shared/toast.service';

declare var bootstrap: any;

@Component({
  selector: 'app-detail-order',
  standalone: false,
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.scss'
})
export class DetailOrderComponent implements OnInit {
  @ViewChild('reviewModal') reviewModal!: any;

  isLoading = true;

  //id!: number;
  id: string | null | undefined;
  //id: string | null | undefined;
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
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    //const idParam = this.route.snapshot.paramMap.get('id');
    this.id = this.route.snapshot.paramMap.get('id');

    this.isLoading = true;
    
    if (this.id) {
      this.orderService.getOrderById(this.id).subscribe({
        next: (res) => {
          console.log(res);
          this.pedido = res.pedido;
          //this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al obtener el pedido:', err);
          //this.isLoading = false;
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

  mostrarToastValoracion(data: { producto_id: number, valoracion: number }) {
    this.toastService.showToast(`¡Gracias por tu reseña!`, 'success');
  }

  openReviewModal(productId: number, clienteId: number) {
    this.reviewModal.open(productId, clienteId);
  }

}
