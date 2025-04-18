import { IReviewPost } from "./ireviewpost";

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

    imagenes: {
        id: number;
        producto_id: number;
        imagen: string;
    }[];
}
