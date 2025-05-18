import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardFilterPipe } from './dashboard/dashboard-filter.pipe';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CouponCreateComponent } from './coupon-create/coupon-create.component';
import { CouponsComponent } from './coupons/coupons.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    NavbarAdminComponent,
    DashboardComponent,
    DashboardFilterPipe,
    AdminLayoutComponent,
    CategoriesComponent,
    CategoryEditComponent,
    CategoryCreateComponent,
    CouponCreateComponent,
    CouponsComponent,
    SearchUsersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminPanelRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AdminPanelModule { }
