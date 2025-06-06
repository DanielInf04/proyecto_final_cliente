import { Component, Input, OnInit } from '@angular/core';

declare var paypal: any;

@Component({
  selector: 'app-paypal-button',
  standalone: false,
  templateUrl: './paypal-button.component.html',
  styleUrl: './paypal-button.component.scss'
})
export class PaypalButtonComponent implements OnInit {

  @Input() productos: any[] = [];
  @Input() total!: number;
  @Input() datosContacto: any;
  @Input() onAprobado!: (details: any) => void;

  ngOnInit(): void {
    console.log("Total recibido con descuento:", this.total);

    paypal.Buttons({
      fundingSource: paypal.FUNDING.PAYPAL,

      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },

      createOrder: (_: any, actions: any) => {
        if (this.total <= 0) {
          console.error('❌ El total es 0 o negativo. Revisa el cupón o productos.');
          alert('El total del pedido no puede ser cero.');
          return;
        }

        return actions.order.create({
          intent: 'CAPTURE',
          application_context: {
            shipping_preference: 'SET_PROVIDED_ADDRESS'
          },
          purchase_units: [{
            amount: {
              currency_code: 'EUR',
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


  /*ngOnInit(): void {
    console.log("Productos recibidos:", this.productos);
    paypal.Buttons({
      fundingSource: paypal.FUNDING.PAYPAL,

      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },

      createOrder: (_: any, actions: any) => {
        const items = this.productos
          .filter(p => p.precio_con_iva > 0 && p.cantidad > 0)
          .map(p => ({
            name: p.nombre.slice(0, 127),
            unit_amount: {
              value: Number(p.precio_con_iva).toFixed(2),
              currency_code: 'EUR'
            },
            quantity: p.cantidad.toString()
          }));

        const total = items.reduce((acc, item) =>
          acc + (parseFloat(item.unit_amount.value) * parseInt(item.quantity)), 0);

        // LOGS DE DEPURACIÓN
        console.log('Productos originales:', this.productos);
        console.log('Items para PayPal:', items);
        console.log('Total calculado:', total.toFixed(2));
        console.log('Datos de envío:', this.datosContacto);

        if (total <= 0) {
          console.error('❌ El total calculado es 0 o negativo. Revisa precios o cantidades.');
          alert('El total del pedido no puede ser cero.');
          return;
        }

        return actions.order.create({
          intent: 'CAPTURE',
          application_context: {
            shipping_preference: 'SET_PROVIDED_ADDRESS'
          },
          purchase_units: [{
            amount: {
              currency_code: 'EUR',
              value: total.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: total.toFixed(2)
                }
              }
            },
            items,
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
  }*/

}
