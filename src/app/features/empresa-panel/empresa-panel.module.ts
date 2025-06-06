import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaPanelRoutingModule } from './empresa-panel-routing.module';
import { EmpresaPanelComponent } from './empresa-panel.component';
import { ProductosComponent } from './productos/productos.component';
import { PerfilComponent } from './perfil/perfil.component';
//import { PedidosComponent } from './pedidos/pedidos.component';
import { PedidosListComponent } from './pedidos/pedidos-list/pedidos-list.component';
import { ValoracionesComponent } from './valoraciones/valoraciones.component';
import { Routes, RouterModule } from '@angular/router';
import { NavbarEmpresaComponent } from './components/navbar-empresa/navbar-empresa.component';
//import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductCreateComponent } from './products/product-create/product-create.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { SearchProductsComponent } from './search-products/search-products.component';
import { SearchProductsComponent } from './products/search-products/search-products.component';
import { SharedModule } from '../../shared/shared.module';
import { SearchPedidosComponent } from './pedidos/search-pedidos/search-pedidos.component';
import { ProductosListComponent } from './products/productos-list/productos-list.component';

const routes: Routes = [
  {
    path: '',
    component: EmpresaPanelComponent,
    children: [
      //{path: 'productos', component: ProductosComponent},
      {path: 'productos-list', component: ProductosListComponent},
      {path: 'productos/search', component: SearchProductsComponent},
      {path: 'product-create', component: ProductCreateComponent},
      {path: 'product-edit/:id', component: ProductEditComponent},
      {path: 'pedidos', component: PedidosListComponent},
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
    PedidosListComponent,
    ValoracionesComponent,
    NavbarEmpresaComponent,
    ProductCreateComponent,
    ProductEditComponent,
    SearchProductsComponent,
    SearchPedidosComponent,
    ProductosListComponent
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
