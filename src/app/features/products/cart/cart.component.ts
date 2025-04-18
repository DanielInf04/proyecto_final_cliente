import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../../services/cart.service';
import { CheckoutService } from '../../../../services/checkout.service';
import { Coupon } from '../../../interfaces/coupon';
import { CouponService } from '../../../core/services/coupons/coupon.service';
import { CouponManagerService } from '../../../core/services/coupons/coupon-manager.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  
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
    private cartService: CartService,
    private couponService: CouponService,
    private couponManager: CouponManagerService,
    private checkoutService: CheckoutService,
  ) {}

  ngOnInit(): void {
    // Recuperar posible cupón desde CouponManagerService
    this.couponManager.recuperarDesdeStorage();
    this.cuponAplicado = this.couponManager.cuponAplicado;
    this.codigoPromocional = this.couponManager.codigoPromocional;
    this.totalConDescuento = this.couponManager.totalConDescuento;
    
    this.cartService.getCart().subscribe({
      next: (res) => {
        console.log('Carrito:', res.body);

        const carrito = res.body;
        this.productos = carrito.items || [];
        this.subtotal = carrito.total || 0;
        
        this.envio = 0;
        this.iva = 0;
        this.total = this.subtotal + this.envio + this.iva;

        this.actualizarTotales();
      },
      error: (err) => {
        console.error('Error al obtener el carrito', err);
      }
    });
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
    // Calculamos el subtotal
    this.subtotal = this.productos.reduce((acc, p) => acc + (parseFloat(p.precio_unitario) * p.cantidad), 0);

    // Agrupar IVA por tipo
    const agrupado = new Map<string, number>();

    this.productos.forEach(p => {
      const porcentaje = (parseFloat(p.iva_porcentaje) * 100).toFixed(0);
      const ivaProducto = parseFloat(p.precio_unitario) * parseFloat(p.iva_porcentaje) * p.cantidad;

      const totalActual = agrupado.get(porcentaje) ?? 0;
      agrupado.set(porcentaje, totalActual + ivaProducto);
    });

    // Convertir Map a array para mostrarlo en HTML
    this.ivaPorTipo = Array.from(agrupado.entries()).map(([porcentaje, total]) => ({
      porcentaje,
      total
    }));

    // Calculamos IVA total
    this.iva = this.ivaPorTipo.reduce((acc, tipo) => acc + tipo.total, 0);

    // Calculamos total final
    this.total = this.subtotal + this.iva + this.envio;

    // Aplicamos el descuento si hay cupón
    if (this.cuponAplicado) {
      this.totalConDescuento = this.couponManager.calcularTotalConDescuento(this.total);
    } else {
      this.totalConDescuento = this.total;
    }

    const totalFinal = this.cuponAplicado ? this.totalConDescuento : this.total;

    // Guardamos el checkout actualizado
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

  private recalcularTotalConCupon(): void {
    if (this.cuponAplicado) {
      this.totalConDescuento = this.total - (this.total * this.cuponAplicado.porcentaje_descuento / 100);
    } else {
      this.totalConDescuento = this.total;
    }
  }

  /*actualizarTotales(): void {
    this.subtotal = this.productos.reduce((acc, p) => acc + (p.precio_unitario * p.cantidad), 0);
    //this.impuestos = this.subtotal * 0.21;
    //this.envio = this.subtotal > 50 ? 0 : 5;
    this.total = this.subtotal + this.iva + this.envio;
  }*/

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
