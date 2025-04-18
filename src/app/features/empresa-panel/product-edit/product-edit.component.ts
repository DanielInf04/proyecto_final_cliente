import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Icategory } from '../../../interfaces/icategory';
import { IProduct } from '../../../interfaces/iproduct';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-product-edit',
  standalone: false,
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {
  id: string | null | undefined;
  imagenActual: string | null = null;
  imagenesActuales: string[] = [];
  imagenesPreview: string[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router:Router,
    private formBuilder:FormBuilder,
    private ruta:ActivatedRoute
  ){
    this.myForm = new FormGroup({
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = [];
    this.imagenesPreview = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenesPreview.push(e.target.result);
      }
      reader.readAsDataURL(file);
    }
  }

  /*onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenActual = reader.result as string;
      }
      reader.readAsDataURL(file);
      console.log('Imagen seleccionada', file.name);

    }
  }*/

  ngOnInit(): void {
    this.id = this.ruta.snapshot.paramMap.get('id');
    this.categoryService.getCategories().subscribe(resp => {
      if (resp.body) {
        this.categorias = resp.body;
      } else {
        this.categorias = [];
      }
    })
    this.myForm = this.formBuilder.group({
      nombre: [null],
      descripcion: [null],
      precio: [null],
      stock: [null],
      categoria_id: [null],
      imagen: [null]
    });
    this.productService.getProduct(this.id).subscribe({
      next: (data) => {
        if(data.body) {
          this.myForm.setValue ({
            nombre: data.body.nombre,
            descripcion: data.body.descripcion,
            precio: data.body.precio,
            stock: data.body.stock,
            categoria_id: data.body.categoria_id,
            imagen: null
            //imagen: data.body.imagen
          });
          // Cargar imágenes desde el servicio separado
          this.productService.getImagenesDeProducto(data.body.id).subscribe({
            next: (resp) => {
              if (resp.imagenes && resp.imagenes.length > 0) {
                this.imagenesActuales = resp.imagenes;
                this.imagenActual = this.imagenesActuales[0];
                console.log('Imágenes recibidas:', this.imagenesActuales);
              }
            },
            error: (err) => {
              console.error('Error al obtener imágenes del producto', err);
            }
          });
          /*if (data.body.imagenes && data.body.imagenes.length > 0) {
            this.imagenesActuales = data.body.imagenes.map((img: any) => {

            });
            this.imagenActual = this.imagenesActuales[0];
          }*/
          /*this.imagenActual = data.body.imagen;
          console.log('URL de imagen cargada:', data.body.imagen);*/
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
      }
    });
  }
  myForm:FormGroup;
  errorMessage:string='';
  //selectedFile: File | null = null;
  selectedFiles: File[] = [];
  producto:IProduct[] = [];
  categorias:Icategory[] = [];

  onSubmit(product: any) {
    const formData = new FormData();

    formData.append('nombre', product.nombre);
    formData.append('descripcion', product.descripcion);
    formData.append('precio', product.precio);
    formData.append('stock', product.stock);
    formData.append('categoria_id', product.categoria_id);

    this.selectedFiles.forEach(file => {
      formData.append('imagenes[]', file);
    });

    this.productService.editProduct(this.id, formData).subscribe({
      next: (data) => {
        console.log('Producto actualizado correctamente:', data);
        this.router.navigate(['/empresa-panel/productos']);
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
        this.errorMessage = error.message;
      }
    });
  }

  /*onSubmit(product: any) {
    const formData = new FormData();
  
    formData.append('nombre', product.nombre);
    formData.append('descripcion', product.descripcion);
    formData.append('precio', product.precio);
    formData.append('stock', product.stock);
    formData.append('categoria_id', product.categoria_id);
  
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile, this.selectedFile.name);
    }

    console.log('Contenido de FormData:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
    this.productService.editProduct(this.id, formData).subscribe({
      next: (data) => {
        console.log('Producto actualizado correctamente:', data);
        this.router.navigate(['/empresa-panel/productos']);
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
        this.errorMessage = error.message;
      }
    });
  }*/

  /*onSubmit(product:any) {
    this.productService.editProduct(this.id, product).subscribe({
      next: (data) => {
        // navegamos a la ruta productos
        this.router.navigate(['/empresa-panel/productos']);
      },
      error: (error) => {
        this.errorMessage = error.message;
      }
    })
  }*/
}
