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
         direccion_entrega: {
            calle: string;
            puerta: string;
            piso: string;
            codigo_postal: string;
            pais: string;
            poblacion: {
                nombre: string;
                provincia: string;
            } | null;
        } | null;
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