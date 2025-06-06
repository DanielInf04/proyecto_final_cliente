import { Component, ElementRef, OnInit } from '@angular/core';
import { CartToggleService } from '../../../../../core/services/shared/cart-toggle.service';
import { CartService } from '../../../../../core/services/customer/cart/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/shared/auth/auth.service';
import { TokenService } from '../../../../../core/services/shared/auth/token.service';

declare var bootstrap: any;

@Component({
  selector: 'app-cart-offcanvas',
  standalone: false,
  templateUrl: './cart-offcanvas.component.html',
  styleUrl: './cart-offcanvas.component.scss'
})
export class CartOffcanvasComponent implements OnInit {

  usuarioLogueado: boolean = false;
  usuarioNombre: any = null;
  userRole: string | null = null;

  cartCount = 0;
  productos: any[] = [];
  subtotal: number = 0;
  cupon: any = null;
  totalConDescuento: number = 0;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private cartService: CartService,
    private cartToggleService: CartToggleService,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // Obtenemos el usuario si existe
    this.authService.currentUser$.subscribe(user => {
      this.usuarioLogueado = !! user;
      this.usuarioNombre = user?.name || null;
    });

    // Obtenemos el rol del usuario
    this.userRole = this.tokenService.getUserRole();

    // Estado reactivo del carrito
    this.cartService.cartState$.subscribe(productos => {
      this.productos = productos;
      this.cartCount = productos.reduce((acc, item) => acc + item.cantidad, 0);
      this.actualizarSubtotal();
    });

    this.cartService.cartItemCount$.subscribe(count => {
      this.cartCount = count;
    });

    this.cartToggleService.toggleCart$.subscribe(() => {
      this.abrirOffcanvas();
      this.cartService.refreshCart();
      this.recuperarCuponDesdeStorage();
      this.cargarCheckoutDataDesdeStorage();
    })

