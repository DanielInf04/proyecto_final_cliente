import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../../core/services/customer/coupon/coupon.service';
import { BannerService } from '../../../../core/services/shared/banner.service';
import { TokenService } from '../../../../core/services/shared/auth/token.service';

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
    private bannerService: BannerService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.bannerService.bannerVisible$.subscribe(show => {
      this.show = show;
    });

    this.bannerService.cuponNombre$.subscribe(nombre => {
      this.cupon = nombre;
    });

    this.bannerService.porcentajeDescuento$.subscribe(porcentaje => {
      this.porcentaje_descuento = porcentaje;
    });

    this.inicializarBanner();

    // Escuchamos eventos de recarga forzada
    this.bannerService.reloadBanner$.subscribe(() => {
      this.inicializarBanner();
    });
  }

  inicializarBanner(): void {
    const userIsLoggedIn = this.tokenService.isLoggedIn();

    // Siempre pedimos al backend, logueado o no
    this.couponService.checkWelcomeCouponStatus().subscribe({
      next: (resp) => {
        if (resp.mostrarBanner && resp.cupon && resp.porcentaje_descuento > 0) {
          this.bannerService.showBanner(resp.cupon, resp.porcentaje_descuento);

          // Guardamos en localStorage solo si es anónimo
          if (!userIsLoggedIn) {
            localStorage.setItem('cuponNombre', resp.cupon);
            localStorage.setItem('cuponDescuento', resp.porcentaje_descuento.toString());
          }
        } else {
          this.bannerService.hideBanner();
        }
      },
      error: () => {
        this.bannerService.hideBanner();
      }
    });
  }

  /*inicializarBanner(): void {
    const userIsLoggedIn = this.tokenService.isLoggedIn();

    if (!userIsLoggedIn) {
      const alreadySeen = localStorage.getItem('seenWelcomeBanner') === 'true';
      if (alreadySeen) {
        this.bannerService.hideBanner();
        return;
      }

      const cuponGuardado = localStorage.getItem('cuponNombre');
      const descuentoGuardado = localStorage.getItem('cuponDescuento');
      if (cuponGuardado && descuentoGuardado) {
        this.cupon = cuponGuardado;
        this.porcentaje_descuento = +descuentoGuardado;
      }
    }

    this.bannerService.bannerVisible$.subscribe(isVisible => {
      this.show = isVisible && !!this.cupon && this.porcentaje_descuento > 0;
    });

    this.couponService.checkWelcomeCouponStatus().subscribe({
      next: (resp) => {
        if (resp.mostrarBanner && resp.cupon && resp.porcentaje_descuento > 0) {
          this.cupon = resp.cupon;
          this.porcentaje_descuento = resp.porcentaje_descuento;

          if (!userIsLoggedIn) {
            localStorage.setItem('cuponNombre', this.cupon);
            localStorage.setItem('cuponDescuento', this.porcentaje_descuento.toString());
          }

          this.bannerService.showBanner();
        } else {
          this.bannerService.hideBanner();
        }
      },
      error: () => {
        this.bannerService.hideBanner();
      }
    });
  }*/

  /*ngOnInit(): void {
    const userIsLoggedIn = this.tokenService.isLoggedIn();

    if (!userIsLoggedIn) {
      const alreadySeen = localStorage.getItem('seenWelcomeBanner') === 'true';
      if (alreadySeen) {
        this.bannerService.hideBanner();
        return;
      }

      // Pre-carga desde localStorage para mostrar si es anónimo
      const cuponGuardado = localStorage.getItem('cuponNombre');
      const descuentoGuardado = localStorage.getItem('cuponDescuento');
      if (cuponGuardado && descuentoGuardado) {
        this.cupon = cuponGuardado;
        this.porcentaje_descuento = +descuentoGuardado;
        this.bannerService.showBanner();
      }
    }

    // Siempre validamos con el backend (solo para usuarios logueados)
    this.couponService.checkWelcomeCouponStatus().subscribe({
      next: (resp) => {
        if (resp.mostrarBanner && resp.cupon && resp.porcentaje_descuento > 0) {
          this.cupon = resp.cupon;
          this.porcentaje_descuento = resp.porcentaje_descuento;

          // Solo guardamos si NO está logueado
          if (!userIsLoggedIn) {
            localStorage.setItem('cuponNOmbre', this.cupon);
            localStorage.setItem('cuponDescuento', this.porcentaje_descuento.toString());
          }

          this.bannerService.showBanner();
        } else {
          this.bannerService.hideBanner();
        }
      },
      error: () => {
        this.bannerService.hideBanner();
      }
    });

    // Suscribirse al estado observable del banner
    this.bannerService.bannerVisible$.subscribe(isVisible => {
      this.show = isVisible;
    });
  }*/

    /*const alreadySeen = localStorage.getItem('seenWelcomeBanner') === 'true';

    if (alreadySeen) {
      this.bannerService.hideBanner();
      return;
    }

    // Precargamos el cupón guardado si existe
    const cuponGuardado = localStorage.getItem('cuponNombre');
    const descuentoGuardado = localStorage.getItem('cuponDescuento');

    if (cuponGuardado && descuentoGuardado) {
      this.cupon = cuponGuardado;
      this.porcentaje_descuento = +descuentoGuardado;
    }

    // Escuchamos la visibilidad del banner
    this.bannerService.bannerVisible$.subscribe(isVisible => {
      this.show = isVisible && !!this.cupon;
    });

    // Estado del cupón
    this.couponService.checkWelcomeCouponStatus().subscribe({
      next: (resp) => {
        if (resp.mostrarBanner && resp.cupon && resp.porcentaje_descuento) {
          this.cupon = resp.cupon;
          this.porcentaje_descuento = resp.porcentaje_descuento;

          localStorage.setItem('cuponNombre', this.cupon);
          localStorage.setItem('cuponDescuento', this.porcentaje_descuento.toString());

          this.bannerService.showBanner();
        } else {
          this.bannerService.hideBanner();
        }
      },
      error: () => {
        this.bannerService.hideBanner();
        this.cupon = null;
      }
    });*/
  

}
