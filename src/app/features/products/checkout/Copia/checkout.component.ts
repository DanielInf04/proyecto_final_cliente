import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../../../../services/checkout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutPagoService } from '../../../core/services/checkout/checkout-pago.service';
import { Router } from '@angular/router';
import { DireccionService } from '../../../core/services/checkout/direccion/direccion.service';
import { Coupon } from '../../../interfaces/coupon';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  productos: any[] = [];
  //subtotal: number = 0;
  envio: number = 0;
  impuestos: number = 0;
  total: number = 0;
  totalSinDescuento: number = 0;
  cuponAplicado: Coupon | null = null;

  myForm:FormGroup;

  constructor(
    private checkoutService: CheckoutService,
    private checkoutPagoService: CheckoutPagoService,
    private checkoutDireccionService: DireccionService,
    private formBuilder: FormBuilder,
    private router: Router
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
        this.recuperarDesdeStorage();
      } else {
        this.productos = p;
      }
    });

    //datos$.subtotal$.subscribe(s => this.subtotal = s);
    datos$.envio$.subscribe(e => this.envio = e);
    datos$.impuestos$.subscribe(i => this.impuestos = i);
    datos$.total$.subscribe(t => this.total = t);
    datos$.cupon$.subscribe(c => this.cuponAplicado = c);

    this.myForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.email]],
      telefono: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      puerta: ['', [Validators.required]],
      piso: [''],
      pais: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      codigo_postal: ['', [Validators.required]],
      metodo_pago: ['', Validators.required],
      guardarDireccion: [false]
    });

    this.checkoutDireccionService.obtenerDireccionGuardada().subscribe({
      next: (data) => {
        if (data.body) {
          this.myForm.patchValue({
            calle: data.body.calle,
            puerta: data.body.puerta,
            piso: data.body.piso,
            pais: data.body.pais,
            provincia: data.body.provincia,
            ciudad: data.body.ciudad,
            codigo_postal: data.body.codigo_postal,
            guardarDireccion: [true]
          });
        }
      }
    })

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

  finalizarCompra() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); // Mostramos los errores si los hay
      return;
    }

    const payload = {
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
        provincia: this.myForm.value.provincia,
        ciudad: this.myForm.value.ciudad,
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

    console.log('Payload final:', payload);

    this.checkoutPagoService.procesarCheckout(payload).subscribe({
      next: (res) => {
        console.log('Pedido completado', res.body);
        alert('Pedido completado');
        localStorage.removeItem('checkoutData');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al finalizar compra', err);
      }
    })

  }

  calcularDescuento(): number {
    if (!this.cuponAplicado) return 0;
    return this.total * (this.cuponAplicado.porcentaje_descuento / 100);
  }

}
