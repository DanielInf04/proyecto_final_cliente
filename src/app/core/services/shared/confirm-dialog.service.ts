import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private confirmSubject = new Subject<{ message: string, onConfirm: () => void }>();

  // Observable para que los componentes se suscriban
  confirmRequest$: Observable<{ message: string, onConfirm: () => void }> = this.confirmSubject.asObservable();

  requestConfirmation(message: string, onConfirm: () => void) {
    this.confirmSubject.next({ message, onConfirm });
  }

}
