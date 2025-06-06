export interface PedidoEmpresa {
    id: number;
    estado_envio: string;
    fecha_envio: string | null;
    precio_total: string;
    pedido: {
        id: number;
        cliente_id: number;
        fecha_pedido: string;
        nombre_completo: string;
    };
    productos: DetallePedido[];
}

export interface DetallePedido {
    cantidad: number;
    precio_unitario: string;
    producto: {
        producto_id: number;
        nombre: string;
        precio: string;
        imagen: string;
    }
}