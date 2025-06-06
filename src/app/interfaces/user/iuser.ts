export interface IUser {
    id:number;
    name:string;
    telefono: string;
    role: 'admin' | 'empresa' | 'cliente' | string;
    status: 'activo' |'inactivo' | string;
    email:string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    fecha_creacion?: string;
}
