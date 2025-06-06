import { Injectable } from '@angular/core';
import { Coupon } from '../../../interfaces/coupon/coupon';
import { CouponService } from '../customer/coupon/coupon.service';

@Injectable({
  providedIn: 'root'
})
export class CouponManagerService {

  cuponAplicado: Coupon | null = null;
  codigoPromocional: string = '';
  totalOriginal: number = 0;
  totalConDescuento: number = 0;
  error: string = '';

  constructor(private couponService: CouponService) { }

  aplicarCupon(codigo: string, total: number, callback: (ok: boolean, descuento: number) => void): void {
    this.codigoPromocional = codigo;
    this.totalOriginal = total;

    console.log("Validando cupon");

    if (!codigo) {
      callback(false, 0);
      return;
    }

    // Validamos el código del cupón
    this.couponService.validarCodigo(codigo).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res.success);
          this.cuponAplicado = res.data!;
          this.error = '';
          this.totalConDescuento = this.calcularTotalConDescuento(this.totalOriginal);
          this.guardarEnStorage();
          callback(true, this.totalOriginal - this.totalConDescuento);
        } else {
          this.limpiar();
          this.error = res.message || 'El cupón no es válido';
          callback(false, 0);
        }
      },
      error: (err) => {
        this.limpiar();

        if (err.status === 422) {
          this.error = 'Este cupón ya ha sido utilizado.';
        } else if (err.status === 404) {
          this.error = 'Cupón no encontrado';
        } else {
          this.error = err.error?.error || 'Error al válidar el cupón';
        }

        callback(false, 0);
      }
    });
  }

  resetCupon(): void {
    this.cuponAplicado = null;
    this.codigoPromocional = '';
    this.totalConDescuento = 0;
    localStorage.removeItem('cuponAplicado');
    localStorage.removeItem('codigoPromocional');
  }

  calcularTotalConDescuento(total: number): number {
    if (!this.cuponAplicado) return total;

    const descuento = total * (this.cuponAplicado.porcentaje_descuento / 100);
    return total - descuento;
  }

  guardarEnStorage(): void {
    const data = localStorage.getItem('checkoutData');
    const parsed = data ? JSON.parse(data): {};

    const actualizado = {
      ...parsed,
      cupon: this.cuponAplicado,
      total: this.totalConDescuento,
      totalSInDescuento: this.totalOriginal,
      codigoPromocional: this.codigoPromocional
    };

    localStorage.setItem('checkoutData', JSON.stringify(actualizado));
  }

  limpiar(): void {
    this.cuponAplicado = null;
    this.codigoPromocional = '';
    this.totalConDescuento = this.totalOriginal;
  }

  recuperarDesdeStorage(): void {
    const data = localStorage.getItem('checkoutData');
    if (data) {
      const parsed = JSON.parse(data);
      this.cuponAplicado = parsed.cupon || null;
      this.codigoPromocional = parsed.codigoPromocional || '';
      this.totalOriginal = parsed.totalSinDescuento || parsed.total || 0;
      this.totalConDescuento = parsed.total || this.totalOriginal;
    }
  }
  

}
