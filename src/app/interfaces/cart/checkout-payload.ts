import { ContactoEntrega } from "./contacto-entrega";
import { DetallePedido } from "../order/iorder";
import { Direccion } from "../location/direccion";

export interface CheckoutPayload {
    contacto: ContactoEntrega;
    direccion: Direccion;
    guardar_direccion?: boolean;
    productos: DetallePedido[];
    metodo_pago: 'tarjeta' | 'paypal';
    paypal?: any;
    total: number;
    cupon?: { id: number; codigo: string };
}
