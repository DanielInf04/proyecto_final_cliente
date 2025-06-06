import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-google-button',
  standalone: false,
  templateUrl: './google-button.component.html',
  styleUrl: './google-button.component.scss'
})
export class GoogleButtonComponent implements AfterViewInit {

  @Output() credentialResponse = new EventEmitter<any>();

  ngAfterViewInit(): void {
    const interval = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts?.id) {
        clearInterval(interval);

        google.accounts.id.initialize({
          client_id: '258228785172-2uspq8cjjvetkff0fum30mqoa4pgtf6e.apps.googleusercontent.com',
          callback: (response: any) => this.credentialResponse.emit(response),
        });

        google.accounts.id.renderButton(
          document.getElementById('googleBtn'),
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: '250',
          }
        );
      }
    }, 100);
  }

}
