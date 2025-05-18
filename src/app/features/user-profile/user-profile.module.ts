import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SidebarComponent,
    ProfileComponent,
    EditProfileComponent,
    UserLayoutComponent,
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    FormsModule
  ]
})
export class UserProfileModule { }
