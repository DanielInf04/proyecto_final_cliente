import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toast-action',
  standalone: false,
  templateUrl: './toast-action.component.html',
  styleUrl: './toast-action.component.scss'
})
export class ToastActionComponent {
  @Input() message: string = '¿Estás seguro?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

}
