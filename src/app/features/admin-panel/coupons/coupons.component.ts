import { Component, OnInit } from '@angular/core';
import { Coupon } from '../../../interfaces/coupon';
import { AdminCouponService } from '../../../core/services/coupons/admin-coupon.service';

@Component({
  selector: 'app-coupons',
  standalone: false,
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent implements OnInit {

  tituloListado = "Listado de cupones";
  cupones: Coupon[] = [];

  constructor(
    private couponsService: AdminCouponService
  ) {}

  ngOnInit(): void {
      this.couponsService.getCoupons().subscribe(resp => {
        if (resp.body) {
          console.log(resp.body);
          this.cupones = resp.body;
        } else {
          this.cupones = [];
        }
      })
  }

  eliminarCupon(id: any) {
    this.couponsService.deleteCoupon(id).subscribe(() => {
      this.ngOnInit();
    })
  }

}
