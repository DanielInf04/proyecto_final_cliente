import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaPanelRoutingModule } from './empresa-panel-routing.module';
import { EmpresaPanelComponent } from './empresa-panel.component';
import { ProductosComponent } from './productos/productos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ValoracionesComponent } from './valoraciones/valoraciones.component';
import { Routes, RouterModule } from '@angular/router';
import { NavbarEmpresaComponent } from './components/navbar-empresa/navbar-empresa.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListFilterPipe } from './productos/product-list-filter.pipe';
import { SearchProductsComponent } from './search-products/search-products.component';
import { SharedModule } from '../../shared/shared.module';
import { SearchPedidosComponent } from './search-pedidos/search-pedidos.component';

const routes: Routes = [
  {
    path: '',
    component: EmpresaPanelComponent,
    children: [
      {path: 'productos', component: ProductosComponent},
      {path: 'productos/search', component: SearchProductsComponent},
      {path: 'product-create', component: ProductCreateComponent},
      {path: 'product-edit/:id', component: ProductEditComponent},
      {path: 'pedidos', component: PedidosComponent},
      {path: 'pedidos/search', component: SearchPedidosComponent},
      {path: 'valoraciones', component: ValoracionesComponent},
      {path: 'perfil', component: PerfilComponent},
      {path: '', redirectTo: 'productos', pathMatch: 'full'},
    ],
  },
];

@NgModule({
  declarations: [
    EmpresaPanelComponent,
    ProductosComponent,
    PerfilComponent,
    PedidosComponent,
    ValoracionesComponent,
    NavbarEmpresaComponent,
    ProductCreateComponent,
    ProductEditComponent,
    ProductListFilterPipe,
    SearchProductsComponent,
    SearchPedidosComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    CommonModule,
    EmpresaPanelRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class EmpresaPanelModule { }
