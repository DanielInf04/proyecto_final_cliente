import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private bannerVisibleSubject = new BehaviorSubject<boolean>(false);
  bannerVisible$ = this.bannerVisibleSubject.asObservable();

  private cuponNombreSubject = new BehaviorSubject<string | null>(null);
  cuponNombre$ = this.cuponNombreSubject.asObservable();
  
  private porcentajeDescuentoSubject = new BehaviorSubject<number>(0);
  porcentajeDescuento$ = this.porcentajeDescuentoSubject.asObservable();

  private reloadBannerSubject = new Subject<void>(); // ✅ mejor que usar BehaviorSubject<void>
  reloadBanner$ = this.reloadBannerSubject.asObservable();

  showBanner(cupon: string, descuento: number): void {
    this.cuponNombreSubject.next(cupon);
    this.porcentajeDescuentoSubject.next(descuento);
    this.bannerVisibleSubject.next(true);
  }

  hideBanner(): void {
    this.bannerVisibleSubject.next(false);
  }

  triggerReload(): void {
    this.reloadBannerSubject.next(); // ✅ ahora emite correctamente sin tener valor anterior
  }

  reset(): void {
    this.cuponNombreSubject.next(null);
    this.porcentajeDescuentoSubject.next(0);
    this.bannerVisibleSubject.next(false);
  }
}

  /*isBannerVisible(): boolean {
    return this.bannerVisibleSubject.value;
  }*/

  /*private _hideBanner$ = new BehaviorSubject<boolean>(false);
  hideBanner$ = this._hideBanner$.asObservable();

  hideBanner() {
    this._hideBanner$.next(true);
  }*/


