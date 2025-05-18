export interface IPaginatedOrders {
  current_page: number;
  data: IUserOrder[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface IUserOrder {
    id: number;
    cliente_id: number;
    fecha_pedido: string;
    status: string;
    total: string;
    nombre_completo: string;

    //direccion: string;

    direccion: {
        calle: string;
        puerta: string;
        piso: string;
        pais: string;
        codigo_postal: string;
        poblacion: string;
        provincia: string;
    };

    metodo_pago: string;
    estado_pago: string;
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
