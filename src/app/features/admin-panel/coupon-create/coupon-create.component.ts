import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminCouponService } from '../../../core/services/admin/admin-coupon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coupon-create',
  standalone: false,
  templateUrl: './coupon-create.component.html',
  styleUrl: './coupon-create.component.scss'
})
export class CouponCreateComponent implements OnInit {

  myForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private couponService: AdminCouponService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.myForm = new FormGroup({
    });
  }

  ngOnInit(): void {
      this.myForm = this.formBuilder.group({
        codigo: ['', [Validators.required]],
        porcentaje_descuento: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
        solo_nuevos_usuarios: [''],
        fecha_expiracion: [''],
      });
  }

  onSubmit(formValue: any) {

    const formData = new FormData();

    formData.append('codigo', formValue.codigo);
    formData.append('porcentaje_descuento', formValue.porcentaje_descuento);
    formData.append(
      'solo_nuevos_usuarios', 
      formValue.solo_nuevos_usuarios ? '1' : '0'
    );
    formData.append('fecha_expiracion', formValue.fecha_expiracion);

    this.couponService.createCoupon(formData).subscribe({
      next: () => {
        this.router.navigate(['/admin-panel/coupons'], {
          state: { messageSuccess: 'Cupón creado con éxito' }
        });
        /*alert('Cupon añadido con éxito');
        this.router.navigate(['/admin-panel/coupons']);*/
      },
      error: (err) => {
        this.errorMessage = 'Error al agregar un cupon';
        console.error(err);
      }
    })

  }

}
