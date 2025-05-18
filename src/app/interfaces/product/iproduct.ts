import { IReviewPost } from "../review/ireviewpost";

export interface IProduct {
    id:number;
    nombre:string;
    descripcion:string;
    precio:number;
    iva_porcentaje:number;
    precio_con_iva:number;
    stock:number;
    imagen:string;
    estado:string;
    categoria_id:number;
    empresa_id:number;
    resenyas?: IReviewPost[];

    precio_base: number;
    precio_oferta?: number | null;
    oferta_activa?: boolean | number;

    oferta?: {
        precio_oferta_con_iva: number;
        descuento_porcentaje: number;
        precio_original_con_iva: number;
    };

    imagenes: {
        id: number;
        producto_id: number;
        imagen: string;
    }[];

    // NUEVO PARA USUARIOS ANóNIMOS

    categoria?: {
        id: number;
        nombre: string;
        iva_porcentaje: string,
    }

}
