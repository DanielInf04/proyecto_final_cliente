import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CouponCreateComponent } from './coupon-create/coupon-create.component';
import { CouponsComponent } from './coupons/coupons.component';
import { SearchUsersComponent } from './search-users/search-users.component';

const routes: Routes = [
  { 
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'users/search', component: SearchUsersComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'category-edit/:id', component: CategoryEditComponent },
      { path: 'category-create', component: CategoryCreateComponent },
      { path: 'coupons', component: CouponsComponent },
      { path: 'coupon-create', component: CouponCreateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
