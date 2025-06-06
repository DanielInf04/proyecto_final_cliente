import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './components/ui/alert/alert.component';
import { ToastComponent } from './components/ui/toast/toast.component';
import { ToastActionComponent } from './components/ui/toast-action/toast-action.component';
//import { ModalComponent } from './components/Copia/modal/modal.component';
import { ModalComponent } from './components/modal/modal.component';
import { ScrollToTopComponent } from './components/layout/scroll-to-top/scroll-to-top.component';
import { ReviewModalComponent } from './components/modals/review-modal/review-modal.component';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from './components/layout/nav-bar/nav-bar.component';
import { PaypalButtonComponent } from './components/buttons/paypal-button/paypal-button.component';
import { PromoBannerComponent } from './components/banners/promo-banner/promo-banner.component';
import { RouterModule } from '@angular/router';
import { GoogleButtonComponent } from './components/buttons/google-button/google-button.component';
import { EditPersonalInfoComponent } from './components/modals/edit-personal-info/edit-personal-info.component';



@NgModule({
  declarations: [
    PromoBannerComponent,
    PaypalButtonComponent,
    NavBarComponent,
    AlertComponent,
    ToastComponent,
    ToastActionComponent,
    ModalComponent,
    ScrollToTopComponent,
    ReviewModalComponent,
    GoogleButtonComponent,
    EditPersonalInfoComponent
  ],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ],
  exports: [
    EditPersonalInfoComponent,
    GoogleButtonComponent,
    PromoBannerComponent,
    NavBarComponent,
    PaypalButtonComponent,
    ReviewModalComponent,
    ScrollToTopComponent,
    AlertComponent,
    ToastComponent,
    ToastActionComponent,
    ModalComponent
  ]
})
export class SharedModule { }
