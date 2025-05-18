import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IProduct } from '../../../interfaces/product/iproduct';
//import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../core/services/admin/category.service';
import { Icategory } from '../../../interfaces/product/category/icategory';
import { ProductBusinessService } from '../../../core/services/business/product-business.service';
import { Location } from '@angular/common';
import { ToastService } from '../../../core/services/shared/toast.service';
//import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-create',
  standalone: false,
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent implements OnInit {

  precioBaseConIva: number | null = null;
  precioFinalConIva: number | null = null;

  constructor(
    private productBusinessService: ProductBusinessService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private router:Router,
    private categoryService: CategoryService,
    private location: Location
  ) {
    this.myForm = new FormGroup({
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(resp => {
      if (resp.body) {
        this.categorias = resp.body;
        console.log("Categorias recibidas", this.categorias);
      } else {
        this.categorias = [];
      }
    })
    this.myForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      precio_base: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      categoria_id: ['', [Validators.required]],
      precio_oferta: [null],
      oferta_activa: [false]
    });

    this.myForm.get('precio_base')?.valueChanges.subscribe(() => {
      this.calcularPrecioConIva('base');
    });

    this.myForm.get('precio_oferta')?.valueChanges.subscribe(() => {
      this.calcularPrecioConIva('oferta');
    });

    this.myForm.get('categoria_id')?.valueChanges.subscribe(() => {
      this.calcularPrecioConIva('base');
      this.calcularPrecioConIva('oferta');
    });

  }

  calcularPrecioConIva(tipo: 'base' | 'oferta') {
    const categoriaId = this.myForm.get('categoria_id')?.value;
    const categoria = this.categorias.find(c => c.id === +categoriaId);
    const iva = categoria ? Number(categoria.iva_porcentaje) : 0;

    if (!categoriaId || !categoria) {
      if (tipo === 'base') this.precioBaseConIva = null;
      if (tipo === 'oferta') this.precioFinalConIva = null;
      return;
    }

    const controlName = tipo === 'base' ? 'precio_base' : 'precio_oferta';
    const precio = parseFloat(this.myForm.get(controlName)?.value);

    if (!precio || isNaN(precio)) {
      if (tipo === 'base') this.precioBaseConIva = null;
      if (tipo === 'oferta') this.precioFinalConIva = null;
      return;
    }

    const resultado = +(precio * (1 + iva)).toFixed(2);
    if (tipo === 'base') {
      this.precioBaseConIva = resultado;
    } else {
      this.precioFinalConIva = resultado;
    }
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
      //alert('Por favor selecciona al menos una imagen del producto');
      this.toastService.showToast('Debes seleccionar una imagen antes de continuar', 'warning');
      return;
    }

    const formData = new FormData();

    formData.append('nombre', formValue.nombre);
    formData.append('descripcion', formValue.descripcion);
    formData.append('precio_base', formValue.precio_base);
    formData.append('stock', formValue.stock);
    formData.append('categoria_id', formValue.categoria_id);

    // Ofeta activa
    if (formValue.oferta_activa && formValue.precio_oferta) {
      formData.append('precio_oferta', formValue.precio_oferta);
      formData.append('oferta_activa', '1');
    } else {
      formData.append('oferta_activa', '0');
    }

    // Añadir múltiples imagenes
    this.selectedFiles.forEach(file => {
      formData.append('imagenes[]', file);
    });

    this.productBusinessService.createProduct(formData).subscribe({
      next: () => {
        this.router.navigate(['/empresa-panel/productos'], {
          state: { messageSuccess: 'Producto añadido con éxito' }
        });
        /*alert('Producto agregado con éxito');
        this.router.navigate(['/empresa-panel/productos']);*/
      },
      error: (err) => {
        //this.errorMessage = 'Error al agregar el producto';
        console.error(err);

        if (err.status === 422 && err.error?.errors) {
          const errores = err.error.errors;

          // Mostramos todos los errores en el toast
          Object.values(errores).forEach((mensajes: any) => {
            mensajes.forEach((mensaje: string) => {
              this.toastService.showToast(mensaje, 'danger');
            })
          });
        } else {
          this.toastService.showToast('Ocurrio un error inesperado. Intenta nuevamente.', 'danger');
        }

      }
    })

  }

  eliminarImagen(index: number): void {
    this.imagenesPreview.splice(index, 1);
    this.selectedFiles.splice(index, 1);
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
