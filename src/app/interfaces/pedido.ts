export interface Pedido {
    cliente_id: number;
    direccion_id: number;
    contacto_entrega_id: number;
    total: number;
    status?:string;
}
