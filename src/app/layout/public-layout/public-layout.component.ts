import { Component, OnInit } from '@angular/core';
import { ToastData, ToastService } from '../../core/services/shared/toast.service';

@Component({
  selector: 'app-public-layout',
  standalone: false,
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent implements OnInit {

  toastMessage: string | null = null;
  toastType: ToastData['type'] = 'success';

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toast$.subscribe((toast) => {
      if (toast) {
        this.toastMessage = toast.message;
        this.toastType = toast.type;
      } else {
        this.toastMessage = null;
      }
    });
  }

}
