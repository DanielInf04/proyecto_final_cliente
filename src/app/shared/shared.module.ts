import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './components/alert/alert.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastActionComponent } from './components/toast-action/toast-action.component';
import { ModalComponent } from './components/modal/modal.component';



@NgModule({
  declarations: [
    AlertComponent,
    ToastComponent,
    ToastActionComponent,
    ModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    ToastComponent,
    ToastActionComponent,
    ModalComponent
  ]
})
export class SharedModule { }
