import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardFilterPipe } from './dashboard/dashboard-filter.pipe';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
//import { CategoriesComponent } from './categories-list/categories-list.component';
/*import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryCreateComponent } from './category-create/category-create.component';*/
import { CategoriesListComponent } from './categories/categories-list/categories-list.component';
import { CategoryEditComponent } from './categories/category-edit/category-edit.component';
import { CategoryCreateComponent } from './categories/category-create/category-create.component';
//import { CouponCreateComponent } from './coupon-create/coupon-create.component';
//import { CouponsComponent } from './coupons-list/coupons-list.component';
//import { CouponsListComponent } from './coupons-list/coupons-list.component';
import { CouponCreateComponent } from './coupons/coupon-create/coupon-create.component';
import { CouponsListComponent } from './coupons/coupons-list/coupons-list.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    NavbarAdminComponent,
    DashboardComponent,
    DashboardFilterPipe,
    AdminLayoutComponent,
    CategoriesListComponent,
    CategoryEditComponent,
    CategoryCreateComponent,
    CouponCreateComponent,
    CouponsListComponent,
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
