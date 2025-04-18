export interface Coupon {
    id: number;
    codigo: string;
    porcentaje_descuento: number;
    solo_nuevos_usuarios: boolean;
    fecha_expiracion?: string | null;
}
