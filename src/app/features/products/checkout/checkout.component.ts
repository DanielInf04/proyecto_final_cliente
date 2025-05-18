import { Component, OnDestroy, OnInit } from '@angular/core';
//import { CheckoutService } from '../../../../services/checkout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutPagoService } from '../../../core/services/customer/checkout/checkout-pago.service';
import { Router } from '@angular/router';
import { DireccionService } from '../../../core/services/customer/checkout/direccion/direccion.service';
import { Coupon } from '../../../interfaces/coupon/coupon';
import { CouponManagerService } from '../../../core/services/shared/coupon-manager.service';
import { BannerService } from '../../../core/services/shared/banner.service';
import { PaypalButtonComponent } from '../../../shared/paypal-button/paypal-button.component';
import { LocationService } from '../../../core/services/customer/checkout/location.service';
import { CheckoutService } from '../../../core/services/customer/checkout/checkout.service';
import { AuthService } from '../../../core/services/shared/auth/auth.service';
import { CartService } from '../../../core/services/customer/cart/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../../../core/services/customer/profile/profile.service';
import { ToastService } from '../../../core/services/shared/toast.service';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {

  cargandoCarrito = true;
  private destroy$ = new Subject<void>();

  toastMessage: string | null = null;
  toastType: 'success' | 'danger' = 'success';

  productos: any[] = [];
  provincias: any[] | null = null;
  poblaciones: any[] = [];

  envio: number = 0;
  impuestos: number = 0;
  total: number = 0;
  totalSinDescuento: number = 0;
  
  cuponAplicado: Coupon | null = null;
  codigoPromocional: string = '';
  errorCupon: string = '';
  errorCodigoPostal: string = '';

  // Errores al finalizar compra
  errorMessage: string | null = null;

  myForm:FormGroup;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private toastService: ToastService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private checkoutPagoService: CheckoutPagoService,
    private checkoutDireccionService: DireccionService,
    private locationService: LocationService,
    private bannerService: BannerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private couponManager: CouponManagerService
  ) {
    this.myForm = new FormGroup({
    });
  }

  ngOnInit(): void {
    // Escuchamos cambios del carrito
    this.cartService.cartState$
    .pipe(takeUntil(this.destroy$))
      .subscribe(productos => {
        this.productos = productos;

        if (!this.cargandoCarrito && productos.length === 0) {
          this.router.navigate(['/cart']);
          return;
        }

        this.totalSinDescuento = productos.reduce((acc, p) => acc + (p.precio_con_iva * p.cantidad), 0);

        this.cuponAplicado = this.couponManager.cuponAplicado;
        this.total = this.cuponAplicado
          ? this.totalSinDescuento * (1 - (this.cuponAplicado.porcentaje_descuento / 100))
          : this.totalSinDescuento;
    });

    // Detectamos cuando termina de cargar el carrito
    this.cartService.cartLoaded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cargado => {
        if (cargado) {
          this.cargandoCarrito = false;
        }
      });

    // Siempre intentamos recuperar cupón desde localStorage también
    this.couponManager.recuperarDesdeStorage();
    this.cuponAplicado = this.couponManager.cuponAplicado;
    this.total = this.couponManager.totalConDescuento || this.total;
    this.totalSinDescuento = this.couponManager.totalOriginal;
    this.codigoPromocional = this.couponManager.codigoPromocional;
    this.errorCupon = this.couponManager.error;

    this.myForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.email]],
      telefono: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      puerta: [''],
      piso: [''],
      pais: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      poblacion_id: ['', [Validators.required]],
      codigo_postal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      metodo_pago: ['', Validators.required],
      guardarDireccion: [false]
    });

    this.locationService.getProvincias().subscribe({
      next: (res) => {
        this.provincias = res.body ?? [];

        if (this.authService.isLoggedIn()) {
          // Obtenemos datos del usaurio logueado
          this.profileService.getProfile().subscribe({
            next: (data) => {
              if (data.body) {
                console.log('Datos de usuario', data.body);
                this.myForm.patchValue({
                  email: data.body.email,
                  telefono: data.body.telefono
                });
              }
            },
            error: (err) => {
              console.error('Error al cargar datos del usuario');
            }
          });

          // Obtemnemos direccion guardada
          this.checkoutDireccionService.obtenerDireccionGuardada().subscribe({
            next: (data) => {
              if (data.body) {
                console.log("Direccion guardada:", data.body);
                this.myForm.patchValue({
                  calle: data.body.calle,
                  puerta: data.body.puerta,
                  piso: data.body.piso,
                  pais: data.body.pais,
                  provincia: data.body.provincia_id,
                  codigo_postal: data.body.codigo_postal,
                  guardarDireccion: true
                });

                this.locationService.getPoblacionPorProvincia(data.body.provincia_id).subscribe({
                  next: (res) => {
                    this.poblaciones = res.body ?? [];
                    this.myForm.patchValue({ poblacion_id: data.body.poblacion_id });
                  },
                  error: (err) => {
                    console.error('Error al cargar poblaciones', err);
                  }
                });
              }
            },
            error: (err) => {
              if (err.status !== 204) {
                console.error('Error al obtener direccion guardada', err);
              }
            }
          });
        }

        this.myForm.get('provincia')?.valueChanges.subscribe((provinciaId) => {
          if (provinciaId) {
            this.locationService.getPoblacionPorProvincia(provinciaId).subscribe({
              next: (res) => {
                this.poblaciones = res.body ?? [];
              },
              error: (err) => {
                console.error('Error al cargar poblaciones', err);
                this.poblaciones = [];
              }
            });
          } else {
            this.poblaciones = [];
          }
        });
      }
    });
    console.log("Total sin descuento:", this.totalSinDescuento);
    console.log("Total:", this.total);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPaypalAprobado(details: any) {
    //console.log('Productos a pagar:', details);
    this.finalizarCompra({ id: details.id });
  }

  aplicarCupon(): void {
    if (!this.codigoPromocional) return;

    this.couponManager.aplicarCupon(this.codigoPromocional, this.totalSinDescuento, (ok, descuento) => {
      if (ok) {
        this.cuponAplicado = this.couponManager.cuponAplicado;
        this.total = this.couponManager.totalConDescuento;
        this.errorCupon = '';
      } else {
        this.cuponAplicado = null;
        this.total = this.totalSinDescuento;
        this.errorCupon = this.couponManager.error;
      }
    });
  }

  get datosContactoPaypal() {
    return {
      nombre: this.myForm.value.nombre,
      apellidos: this.myForm.value.apellidos,
      calle: this.myForm.value.calle,
      codigo_postal: this.myForm.value.codigo_postal,
      provincia: this.provincias?.find(p => p.id == this.myForm.value.provincia)?.nombre || '',
      ciudad: this.poblaciones?.find(p => p.id == this.myForm.value.poblacion_id)?.nombre || ''
    };
  }

  isInvalid(field: string): boolean {
    const control = this.myForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  finalizarCompra(paypalDetails: any = null) {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); // Mostramos los errores si los hay
      return;
    }

    const payload: any = {
      contacto: {
        nombre: this.myForm.value.nombre,
        apellidos: this.myForm.value.apellidos,
        email: this.myForm.value.email,
        telefono: this.myForm.value.telefono,
      },
      direccion: {
        calle: this.myForm.value.calle,
        puerta: this.myForm.value.puerta,
        piso: this.myForm.value.piso,
        pais: this.myForm.value.pais,
        //provincia: this.myForm.value.provincia,
        //ciudad: this.myForm.value.ciudad,
        poblacion_id: this.myForm.value.poblacion_id,
        codigo_postal: this.myForm.value.codigo_postal,
      },
      guardar_direccion: this.myForm.value.guardarDireccion,
      productos: this.productos,
      metodo_pago: this.myForm.value.metodo_pago,
      total: this.total,
      cupon: this.cuponAplicado
        ? {
          id: this.cuponAplicado.id,
          codigo: this.cuponAplicado.codigo
        }
        : undefined,
    };

    // Si se usó PayPal, añadimos los detalles
    if (paypalDetails) {
      payload.paypal = paypalDetails;
    }

    console.log('Payload final:', payload);

    this.toastService.showToast('¡Pedido completado con éxito!', 'success');

    this.checkoutPagoService.procesarCheckout(payload).subscribe({
      next: (res) => {
        console.log('Pedido completado', res.body);

        this.toastService.showToast('¡Pedido completado con éxito!', 'success');

        setTimeout(() => {
          this.couponManager.resetCupon();
          localStorage.removeItem('checkoutData');

          localStorage.setItem('seenWelcomeBanner', 'true');
          localStorage.removeItem('cuponNombre');
          localStorage.removeItem('cuponDescuento');


          this.cartService.resetCartState();

          this.router.navigate(['/']);

          this.bannerService.reset();
          this.bannerService.triggerReload();
        }, 2000);
      },
      error: (err) => {
        console.error('Error al finalizar compra', err);

        if (err.status === 400 && err.error?.error === 'stock_insuficiente') {
          const errores = err.error.productos_con_error || [];

          this.errorMessage = 'Stock insuficiente en: ' + errores
            .map((p: { nombre?: string; stock_disponible?: number }) => {
              const nombre = p?.nombre ?? 'Producto desconocido';
              const truncado = nombre.length > 40 ? nombre.slice(0, 37) + '...' : nombre;
              const stock = p?.stock_disponible ?? 0;
              return `${truncado} (quedan ${stock})`;
            })
            .join(', ') + '.';

            // Desaparece en 6 segundos
            setTimeout(() => {
              this.errorMessage = null;
            }, 6000);

          return;
        }

        // Manejo específico para errores de validación 422
        if (err.status === 422 && err.error?.error) {
          this.errorCodigoPostal = "Código postal inválido";
        } else {
          alert('Ocurrió un error al procesar el pedido. Inténtalo más tarde.');
        }
      }
    })

  }

  calcularDescuento(): number {
    return this.cuponAplicado ? (this.totalSinDescuento - this.total) : 0;
  }

}
