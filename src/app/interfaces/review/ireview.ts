export interface IReview {
    comentario?: string;
    valoracion: number;
    fecha?: string;
    cliente?: {
      nombre?: string;
    };
  }