import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../../../interfaces/product/iproduct';

@Pipe({
  name: 'productListFilter',
  standalone: false
})
export class ProductListFilterPipe implements PipeTransform {

  transform(productos: IProduct[], filterBy: string): IProduct[] {
      filterBy = filterBy ? filterBy.toLowerCase() : '';
      return filterBy ? productos.filter((producto) => {
        return producto.nombre.toLowerCase().indexOf(filterBy) !== -1;
      }) : productos;
    }

}
