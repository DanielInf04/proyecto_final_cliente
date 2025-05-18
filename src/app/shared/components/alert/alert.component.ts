import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: false,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent implements OnInit {
  @Input() type: 'success' | 'danger' | 'warning' | 'info' = 'success';
  @Input() message: string = '';
  @Input() autoClose: boolean = true;

  closing = false;

  ngOnInit(): void {
    if (this.autoClose) {
      setTimeout(() => this.startClose(), 4000);
    }
  }

  startClose() {
    this.closing = true;
    setTimeout(() => {
      this.message = '';
    }, 500);
  }

  close() {
    this.startClose();
  }

}
