import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileV2Component } from './pages/profile-v2/profile-v2.component';
import { OrdersV2Component } from './pages/orders-v2/orders-v2.component';
import { DetailOrderComponent } from './pages/detail-order/detail-order.component';

const routes: Routes = [
 // { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', component: ProfileV2Component },
  { path: 'orders', component: OrdersV2Component },
  { path: 'orders/detail-order/:id', component: DetailOrderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileV2RoutingModule { }
