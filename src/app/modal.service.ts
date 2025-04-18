import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private openLoginSubject = new Subject<void>();
  private closeLoginSubject = new Subject<void>();

  private openRegisterSubject = new Subject<void>();
  private closeRegisterSubject = new Subject<void>();

  openLoginModal$ = this.openLoginSubject.asObservable();
  closeLoginModal$ = this.closeLoginSubject.asObservable();

  openRegisterModal$ = this.openRegisterSubject.asObservable();
  closeRegisterModal$ = this.closeRegisterSubject.asObservable();

  openLoginModal(): void {
    this.openLoginSubject.next();
  }

  closeLoginModal(): void {
    this.closeLoginSubject.next();
  }

  openRegisterModal(): void {
    this.openRegisterSubject.next();
  }

  closeRegisterModal(): void {
    this.closeRegisterSubject.next();
  }

  // ANTIGUO

  /*private openModalSubject = new Subject<void>();
  openModal$ = this.openModalSubject.asObservable();

  openLoginModal(): void {
    this.openModalSubject.next();
  }*/
}
