import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input() message: string | null = null;
  @Input() type: 'success' | 'danger' | 'info' | 'warning' = 'success';
  @Input() autoClose: boolean = true;

  ngOnChanges() {
    if (this.autoClose && this.message) {
      setTimeout(() => this.message = null, 4000);
    }
  }

  close() {
    this.message = null;
  }

}
