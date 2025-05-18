import { Component, OnInit } from '@angular/core';
//import { AuthService } from '../services/auth.service';
//import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../app/core/services/shared/product.service';
//import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements  OnInit {

  productos: any[] = [];
  
  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (resp) => {
        console.log("Productos recibidos", resp.body);
        this.productos = resp.body || [];
        //console.log('Productos recibidos', resp);
      },
      error: (err) => {
        console.log('Error al cargar productos públicos', err);
      }
    })
  }

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

}
