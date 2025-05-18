import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'welcomeFilter',
  standalone: false
})
export class WelcomeFilterPipe implements PipeTransform {

  transform(productos: any[], filterBy: string): any[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : '';
    return filterBy ? productos.filter((producto) => {
      return producto.nombre.toLowerCase().indexOf(filterBy) !== -1;
    }) : productos;
  }

}
