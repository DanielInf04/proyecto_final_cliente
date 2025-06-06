import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastData {
  message: string;
  type: 'success' | 'danger' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastSubject = new BehaviorSubject<ToastData | null>(null);

  get toast$(): Observable<ToastData | null>{
    return this.toastSubject.asObservable();
  }

  showToast(message: string, type: ToastData['type'] = 'info') {
    this.toastSubject.next({ message, type });

    setTimeout(() => {
      this.toastSubject.next(null);
    }, 5000);
  }

  cleart() {
    this.toastSubject.next(null);
  }
}
