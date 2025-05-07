import { Component, ElementRef, OnInit } from '@angular/core';
import { CartToggleService } from '../../../../core/services/shared/cart-toggle.service';
import { CartService } from '../../../../core/services/customer/cart/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/shared/auth/auth.service';
import { TokenService } from '../../../../core/services/shared/auth/token.service';

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

  cartCount = 0;
  productos: any[] = [];
  subtotal: number = 0;
  cupon: any = null;
  totalConDescuento: number = 0;

  constructor(
    private tokenService: TokenService,
    private cartService: CartService,
    private cartToggleService: CartToggleService,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // Comprobamos sesión
    this.usuarioLogueado = this.tokenService.isLoggedIn();
    this.usuarioNombre = this.tokenService.getUserName() ?? '';

    // Recuperar cantidad de productos en carrito
    this.cartService.cartItemCount$.subscribe(count => {
      this.cartCount = count;
    });

    // Obtener productos de carrito
    this.cartToggleService.toggleCart$.subscribe(() => {
      this.abrirOffcanvas();
      this.cargarCarrito();
      this.recuperarCuponDesdeStorage();
    });

    // Cargamos el carrito por si ya hay cosas en localStorage
    this.cargarCarrito();
    this.recuperarCuponDesdeStorage();
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
    this.cerrarOffcanvas();
    this.router.navigate(['/login']);
  }

  irAlCarrito(): void {
    this.cerrarOffcanvas();
    this.router.navigate(['/cart']);
  }

  irAlHome(): void {
    this.cerrarOffcanvas();
    this.router.navigate(['/']);
  }

  irAlFinalizarCompra(): void {
    this.cerrarOffcanvas();
    this.router.navigate(['/checkout']);
  }

  cerrarOffcanvas(): void {
    const offcanvasEl = this.el.nativeElement.querySelector('#cartOffcanvas');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  }

  abrirOffcanvas() {
    const element = this.el.nativeElement.querySelector('#cartOffcanvas');
    const offcanvas = new bootstrap.Offcanvas(element);
    offcanvas.show();
  }

  cargarCarrito() {
    console.log('Cargando carrito...');

    if (this.usuarioLogueado) {
      // Usuario logueado -> obtenemos desde el backend
      this.cartService.getCart().subscribe({
        next: (res) => {
          const carrito = res.body;
          this.productos = carrito.items || [];
          this.actualizarSubtotal();
        },
        error: (err) => {
          console.error('Error al cargar el carrito', err);
        }
      });
    } else {
      // Usuario anónimo -> obtenemos desde localstorage
      const carritoLocal = JSON.parse(localStorage.getItem('anon_cart') || '[]');
      this.productos = carritoLocal;
      this.cartCount = carritoLocal.reduce((acc: number, item: any) => acc + item.cantidad, 0);
      this.actualizarSubtotal();
      console.log('Carrito cargado desde localStorage (anónimo):', this.productos);
    }

  }

  cambiarCantidad(producto: any, cambio: number): void {
    const nuevaCantidad = producto.cantidad + cambio;

    if (nuevaCantidad < 1) {
      this.eliminarProducto(producto);
      return;
    }

    if (this.usuarioLogueado) {
      // Usuario logueado -> actualizamos en el backend
      this.cartService.updateProduct(producto.producto_id, nuevaCantidad).subscribe({
        next: () => {
          producto.cantidad = nuevaCantidad;
          producto.subtotal = producto.precio_con_iva * nuevaCantidad;
          this.actualizarSubtotal();
        },
        error: (err) => console.error('Error al actualizar la cantidad', err)
      });
    } else {
      // Usuario anónimo -> actualizamos en localStorage
      const carrito = JSON.parse(localStorage.getItem('anon_cart') || '[]');
      const index = carrito.findIndex((p: any) => p.producto_id === producto.producto_id);
      if (index !== -1) {
        carrito[index].cantidad = nuevaCantidad;
        localStorage.setItem('anon_cart', JSON.stringify(carrito));
        this.productos = carrito;
        this.cartCount = carrito.reduce((acc: number, item: any) => acc + item.cantidad, 0);
        this.actualizarSubtotal();
      }
    }

  }

  /*cambiarCantidad(producto: any, cambio: number): void {
    const nuevaCantidad = producto.cantidad + cambio;
  
    if (nuevaCantidad < 1) {
      this.eliminarProducto(producto);
      return;
    }
  
    this.cartService.updateProduct(producto.producto_id, nuevaCantidad).subscribe({
      next: (res) => {
        producto.cantidad = nuevaCantidad;
        producto.subtotal = producto.precio_con_iva * nuevaCantidad;
        
        this.subtotal = this.productos.reduce((total, item) => total + item.subtotal, 0);

        if (this.cupon) {
          this.totalConDescuento = this.calcularTotalConDescuento(this.subtotal, this.cupon.porcentaje_descuento);
        }
      },
      error: (err) => {
        console.error('Error al actualizar la cantidad', err);
      }
    });
  }*/

  actualizarSubtotal(): void {
    this.subtotal = this.productos.reduce(
      (total, item) => total + (item.precio_con_iva * item.cantidad),
      0
    );
  
    // ⚠️ Si ya no hay productos, reseteamos todo
    if (this.productos.length === 0) {
      this.cupon = null;
      this.totalConDescuento = 0;
      localStorage.removeItem('checkoutData'); // opcional, pero recomendado
      localStorage.removeItem('anon_cart');
      return;
    }
  
    if (this.cupon) {
      this.totalConDescuento = this.calcularTotalConDescuento(
        this.subtotal,
        this.cupon.porcentaje_descuento
      );
    }
  }

  eliminarProducto(producto: any): void {
    if (this.usuarioLogueado) {
      // Usuario logueado → eliminar del backend
      this.cartService.deleteProduct(producto.producto_id).subscribe({
        next: () => {
          this.productos = this.productos.filter(p => p.producto_id !== producto.producto_id);
          this.actualizarSubtotal();
        },
        error: (err) => console.error('Error al eliminar producto', err)
      });
    } else {
      // Usuario anónimo → eliminar de localStorage
      const carrito = JSON.parse(localStorage.getItem('anon_cart') || '[]');
      const nuevoCarrito = carrito.filter((p: any) => p.producto_id !== producto.producto_id);
      localStorage.setItem('anon_cart', JSON.stringify(nuevoCarrito));
      
      this.productos = nuevoCarrito;
      this.cartCount = nuevoCarrito.reduce((acc: number, item: any) => acc + item.cantidad, 0);
      this.actualizarSubtotal();
    }
  }

  /*eliminarProducto(producto: any): void {
    this.cartService.deleteProduct(producto.producto_id).subscribe({
      next: () => {
        // 1. Eliminar producto
        this.productos = this.productos.filter(p => p.producto_id !== producto.producto_id);
  
        // 2. Recalcular subtotal de cada producto (por seguridad)
        this.productos.forEach(p => {
          p.subtotal = p.precio_con_iva * p.cantidad;
        });
  
        // 3. Actualizar subtotal total
        this.subtotal = this.productos.reduce((total, item) => total + item.subtotal, 0);
  
        // 4. Si hay cupón, recalcular total con descuento
        if (this.cupon) {
          this.totalConDescuento = this.calcularTotalConDescuento(this.subtotal, this.cupon.porcentaje_descuento);
        }
      },
      error: (err) => {
        console.error('Error al eliminar producto', err);
      }
    });
  }*/

}