    // Carga inicial
    this.cartService.refreshCart();
    this.recuperarCuponDesdeStorage();
    this.cargarCheckoutDataDesdeStorage();
  }

  limpiarScrollBody(): void {
    document.body.removeAttribute('style');
    document.body.removeAttribute('data-bs-padding-right');
    document.body.removeAttribute('data-bs-overflow');
  }

  recuperarCuponDesdeStorage(): void {
    const data = localStorage.getItem('checkoutData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.cupon = parsed.cupon || null;
        if (parsed.cupon) {
          this.cupon = parsed.cupon;
          this.totalConDescuento = this.calcularTotalConDescuento(this.subtotal, parsed.cupon.porcentaje_descuento);
        }
        console.log('✅ Cupon cargado desde localStorage:', this.cupon);
      } catch (e) {
        console.warn('❌ Error al leer checkoutData:', e);
      }
    }
  }

  calcularTotalConDescuento(subtotal: number, porcentaje: number): number {
    const descuento = subtotal * (porcentaje / 100);
    return parseFloat((subtotal - descuento).toFixed(2));
  }

  irALogin(): void {
    this.cerrarOffcanvasYRedirigir('/login');
  }

  irAlCarrito(): void {
    this.cerrarOffcanvasYRedirigir('/cart');
  }

  irAlHome(): void {
    this.cerrarOffcanvasYRedirigir('/');
  }

  irAPanelEmpresa(): void {
    this.cerrarOffcanvasYRedirigir('/empresa-panel/productos');
  }

  irAlFinalizarCompra(): void {
    console.log("Finalizando compra");
    const user = this.authService.getCurrentUser();
    console.log("Tiene usuario?", user);
    if (!user) {

      const habiaCarritoAnon = !!localStorage.getItem('anon_cart');
      const queryParams: any = { redirectTo: '/checkout' };

      if (habiaCarritoAnon) {
        queryParams.pendingMerge = true;
        queryParams.fromLogin = true;
      }

      this.cerrarOffcanvasYRedirigir('/login', queryParams);

      //this.cerrarOffcanvasYRedirigir('/login', { redirectTo: '/checkout' });
    } else {
      this.cerrarOffcanvasYRedirigir('/checkout');
    }
  }

  cerrarOffcanvasYRedirigir(ruta: string, queryParams?: any) {
    const element = this.el.nativeElement.querySelector('#cartOffcanvas');
    const offcanvas = bootstrap.Offcanvas.getInstance(element);

    const limpiarAtributos = () => {
      document.body.removeAttribute('style');
      document.body.removeAttribute('data-bs-padding-right');
      document.body.removeAttribute('data-bs-overflow');
    };

    const redirigir = () => {
      limpiarAtributos();
      this.router.navigate([ruta], { queryParams });
    };

    if (offcanvas) {
      element.addEventListener('hidden.bs.offcanvas', redirigir, { once: true });
      offcanvas.hide();
    } else {
      redirigir();
    }
  }

  abrirOffcanvas() {
    this.limpiarScrollBody();

    const element = this.el.nativeElement.querySelector('#cartOffcanvas');
    const offcanvas = new bootstrap.Offcanvas(element);
    offcanvas.show();
  }

  cambiarCantidad(producto: any, cambio: number): void {
    console.log("Cambiando cantidad", producto);
    const nuevaCantidad = producto.cantidad + cambio;

    // ✅ No permitir más que el stock disponible
    if (nuevaCantidad > producto.stock) {
      return;
    }

    // ✅ Eliminar si la cantidad es menor a 1
    if (nuevaCantidad < 1) {
      this.eliminarProducto(producto);
      return;
    }

    if (this.usuarioLogueado) {
      this.cartService.updateProduct(producto.producto_id, nuevaCantidad).subscribe({
        error: err => console.error('Error al actualizar la cantidad', err)
      });
    } else {
      this.cartService.updateAnonCart(producto.producto_id, nuevaCantidad);
    }
  }

  actualizarSubtotal(): void {
    this.subtotal = this.productos.reduce(
      (total, item) => total + (item.precio_con_iva * item.cantidad),
      0
    );

    if (this.productos.length === 0) {
      this.cupon = null;
      this.totalConDescuento = 0;
      localStorage.removeItem('checkoutData');
      localStorage.removeItem('anon_cart');
      return;
    }

    if (this.cupon) {
      this.totalConDescuento = this.calcularTotalConDescuento(
        this.subtotal,
        this.cupon.porcentaje_descuento
      );
    } else {
      this.totalConDescuento = this.subtotal;
    }

    // ✅ Crear o actualizar checkoutData en localStorage
    localStorage.setItem('checkoutData', JSON.stringify({
      productos: this.productos,
      envio: 0,
      iva: +(this.totalConDescuento - this.subtotal).toFixed(2),
      total: this.totalConDescuento,
      totalSinDescuento: this.subtotal,
      cupon: this.cupon,
      codigoPromocional: ''
    }));
  }

  eliminarProducto(producto: any): void {
    if (this.usuarioLogueado) {
      this.cartService.deleteProduct(producto.producto_id).subscribe({
        next: () => {
          // Actualiza local (opcional si usas el estado central reactivo)
          this.productos = this.productos.filter(p => p.producto_id !== producto.producto_id);
          this.actualizarSubtotal();
        },
        error: err => console.error('Error al eliminar producto', err)
      });
    } else {
      this.cartService.deleteFromAnonCart(producto.producto_id);
      this.productos = this.productos.filter(p => p.producto_id !== producto.producto_id);
      this.actualizarSubtotal();
    }
  }

  cargarCheckoutDataDesdeStorage(): void {
    console.log("Cargando datos en localstorage");
    const data = localStorage.getItem('checkoutData');
    if (!data) return;

    try {
      const parsed = JSON.parse(data);
      this.productos = parsed.productos || [];
      this.subtotal = this.productos.reduce(
        (acc: number, p: any) => acc + (p.precio_con_iva * p.cantidad),
        0
      );
      this.cupon = parsed.cupon || null;
      this.totalConDescuento = parsed.total || this.subtotal;
    } catch (e) {
      console.warn('❌ Error al parsear checkoutData en offcanvas:', e);
    }
  }

}
