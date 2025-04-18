import { ContactoEntrega } from "./contacto-entrega";
import { DetallePedido } from "./detalle-pedido";
import { Direccion } from "./direccion";

export interface CheckoutPayload {
    contacto: ContactoEntrega;
    direccion: Direccion;
    guardar_direccion?: boolean;
    productos: DetallePedido[];
    metodo_pago: 'tarjeta' | 'paypal';
    total: number;
    cupon?: { id: number; codigo: string };
}
