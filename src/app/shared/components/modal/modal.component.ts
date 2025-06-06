import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmDialogService } from '../../../core/services/shared/confirm-dialog.service';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  show = false;
  message = '';
  onConfirmCallback: () => void = () => {};

  constructor(private confirmService: ConfirmDialogService) {}

  ngOnInit(): void {
    this.confirmService.confirmRequest$.subscribe(({ message, onConfirm }) => {
      this.message = message;
      this.onConfirmCallback = onConfirm;
      this.show = true;
    });
  }

  confirmar() {
    this.onConfirmCallback();
    this.show = false;
  }

  cancelar() {
    this.show = false;
  }

}
