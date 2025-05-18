import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from '../welcome/welcome.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { roleGuard } from './core/guards/auth.guard';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { CartComponent } from './features/products/cart/cart.component';
import { CheckoutComponent } from './features/products/checkout/checkout.component';
import { SidebarComponent } from './features/user-profile/components/sidebar/sidebar.component';
import { ProfileComponent } from './features/user-profile/pages/profile/profile.component';
import { EditProfileComponent } from './features/user-profile/pages/edit-profile/edit-profile.component';
import { OffersComponent } from './features/welcome/offers/offers.component';
import { NewProductsComponent } from './features/welcome/new-products/new-products.component';
import { CategoryProductsComponent } from './features/welcome/category-products/category-products.component';
import { WelcomeNewComponent } from './features/welcome/welcome-new/welcome-new.component';
import { SearchResultsComponent } from './features/search-results/search-results.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      //{ path: '', component: WelcomeComponent },
      { path: '', component: WelcomeNewComponent },
      { path: 'search', component: SearchResultsComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'new-products', component: NewProductsComponent },
      { path: 'producto/:id', component: ProductDetailComponent },
      { path: 'categoria/:id', component: CategoryProductsComponent },
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
  //{ path: 'user-profile', loadChildren: () => import('./features/user-profile/user-profile.module').then(m => m.UserProfileModule) },
  {
    path: 'user-profile',
    canActivate: [roleGuard(['cliente', 'user'])],
    loadChildren: () => import('./features/user-profile/user-profile.module').then(m => m.UserProfileModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
