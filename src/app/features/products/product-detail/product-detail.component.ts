import { Component, OnInit } from '@angular/core';
//import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { IProduct } from '../../../interfaces/iproduct';
//import { CartService } from '../../../../services/cart.service';
import { IReview } from '../../../interfaces/review/ireview';
//import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/customer/cart/cart.service';
import { ProductService } from '../../../core/services/shared/product.service';
import { IProduct } from '../../../interfaces/product/iproduct';
import { AuthService } from '../../../core/services/shared/auth/auth.service';
import { CartToggleService } from '../../../core/services/shared/cart-toggle.service';
import { TokenService } from '../../../core/services/shared/auth/token.service';
import { CheckoutService } from '../../../core/services/customer/checkout/checkout.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

  isLoading = true;

  userRole: string | null = null;

  id:string | null | undefined;
  producto:IProduct | null = null;
  recomendados: any[] = [];
  imagenActual: string | null = null;
  imagenesPreview: string[] = [];
  cantidad: number = 1;

  //isLoading = true;

  errorMessage: string | null = null;

  resenyas: IReview[] = [];

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private productService: ProductService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private cartToggleService: CartToggleService,
    private router: Router,
    private ruta:ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.userRole = this.tokenService.getUserRole();

    this.ruta.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.id = id;
        this.cargarProducto(id);

        /*if (window.scrollY > 100) {
          setTimeout(() => window.scrollTo(0, 0), 0);
        }*/
      }
    })
  }

  /*ngOnInit(): void {
    // Obtenemos el rol del usuario
    this.userRole = this.tokenService.getUserRole();

    this.id = this.ruta.snapshot.paramMap.get('id');
    // Obtener producto
    this.productService.getProduct(this.id).subscribe({
      next: (data) => {
        if (data.body) {
          this.producto = data.body || data;
          //this.isLoading = false;
          console.log(this.producto);

          // Productos relacionados
          this.productService.getRecommendedProducts('producto', this.producto.id).subscribe({
            next: (resp) => this.recomendados = resp,
            error: (err) => console.error("Error al obtener productos relacionados", err)
          });

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
  }*/

  private cargarProducto(id: string) {
    this.isLoading = true;
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        if (data.body) {
          this.producto = data.body || data;
          this.resenyas = this.producto.resenyas ?? [];

          // Obtenemos las imagenes del producto
          this.productService.getImagenesDeProducto(this.producto.id).subscribe({
            next: (resp) => {
              if (resp.imagenes && resp.imagenes.length > 0) {
                this.imagenActual = resp.imagenes[0];
                this.imagenesPreview = resp.imagenes.slice(1);
              }
            },
            error: (e) => console.error('Error cargando imagenes', e)
          });

          // Obtener productos relacionados
          this.productService.getRecommendedProducts('producto', this.producto.id).subscribe({
            next: (resp) => {
              this.recomendados = resp;
            },
            error: (err) => console.error("Error al obtener productos relacionados", err)
          });
        }
      },
      error: (err) => console.error('Ha ocurrido un error', err),
      complete: () => this.isLoading = false
    });
  }

  /*verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }*/

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
    if (!this.producto) return;

    const nuevaCantidad = this.cantidad + valor;

    if (nuevaCantidad < 1) return;

    if (nuevaCantidad > this.producto.stock) {
      this.errorMessage = `Solo quedan ${this.producto.stock} unidades disponibles.`;
      setTimeout(() => this.errorMessage = null, 4000);
      return;
    }

    this.cantidad = nuevaCantidad;
  }

  addToCart() {
    if (!this.producto) return;

    const precioOfertaOriginal = this.producto.oferta?.precio_original_con_iva;
    const ivaPorcentaje = parseFloat(this.producto.categoria?.iva_porcentaje || '0.21');

    const ofertaActiva = !!this.producto.oferta?.precio_oferta_con_iva;

    const precioFinalConIVA = ofertaActiva
      ? this.producto.oferta?.precio_oferta_con_iva
      : this.producto.precio_con_iva;

      const precioUnitarioBase = ofertaActiva && precioOfertaOriginal != null
      ? precioOfertaOriginal / (1 + ivaPorcentaje)
      : this.producto.precio_base;

    const productoParaCarrito = {
      producto_id: this.producto.id,
      nombre: this.producto.nombre,
      imagen_url: this.imagenActual,
      cantidad: this.cantidad,
      categoria: this.producto.categoria?.nombre,
      iva_porcentaje: this.producto.categoria?.iva_porcentaje || 0.21,

      precio_unitario: precioUnitarioBase,
      precio_con_iva: precioFinalConIVA
    };

    console.log('Producto para carrito', productoParaCarrito);

    if (this.authService.isLoggedIn()) {
      // Usuario logueado -> Enviamos al backend
      this.cartService.addToCart(this.producto.id, this.cantidad).subscribe({
        next: (data) => {
          console.log('Producto agregado al carrito (usuario logueado)', data);
          this.cartToggleService.openCart();
        },
        error: (error) => {
          console.error('Error al agregar producto al carrito', error);
        }
      });
    } else {
      // Usuario anónimo -> guardamos en localstorage
      const carritoLocal = JSON.parse(localStorage.getItem('anon_cart') || '[]');

      const index = carritoLocal.findIndex((p: any) => p.producto_id === this.producto?.id);
      if (index > -1) {
        carritoLocal[index].cantidad += this.cantidad;
      } else {
        carritoLocal.push(productoParaCarrito);
      }

      localStorage.setItem('anon_cart', JSON.stringify(carritoLocal));
      console.log('Producto agregado al carrito local (anónimo)', carritoLocal);
      this.cartToggleService.openCart();
    }
  }

  /*addToCart() {
    if (!this.producto) return;

    this.cartService.addToCart(this.producto.id, this.cantidad).subscribe({
      next: (data) => {
        console.log('Producto agregado al carrito correctamente', data);
        this.cartToggleService.openCart(); // Abrimos el carrito al agregar
        //alert('Producto agregado al carrito');
      },
      error: (error) => {
        console.error('Error al agregar el producto al carrito', error);
      }
    })
  }*/


}
