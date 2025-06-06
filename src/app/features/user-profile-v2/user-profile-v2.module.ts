import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileV2RoutingModule } from './user-profile-v2-routing.module';
import { ProfileV2Component } from './pages/profile-v2/profile-v2.component';
import { OrdersV2Component } from './pages/orders-v2/orders-v2.component';
import { FormsModule } from '@angular/forms';
import { DetailOrderComponent } from './pages/detail-order/detail-order.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [
    ProfileV2Component,
    OrdersV2Component,
    DetailOrderComponent
  ],
  imports: [
    InfiniteScrollModule,
    FormsModule,
    CommonModule,
    UserProfileV2RoutingModule,
    SharedModule
]
})
export class UserProfileV2Module { }
