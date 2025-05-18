import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { InfiniteScrollDirective, InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './../nav-bar/nav-bar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './features/auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { CartComponent } from './features/products/cart/cart.component';
import { CheckoutComponent } from './features/products/checkout/checkout.component';
import { PromoBannerComponent } from './promo-banner/promo-banner.component';
import { PaypalButtonComponent } from './shared/paypal-button/paypal-button.component';
import { OffersComponent } from './features/welcome/offers/offers.component';
import { NewProductsComponent } from './features/welcome/new-products/new-products.component';
import { CartOffcanvasComponent } from './features/products/cart/cart-offcanvas/cart-offcanvas.component';
import { CategoryProductsComponent } from './features/welcome/category-products/category-products.component';
import { WelcomeNewComponent } from './features/welcome/welcome-new/welcome-new.component';
import { WelcomeFilterPipe } from './features/welcome/welcome-new/welcome-filter.pipe';
import { SearchResultsComponent } from './features/search-results/search-results.component';
import { UserOffcanvasComponent } from './features/user-offcanvas/user-offcanvas.component';
import { FooterComponent } from './layout/shared/footer/footer.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    UserOffcanvasComponent,
    LoginComponent,
    RegisterComponent,
    ProductDetailComponent,
    PublicLayoutComponent,
    AuthLayoutComponent,
    CartComponent,
    CheckoutComponent,
    PromoBannerComponent,
    PaypalButtonComponent,
    OffersComponent,
    NewProductsComponent,
    CartOffcanvasComponent,
    CategoryProductsComponent,
    WelcomeNewComponent,
    WelcomeFilterPipe,
    SearchResultsComponent,
    FooterComponent
  ],
  imports: [
    InfiniteScrollModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
      },
    }),
],
  providers: [
    // Interceptor HTTP para renovar token
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
