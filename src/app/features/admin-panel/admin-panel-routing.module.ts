import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
//import { CategoriesComponent } from './categories-list/categories-list.component';
/*import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryCreateComponent } from './category-create/category-create.component';*/
import { CategoriesListComponent } from './categories/categories-list/categories-list.component';
import { CategoryEditComponent } from './categories/category-edit/category-edit.component';
import { CategoryCreateComponent } from './categories/category-create/category-create.component';
/*import { CouponCreateComponent } from './coupon-create/coupon-create.component';
import { CouponsComponent } from './coupons-list/coupons-list.component';*/
import { CouponCreateComponent } from './coupons/coupon-create/coupon-create.component';
import { CouponsListComponent } from './coupons/coupons-list/coupons-list.component';
import { SearchUsersComponent } from './search-users/search-users.component';

const routes: Routes = [
  { 
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'users/search', component: SearchUsersComponent },
      { path: 'categories-list', component: CategoriesListComponent },
      { path: 'category-edit/:id', component: CategoryEditComponent },
      { path: 'category-create', component: CategoryCreateComponent },
      { path: 'coupons', component: CouponsListComponent },
      { path: 'coupon-create', component: CouponCreateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
