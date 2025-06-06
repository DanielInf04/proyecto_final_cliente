import { Component, OnInit } from '@angular/core';
import { Coupon } from '../../../../interfaces/coupon/coupon';
import { AdminCouponService } from '../../../../core/services/admin/admin-coupon.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConfirmDialogService } from '../../../../core/services/shared/confirm-dialog.service';

@Component({
  selector: 'app-coupons',
  standalone: false,
  templateUrl: './coupons-list.component.html',
  styleUrl: './coupons-list.component.scss'
})
export class CouponsListComponent implements OnInit {

  isLoading = true;

  tituloListado = "Listado de cupones";
  cupones: Coupon[] = [];
  messageSuccess: string | null = null;

  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(
    private couponsService: AdminCouponService,
    private confirmDialog: ConfirmDialogService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Capturamos el mensaje pasado desde otra vista
    const state = this.location.getState() as { messageSuccess?: string };
    if (state.messageSuccess) {
      this.setAlert('success', state.messageSuccess);
    }

    this.isLoading = true;

    this.couponsService.getCoupons().subscribe({
      next: (resp) => {
        this.cupones = resp.body || [];
      },
      error: (err) => {
        console.error('Error al cargar cupones', err);
        this.setAlert('danger', 'Error al cargar los cupones');
        this.cupones = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    /*this.couponsService.getCoupons().subscribe(resp => {
      this.cupones = resp.body || [];
    });*/
  }

  /*setAlert(type: 'success' | 'danger', message: string) {
    this.alert = { type, message };
    this.alertClosing = false;

    setTimeout(() => {
      this.alertClosing = true; // activa la clase de salida

      setTimeout(() => {
        this.alert = null;
      }, 500); // tiempo de la animación
    }, 4000);
  }

  closeAlert() {
    this.alertClosing = true;
    setTimeout(() => {
      this.alert = null;
    }, 500);
  }*/

  setAlert(type: 'success' | 'danger' | 'warning' | 'info', message: string) {
    this.alertType = type;
    this.alertMessage = message;

    setTimeout(() => {
      this.alertMessage = null;
    }, 3000); // se borra automáticamente
  }

  eliminarCupon(cupon: Coupon): void {
    this.confirmDialog.requestConfirmation(
      `¿Estás seguro que quieres eliminar el cupón "${cupon.codigo}"?`,
      () => {
        this.couponsService.deleteCoupon(cupon.id).subscribe({
          next: () => {
            this.setAlert('danger', `Cupón "${cupon.codigo}" eliminado con éxito`);

            // Eliminación local sin recargar los cupones
            this.cupones = this.cupones.filter(c => c.id !== cupon.id);
            
            /*this.couponsService.getCoupons().subscribe(resp => {
              this.cupones = resp.body || [];
            });*/
          },
          error: (err) => {
            console.error('Error al eliminar el cupón', err);
            this.setAlert('warning', 'No se pudo eliminar el cupón');
          }
        });
      }
    )
  }

  /*eliminarCupon(id: any) {
    this.couponsService.deleteCoupon(id).subscribe(() => {
      this.couponsService.getCoupons().subscribe(resp => {
        this.cupones = resp.body || [];
      });

      this.setAlert('danger', 'Cupón eliminado con éxito');
    });
  }*/

  /*eliminarCupon(id: any) {
    this.couponsService.deleteCoupon(id).subscribe(() => {
      this.messageSuccess = 'Cupón eliminado con éxito';

      // Refrescamos la lista
      this.couponsService.getCoupons().subscribe(resp => {
        this.cupones = resp.body || [];
      });

      setTimeout(() => {
        this.messageSuccess = null;
      }, 4000);
      //this.ngOnInit();
    })
  }*/

}
