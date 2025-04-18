import { Component, OnInit } from '@angular/core';
import { CouponService } from '../core/services/coupons/coupon.service';
import { BannerService } from '../core/services/coupons/banner.service';

@Component({
  selector: 'app-promo-banner',
  standalone: false,
  templateUrl: './promo-banner.component.html',
  styleUrl: './promo-banner.component.scss'
})
export class PromoBannerComponent implements OnInit {

  show = false;
  cupon: string | null = null;
  porcentaje_descuento: number = 0;

  constructor(
    private couponService: CouponService,
    private bannerService: BannerService
  ) {}

  ngOnInit(): void {
    const alreadySeen = localStorage.getItem('seenWelcomeBanner') === 'true';

    if (alreadySeen) {
      this.show = false;
      return;
    }

    this.bannerService.hideBanner$.subscribe(hide => {
      if (hide) {
        this.show = false;
      }
    })

    this.couponService.checkWelcomeCouponStatus().subscribe({
      next: (response) => {
        this.show = response.mostrarBanner;
        this.cupon = response.cupon;
        this.porcentaje_descuento = response.porcentaje_descuento;
      },
      error: () => {
        this.show = false;
        this.cupon = null;
      }
    });
  }

}
