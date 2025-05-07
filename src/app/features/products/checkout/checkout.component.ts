import { Component, OnInit } from '@angular/core';
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

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
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

  myForm:FormGroup;

  constructor(
    private authService: AuthService,
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
    const datos$ = this.checkoutService.getDatos();

    datos$.productos$.subscribe(p => {
      this.productos = p;

      // Si está vacío por recarga, intentamos desde localStorage
      if (!p || p.length === 0) {
        console.warn('No hay productos en el carrito. No se puede continuar con el pedido.');
        return;
      }

      this.productos = p;

    });

    //datos$.subtotal$.subscribe(s => this.subtotal = s);
    datos$.envio$.subscribe(e => this.envio = e);
    datos$.impuestos$.subscribe(i => this.impuestos = i);
    datos$.total$.subscribe(t => this.total = t);
    datos$.cupon$.subscribe(c => this.cuponAplicado = c);

    this.couponManager.recuperarDesdeStorage();
    this.cuponAplicado = this.couponManager.cuponAplicado;
    this.total = this.couponManager.totalConDescuento || this.total;
    this.totalSinDescuento = this.couponManager.totalOriginal;
    
    this.codigoPromocional = this.couponManager.codigoPromocional;
    this.errorCupon = this.couponManager.error;

    this.myForm = this.formBuilder.group({
      nombre: ['Daniel', [Validators.required]],
      apellidos: ['Matviiv', [Validators.required]],
      email: ['danigamerrep@gmail.com', [Validators.email]],
      telefono: ['661074646', [Validators.required]],
      calle: ['', [Validators.required]],
      puerta: [''],
      piso: [''],
      pais: ['España', [Validators.required]],
      provincia: ['', [Validators.required]],
      //ciudad: ['', [Validators.required]],
      poblacion_id: ['', [Validators.required]],
      codigo_postal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      metodo_pago: ['', Validators.required],
      guardarDireccion: [false]
    });

    this.locationService.getProvincias().subscribe({
      next: (res) => {
        console.log('📦 Provincias cargadas:', res);
        this.provincias = res.body ?? [];

        // Si el usuario está logueado, comprobamos si tiene una direccion guardada
        if (this.authService.isLoggedIn()) {
          this.checkoutDireccionService.obtenerDireccionGuardada().subscribe({
            next: (data) => {
              if (data.body) {
                this.myForm.patchValue({
                  calle: data.body.calle,
                  puerta: data.body.puerta,
                  piso: data.body.piso,
                  pais: data.body.pais,
                  provincia: data.body.provincia_id,
                  codigo_postal: data.body.codigo_postal,
                  guardarDireccion: true
                });
  
                // Luego cargamos poblaciones de esa provincia
                this.locationService.getPoblacionPorProvincia(data.body.provincia_id).subscribe({
                  next: (res) => {
                    this.poblaciones = res.body ?? [];
    
                    this.myForm.patchValue({
                      poblacion_id: data.body.poblacion_id
                    });
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

  }

  onPaypalAprobado(details: any) {
    this.finalizarCompra({ id: details.id });
  }

  recuperarDesdeStorage(): void {
    const data = localStorage.getItem('checkoutData');
    if (data) {
      const parsed = JSON.parse(data);
      this.productos = parsed.productos || [];
      //this.subtotal = parsed.subtotal || 0;
      this.envio = parsed.envio || 0;
      this.impuestos = parsed.impuestos || 0;
      this.total = parsed.total || 0;
      this.totalSinDescuento = parsed.totalSinDescuento || this.total;
      this.cuponAplicado = parsed.cupon || null;
    }
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

    this.checkoutPagoService.procesarCheckout(payload).subscribe({
      next: (res) => {
        console.log('Pedido completado', res.body);
        alert('Pedido completado');

        this.couponManager.resetCupon();
        localStorage.removeItem('checkoutData');

        localStorage.setItem('seenWelcomeBanner', 'true');

        // Notificamos al banner que debe ocultarse
        this.bannerService.hideBanner();

        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al finalizar compra', err);

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
