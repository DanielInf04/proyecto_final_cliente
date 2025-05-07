import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpresaPanelComponent } from './empresa-panel.component';

const routes: Routes = [{ path: '', component: EmpresaPanelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaPanelRoutingModule { }
