import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from '../../../interfaces/user/iuser';

@Pipe({
  name: 'dashboardFilter',
  standalone: false
})
export class DashboardFilterPipe implements PipeTransform {

  transform(usuarios: IUser[], filterBy: string): IUser[] {
    filterBy = filterBy ? filterBy.toLowerCase() : '';
    return filterBy ? usuarios.filter((usuario) => {
      return usuario.name.toLowerCase().indexOf(filterBy) !== -1 ||
              usuario.email.toLowerCase().indexOf(filterBy) !== -1;
    }) : usuarios;
  }

}
