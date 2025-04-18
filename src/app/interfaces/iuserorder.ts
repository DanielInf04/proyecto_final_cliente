export interface IUserOrder {
    id: number;
    cliente_id: number;
    fecha_pedido: string;
    status: string;
    nombre_completo: string;
    total: string;
    direccion: string;
    empresas: EmpresaPedido[];
}

export interface EmpresaPedido {
    empresa_id: number;
    nombre: string;
    estado_envio: string;
    fechaEnvio: string | null;
    productos: DetallePedidoCliente[];
}

export interface DetallePedidoCliente {
    producto_id: number;
    nombre: string;
    imagen: string;
    cantidad: number;
    precio_unitario: string;
    estado_envio: string;
    vendedor: string;
    valoracion_cliente: number;
}
