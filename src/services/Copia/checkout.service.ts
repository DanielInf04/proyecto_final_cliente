import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coupon } from '../app/interfaces/coupon';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private productos = new BehaviorSubject<any[]>([]);
  //private subtotal = new BehaviorSubject<number>(0);
  private envio = new BehaviorSubject<number>(0);
  private iva = new BehaviorSubject<number>(0);
  private total = new BehaviorSubject<number>(0);
  private cupon$ = new BehaviorSubject<Coupon | null>(null);
  private totalSinDescuento = new BehaviorSubject<number>(0);

  setDatos(data: {
    productos: any[],
    //subtotal: number,
    envio: number,
    iva: number,
    total: number,
    totalSinDescuento: number,
    cupon?: Coupon | null
  }) {
    this.productos.next(data.productos);
    //this.subtotal.next(data.subtotal);
    this.envio.next(data.envio);
    this.iva.next(data.iva);
    this.total.next(data.total);
    this.totalSinDescuento.next(data.totalSinDescuento);
    this.cupon$.next(data.cupon ?? null);
  }

  getDatos() {
    return {
      productos$: this.productos.asObservable(),
      //subtotal$: this.subtotal.asObservable(),
      envio$: this.envio.asObservable(),
      impuestos$: this.iva.asObservable(),
      total$: this.total.asObservable(),
      totalSinDescuento$: this.totalSinDescuento.asObservable(),
      cupon$: this.cupon$.asObservable()
    };
  }

}
