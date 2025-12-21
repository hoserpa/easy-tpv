import { Articulo } from './articulo.entity';
export declare class Familia {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    articulos: Articulo[];
}
