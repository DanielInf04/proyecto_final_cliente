import { Component, Input, OnInit } from '@angular/core';

declare var paypal: any;

@Component({
  selector: 'app-paypal-button',
  standalone: false,
  templateUrl: './paypal-button.component.html',
  styleUrl: './paypal-button.component.scss'
})
export class PaypalButtonComponent implements OnInit {

  @Input() total!: number;
  @Input() datosContacto: any;
  @Input() onAprobado!: (details: any) => void;

  ngOnInit(): void {
    paypal.Buttons({
      fundingSource: paypal.FUNDING.PAYPAL, // 👈 esto limita a solo PayPal
    
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },
    
      createOrder: (_: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.total.toFixed(2)
            },
            shipping: {
              name: {
                full_name: this.datosContacto.nombre + ' ' + this.datosContacto.apellidos
              },
              address: {
                address_line_1: this.datosContacto.calle,
                admin_area_2: this.datosContacto.ciudad,
                admin_area_1: this.datosContacto.provincia,
                postal_code: this.datosContacto.codigo_postal,
                country_code: "ES"
              }
            }
          }]
        });
      },
    
      onApprove: (_: any, actions: any) => {
        return actions.order.capture().then(this.onAprobado);
      }
    
    }).render('#paypal-button-container');
  }

}
