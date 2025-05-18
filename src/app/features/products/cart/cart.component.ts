import { Component, OnInit } from '@angular/core';
import { Coupon } from '../../../interfaces/coupon/coupon';
import { CouponManagerService } from '../../../core/services/shared/coupon-manager.service';
import { CartService } from '../../../core/services/customer/cart/cart.service';
import { CheckoutService } from '../../../core/services/customer/checkout/checkout.service';
import { TokenService } from '../../../core/services/shared/auth/token.service';
import { AuthService } from '../../../core/services/shared/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogService } from '../../../core/services/shared/confirm-dialog.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  
  usuarioLogueado: boolean = false;

  accionPendiente: 'eliminar' | 'fusionar' | null = null;

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

  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private cartService: CartService,
    private confirmDialog: ConfirmDialogService,
    private couponManager: CouponManagerService,
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log("ngOnInit cart compontent");
    this.usuarioLogueado = this.tokenService.isLoggedIn();

    const queryParams = this.route.snapshot.queryParams;
    const fromLogin = queryParams['fromLogin'];
    const pendingMerge = queryParams['pendingMerge'];

    if (fromLogin && pendingMerge) {
      this.pedirFusionCarritoAnonimo();
    }

    // Recuperar cupón
    this.couponManager.recuperarDesdeStorage();
    this.cuponAplicado = this.couponManager.cuponAplicado;
    this.codigoPromocional = this.couponManager.codigoPromocional;
    this.totalConDescuento = this.couponManager.totalConDescuento;

    // Subscribirse al estado central del carrito
    this.cartService.cartState$.subscribe(productos => {
      console.log("Productos carrito", productos);
      this.productos = productos;
      this.actualizarTotales();

      // Si hay cupón, revalidar con backend
      if (this.codigoPromocional) {
        this.couponManager.aplicarCupon(this.codigoPromocional, this.total, (ok, _) => {
          this.cuponAplicado = ok ? this.couponManager.cuponAplicado : null;
          this.totalConDescuento = this.couponManager.totalConDescuento;
          this.errorCupon = this.couponManager.error || (ok ? '' : 'El cupón ya ha sido usado.');
          if (!ok) this.codigoPromocional = '';
          this.actualizarTotales();
        })
      }
    });
    
    // Solo refrescar si no hay fusión pendiente
    if (!(fromLogin && pendingMerge)) {
      this.cartService.refreshCart();
    }
  }

  procederAlPago(): void {
    if (!this.authService.isLoggedIn()) {
      const teniaCarritoAnon = !!localStorage.getItem('anon_cart');

      const queryParams: any = {
        redirectTo: '/checkout'
      };

      if (teniaCarritoAnon) {
        queryParams.pendingMerge = true;
        queryParams.fromLogin = true;
      }

      this.router.navigate(['/login'], { queryParams });
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  cambiarCantidad(producto: any, cambio: number): void {
    const nuevaCantidad = producto.cantidad + cambio;

    if (nuevaCantidad < 1) {
      this.eliminarProducto(producto);
      return;
    }

    if (nuevaCantidad > producto.stock) {
      this.errorMessage = `Solo hay ${producto.cantidad} ${producto.cantidad === 1 ? 'unidad disponible' : 'unidades disponibles'} de "${producto.nombre}".`;
      setTimeout(() => this.errorMessage = null, 4000);
      return;
    }

    if (this.usuarioLogueado) {
      this.cartService.updateProduct(producto.producto_id, nuevaCantidad).subscribe({
        error: (err) => console.error('Error al actualizar cantidad', err)
      });
    } else {
      this.cartService.updateAnonCart(producto.producto_id, nuevaCantidad);
    }
  }

  eliminarProducto(producto: any): void {
    this.confirmDialog.requestConfirmation(
      '¿Estás seguro de que quieres eliminar este producto del carrito?',
      () => {
        const id = producto.producto_id;

        if (this.usuarioLogueado) {
          this.cartService.deleteProduct(id).subscribe({
            error: (err) => console.error('Error al eliminar producto', err)
          });
        } else {
          this.cartService.deleteFromAnonCart(id);
          localStorage.removeItem('anon_cart');
        }
      }
    );
  }

  pedirFusionCarritoAnonimo(): void {
    this.confirmDialog.requestConfirmation(
      'Tienes productos guardados como invitado. ¿Quieres añadirlos a tu cuenta?',
      () => {
        this.cartService.mergeAnonCartIfExists().subscribe({
          next: (merged) => {
            if (merged) {
              localStorage.removeItem('anon_cart');
            }
            this.cartService.refreshCart();
          },
          error: (err) => {
            console.error('Error al fusionar carrito', err);
          }
        });
      }
    );
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

    console.log('[CartComponent] Totales actualizados y enviados al checkoutService');
  
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
}