import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: ProfileComponent },
      { path: 'edit-profile', component: EditProfileComponent },
      { path: 'reviews', component: ReviewsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
