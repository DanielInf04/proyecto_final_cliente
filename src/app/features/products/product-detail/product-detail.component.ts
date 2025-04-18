import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../../interfaces/iproduct';
import { CartService } from '../../../../services/cart.service';
import { IReview } from '../../../interfaces/ireview';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

  id:string | null | undefined;
  producto:IProduct | null = null;
  imagenActual: string | null = null;
  imagenesPreview: string[] = [];
  cantidad: number = 1;

  resenyas: IReview[] = [];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private ruta:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.ruta.snapshot.paramMap.get('id');
    this.productService.getProduct(this.id).subscribe({
      next: (data) => {
        if (data.body) {
          this.producto = data.body || data;
          console.log(this.producto);
          this.resenyas = this.producto.resenyas ?? [];
          //console.log(data.body);
          console.log("✅ Reseñas recibidas:", this.resenyas);
          console.log("🗨️ Comentarios:", this.resenyas.map(r => r.comentario));
          console.log(this.resenyas);

          this.productService.getImagenesDeProducto(this.producto?.id).subscribe({
            next: (resp) => {
              if (resp.imagenes && resp.imagenes.length > 0) {
                this.imagenActual = resp.imagenes[0];
                this.imagenesPreview = resp.imagenes.slice(1);
              }
            },
            error: (e) => {
              console.error('Error cargando imagenes', e);
            }
          })
        }
      },
      error: (err) => {
        console.error('Ha ocurrido un error', err);
      }
    })
  }

  cambiarImagen(nuevaImagen: string) {
    if (!this.imagenActual) return;

    // Intercambia la imagen actual con la nueva
    const index = this.imagenesPreview.indexOf(nuevaImagen);
    if (index > -1) {
      this.imagenesPreview[index] = this.imagenActual;
      this.imagenActual = nuevaImagen;
    }
  }

  cambiarCantidad(valor: number) {
    const nuevaCantidad = this.cantidad + valor;
    if (nuevaCantidad >= 1 && nuevaCantidad <= (this.producto?.stock || 1)) {
      this.cantidad = nuevaCantidad;
    }
  }

  addToCart() {
    if (!this.producto) return;

    /*if (!this.authService.isLoggedIn()) {
      const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
  
      const existing = localCart.find((item: any) => item.productoId === this.producto.id);
      if (existing) {
        existing.cantidad += this.cantidad;
      } else {
        localCart.push({
          productoId: this.producto.id,
          cantidad: this.cantidad
        });
      }
  
      localStorage.setItem('guest_cart', JSON.stringify(localCart));
      alert('Producto agregado al carrito (modo invitado)');
      return;
    }*/

    this.cartService.addToCart(this.producto.id, this.cantidad).subscribe({
      next: (data) => {
        console.log('Producto agregado al carrito correctamente', data);
        alert('Producto agregado al carrito');
      },
      error: (error) => {
        console.error('Error al agregar el producto al carrito', error);
      }
    })
  }


}
