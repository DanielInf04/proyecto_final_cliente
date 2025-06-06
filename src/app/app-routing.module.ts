import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { roleGuard } from './core/guards/auth.guard';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { CartComponent } from './features/products/cart/cart.component';
import { CheckoutComponent } from './features/products/checkout/checkout.component';
import { OffersComponent } from './features/shop/pages/offers/offers.component';
import { NewProductsComponent } from './features/welcome/new-products/new-products.component';
import { SearchResultsComponent } from './features/shop/pages/search-results/search-results.component';
import { HomeComponent } from './features/shop/pages/home/home.component';
import { CategoryProductsComponent } from './features/shop/pages/category-products/category-products.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent},
      { path: 'offers', component: OffersComponent },
      { path: 'category/:id', component: CategoryProductsComponent},
      { path: 'search', component: SearchResultsComponent },
      { path: 'new-products', component: NewProductsComponent },
      { path: 'product/:id', component: ProductDetailComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },

      {
        path: 'user-profile-v2',
        canActivate: [roleGuard(['cliente', 'user'])],
        loadChildren: () => 
          import('./features/user-profile-v2/user-profile-v2.module').then(
            (m) => m.UserProfileV2Module
          )
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
    path: 'empresa-panel',
    canActivate: [roleGuard(['empresa'])],
    loadChildren: () => import('./features/empresa-panel/empresa-panel.module').then(m => m.EmpresaPanelModule)
  },
  {
    path: 'admin-panel',
    canActivate: [roleGuard(['admin'])],
    loadChildren: () => import('./features/admin-panel/admin-panel.module').then(m => m.AdminPanelModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
