import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReviewService } from '../../../../core/services/customer/review/review.service';
import { IReviewPost } from '../../../../interfaces/review/ireviewpost';

declare var bootstrap: any;

@Component({
  selector: 'app-review-modal',
  standalone: false,
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.scss'
})
export class ReviewModalComponent {

  @Output() reviewSubmitted = new EventEmitter<{ producto_id: number, valoracion: number }>();

  hoveredStar: number = 0;

  reviewData = {
    comentario: '',
    valoracion: 0,
    cliente_id: 0,
    producto_id: 0
  };

  constructor(private reviewService: ReviewService) {}

  open(productId: number, clienteId: number) {
    this.reviewData = {
      comentario: '',
      valoracion: 0,
      cliente_id: clienteId,
      producto_id: productId
    };

    console.log("ReviewData inicializada:", this.reviewData);

    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
  }

  setRating(estrella: number) {
    this.reviewData.valoracion = estrella;
  }

  setHovered(estrella: number) {
    this.hoveredStar = estrella;
  }

  clearHovered() {
    this.hoveredStar = 0;
  }

  submitReview() {
    console.log("ReviewData", this.reviewData);
    this.reviewService.createReview(this.reviewData).subscribe({
      next: () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
        modal.hide();

        // Elimir evento al padre
        this.reviewSubmitted.emit({
          producto_id: this.reviewData.producto_id,
          valoracion: this.reviewData.valoracion
        });
      },
      error: (err) => {
        console.error('Error al enviar reseña', err);
      }
    });
  }

}
