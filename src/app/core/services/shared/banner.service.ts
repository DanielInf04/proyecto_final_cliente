import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private _hideBanner$ = new BehaviorSubject<boolean>(false);
  hideBanner$ = this._hideBanner$.asObservable();

  hideBanner() {
    this._hideBanner$.next(true);
  }

}
