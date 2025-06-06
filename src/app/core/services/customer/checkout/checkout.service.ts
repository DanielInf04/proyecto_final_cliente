import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coupon } from '../../../../interfaces/coupon/coupon';
//import { Coupon } from '../app/interfaces/coupon';

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

  constructor() {
    console.log("Constructor llamado en checkoutservice");
    //this.cargarDesdeLocalStorage();
  }

  setDatos(data: {
    productos: any[],
    envio: number,
    iva: number,
    total: number,
    totalSinDescuento: number,
    cupon?: Coupon | null
  }) {
    // Convertimos los datos nuevos en string
    const newDataString = JSON.stringify({
      productos: data.productos,
      envio: data.envio,
      iva: data.iva,
      total: data.total,
      totalSinDescuento: data.totalSinDescuento,
      cupon: data.cupon ?? null
    });

    const currentDataString = localStorage.getItem('checkoutData');

    // ✅ Evitamos sobrescribir si es idéntico
    if (newDataString === currentDataString) {
      return;
    }

    // Continuamos normalmente
    this.productos.next([...data.productos]);
    this.envio.next(data.envio);
    this.iva.next(data.iva);
    this.total.next(data.total);
    this.totalSinDescuento.next(data.totalSinDescuento);
    this.cupon$.next(data.cupon ?? null);

    localStorage.setItem('checkoutData', newDataString);
  }

  cargarDesdeLocalStorage() {
    const raw = localStorage.getItem('checkoutData');
    if (!raw) return;

    try {
      const data = JSON.parse(raw);

      this.productos.next(data.productos || []);
      this.envio.next(data.envio || 0);
      this.iva.next(data.iva || 0);
      this.total.next(data.total || 0);
      this.totalSinDescuento.next(data.totalSinDescuento || 0);
      this.cupon$.next(data.cupon || null);
    } catch (e) {
      console.warn('Error al leer checkoutData desde localStorage:', e);
    }
  }

  getProductosActuales(): any[] {
    return this.productos.getValue();
  }

  getDatos() {
    const productosActuales = this.productos.getValue();

    if (productosActuales.length === 0) {
      this.cargarDesdeLocalStorage(); // <-- esto sí carga bien, pero no emite si ya hay subscripciones
    }

    // Devuelve los observables, que ya tienen los valores después de cargar
    return {
      productos$: this.productos.asObservable(),
      envio$: this.envio.asObservable(),
      impuestos$: this.iva.asObservable(),
      total$: this.total.asObservable(),
      totalSinDescuento$: this.totalSinDescuento.asObservable(),
      cupon$: this.cupon$.asObservable()
    };
  }
}
