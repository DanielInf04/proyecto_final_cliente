import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountToggleService {

  private toggleAccountSubject = new Subject<void>();
  toggleAccount$ = this.toggleAccountSubject.asObservable();

  openAccountPanel() {
    this.toggleAccountSubject.next();
  }

}
