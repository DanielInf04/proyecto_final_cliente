import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IProduct } from '../../../interfaces/iproduct';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Icategory } from '../../../interfaces/icategory';

@Component({
  selector: 'app-product-create',
  standalone: false,
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private router:Router,
    private categoryService: CategoryService
  ) {
    this.myForm = new FormGroup({
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(resp => {
      if (resp.body) {
        this.categorias = resp.body;
      } else {
        this.categorias = [];
      }
    })
    this.myForm = this.formBuilder.group({
      nombre: ['Iphone 16', [Validators.required]],
      descripcion: ['Un teléfono increíble'],
      precio: ['839', [Validators.required, Validators.min(0)]],
      stock: ['100', [Validators.required, Validators.min(0)]],
      categoria_id: ['', [Validators.required]],
      //imagen: ['', [Validators.required]]
    });
  }

  async onFileSelected(event: any) {
    const files: FileList = event.target.files;
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      this.selectedFiles.push(file);
  
      const preview = await this.readFileAsDataURL(file);
      this.imagenesPreview.push(preview);
    }
  
    console.log('Archivos seleccionados:', this.selectedFiles);
    console.log('Previews cargados:', this.imagenesPreview);
  }

  // Esta función devuelve una promesa con la URL en base64
  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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

  myForm:FormGroup;
  errorMessage:string='';
  producto:IProduct[] = [];
  categorias:Icategory[] = [];
  //selectedFile: File | null = null;
  selectedFiles: File[] = [];
  //imagenActual: string | null = null;
  imagenesPreview: string[] = [];
  imagenActual: string | null = null;

  onSubmit(formValue: any) {
    if (!this.selectedFiles.length) {
      alert('Por favor selecciona al menos una imagen del producto');
      return;
    }

    const formData = new FormData();

    formData.append('nombre', formValue.nombre);
    formData.append('descripcion', formValue.descripcion);
    formData.append('precio', formValue.precio);
    formData.append('stock', formValue.stock);
    formData.append('categoria_id', formValue.categoria_id);

    // Añadir múltiples imagenes
    this.selectedFiles.forEach(file => {
      formData.append('imagenes[]', file);
    });

    this.productService.createProduct(formData).subscribe({
      next: (resp) => {
        alert('Producto agregado con éxito');
        this.router.navigate(['/empresa-panel/productos']);
      },
      error: (err) => {
        this.errorMessage = 'Error al agregar el producto';
        console.error(err);
      }
    })

  }

  /*onSubmit(formValue: any) {
    if (!this.selectedFile) {
      alert('Por favor agrega una imagen del producto');
      return;
    }

    const formData = new FormData();
    
    formData.append('nombre', formValue.nombre);
    formData.append('descripcion', formValue.descripcion);
    formData.append('precio', formValue.precio);
    formData.append('stock', formValue.stock);
    formData.append('categoria_id', formValue.categoria_id);

    // Imagen obligatoria
    formData.append('imagen', this.selectedFile);
    console.log('Imagen agregada:', this.selectedFile.name);

    this.productService.createProduct(formData).subscribe({
      next: (resp) => {
        alert('Producto agregado con éxito');
        this.router.navigate(['/empresa-panel/productos']);
      },
      error: (err) => {
        this.errorMessage = 'Error al agregar el producto';
        console.error(err);
      }
    })

  }*/

}
