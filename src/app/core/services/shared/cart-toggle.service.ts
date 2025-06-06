import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartToggleService {

  private toggleCartSubject = new Subject<void>();
  toggleCart$ = this.toggleCartSubject.asObservable();

  openCart() {
    this.toggleCartSubject.next();
  }

}