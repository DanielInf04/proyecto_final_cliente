import { Component, OnInit } from '@angular/core';
import { Coupon } from '../../../interfaces/coupon/coupon';
import { CouponManagerService } from '../../../core/services/shared/coupon-manager.service';
import { CartService } from '../../../core/services/customer/cart/cart.service';
import { CheckoutService } from '../../../core/services/customer/checkout/checkout.service';
import { TokenService } from '../../../core/services/shared/auth/token.service';
import { AuthService } from '../../../core/services/shared/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  
  usuarioLogueado: boolean = false;

  productos: any[] = [];
  subtotal: number = 0;
  envio: number = 0;
  iva: number = 0;
  ivaPorTipo: { porcentaje: string, total: number }[] = [];
  codigoPromocional: string = '';
  cuponAplicado: Coupon | null = null;
  errorCupon: string = '';
  total: number = 0;
  totalConDescuento: number = 0;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private cartService: CartService,
    private couponManager: CouponManagerService,
    private checkoutService: CheckoutService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.usuarioLogueado = this.tokenService.isLoggedIn();

    // Recuperar posible cupón desde CouponManagerSercice
    this.couponManager.recuperarDesdeStorage();
    this.cuponAplicado = this.couponManager.cuponAplicado;
    this.codigoPromocional = this.couponManager.codigoPromocional;
    this.totalConDescuento = this.couponManager.totalConDescuento;

    if (this.usuarioLogueado) {
      this.cartService.getCart().subscribe({
        next: (res) => {
          const carrito = res.body;
          this.productos = carrito.items || [];
          this.subtotal  = carrito.total || 0;
          this.envio = 0;
          this.iva = 0;
          this.total = this.subtotal + this.envio + this.iva;

          this.actualizarTotales();

          // Revalidamos el cupón guardado en localstorage con el backend
          if (this.codigoPromocional) {
            this.couponManager.aplicarCupon(this.codigoPromocional, this.total, (ok, descuento) => {
              if (ok) {
                this.cuponAplicado = this.couponManager.cuponAplicado;
                this.totalConDescuento = this.couponManager.totalConDescuento;
                this.errorCupon = '';
              } else {
                this.cuponAplicado = null;
                this.totalConDescuento = this.total;
                this.errorCupon = this.couponManager.error || 'El cupón ya ha sido usado.';
                this.codigoPromocional = '';
              }

              this.actualizarTotales();
            });
          }
        },
        error: (err) => {
          console.error('Error al obtener el carrito', err);
        }
      });
    } else {
      const carrito = JSON.parse(localStorage.getItem('anon_cart') || '[]');
      this.productos = carrito;
      this.actualizarTotales();
    }
  }

  procederAlPago(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { redirectTo: '/checkout' } });
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  cambiarCantidad(producto: any, cambio: number):void {
    const nuevaCantidad = producto.cantidad + cambio;

    if (nuevaCantidad < 1) {
      this.eliminarProducto(producto);
      return;
    }

    this.cartService.updateProduct(producto.producto_id, nuevaCantidad).subscribe({
      next: (res) => {
        producto.cantidad = nuevaCantidad;
        producto.subtotal = producto.precio_unitario * nuevaCantidad;
        this.actualizarTotales();
      },
      error: (err) => {
        console.error('Error al actualizar la cantidad', err);
      }
    });

  }

  actualizarTotales(): void {
    // Total con IVA incluido ya en los productos
    this.total = this.productos.reduce((acc, p) => acc + (p.precio_con_iva * p.cantidad), 0);
  
    // Calculamos subtotal e IVA estimados para mostrar, solo a nivel visual
    this.subtotal = this.productos.reduce((acc, p) => {
      const ivaPorcentaje = parseFloat(p.iva_porcentaje || '0.21');
      const precioSinIVA = p.precio_con_iva / (1 + ivaPorcentaje);
      return acc + (precioSinIVA * p.cantidad);
    }, 0);
  
    this.iva = this.total - this.subtotal;
  
    // Agrupar IVA por tipo (opcional visualmente)
    const agrupado = new Map<string, number>();
    this.productos.forEach(p => {
      const porcentaje = (parseFloat(p.iva_porcentaje || '0.21') * 100).toFixed(0);
      const precioSinIVA = p.precio_con_iva / (1 + parseFloat(p.iva_porcentaje || '0.21'));
      const ivaProducto = (p.precio_con_iva - precioSinIVA) * p.cantidad;
      const totalActual = agrupado.get(porcentaje) ?? 0;
      agrupado.set(porcentaje, totalActual + ivaProducto);
    });
  
    this.ivaPorTipo = Array.from(agrupado.entries()).map(([porcentaje, total]) => ({
      porcentaje,
      total
    }));
  
    // Aplicamos el cupón si lo hay
    if (this.cuponAplicado) {
      this.totalConDescuento = this.couponManager.calcularTotalConDescuento(this.total);
    } else {
      this.totalConDescuento = this.total;
    }
  
    // Guardamos los datos actualizados para el checkout
    const totalFinal = this.totalConDescuento;
    this.checkoutService.setDatos({
      productos: this.productos,
      envio: this.envio,
      iva: this.iva,
      total: totalFinal,
      totalSinDescuento: this.total,
      cupon: this.cuponAplicado
    });
  
    localStorage.setItem('checkoutData', JSON.stringify({
      productos: this.productos,
      envio: this.envio,
      iva: this.iva,
      total: totalFinal,
      totalSinDescuento: this.total,
      cupon: this.cuponAplicado,
      codigoPromocional: this.codigoPromocional
    }));
  }

  aplicarCupon() {
    if (!this.codigoPromocional) return;

    this.couponManager.aplicarCupon(this.codigoPromocional, this.total, (ok, descuento) => {
      if (ok) {
        this.cuponAplicado = this.couponManager.cuponAplicado;
        this.totalConDescuento = this.couponManager.totalConDescuento;
        this.errorCupon = '';
      } else {
        this.cuponAplicado = null;
        this.totalConDescuento = this.total;
        this.errorCupon = this.couponManager.error;
      }

      this.actualizarTotales();
    });

  }

  eliminarProducto(producto: any): void {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) return;

    this.cartService.deleteProduct(producto.producto_id).subscribe({
      next: (res) => {
        // Elimina el producto del array local
        this.productos = this.productos.filter(p => p.producto_id !== producto.producto_id);
        this.actualizarTotales();
      },
      error: (err) => {
        console.error('Error al eliminar producto del carrito', err);
      }
    })
  }
}
